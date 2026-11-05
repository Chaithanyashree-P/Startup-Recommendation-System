'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PricePoint {
  day: number;
  forecastPrice: number;
  upperBound: number;
  lowerBound: number;
}

interface PriceChartProps {
  data: PricePoint[];
}

export const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: `Day ${item.day}`,
    Forecast: item.forecastPrice,
    Band: [item.lowerBound, item.upperBound],
    upper: item.upperBound,
    lower: item.lowerBound
  }));

  return (
    <div className="rounded-2xl border border-sage-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between pb-2">
        <h4 className="text-xs font-semibold text-muted">
          90-day price outlook (illustrative)
        </h4>
        <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-bold text-sage-700">
          ±5% Band
        </span>
      </div>

      <div className="h-44 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#566558' }} />
            <YAxis tick={{ fontSize: 10, fill: '#566558' }} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#263322',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: any) => [`₹${value}`, 'Price']}
            />
            {/* Shaded Forecast Band */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="#D3DFCB"
              fillOpacity={0.6}
            />
            {/* Line Forecast */}
            <Area
              type="monotone"
              dataKey="Forecast"
              stroke="#5E7A50"
              strokeWidth={3}
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
