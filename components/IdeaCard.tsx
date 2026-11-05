'use client';

import React from 'react';
import { ScoredIdea } from '../lib/scoring';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface IdeaCardProps {
  idea: ScoredIdea;
  isTopPick?: boolean;
  onSelect: (idea: ScoredIdea) => void;
  onCompareToggle?: (idea: ScoredIdea) => void;
  isCompared?: boolean;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  isTopPick = false,
  onSelect,
  onCompareToggle,
  isCompared = false,
}) => {
  const getBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-sage-800 text-white';
    if (score >= 80) return 'bg-sage-600 text-white';
    return 'bg-sage-500 text-white';
  };

  const initial = idea.name.charAt(0);

  return (
    <div
      className={`relative rounded-2xl bg-white p-4 transition shadow-sm hover:shadow-md ${
        isTopPick
          ? 'border-2 border-accent shadow-md ring-2 ring-accent/20'
          : 'border border-sage-200'
      }`}
    >
      <div className="flex items-start justify-between">
        {/* Left icon avatar & title */}
        <div className="flex items-start space-x-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-sage-100 text-sage-800 font-bold text-lg">
            {initial}
          </div>
          <div>
            <h3 className="text-base font-semibold text-ink leading-tight">
              {idea.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted font-medium">
              {idea.setupCostFormatted} setup · {idea.paybackMonths} mo payback
            </p>
          </div>
        </div>

        {/* Right Score Badge */}
        <div
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-base font-bold shadow-sm ${getBadgeColor(
            idea.fitScore
          )}`}
        >
          {idea.fitScore}
        </div>
      </div>

      {/* Confidence dots & Benefit tag */}
      <div className="mt-3 flex flex-wrap items-center justify-between border-t border-sage-100 pt-3 gap-2">
        <div className="flex items-center space-x-1.5 text-xs text-muted">
          <span className="font-medium">Confidence</span>
          <span className="flex space-x-0.5 text-sage-600">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`inline-block h-2 w-2 rounded-full ${
                  i < idea.confidenceDots ? 'bg-sage-600' : 'bg-sage-300'
                }`}
              />
            ))}
          </span>
          <span className="text-[11px] font-semibold text-sage-700">{idea.confidence}</span>
        </div>

        {/* Benefit Badge Tag */}
        <span className="rounded-full bg-sage-100 px-3 py-1 text-[11px] font-semibold text-sage-700">
          {idea.schemesEligible.includes('PMEGP')
            ? 'Loan eligible'
            : idea.spaceRequired === 'Home room'
            ? 'Low space need'
            : 'Training nearby'}
        </span>
      </div>

      {/* Card Action footer */}
      <div className="mt-3 flex items-center justify-between">
        {onCompareToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCompareToggle(idea);
            }}
            className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              isCompared
                ? 'bg-sage-600 text-white'
                : 'bg-sage-50 text-sage-700 border border-sage-200 hover:bg-sage-100'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{isCompared ? 'Comparing' : '+ Compare'}</span>
          </button>
        )}

        <button
          onClick={() => onSelect(idea)}
          className="ml-auto flex items-center space-x-1 text-xs font-semibold text-sage-700 hover:text-sage-900"
        >
          <span>View Details</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
