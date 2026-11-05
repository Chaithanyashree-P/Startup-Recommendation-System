'use client';

import React from 'react';
import { X, TrendingUp, Download, AlertCircle } from 'lucide-react';

interface OfficerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const blocks = Array.from({ length: 20 }, (_, i) => ({
    id: `B${i + 1}`,
    name: `Block B${i + 1}`,
    intensity: i === 12 ? 'gap' : (i * 7) % 5 === 0 ? 'high' : (i * 3) % 2 === 0 ? 'medium' : 'low',
  }));

  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Block,ActiveUsers,PlansCreated,VenturesStarted,DemandScore\n' +
      blocks.map(b => `${b.id},62,30,9,High`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'gram-udyam-district-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-2 sm:p-6 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl rounded-3xl bg-sage-50 text-ink shadow-2xl overflow-hidden border border-sage-300">
        {/* Top Header */}
        <div className="bg-sage-900 text-white p-4 sm:p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sage-400">
              Gram Udyam AI · Web Analytics
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">
              District Overview · Block-wise Opportunity
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportCSV}
              className="flex items-center space-x-1 rounded-xl bg-sage-700 px-3 py-2 text-xs font-semibold text-white hover:bg-sage-600 transition"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-sage-800 p-2 text-sage-200 hover:bg-sage-700 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Dashboard Content Container */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* 4 Metric KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white p-4 border border-sage-200 shadow-sm">
              <span className="text-xs font-semibold text-muted">Active users</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-sage-900">1,240</span>
                <span className="flex items-center text-xs font-bold text-sage-600">
                  <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> 12%
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-sage-200 shadow-sm">
              <span className="text-xs font-semibold text-muted">Plans created</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-sage-900">612</span>
                <span className="flex items-center text-xs font-bold text-sage-600">
                  <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> 8%
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-sage-200 shadow-sm">
              <span className="text-xs font-semibold text-muted">Ventures started</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-sage-900">187</span>
                <span className="flex items-center text-xs font-bold text-sage-600">
                  <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> 21%
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-sage-200 shadow-sm">
              <span className="text-xs font-semibold text-muted">Loans linked</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-sage-900">54</span>
                <span className="flex items-center text-xs font-bold text-sage-600">
                  <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> 6%
                </span>
              </div>
            </div>
          </div>

          {/* 12-Column Grid Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Top Recommended Ideas Chart (7 Cols) */}
            <div className="md:col-span-7 rounded-2xl bg-white p-5 border border-sage-200 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-sage-900">Top recommended ideas</h3>
              
              <div className="space-y-2.5 pt-2">
                {[
                  { name: 'Millet snacks', width: '92%' },
                  { name: 'Goat farming', width: '78%' },
                  { name: 'Mushroom unit', width: '68%' },
                  { name: 'Tailoring hub', width: '52%' },
                  { name: 'Dairy cooling', width: '45%' },
                ].map(item => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-ink">
                      <span>{item.name}</span>
                      <span className="font-bold text-sage-800">{item.width}</span>
                    </div>
                    <div className="h-3 w-full bg-sage-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sage-600 rounded-full transition-all duration-500"
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunity matrix by block (5 Cols) */}
            <div className="md:col-span-5 rounded-2xl bg-white p-5 border border-sage-200 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-sage-900">Opportunity by block</h3>
              <p className="text-xs text-muted">20 District blocks demand intensity</p>

              <div className="grid grid-cols-5 gap-2 pt-2">
                {blocks.map(b => (
                  <div
                    key={b.id}
                    className={`flex h-10 items-center justify-center rounded-lg text-xs font-bold shadow-sm transition ${
                      b.intensity === 'gap'
                        ? 'bg-accent text-white ring-2 ring-accent-strong animate-pulse'
                        : b.intensity === 'high'
                        ? 'bg-sage-700 text-white'
                        : b.intensity === 'medium'
                        ? 'bg-sage-400 text-sage-900'
                        : 'bg-sage-100 text-sage-800'
                    }`}
                  >
                    {b.id}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted pt-2 border-t border-sage-100">
                <span>low demand</span>
                <div className="flex space-x-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-sage-100"></span>
                  <span className="h-2.5 w-2.5 rounded-sm bg-sage-400"></span>
                  <span className="h-2.5 w-2.5 rounded-sm bg-sage-700"></span>
                  <span className="h-2.5 w-2.5 rounded-sm bg-accent"></span>
                </div>
                <span>high demand</span>
              </div>
            </div>
          </div>

          {/* Gap Spotted Banner */}
          <div className="rounded-2xl bg-sand p-5 border border-amber-200 text-ink shadow-sm">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-accent-strong flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-base text-accent-strong">Gap spotted</h4>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-ink">
                  Block B13 shows strong demand for millet processing but only one processing unit exists within 20 km.
                </p>
                <p className="mt-2 text-xs font-bold text-sage-800">
                  Suggested action: Run an awareness session in Melur and link SHGs to the nearest lender.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
