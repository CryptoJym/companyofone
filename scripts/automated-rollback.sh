#!/bin/bash

# Automated Rollback Script for Company of One
# This script can be triggered by monitoring alerts or run manually

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="${PROJECT_DIR}/logs/rollback-$(date +%Y%m%d-%H%M%S).log"
ROLLBACK_TIMEOUT=300  # 5 minutes

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo -e "${timestamp} [$level] $message" | tee -a "$LOG_FILE"
    
    case $level in
        ERROR)   echo -e "${RED}${timestamp} [$level] $message${NC}" >&2 ;;
        SUCCESS) echo -e "${GREEN}${timestamp} [$level] $message${NC}" ;;
        WARNING) echo -e "${YELLOW}${timestamp} [$level] $message${NC}" ;;
        INFO)    echo -e "${BLUE}${timestamp} [$level] $message${NC}" ;;
    esac
}

# Print usage information
usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Automated rollback script for Company of One deployments.

OPTIONS:
    -e, --environment ENV    Target environment (staging|production)
    -r, --reason REASON      Reason for rollback
    -f, --force             Skip confirmation prompts
    -t, --target-version V   Specific version to rollback to
    -h, --help              Show this help message

EXAMPLES:
    $0 -e production -r "High error rate detected"
    $0 -e staging -f -t v1.2.3
    $0 --environment production --reason "Performance degradation" --force

ENVIRONMENT VARIABLES:
    VERCEL_TOKEN           Vercel deployment token
    PROMETHEUS_URL         Prometheus server URL for metrics
    SLACK_WEBHOOK_URL      Slack webhook for notifications
EOF
}

# Parse command line arguments
parse_args() {
    ENVIRONMENT=""
    REASON=""
    FORCE=false
    TARGET_VERSION=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            -r|--reason)
                REASON="$2"
                shift 2
                ;;
            -f|--force)
                FORCE=true
                shift
                ;;
            -t|--target-version)
                TARGET_VERSION="$2"
                shift 2
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                log "ERROR" "Unknown option: $1"
                usage
                exit 1
                ;;
        esac
    done
    
    # Validate required arguments
    if [[ -z "$ENVIRONMENT" ]]; then
        log "ERROR" "Environment is required"
        usage
        exit 1
    fi
    
    if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
        log "ERROR" "Environment must be 'staging' or 'production'"
        exit 1
    fi
    
    if [[ -z "$REASON" ]]; then
        log "WARNING" "No reason provided for rollback"
        REASON="Manual rollback - no reason specified"
    fi
}

# Check prerequisites
check_prerequisites() {
    log "INFO" "Checking prerequisites..."
    
    # Check if required tools are installed
    local tools=("curl" "jq" "vercel")
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log "ERROR" "$tool is not installed or not in PATH"
            exit 1
        fi
    done
    
    # Check environment variables
    if [[ -z "${VERCEL_TOKEN:-}" ]]; then
        log "ERROR" "VERCEL_TOKEN environment variable is not set"
        exit 1
    fi
    
    log "SUCCESS" "Prerequisites check passed"
}

# Get current deployment information
get_current_deployment() {
    log "INFO" "Getting current deployment information for $ENVIRONMENT..."
    
    local project_name
    case $ENVIRONMENT in
        staging)
            project_name="${VERCEL_PROJECT_ID_STAGING:-company-of-one-staging}"
            ;;
        production)
            project_name="${VERCEL_PROJECT_ID_PRODUCTION:-company-of-one-prod}"
            ;;
    esac
    
    # Get current deployment from Vercel
    CURRENT_DEPLOYMENT=$(vercel ls --token="$VERCEL_TOKEN" --scope="$project_name" --meta environment="$ENVIRONMENT" -o json | jq -r '.[0]' 2>/dev/null || echo "null")
    
    if [[ "$CURRENT_DEPLOYMENT" == "null" ]]; then
        log "ERROR" "Could not retrieve current deployment information"
        exit 1
    fi
    
    CURRENT_VERSION=$(echo "$CURRENT_DEPLOYMENT" | jq -r '.meta.version // "unknown"')
    CURRENT_URL=$(echo "$CURRENT_DEPLOYMENT" | jq -r '.url')
    
    log "INFO" "Current deployment: $CURRENT_VERSION at $CURRENT_URL"
}

# Get previous deployment for rollback
get_previous_deployment() {
    log "INFO" "Finding previous deployment for rollback..."
    
    if [[ -n "$TARGET_VERSION" ]]; then
        log "INFO" "Looking for specific version: $TARGET_VERSION"
        # Search for specific version
        PREVIOUS_DEPLOYMENT=$(vercel ls --token="$VERCEL_TOKEN" --scope="$project_name" --meta version="$TARGET_VERSION" -o json | jq -r '.[0]' 2>/dev/null || echo "null")
    else
        # Get the second most recent deployment
        PREVIOUS_DEPLOYMENT=$(vercel ls --token="$VERCEL_TOKEN" --scope="$project_name" --meta environment="$ENVIRONMENT" -o json | jq -r '.[1]' 2>/dev/null || echo "null")
    fi
    
    if [[ "$PREVIOUS_DEPLOYMENT" == "null" ]]; then
        log "ERROR" "Could not find previous deployment for rollback"
        exit 1
    fi
    
    ROLLBACK_VERSION=$(echo "$PREVIOUS_DEPLOYMENT" | jq -r '.meta.version // "unknown"')
    ROLLBACK_URL=$(echo "$PREVIOUS_DEPLOYMENT" | jq -r '.url')
    
    log "INFO" "Rollback target: $ROLLBACK_VERSION at $ROLLBACK_URL"
}

# Capture current metrics before rollback
capture_current_metrics() {
    log "INFO" "Capturing current metrics before rollback..."
    
    if [[ -n "${PROMETHEUS_URL:-}" ]]; then
        # Capture metrics from Prometheus
        local response_time error_rate requests_per_sec
        
        response_time=$(curl -s "${PROMETHEUS_URL}/api/v1/query?query=histogram_quantile(0.95,rate(http_request_duration_seconds_bucket[5m]))" | jq -r '.data.result[0].value[1] // "0"' 2>/dev/null || echo "0")
        error_rate=$(curl -s "${PROMETHEUS_URL}/api/v1/query?query=rate(http_requests_total{status=~\"5..\"}[5m])" | jq -r '.data.result[0].value[1] // "0"' 2>/dev/null || echo "0")
        requests_per_sec=$(curl -s "${PROMETHEUS_URL}/api/v1/query?query=rate(http_requests_total[5m])" | jq -r '.data.result[0].value[1] // "0"' 2>/dev/null || echo "0")
        
        CURRENT_METRICS=$(jq -n \
            --arg response_time "$response_time" \
            --arg error_rate "$error_rate" \
            --arg rps "$requests_per_sec" \
            --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
            '{
                timestamp: $timestamp,
                response_time: $response_time,
                error_rate: $error_rate,
                requests_per_sec: $rps
            }')
        
        log "INFO" "Current metrics captured: Response time: ${response_time}s, Error rate: ${error_rate}, RPS: ${requests_per_sec}"
    else
        log "WARNING" "PROMETHEUS_URL not set, skipping metrics capture"
        CURRENT_METRICS="{}"
    fi
}

# Confirm rollback action
confirm_rollback() {
    if [[ "$FORCE" == "true" ]]; then
        log "INFO" "Force flag set, skipping confirmation"
        return 0
    fi
    
    echo
    log "WARNING" "=== ROLLBACK CONFIRMATION ==="
    echo "Environment: $ENVIRONMENT"
    echo "Current Version: $CURRENT_VERSION"
    echo "Rollback Version: $ROLLBACK_VERSION"
    echo "Reason: $REASON"
    echo
    
    read -p "Are you sure you want to proceed with rollback? (yes/no): " -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log "INFO" "Rollback cancelled by user"
        exit 0
    fi
}

# Perform the actual rollback
perform_rollback() {
    log "INFO" "Starting rollback process..."
    
    local rollback_start_time=$(date +%s)
    
    # Create rollback record
    local rollback_record=$(jq -n \
        --arg id "rollback-$(date +%s)" \
        --arg environment "$ENVIRONMENT" \
        --arg from_version "$CURRENT_VERSION" \
        --arg to_version "$ROLLBACK_VERSION" \
        --arg reason "$REASON" \
        --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --argjson metrics "$CURRENT_METRICS" \
        '{
            id: $id,
            environment: $environment,
            from_version: $from_version,
            to_version: $to_version,
            reason: $reason,
            timestamp: $timestamp,
            metrics_before: $metrics,
            status: "in_progress"
        }')
    
    # Save rollback record
    mkdir -p "${PROJECT_DIR}/logs/rollbacks"
    echo "$rollback_record" > "${PROJECT_DIR}/logs/rollbacks/rollback-$(date +%s).json"
    
    # Perform rollback by promoting previous deployment
    log "INFO" "Promoting previous deployment to $ENVIRONMENT..."
    
    local rollback_deployment_id=$(echo "$PREVIOUS_DEPLOYMENT" | jq -r '.uid')
    
    # Promote the previous deployment
    if vercel promote "$rollback_deployment_id" --token="$VERCEL_TOKEN" --yes; then
        log "SUCCESS" "Rollback deployment completed"
    else
        log "ERROR" "Failed to promote rollback deployment"
        exit 1
    fi
    
    # Wait for deployment to be ready
    log "INFO" "Waiting for rollback deployment to be ready..."
    local max_wait=$ROLLBACK_TIMEOUT
    local wait_interval=10
    local waited=0
    
    while [[ $waited -lt $max_wait ]]; do
        if curl -f "$ROLLBACK_URL/health" &>/dev/null; then
            log "SUCCESS" "Rollback deployment is ready"
            break
        fi
        
        log "INFO" "Waiting for deployment... (${waited}s/${max_wait}s)"
        sleep $wait_interval
        waited=$((waited + wait_interval))
    done
    
    if [[ $waited -ge $max_wait ]]; then
        log "ERROR" "Rollback deployment failed to become ready within timeout"
        exit 1
    fi
    
    local rollback_duration=$(($(date +%s) - rollback_start_time))
    log "SUCCESS" "Rollback completed in ${rollback_duration}s"
}

# Verify rollback success
verify_rollback() {
    log "INFO" "Verifying rollback success..."
    
    # Health check
    if curl -f "$ROLLBACK_URL/health" &>/dev/null; then
        log "SUCCESS" "Health check passed"
    else
        log "ERROR" "Health check failed after rollback"
        return 1
    fi
    
    # Performance check
    local post_rollback_response_time
    post_rollback_response_time=$(curl -w "%{time_total}" -o /dev/null -s "$ROLLBACK_URL" 2>/dev/null || echo "999")
    
    log "INFO" "Post-rollback response time: ${post_rollback_response_time}s"
    
    # Wait a bit for metrics to stabilize
    sleep 30
    
    if [[ -n "${PROMETHEUS_URL:-}" ]]; then
        # Check if metrics improved
        local new_error_rate
        new_error_rate=$(curl -s "${PROMETHEUS_URL}/api/v1/query?query=rate(http_requests_total{status=~\"5..\"}[5m])" | jq -r '.data.result[0].value[1] // "0"' 2>/dev/null || echo "0")
        
        log "INFO" "Post-rollback error rate: $new_error_rate"
    fi
    
    log "SUCCESS" "Rollback verification completed"
}

# Send notifications
send_notifications() {
    log "INFO" "Sending rollback notifications..."
    
    local notification_message="🔄 **Rollback Completed**
Environment: $ENVIRONMENT
From: $CURRENT_VERSION
To: $ROLLBACK_VERSION
Reason: $REASON
Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)
Status: ✅ Success"
    
    # Slack notification
    if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$notification_message\"}" \
            "$SLACK_WEBHOOK_URL" &>/dev/null || log "WARNING" "Failed to send Slack notification"
    fi
    
    # Email notification (if configured)
    if command -v mail &> /dev/null && [[ -n "${ADMIN_EMAIL:-}" ]]; then
        echo "$notification_message" | mail -s "Rollback Completed - $ENVIRONMENT" "$ADMIN_EMAIL" || log "WARNING" "Failed to send email notification"
    fi
    
    log "SUCCESS" "Notifications sent"
}

# Main execution function
main() {
    # Create logs directory
    mkdir -p "$(dirname "$LOG_FILE")"
    
    log "INFO" "Starting automated rollback script"
    log "INFO" "Log file: $LOG_FILE"
    
    # Parse arguments and run checks
    parse_args "$@"
    check_prerequisites
    
    # Get deployment information
    get_current_deployment
    get_previous_deployment
    capture_current_metrics
    
    # Confirm and execute rollback
    confirm_rollback
    perform_rollback
    verify_rollback
    send_notifications
    
    log "SUCCESS" "Automated rollback completed successfully"
    log "INFO" "Rollback details logged to: $LOG_FILE"
}

# Trap errors and cleanup
cleanup() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        log "ERROR" "Rollback script failed with exit code $exit_code"
        
        # Send failure notification
        if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
            curl -X POST -H 'Content-type: application/json' \
                --data "{\"text\":\"❌ **Rollback Failed**\\nEnvironment: ${ENVIRONMENT:-unknown}\\nReason: ${REASON:-unknown}\\nCheck logs: $LOG_FILE\"}" \
                "$SLACK_WEBHOOK_URL" &>/dev/null || true
        fi
    fi
}

trap cleanup EXIT

# Execute main function
main "$@"