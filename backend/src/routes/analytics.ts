// Analytics API routes for Company of One
import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = Router();

// Types
interface AnalyticsEvent {
  id?: string;
  event_name: string;
  event_category: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
  session_id?: string;
  user_id?: string;
  timestamp: string;
  user_properties?: Record<string, any>;
  ip_address?: string;
  received_at?: string;
  url?: string;
  user_agent?: string;
}

interface UserSession {
  session_id: string;
  user_id?: string;
  events: AnalyticsEvent[];
  first_seen: string;
  last_seen: string;
  page_views: number;
  user_properties: Record<string, any>;
}

interface DailyMetrics {
  date: string;
  total_events: number;
  unique_sessions: Set<string>;
  page_views: number;
  events_by_category: Record<string, number>;
  events_by_name: Record<string, number>;
}

// In-memory storage for demo (replace with database in production)
const analyticsData: {
  events: AnalyticsEvent[];
  userSessions: Map<string, UserSession>;
  dailyMetrics: Map<string, DailyMetrics>;
} = {
  events: [],
  userSessions: new Map(),
  dailyMetrics: new Map(),
};

// Validation middleware
const validateEvent = [
  body('event_name').notEmpty().withMessage('Event name is required'),
  body('event_category').notEmpty().withMessage('Event category is required'),
  body('timestamp').isISO8601().withMessage('Valid timestamp is required'),
];

// Track analytics events
router.post('/events', validateEvent, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const eventData: AnalyticsEvent = {
      id: generateEventId(),
      ...req.body,
      ip_address: req.ip,
      received_at: new Date().toISOString(),
    };

    // Store the event
    analyticsData.events.push(eventData);

    // Update session data
    if (eventData.session_id) {
      const session: UserSession = analyticsData.userSessions.get(eventData.session_id) || {
        session_id: eventData.session_id,
        user_id: eventData.user_id,
        events: [],
        first_seen: eventData.timestamp,
        last_seen: eventData.timestamp,
        page_views: 0,
        user_properties: eventData.user_properties || {},
      };

      session.events.push(eventData);
      session.last_seen = eventData.timestamp;
      
      if (eventData.event_name === 'page_view') {
        session.page_views++;
      }

      analyticsData.userSessions.set(eventData.session_id, session);
    }

    // Update daily metrics
    const today = new Date().toISOString().split('T')[0] as string;
    const dailyData: DailyMetrics = analyticsData.dailyMetrics.get(today) || {
      date: today,
      total_events: 0,
      unique_sessions: new Set(),
      page_views: 0,
      events_by_category: {},
      events_by_name: {},
    };

    dailyData.total_events++;
    if (eventData.session_id) {
      dailyData.unique_sessions.add(eventData.session_id);
    }
    if (eventData.event_name === 'page_view') {
      dailyData.page_views++;
    }

    // Track event categories and names
    dailyData.events_by_category[eventData.event_category] = 
      (dailyData.events_by_category[eventData.event_category] || 0) + 1;
    dailyData.events_by_name[eventData.event_name] = 
      (dailyData.events_by_name[eventData.event_name] || 0) + 1;

    analyticsData.dailyMetrics.set(today, dailyData);

    res.status(201).json({ 
      success: true, 
      event_id: eventData.id,
      message: 'Event tracked successfully' 
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// Get analytics dashboard data
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const days = parseInt((req.query.days as string) || '7', 10);
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Get metrics for the date range
    const metrics = {
      total_events: 0,
      total_sessions: 0,
      total_page_views: 0,
      daily_breakdown: [] as any[],
      top_events: {} as Record<string, number>,
      top_categories: {} as Record<string, number>,
      active_users: new Set<string>(),
      bounce_rate: 0,
    };

    // Process daily metrics
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayData = analyticsData.dailyMetrics.get(dateStr);
      
      if (dayData) {
        metrics.total_events += dayData.total_events;
        metrics.total_page_views += dayData.page_views;
        metrics.total_sessions += dayData.unique_sessions.size;
        
        // Add to active users
        dayData.unique_sessions.forEach((sessionId: string) => {
          const sessionData = analyticsData.userSessions.get(sessionId);
          if (sessionData?.user_id) {
            metrics.active_users.add(sessionData.user_id);
          }
        });

        metrics.daily_breakdown.push({
          date: dateStr,
          events: dayData.total_events,
          sessions: dayData.unique_sessions.size,
          page_views: dayData.page_views,
        });

        // Aggregate top events and categories
        Object.entries(dayData.events_by_name).forEach(([name, count]) => {
          metrics.top_events[name] = (metrics.top_events[name] || 0) + count;
        });
        
        Object.entries(dayData.events_by_category).forEach(([category, count]) => {
          metrics.top_categories[category] = (metrics.top_categories[category] || 0) + count;
        });
      } else {
        metrics.daily_breakdown.push({
          date: dateStr,
          events: 0,
          sessions: 0,
          page_views: 0,
        });
      }
    }

    // Calculate bounce rate (sessions with only 1 page view)
    let singlePageSessions = 0;
    analyticsData.userSessions.forEach((session) => {
      if (session.page_views === 1) {
        singlePageSessions++;
      }
    });
    metrics.bounce_rate = metrics.total_sessions > 0 
      ? Math.round((singlePageSessions / metrics.total_sessions) * 100) 
      : 0;

    res.json({
      ...metrics,
      active_users: metrics.active_users.size,
      date_range: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        days: days,
      },
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

// Get user journey data
router.get('/user-journey/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = analyticsData.userSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Process journey steps
    const journeySteps = session.events
      .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map((event: any) => ({
        timestamp: event.timestamp,
        event_name: event.event_name,
        event_category: event.event_category,
        page_path: event.custom_parameters?.page_path,
        custom_parameters: event.custom_parameters,
      }));

    res.json({
      session_id: sessionId,
      user_id: session.user_id,
      first_seen: session.first_seen,
      last_seen: session.last_seen,
      total_events: session.events.length,
      page_views: session.page_views,
      user_properties: session.user_properties,
      journey_steps: journeySteps,
    });
  } catch (error) {
    console.error('Error getting user journey:', error);
    res.status(500).json({ error: 'Failed to get user journey' });
  }
});

// Get real-time analytics
router.get('/realtime', async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    // Get events from last 30 minutes
    const recentEvents = analyticsData.events.filter((event: AnalyticsEvent) => 
      new Date(event.timestamp) >= thirtyMinutesAgo
    );

    // Active sessions (sessions with activity in last 30 minutes)
    const activeSessions = new Set<string>();
    const activePages = new Map<string, number>();
    const eventCounts = new Map<string, number>();

    recentEvents.forEach((event: AnalyticsEvent) => {
      if (event.session_id) {
        activeSessions.add(event.session_id);
      }
      
      if (event.event_name === 'page_view' && event.custom_parameters?.page_path) {
        const path = event.custom_parameters.page_path;
        activePages.set(path, (activePages.get(path) || 0) + 1);
      }
      
      eventCounts.set(event.event_name, (eventCounts.get(event.event_name) || 0) + 1);
    });

    res.json({
      active_users: activeSessions.size,
      recent_events: recentEvents.length,
      active_pages: Array.from(activePages.entries())
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10),
      recent_event_types: Array.from(eventCounts.entries())
        .map(([event, count]) => ({ event, count }))
        .sort((a, b) => b.count - a.count),
      last_updated: now.toISOString(),
    });
  } catch (error) {
    console.error('Error getting realtime data:', error);
    res.status(500).json({ error: 'Failed to get realtime data' });
  }
});

// Get business metrics
router.get('/business-metrics', async (req: Request, res: Response) => {
  try {
    const businessEvents = analyticsData.events.filter((event: AnalyticsEvent) => 
      ['goal_created', 'business_metric', 'tool_usage', 'content_engagement'].includes(event.event_name)
    );

    const metrics = {
      goals_created: businessEvents.filter(e => e.event_name === 'goal_created').length,
      tools_used: new Set(businessEvents
        .filter(e => e.event_name === 'tool_usage')
        .map(e => e.custom_parameters?.tool_name)
        .filter(Boolean)
      ).size,
      content_engagements: businessEvents.filter(e => e.event_name === 'content_engagement').length,
      user_types: {} as Record<string, number>,
      popular_tools: {} as Record<string, number>,
      popular_content: {} as Record<string, number>,
    };

    // Analyze user types
    analyticsData.userSessions.forEach((session) => {
      const userType = session.user_properties?.user_type || 'unknown';
      metrics.user_types[userType] = (metrics.user_types[userType] || 0) + 1;
    });

    // Popular tools
    businessEvents
      .filter(e => e.event_name === 'tool_usage')
      .forEach(event => {
        const tool = event.custom_parameters?.tool_name;
        if (tool) {
          metrics.popular_tools[tool] = (metrics.popular_tools[tool] || 0) + 1;
        }
      });

    // Popular content
    businessEvents
      .filter(e => e.event_name === 'content_engagement')
      .forEach(event => {
        const content = event.custom_parameters?.content_type;
        if (content) {
          metrics.popular_content[content] = (metrics.popular_content[content] || 0) + 1;
        }
      });

    res.json(metrics);
  } catch (error) {
    console.error('Error getting business metrics:', error);
    res.status(500).json({ error: 'Failed to get business metrics' });
  }
});

// Utility function to generate event ID
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default router;