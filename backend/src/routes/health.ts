import { Router, Request, Response } from 'express';
import os from 'os';

export const healthRouter = Router();

// Helper function to format bytes
const formatBytes = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Helper function to get system metrics
const getSystemMetrics = () => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  return {
    memory: {
      rss: formatBytes(memUsage.rss),
      heapTotal: formatBytes(memUsage.heapTotal),
      heapUsed: formatBytes(memUsage.heapUsed),
      external: formatBytes(memUsage.external),
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system,
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      uptime: process.uptime(),
      loadAverage: os.loadavg(),
      freeMemory: formatBytes(os.freemem()),
      totalMemory: formatBytes(os.totalmem()),
    }
  };
};

// Basic health check
healthRouter.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Company of One API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Detailed health check with metrics
healthRouter.get('/detailed', (req: Request, res: Response) => {
  try {
    const metrics = getSystemMetrics();
    
    res.status(200).json({
      status: 'healthy',
      message: 'Company of One API is running',
      timestamp: new Date().toISOString(),
      metrics,
      checks: {
        server: 'healthy',
        memory: metrics.memory,
        uptime: `${Math.floor(process.uptime())}s`,
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving health metrics',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Readiness probe (for Kubernetes/container orchestration)
healthRouter.get('/ready', (req: Request, res: Response) => {
  // Add additional readiness checks here (e.g., database connectivity)
  const isReady = true; // Placeholder for actual checks
  
  // Future: Add database connection check
  // const dbReady = await checkDatabaseConnection();
  
  if (isReady) {
    res.status(200).json({
      status: 'ready',
      message: 'Service is ready to accept requests',
      timestamp: new Date().toISOString(),
      checks: {
        server: 'ready',
        // database: dbReady ? 'ready' : 'not ready',
      }
    });
  } else {
    res.status(503).json({
      status: 'not ready',
      message: 'Service is not ready',
      timestamp: new Date().toISOString(),
    });
  }
});

// Liveness probe (for Kubernetes/container orchestration)
healthRouter.get('/live', (req: Request, res: Response) => {
  // Simple liveness check - if this endpoint responds, the service is alive
  res.status(200).json({
    status: 'alive',
    message: 'Service is alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Metrics endpoint for monitoring systems (Prometheus format)
healthRouter.get('/metrics', (req: Request, res: Response) => {
  const metrics = getSystemMetrics();
  const memUsage = process.memoryUsage();
  
  // Simple Prometheus-style metrics
  const prometheusMetrics = `
# HELP nodejs_memory_heap_used_bytes Process heap memory used
# TYPE nodejs_memory_heap_used_bytes gauge
nodejs_memory_heap_used_bytes ${memUsage.heapUsed}

# HELP nodejs_memory_heap_total_bytes Process heap memory total
# TYPE nodejs_memory_heap_total_bytes gauge
nodejs_memory_heap_total_bytes ${memUsage.heapTotal}

# HELP nodejs_memory_rss_bytes Process resident memory
# TYPE nodejs_memory_rss_bytes gauge
nodejs_memory_rss_bytes ${memUsage.rss}

# HELP nodejs_process_uptime_seconds Process uptime in seconds
# TYPE nodejs_process_uptime_seconds gauge
nodejs_process_uptime_seconds ${process.uptime()}

# HELP system_load_average_1m System load average over 1 minute
# TYPE system_load_average_1m gauge
system_load_average_1m ${os.loadavg()[0]}
`.trim();

  res.set('Content-Type', 'text/plain');
  res.status(200).send(prometheusMetrics);
});