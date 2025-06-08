'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';

interface ABTestSummary {
  id: string;
  name: string;
  status: string;
  conversion_rate: number;
  participants: number;
  statistical_significance: number;
}

interface HeatmapSummary {
  page_path: string;
  total_clicks: number;
  total_sessions: number;
  avg_time_on_page: number;
  scroll_depth: number;
}

interface ExitIntentSummary {
  total_triggers: number;
  engagement_rate: number;
  conversion_rate: number;
  dismissal_rate: number;
}

export function ConversionOptimizationDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ab-tests' | 'heatmaps' | 'exit-intent'>('overview');
  const [dateRange, setDateRange] = useState('7d');
  const [abTests, setAbTests] = useState<ABTestSummary[]>([]);
  const [heatmaps, setHeatmaps] = useState<HeatmapSummary[]>([]);
  const [exitIntent, setExitIntent] = useState<ExitIntentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // In a real implementation, these would be actual API calls
      // For demo purposes, using mock data
      
      setAbTests([
        {
          id: 'test_1',
          name: 'Homepage CTA Button',
          status: 'running',
          conversion_rate: 3.2,
          participants: 1250,
          statistical_significance: 95,
        },
        {
          id: 'test_2',
          name: 'Pricing Page Layout',
          status: 'completed',
          conversion_rate: 5.8,
          participants: 892,
          statistical_significance: 99,
        },
      ]);

      setHeatmaps([
        {
          page_path: '/',
          total_clicks: 2450,
          total_sessions: 1200,
          avg_time_on_page: 120,
          scroll_depth: 65,
        },
        {
          page_path: '/pricing',
          total_clicks: 1830,
          total_sessions: 950,
          avg_time_on_page: 180,
          scroll_depth: 45,
        },
      ]);

      setExitIntent({
        total_triggers: 450,
        engagement_rate: 12.5,
        conversion_rate: 3.8,
        dismissal_rate: 83.7,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active A/B Tests</p>
              <p className="text-2xl font-bold text-gray-900">
                {abTests.filter(t => t.status === 'running').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(abTests.reduce((acc, t) => acc + t.conversion_rate, 0) / abTests.length || 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 3v10a1 1 0 001 1h8a1 1 0 001-1V7m-9 0h10M9 11v6m6-6v6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Exit Intent Triggers</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(exitIntent?.total_triggers || 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Heatmap Sessions</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(heatmaps.reduce((acc, h) => acc + h.total_sessions, 0))}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent A/B Tests */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent A/B Tests</h3>
        <div className="space-y-4">
          {abTests.slice(0, 3).map(test => (
            <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{test.name}</h4>
                <p className="text-sm text-gray-600">
                  {formatNumber(test.participants)} participants
                </p>
              </div>
              <div className="text-right">
                <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  test.status === 'running' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {test.status}
                </div>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {formatPercentage(test.conversion_rate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderABTests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">A/B Tests</h2>
        <Button variant="primary">Create New Test</Button>
      </div>

      <div className="grid gap-6">
        {abTests.map(test => (
          <Card key={test.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                  test.status === 'running' ? 'bg-green-100 text-green-800' : 
                  test.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {test.status}
                </div>
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(test.conversion_rate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(test.participants)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Statistical Significance</p>
                <p className="text-2xl font-bold text-gray-900">{test.statistical_significance}%</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHeatmaps = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Heatmap Analytics</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Toggle Heatmap</Button>
          <Button variant="primary" size="sm">View Live Heatmap</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {heatmaps.map(page => (
          <Card key={page.page_path} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{page.page_path}</h3>
                <p className="text-sm text-gray-600">Page Analytics</p>
              </div>
              <Button variant="outline" size="sm">View Heatmap</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-xl font-bold text-gray-900">{formatNumber(page.total_clicks)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="text-xl font-bold text-gray-900">{formatNumber(page.total_sessions)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Time on Page</p>
                <p className="text-xl font-bold text-gray-900">{page.avg_time_on_page}s</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Scroll Depth</p>
                <p className="text-xl font-bold text-gray-900">{page.scroll_depth}%</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderExitIntent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Exit Intent Analytics</h2>
        <Button variant="primary">Configure Exit Intent</Button>
      </div>

      {exitIntent && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Triggers</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(exitIntent.total_triggers)}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Engagement Rate</p>
              <p className="text-3xl font-bold text-blue-600">{formatPercentage(exitIntent.engagement_rate)}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-green-600">{formatPercentage(exitIntent.conversion_rate)}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Dismissal Rate</p>
              <p className="text-3xl font-bold text-red-600">{formatPercentage(exitIntent.dismissal_rate)}</p>
            </div>
          </Card>
        </div>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Good engagement rate</p>
              <p className="text-sm text-gray-600">Your exit intent popups are getting attention from users.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Consider A/B testing popup designs</p>
              <p className="text-sm text-gray-600">Test different messaging to improve conversion rates.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">High dismissal rate</p>
              <p className="text-sm text-gray-600">Review popup timing and content to reduce dismissals.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Conversion Optimization Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor and optimize your conversion rates with A/B testing, heatmaps, and exit-intent analytics.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'ab-tests', label: 'A/B Tests' },
            { id: 'heatmaps', label: 'Heatmaps' },
            { id: 'exit-intent', label: 'Exit Intent' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Date Range Selector */}
      <div className="flex justify-end mb-6">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="1d">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'ab-tests' && renderABTests()}
      {activeTab === 'heatmaps' && renderHeatmaps()}
      {activeTab === 'exit-intent' && renderExitIntent()}
    </div>
  );
}