import express from 'express';
import { body, param, query, validationResult } from 'express-validator';

const router = express.Router();

// In-memory storage (replace with database in production)
const abTests: Map<string, any> = new Map();
const abTestResults: Map<string, any[]> = new Map();
const heatmapData: Map<string, any[]> = new Map();
const exitIntentData: any[] = [];

// A/B Testing Endpoints

// Get all A/B tests
router.get('/ab-tests', (req, res) => {
  const tests = Array.from(abTests.values());
  res.json({
    success: true,
    data: tests,
    total: tests.length,
  });
});

// Get specific A/B test
router.get('/ab-tests/:testId', [
  param('testId').notEmpty().withMessage('Test ID is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { testId } = req.params;
  const test = abTests.get(testId);
  
  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'A/B test not found',
    });
  }

  const results = abTestResults.get(testId) || [];
  
  // Calculate conversion metrics
  const metrics = calculateABTestMetrics(results);
  
  res.json({
    success: true,
    data: {
      ...test,
      metrics,
      total_participants: results.length,
    },
  });
});

// Create A/B test
router.post('/ab-tests', [
  body('name').notEmpty().withMessage('Test name is required'),
  body('variations').isArray().withMessage('Variations must be an array'),
  body('traffic_allocation').isNumeric().withMessage('Traffic allocation must be numeric'),
  body('conversion_goal').notEmpty().withMessage('Conversion goal is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const test = {
    id: testId,
    ...req.body,
    status: 'draft',
    created_at: new Date().toISOString(),
  };

  abTests.set(testId, test);
  abTestResults.set(testId, []);

  res.status(201).json({
    success: true,
    data: test,
  });
});

// Update A/B test status
router.patch('/ab-tests/:testId/status', [
  param('testId').notEmpty().withMessage('Test ID is required'),
  body('status').isIn(['draft', 'running', 'paused', 'completed']).withMessage('Invalid status'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { testId } = req.params;
  const { status } = req.body;
  const test = abTests.get(testId);
  
  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'A/B test not found',
    });
  }

  test.status = status;
  test.updated_at = new Date().toISOString();
  
  if (status === 'running' && !test.start_date) {
    test.start_date = new Date().toISOString();
  }
  
  if (status === 'completed' && !test.end_date) {
    test.end_date = new Date().toISOString();
  }

  abTests.set(testId, test);

  res.json({
    success: true,
    data: test,
  });
});

// Track A/B test assignment
router.post('/ab-tests/:testId/assignments', [
  param('testId').notEmpty().withMessage('Test ID is required'),
  body('variation_id').notEmpty().withMessage('Variation ID is required'),
  body('user_key').notEmpty().withMessage('User key is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { testId } = req.params;
  const { variation_id, user_key } = req.body;
  
  const assignment = {
    test_id: testId,
    variation_id,
    user_key,
    assigned_at: new Date().toISOString(),
  };

  let results = abTestResults.get(testId) || [];
  
  // Check if user already assigned
  const existingAssignment = results.find(r => r.user_key === user_key);
  if (!existingAssignment) {
    results.push({
      ...assignment,
      converted: false,
      conversion_value: null,
    });
    abTestResults.set(testId, results);
  }

  res.json({
    success: true,
    data: assignment,
  });
});

// Track A/B test conversion
router.post('/ab-tests/:testId/conversions', [
  param('testId').notEmpty().withMessage('Test ID is required'),
  body('user_key').notEmpty().withMessage('User key is required'),
  body('conversion_goal').notEmpty().withMessage('Conversion goal is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { testId } = req.params;
  const { user_key, conversion_goal, conversion_value } = req.body;
  
  let results = abTestResults.get(testId) || [];
  const userResult = results.find(r => r.user_key === user_key);
  
  if (userResult) {
    userResult.converted = true;
    userResult.conversion_goal = conversion_goal;
    userResult.conversion_value = conversion_value;
    userResult.converted_at = new Date().toISOString();
    
    abTestResults.set(testId, results);
  }

  res.json({
    success: true,
    message: 'Conversion tracked successfully',
  });
});

// Heatmap Endpoints

// Store heatmap data
router.post('/heatmap/events', [
  body('events').isArray().withMessage('Events must be an array'),
  body('page_path').notEmpty().withMessage('Page path is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { events, page_path } = req.body;
  
  const pageData = heatmapData.get(page_path) || [];
  pageData.push(...events.map((event: any) => ({
    ...event,
    recorded_at: new Date().toISOString(),
  })));
  
  heatmapData.set(page_path, pageData);

  res.json({
    success: true,
    message: 'Heatmap events stored successfully',
    count: events.length,
  });
});

// Get heatmap data for a page
router.get('/heatmap/pages/:path(*)', [
  param('path').notEmpty().withMessage('Page path is required'),
  query('type').optional().isIn(['click', 'move', 'scroll']).withMessage('Invalid event type'),
  query('limit').optional().isNumeric().withMessage('Limit must be numeric'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const pagePath = `/${req.params.path}`;
  const { type, limit } = req.query;
  
  let events = heatmapData.get(pagePath) || [];
  
  if (type) {
    events = events.filter((e: any) => e.type === type);
  }
  
  if (limit) {
    events = events.slice(-parseInt(limit as string));
  }

  res.json({
    success: true,
    data: events,
    page_path: pagePath,
    total: events.length,
  });
});

// Get heatmap summary
router.get('/heatmap/summary', (req, res) => {
  const summary = Array.from(heatmapData.entries()).map(([path, events]) => ({
    page_path: path,
    total_events: events.length,
    clicks: events.filter((e: any) => e.type === 'click').length,
    moves: events.filter((e: any) => e.type === 'move').length,
    scrolls: events.filter((e: any) => e.type === 'scroll').length,
    last_activity: events[events.length - 1]?.recorded_at,
  }));

  res.json({
    success: true,
    data: summary,
    total_pages: summary.length,
  });
});

// Exit Intent Endpoints

// Track exit intent events
router.post('/exit-intent/events', [
  body('event_type').isIn(['triggered', 'engaged', 'converted', 'dismissed']).withMessage('Invalid event type'),
  body('page_path').notEmpty().withMessage('Page path is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const exitEvent = {
    ...req.body,
    timestamp: new Date().toISOString(),
    id: `exit_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
  };

  exitIntentData.push(exitEvent);

  res.json({
    success: true,
    data: exitEvent,
  });
});

// Get exit intent analytics
router.get('/exit-intent/analytics', [
  query('date_from').optional().isISO8601().withMessage('Invalid date format'),
  query('date_to').optional().isISO8601().withMessage('Invalid date format'),
  query('page_path').optional().isString().withMessage('Page path must be string'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { date_from, date_to, page_path } = req.query;
  
  let filteredData = [...exitIntentData];
  
  if (date_from) {
    filteredData = filteredData.filter(e => new Date(e.timestamp) >= new Date(date_from as string));
  }
  
  if (date_to) {
    filteredData = filteredData.filter(e => new Date(e.timestamp) <= new Date(date_to as string));
  }
  
  if (page_path) {
    filteredData = filteredData.filter(e => e.page_path === page_path);
  }

  const analytics = calculateExitIntentMetrics(filteredData);

  res.json({
    success: true,
    data: analytics,
    total_events: filteredData.length,
  });
});

// Utility functions
function calculateABTestMetrics(results: any[]) {
  const variationStats = new Map();
  
  results.forEach(result => {
    const { variation_id, converted } = result;
    
    if (!variationStats.has(variation_id)) {
      variationStats.set(variation_id, {
        participants: 0,
        conversions: 0,
        conversion_rate: 0,
      });
    }
    
    const stats = variationStats.get(variation_id);
    stats.participants++;
    
    if (converted) {
      stats.conversions++;
    }
    
    stats.conversion_rate = (stats.conversions / stats.participants) * 100;
  });
  
  return Object.fromEntries(variationStats);
}

function calculateExitIntentMetrics(events: any[]) {
  const triggered = events.filter(e => e.event_type === 'triggered').length;
  const engaged = events.filter(e => e.event_type === 'engaged').length;
  const converted = events.filter(e => e.event_type === 'converted').length;
  const dismissed = events.filter(e => e.event_type === 'dismissed').length;
  
  return {
    total_triggers: triggered,
    engagement_rate: triggered > 0 ? (engaged / triggered) * 100 : 0,
    conversion_rate: triggered > 0 ? (converted / triggered) * 100 : 0,
    dismissal_rate: triggered > 0 ? (dismissed / triggered) * 100 : 0,
    by_page: events.reduce((acc: any, event) => {
      const page = event.page_path;
      if (!acc[page]) {
        acc[page] = { triggered: 0, engaged: 0, converted: 0, dismissed: 0 };
      }
      acc[page][event.event_type]++;
      return acc;
    }, {}),
  };
}

export default router;