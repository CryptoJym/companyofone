'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiEye, 
  FiMousePointer, 
  FiTrendingUp, 
  FiActivity,
  FiPieChart,
  FiBarChart,
  FiRefreshCw
} from 'react-icons/fi';

interface DashboardMetrics {
  total_events: number;
  total_sessions: number;
  total_page_views: number;
  active_users: number;
  bounce_rate: number;
  daily_breakdown: Array<{
    date: string;
    events: number;
    sessions: number;
    page_views: number;
  }>;
  top_events: Record<string, number>;
  top_categories: Record<string, number>;
  date_range: {
    start: string;
    end: string;
    days: number;
  };
}

interface RealtimeData {
  active_users: number;
  recent_events: number;
  active_pages: Array<{
    path: string;
    views: number;
  }>;
  recent_event_types: Array<{
    event: string;
    count: number;
  }>;
  last_updated: string;
}

interface BusinessMetrics {
  goals_created: number;
  tools_used: number;
  content_engagements: number;
  user_types: Record<string, number>;
  popular_tools: Record<string, number>;
  popular_content: Record<string, number>;
}

export function AnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(null);
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
  const [businessData, setBusinessData] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(7);
  const [activeTab, setActiveTab] = useState<'overview' | 'business' | 'realtime'>('overview');

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/analytics/dashboard?days=${selectedTimeRange}`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Fetch realtime data
  const fetchRealtimeData = async () => {
    try {
      const response = await fetch('/api/analytics/realtime');
      const data = await response.json();
      setRealtimeData(data);
    } catch (error) {
      console.error('Error fetching realtime data:', error);
    }
  };

  // Fetch business metrics
  const fetchBusinessData = async () => {
    try {
      const response = await fetch('/api/analytics/business-metrics');
      const data = await response.json();
      setBusinessData(data);
    } catch (error) {
      console.error('Error fetching business data:', error);
    }
  };

  // Load all data
  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      fetchDashboardData(),
      fetchRealtimeData(),
      fetchBusinessData(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedTimeRange]);

  // Auto-refresh realtime data
  useEffect(() => {
    const interval = setInterval(fetchRealtimeData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FiRefreshCw className="w-8 h-8 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>Last 24 hours</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: FiBarChart },
            { id: 'business', label: 'Business Metrics', icon: FiTrendingUp },
            { id: 'realtime', label: 'Real-time', icon: FiActivity },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardData && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Sessions"
              value={dashboardData.total_sessions.toLocaleString()}
              icon={FiUsers}
              color="blue"
            />
            <MetricCard
              title="Page Views"
              value={dashboardData.total_page_views.toLocaleString()}
              icon={FiEye}
              color="green"
            />
            <MetricCard
              title="Events Tracked"
              value={dashboardData.total_events.toLocaleString()}
              icon={FiMousePointer}
              color="purple"
            />
            <MetricCard
              title="Bounce Rate"
              value={`${dashboardData.bounce_rate}%`}
              icon={FiTrendingUp}
              color={dashboardData.bounce_rate > 70 ? "red" : "yellow"}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Activity Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity</h3>
              <div className="space-y-3">
                {dashboardData.daily_breakdown.slice(-7).map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="text-blue-600">{day.sessions}</span> sessions
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (day.sessions / Math.max(...dashboardData.daily_breakdown.map(d => d.sessions))) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Events */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Events</h3>
              <div className="space-y-3">
                {Object.entries(dashboardData.top_events)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([event, count]) => (
                    <div key={event} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">
                        {event.replace(/_/g, ' ')}
                      </span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                (count / Math.max(...Object.values(dashboardData.top_events))) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Metrics Tab */}
      {activeTab === 'business' && businessData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Goals Created"
              value={businessData.goals_created.toString()}
              icon={FiTrendingUp}
              color="green"
            />
            <MetricCard
              title="Tools Used"
              value={businessData.tools_used.toString()}
              icon={FiPieChart}
              color="blue"
            />
            <MetricCard
              title="Content Engagements"
              value={businessData.content_engagements.toString()}
              icon={FiMousePointer}
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Types */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Types</h3>
              <div className="space-y-3">
                {Object.entries(businessData.user_types).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{type}</span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tools */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tools</h3>
              <div className="space-y-3">
                {Object.entries(businessData.popular_tools)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([tool, count]) => (
                    <div key={tool} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{tool}</span>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Popular Content */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Content</h3>
              <div className="space-y-3">
                {Object.entries(businessData.popular_content)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([content, count]) => (
                    <div key={content} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{content}</span>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Tab */}
      {activeTab === 'realtime' && realtimeData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Active Users"
              value={realtimeData.active_users.toString()}
              icon={FiUsers}
              color="green"
              subtitle="In the last 30 minutes"
            />
            <MetricCard
              title="Recent Events"
              value={realtimeData.recent_events.toString()}
              icon={FiActivity}
              color="blue"
              subtitle="In the last 30 minutes"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Pages */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Active Pages</h3>
              <div className="space-y-3">
                {realtimeData.active_pages.slice(0, 5).map((page, index) => (
                  <div key={page.path} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate">{page.path}</span>
                    <span className="text-sm font-medium text-gray-900">{page.views} views</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Event Types */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Event Types</h3>
              <div className="space-y-3">
                {realtimeData.recent_event_types.slice(0, 5).map((eventType, index) => (
                  <div key={eventType.event} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {eventType.event.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{eventType.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Last updated: {new Date(realtimeData.last_updated).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: {
  title: string;
  value: string;
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  subtitle?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}