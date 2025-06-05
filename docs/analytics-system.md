# Analytics & Tracking System Documentation

A comprehensive analytics and tracking solution for the Company of One solopreneur success hub.

## Overview

This system provides:
- **Google Analytics 4 integration** for external analytics
- **Custom event tracking** for business-specific metrics
- **Real-time analytics API** for internal dashboards
- **User journey tracking** for funnel analysis
- **Performance monitoring** for app optimization

## Architecture

### Frontend (`frontend/src/lib/analytics.ts`)
- Singleton Analytics class with Google Analytics 4 integration
- React hook for automatic initialization and page view tracking
- Business-specific tracking methods for solopreneur metrics
- Utility functions for common tracking scenarios

### Backend (`backend/src/routes/analytics.ts`)
- RESTful API endpoints for event collection and data retrieval
- In-memory storage (easily replaceable with database)
- Real-time analytics processing
- Business metrics aggregation

## Setup

### 1. Environment Configuration

Add to your `.env.local`:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Frontend Integration

```typescript
// In your main layout or app component
import { useAnalytics } from '@/lib/analytics';

export default function Layout({ children }) {
  const analytics = useAnalytics(); // Auto-initializes and tracks page views
  
  return <div>{children}</div>;
}
```

### 3. Backend Integration
The analytics routes are already integrated into the backend server at `/api/analytics/*`.

## Usage Examples

### Basic Event Tracking

```typescript
import { analytics, trackClick, trackFormSubmission } from '@/lib/analytics';

// Track button clicks
trackClick('signup_button', 'header');

// Track form submissions
trackFormSubmission('contact_form', true);

// Track custom events
analytics.trackEvent({
  event_name: 'feature_used',
  event_category: 'engagement',
  event_label: 'goal_tracker',
  custom_parameters: {
    feature_id: 'goal-tracker-v2',
    user_plan: 'premium'
  }
});
```

### Business-Specific Tracking

```typescript
// Track goal creation (core business metric)
analytics.trackGoalCreation('revenue', '$10000');

// Track tool usage with duration
analytics.trackToolUsage('business_plan_generator', 'completed', 120);

// Track content engagement
analytics.trackContentEngagement('article', 'how-to-start-business', 'read_complete');

// Track business metrics
analytics.trackBusinessMetric('monthly_revenue', 5000, 'USD');

// Track user journey steps
analytics.trackUserJourney('onboarding_complete', 'user_activation', true);
```

### User Properties

```typescript
// Set user properties for segmentation
analytics.setUserProperties({
  user_type: 'solopreneur',
  plan_type: 'premium',
  signup_date: '2024-01-15',
  goals: ['revenue_growth', 'time_management']
});

// Set user ID for cross-session tracking
analytics.setUserId('user_12345');
```

### Performance Tracking

```typescript
// Track performance metrics
analytics.trackPerformance('page_load_time', 1200);
analytics.trackPerformance('api_response_time', 250);

// Track Core Web Vitals (integrate with web-vitals library)
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS((metric) => analytics.trackPerformance('CLS', metric.value));
getFID((metric) => analytics.trackPerformance('FID', metric.value));
// ... etc
```

## API Endpoints

### POST `/api/analytics/events`
Track custom events.

**Request Body:**
```json
{
  "event_name": "goal_created",
  "event_category": "business_growth",
  "event_label": "revenue",
  "timestamp": "2024-01-15T10:30:00Z",
  "custom_parameters": {
    "goal_type": "revenue",
    "goal_value": "$10000"
  }
}
```

### GET `/api/analytics/dashboard?days=7`
Get dashboard metrics for the specified time period.

**Response:**
```json
{
  "total_events": 1250,
  "total_sessions": 325,
  "total_page_views": 800,
  "active_users": 150,
  "bounce_rate": 45,
  "daily_breakdown": [...],
  "top_events": {...},
  "top_categories": {...}
}
```

### GET `/api/analytics/realtime`
Get real-time analytics (last 30 minutes).

**Response:**
```json
{
  "active_users": 12,
  "recent_events": 45,
  "active_pages": [...],
  "recent_event_types": [...],
  "last_updated": "2024-01-15T10:30:00Z"
}
```

### GET `/api/analytics/business-metrics`
Get business-specific metrics.

**Response:**
```json
{
  "goals_created": 25,
  "tools_used": 8,
  "content_engagements": 150,
  "user_types": {...},
  "popular_tools": {...},
  "popular_content": {...}
}
```

### GET `/api/analytics/user-journey/:sessionId`
Get detailed user journey for a specific session.

## Key Business Metrics Tracked

### Solopreneur Success Metrics
- **Goal Creation**: Track when users set business goals
- **Tool Usage**: Monitor which tools are most popular and effective
- **Content Engagement**: Measure which content drives value
- **User Journey**: Understand the path to success
- **Performance**: Ensure optimal user experience

### User Segmentation
- **User Type**: solopreneur, freelancer, entrepreneur, student
- **Plan Type**: free, premium, enterprise
- **Business Stage**: startup, growth, established
- **Goals**: revenue_growth, time_management, productivity, etc.

## Analytics Dashboard Features

### Overview Tab
- Total sessions, page views, events
- Bounce rate and user engagement
- Daily activity trends
- Top events and categories

### Business Metrics Tab
- Goals created and achieved
- Popular tools and content
- User type distribution
- Revenue and growth metrics

### Real-time Tab
- Currently active users
- Recent events and activities
- Most active pages
- Live user behavior

## Privacy & Compliance

### Data Collection
- Only collects necessary analytics data
- No personally identifiable information (PII) stored
- User consent mechanisms in place
- GDPR compliant data handling

### Data Storage
- Events stored with minimal retention
- User can request data deletion
- Secure API endpoints with rate limiting
- Option to disable tracking

## Performance Considerations

### Frontend
- Lazy loading of analytics scripts
- Non-blocking event tracking
- Efficient session management
- Error handling and fallbacks

### Backend
- In-memory storage for fast queries
- Database optimization for production
- Rate limiting and security measures
- Scalable architecture design

## Future Enhancements

### Advanced Analytics
- Cohort analysis for user retention
- Conversion funnel optimization
- A/B testing framework
- Machine learning insights

### Integrations
- Email marketing platforms
- CRM systems
- Payment processors
- Social media platforms

### Visualization
- Advanced charting and graphs
- Custom dashboard creation
- Export capabilities
- Mobile-responsive design

## Troubleshooting

### Common Issues

**Analytics not initializing:**
- Check GA_MEASUREMENT_ID environment variable
- Verify script loading in browser console
- Ensure proper initialization order

**Events not being tracked:**
- Check network tab for API calls
- Verify event validation passes
- Check console for error messages

**Dashboard showing no data:**
- Confirm backend server is running
- Check API endpoint responses
- Verify data is being stored correctly

### Debug Mode
Enable debug logging by setting:
```typescript
// In analytics.ts
console.log('Analytics event:', eventData); // Uncomment for debugging
```

## Contributing

When adding new analytics features:
1. Update the TypeScript interfaces
2. Add corresponding backend endpoints
3. Update this documentation
4. Add tests for new functionality
5. Consider privacy implications

---

This analytics system provides comprehensive tracking capabilities while maintaining user privacy and delivering actionable insights for solopreneur success.