'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useConversionOptimization, HeatmapEvent } from '@/lib/conversion-optimization';

interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
  type: 'click' | 'move' | 'scroll';
}

interface HeatmapVisualizationProps {
  enabled?: boolean;
  showClicks?: boolean;
  showMoves?: boolean;
  showScrollDepth?: boolean;
  opacity?: number;
  maxPoints?: number;
  className?: string;
}

export function HeatmapVisualization({
  enabled = false,
  showClicks = true,
  showMoves = false,
  showScrollDepth = true,
  opacity = 0.7,
  maxPoints = 500,
  className = '',
}: HeatmapVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [scrollDepth, setScrollDepth] = useState(0);
  const conversionOptimizer = useConversionOptimization();

  // Update canvas size
  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = window.innerWidth;
    canvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  };

  // Process heatmap events from localStorage or API
  useEffect(() => {
    if (!enabled) return;

    const loadHeatmapData = () => {
      // In a real implementation, this would fetch from your analytics API
      // For now, we'll simulate some data collection
      const mockData: HeatmapPoint[] = [];
      
      // Add some sample click points
      for (let i = 0; i < 50; i++) {
        mockData.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          intensity: Math.random() * 10 + 1,
          type: 'click',
        });
      }

      setHeatmapData(mockData.slice(0, maxPoints));
    };

    loadHeatmapData();
    updateCanvasSize();

    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [enabled, maxPoints]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      setScrollDepth(Math.max(0, Math.min(100, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Render heatmap
  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create gradient for heatmap points
    const createHeatmapGradient = (x: number, y: number, intensity: number) => {
      const radius = Math.max(20, intensity * 5);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      
      gradient.addColorStop(0, `rgba(255, 0, 0, ${intensity * 0.1})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 0, ${intensity * 0.05})`);
      gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
      
      return gradient;
    };

    // Set blend mode for heatmap effect
    ctx.globalCompositeOperation = 'screen';

    // Draw click heatmap
    if (showClicks) {
      heatmapData
        .filter(point => point.type === 'click')
        .forEach(point => {
          ctx.fillStyle = createHeatmapGradient(point.x, point.y, point.intensity);
          ctx.beginPath();
          ctx.arc(point.x, point.y, Math.max(20, point.intensity * 5), 0, Math.PI * 2);
          ctx.fill();
        });
    }

    // Draw movement heatmap (if enabled)
    if (showMoves) {
      ctx.globalCompositeOperation = 'multiply';
      heatmapData
        .filter(point => point.type === 'move')
        .forEach(point => {
          ctx.fillStyle = `rgba(0, 255, 0, 0.02)`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
          ctx.fill();
        });
    }

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  }, [heatmapData, enabled, showClicks, showMoves]);

  if (!enabled) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      {/* Heatmap Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity }}
      />
      
      {/* Scroll Depth Indicator */}
      {showScrollDepth && (
        <div className="fixed top-0 right-4 bg-white/90 backdrop-blur-sm rounded-b-lg px-3 py-2 shadow-lg border border-gray-200">
          <div className="text-xs font-medium text-gray-600 mb-1">Scroll Depth</div>
          <div className="flex items-center space-x-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-300"
                style={{ width: `${scrollDepth}%` }}
              />
            </div>
            <span className="text-xs font-mono text-gray-800 w-8">
              {scrollDepth}%
            </span>
          </div>
        </div>
      )}

      {/* Click Counter */}
      <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200">
        <div className="text-xs font-medium text-gray-600">Heatmap Data</div>
        <div className="text-sm font-mono text-gray-800">
          {heatmapData.filter(p => p.type === 'click').length} clicks tracked
        </div>
      </div>
    </div>
  );
}

// Heatmap controls component
interface HeatmapControlsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  showClicks: boolean;
  onToggleClicks: (show: boolean) => void;
  showMoves: boolean;
  onToggleMoves: (show: boolean) => void;
  showScrollDepth: boolean;
  onToggleScrollDepth: (show: boolean) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
}

export function HeatmapControls({
  enabled,
  onToggle,
  showClicks,
  onToggleClicks,
  showMoves,
  onToggleMoves,
  showScrollDepth,
  onToggleScrollDepth,
  opacity,
  onOpacityChange,
}: HeatmapControlsProps) {
  return (
    <div className="fixed top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Heatmap Visualization</span>
          <button
            onClick={() => onToggle(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              enabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {enabled && (
          <>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showClicks}
                  onChange={(e) => onToggleClicks(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Show Click Heatmap</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showMoves}
                  onChange={(e) => onToggleMoves(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Show Movement Tracking</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showScrollDepth}
                  onChange={(e) => onToggleScrollDepth(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Show Scroll Depth</span>
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">Opacity</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-center">
                {Math.round(opacity * 100)}%
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Hook for heatmap state management
export function useHeatmapVisualization() {
  const [enabled, setEnabled] = useState(false);
  const [showClicks, setShowClicks] = useState(true);
  const [showMoves, setShowMoves] = useState(false);
  const [showScrollDepth, setShowScrollDepth] = useState(true);
  const [opacity, setOpacity] = useState(0.7);

  return {
    enabled,
    setEnabled,
    showClicks,
    setShowClicks,
    showMoves,
    setShowMoves,
    showScrollDepth,
    setShowScrollDepth,
    opacity,
    setOpacity,
  };
}