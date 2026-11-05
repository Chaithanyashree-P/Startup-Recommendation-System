'use client';

import React from 'react';
import { ScoredIdea } from '../lib/scoring';
import { Check, ArrowLeft } from 'lucide-react';

interface CompareTableProps {
  ideaA: ScoredIdea;
  ideaB: ScoredIdea;
  onChoose: (idea: ScoredIdea) => void;
  onBack: () => void;
}

export const CompareTable: React.FC<CompareTableProps> = ({
  ideaA,
  ideaB,
  onChoose,
  onBack,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-sage-200 text-sage-800 shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold text-sage-900">Compare Ideas</h2>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-hidden rounded-2xl border border-sage-200 bg-white shadow-sm">
        {/* Table Header Columns */}
        <div className="grid grid-cols-3 bg-sage-100 p-3 text-center border-b border-sage-200">
          <div className="text-left font-semibold text-xs text-muted">Feature</div>
          <div className="font-bold text-sm text-sage-900">{ideaA.shortName}</div>
          <div className="font-bold text-sm text-sage-900">{ideaB.shortName}</div>
        </div>

        {/* Row 1: Score */}
        <div className="grid grid-cols-3 p-3 items-center border-b border-sage-100 text-xs sm:text-sm">
          <div className="font-medium text-muted">Score</div>
          <div className={`flex items-center justify-center space-x-1 p-1.5 rounded-lg ${ideaA.fitScore >= ideaB.fitScore ? 'bg-sage-100 font-bold text-sage-800' : 'text-ink'}`}>
            {ideaA.fitScore >= ideaB.fitScore && <Check className="h-3.5 w-3.5 text-sage-600" />}
            <span>{ideaA.fitScore}</span>
          </div>
          <div className={`flex items-center justify-center space-x-1 p-1.5 rounded-lg ${ideaB.fitScore > ideaA.fitScore ? 'bg-sage-100 font-bold text-sage-800' : 'text-ink'}`}>
            {ideaB.fitScore > ideaA.fitScore && <Check className="h-3.5 w-3.5 text-sage-600" />}
            <span>{ideaB.fitScore}</span>
          </div>
        </div>

        {/* Row 2: Setup Cost */}
        <div className="grid grid-cols-3 p-3 items-center border-b border-sage-100 text-xs sm:text-sm">
          <div className="font-medium text-muted">Setup Cost</div>
          <div className={`flex items-center justify-center space-x-1 p-1.5 rounded-lg ${ideaA.setupCost <= ideaB.setupCost ? 'bg-sage-100 font-bold text-sage-800' : 'text-ink'}`}>
            {ideaA.setupCost <= ideaB.setupCost && <Check className="h-3.5 w-3.5 text-sage-600" />}
            <span>{ideaA.setupCostFormatted}</span>
          </div>
          <div className={`flex items-center justify-center space-x-1 p-1.5 rounded-lg ${ideaB.setupCost < ideaA.setupCost ? 'bg-sage-100 font-bold text-sage-800' : 'text-ink'}`}>
            {ideaB.setupCost < ideaA.setupCost && <Check className="h-3.5 w-3.5 text-sage-600" />}
            <span>{ideaB.setupCostFormatted}</span>
          </div>
        </div>

        {/* Row 3: Payback */}
        <div className="grid grid-cols-3 p-3 items-center border-b border-sage-100 text-xs sm:text-sm">
          <div className="font-medium text-muted">Payback</div>
          <div className={`flex items-center justify-center space-x-1 p-1.5 rounded-lg ${ideaA.paybackMonths <= ideaB.paybackMonths ? 'bg-sage-100 font-bold text-sage-800' : 'text-ink'}`}>
            {ideaA.paybackMonths <= ideaB.paybackMonths && <Check className="h-3.5 w-3.5 text-sage-600" />}
            <span>{ideaA.paybackMonths} mo</span>
          </div>
          <div className={`flex items-center justify-center space-x-1 p-1.5 rounded-lg ${ideaB.paybackMonths < ideaA.paybackMonths ? 'bg-sage-100 font-bold text-sage-800' : 'text-ink'}`}>
            {ideaB.paybackMonths < ideaA.paybackMonths && <Check className="h-3.5 w-3.5 text-sage-600" />}
            <span>{ideaB.paybackMonths} mo</span>
          </div>
        </div>

        {/* Row 4: Net a month */}
        <div className="grid grid-cols-3 p-3 items-center border-b border-sage-100 text-xs sm:text-sm">
          <div className="font-medium text-muted">Net / Mo</div>
          <div className={`flex items-center justify-center space-x-1 p-1.5 rounded-lg ${ideaA.monthlyProfit >= ideaB.monthlyProfit ? 'bg-sage-100 font-bold text-sage-800' : 'text-ink'}`}>
            {ideaA.monthlyProfit >= ideaB.monthlyProfit && <Check className="h-3.5 w-3.5 text-sage-600" />}
            <span>₹{(ideaA.monthlyProfit / 1000).toFixed(1)}k</span>
          </div>
          <div className={`flex items-center justify-center space-x-1 p-1.5 rounded-lg ${ideaB.monthlyProfit > ideaA.monthlyProfit ? 'bg-sage-100 font-bold text-sage-800' : 'text-ink'}`}>
            {ideaB.monthlyProfit > ideaA.monthlyProfit && <Check className="h-3.5 w-3.5 text-sage-600" />}
            <span>₹{(ideaB.monthlyProfit / 1000).toFixed(1)}k</span>
          </div>
        </div>

        {/* Row 5: Risk */}
        <div className="grid grid-cols-3 p-3 items-center border-b border-sage-100 text-xs sm:text-sm">
          <div className="font-medium text-muted">Risk</div>
          <div className="text-center font-medium text-ink">{ideaA.riskLevel}</div>
          <div className="text-center font-medium text-ink">{ideaB.riskLevel}</div>
        </div>

        {/* Row 6: Space */}
        <div className="grid grid-cols-3 p-3 items-center text-xs sm:text-sm">
          <div className="font-medium text-muted">Space</div>
          <div className="text-center font-medium text-ink">{ideaA.spaceRequired}</div>
          <div className="text-center font-medium text-ink">{ideaB.spaceRequired}</div>
        </div>
      </div>

      {/* Why Note Card */}
      <div className="rounded-2xl bg-sand p-4 text-ink border border-sage-200">
        <h4 className="font-bold text-sm text-accent-strong">
          Why {ideaA.fitScore >= ideaB.fitScore ? ideaA.shortName : ideaB.shortName} fits you better
        </h4>
        <p className="mt-1 text-xs text-muted leading-relaxed">
          {ideaA.fitScore >= ideaB.fitScore
            ? `Higher profit potential, buyers within ${ideaA.buyersWithinKm} km, and you can operate directly from a ${ideaA.spaceRequired}.`
            : `Lower setup capital requirement and faster payback period with strong local buyer demand.`}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => onChoose(ideaA)}
          className="rounded-xl bg-sage-600 px-4 py-3 font-semibold text-white shadow hover:bg-sage-700 text-xs sm:text-sm"
        >
          Choose {ideaA.shortName}
        </button>
        <button
          onClick={() => onChoose(ideaB)}
          className="rounded-xl border border-sage-600 bg-white px-4 py-3 font-semibold text-sage-800 hover:bg-sage-50 text-xs sm:text-sm"
        >
          Choose {ideaB.shortName}
        </button>
      </div>
    </div>
  );
};
