'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface CashflowMonth {
  month: number;
  revenue: number;
  expenses: number;
  netProfit: number;
}

interface CashflowChartProps {
  data: CashflowMonth[];
  basePaybackMonth: number;
  monthlyProfit: number;
  onSavePlan: () => void;
}

export const CashflowChart: React.FC<CashflowChartProps> = ({
  data,
  basePaybackMonth,
  monthlyProfit,
  onSavePlan,
}) => {
  const [stressPercent, setStressPercent] = useState<number>(-20);

  // Apply stress test factor to net profits
  const adjustedData = data.map(item => {
    const adjustedRevenue = item.revenue * (1 + stressPercent / 100);
    const adjustedNet = adjustedRevenue - item.expenses;
    return {
      name: `M${item.month}`,
      month: item.month,
      net: adjustedNet,
    };
  });

  // Calculate adjusted monthly profit & payback month under stress
  const adjustedMonthlyProfit = Math.round(monthlyProfit * (1 + stressPercent / 100));
  const isProfitable = adjustedMonthlyProfit > 2000;
  const adjustedPayback = isProfitable
    ? Math.min(18, Math.max(6, Math.round(basePaybackMonth * (1 - stressPercent / 100 * 0.5))))
    : 24;

  return (
    <div className="space-y-4">
      {/* Chart Card */}
      <div className="rounded-2xl border border-sage-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between pb-2">
          <h4 className="text-xs font-semibold text-muted">
            Monthly profit, year 1 (illustrative)
          </h4>
          <span className="text-[11px] font-bold text-sage-800">
            Payback: month {adjustedPayback}
          </span>
        </div>

        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adjustedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#566558' }} />
              <YAxis tick={{ fontSize: 10, fill: '#566558' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#263322',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`₹${val}`, 'Net Profit']}
              />
              <Bar dataKey="net" radius={[4, 4, 0, 0]}>
                {adjustedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.net >= 0 ? '#5E7A50' : '#B5524A'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between pt-2 text-[11px] text-muted">
          <span>Month 1</span>
          <span className="font-semibold text-sage-800">Payback: month {adjustedPayback}</span>
          <span>Month 12</span>
        </div>
      </div>

      {/* Stress Test Slider */}
      <div className="rounded-2xl border border-sage-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-sm text-ink">
            What if the price falls?
          </label>
          <span
            className={`font-bold text-sm ${
              stressPercent < 0 ? 'text-error' : 'text-sage-700'
            }`}
          >
            {stressPercent > 0 ? `+${stressPercent}%` : `${stressPercent}%`}
          </span>
        </div>

        <input
          type="range"
          min="-30"
          max="30"
          step="5"
          value={stressPercent}
          onChange={e => setStressPercent(parseInt(e.target.value))}
          className="mt-3 w-full accent-accent cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-muted font-medium mt-1">
          <span>-30% drop</span>
          <span>Baseline (0%)</span>
          <span>+30% gain</span>
        </div>
      </div>

      {/* Outcome Card */}
      <div
        className={`rounded-2xl p-4 border transition ${
          isProfitable
            ? 'bg-sage-100 border-sage-300 text-ink'
            : 'bg-red-50 border-error/30 text-ink'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              isProfitable ? 'bg-sage-600 text-white' : 'bg-error text-white'
            }`}
          >
            {isProfitable ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-base">
              {isProfitable ? 'You are still profitable' : 'High Risk under price drop'}
            </h4>
            <p className="mt-0.5 text-xs text-muted font-medium">
              Profit ₹{(adjustedMonthlyProfit / 1000).toFixed(1)}k a month · Payback {adjustedPayback} months
            </p>
            <p className="mt-1 text-[11px] text-sage-700 font-semibold">
              Includes micro loan repayment buffer
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={onSavePlan}
        className="w-full rounded-2xl bg-sage-600 py-3.5 font-bold text-white shadow-md hover:bg-sage-700 transition"
      >
        Save to my plan
      </button>
    </div>
  );
};
