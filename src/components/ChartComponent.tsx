"use client";

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
if (typeof window !== 'undefined') {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
  );
}

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut';

interface ChartComponentProps {
  type: ChartType;
  data: any;
  options?: any;
  height?: number;
  width?: number;
  className?: string;
}

export default function ChartComponent({
  type,
  data,
  options = {},
  height,
  width,
  className = '',
}: ChartComponentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Default options for charts
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  // Render different chart types
  const renderChart = () => {
    if (!isClient) return null;
    
    switch (type) {
      case 'line':
        return <Line data={data} options={mergedOptions} />;
      case 'bar':
        return <Bar data={data} options={mergedOptions} />;
      case 'pie':
        return <Pie data={data} options={mergedOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={mergedOptions} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div 
      className={`relative ${className}`} 
      style={{ height: height || '300px', width: width || '100%' }}
    >
      {renderChart()}
    </div>
  );
} 