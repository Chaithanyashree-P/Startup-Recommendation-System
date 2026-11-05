'use client';

import React from 'react';
import { BuyerLocation } from '../lib/types';
import { MapPin, Navigation } from 'lucide-react';

interface MarketMapProps {
  buyers: BuyerLocation[];
}

export const MarketMap: React.FC<MarketMapProps> = ({ buyers }) => {
  return (
    <div className="space-y-4">
      {/* Interactive Map Visual Area */}
      <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-[#E6EFE2] border border-sage-300 p-4 shadow-inner">
        {/* Decorative Grid Lines / Road Paths */}
        <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <path d="M 10 50 Q 80 120 190 60 T 320 180" fill="none" stroke="#7F9A6D" strokeWidth="4" />
          <path d="M 100 200 Q 150 100 280 40" fill="none" stroke="#9CAF88" strokeWidth="3" strokeDasharray="5,5" />
          <circle cx="150" cy="120" r="40" fill="none" stroke="#5E7A50" strokeWidth="1" strokeDasharray="3,3" />
        </svg>

        {/* User Location Pin */}
        <div className="absolute top-[45%] left-[45%] flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-800 text-white shadow-lg ring-4 ring-sage-400/50">
            <Navigation className="h-5 w-5 fill-current" />
          </div>
          <span className="mt-1 rounded bg-sage-900 px-2 py-0.5 text-[10px] font-bold text-white shadow">
            You
          </span>
        </div>

        {/* Buyer Location Pins (Shapes + Colors) */}
        {buyers.map(b => (
          <div
            key={b.id}
            style={{ top: `${b.y}%`, left: `${b.x}%` }}
            className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition hover:scale-110"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center font-bold text-white shadow-md ${
                b.shape === 'circle'
                  ? 'rounded-full bg-accent'
                  : b.shape === 'square'
                  ? 'rounded-md bg-sage-600'
                  : 'rounded-lg bg-warning text-sage-900'
              }`}
            >
              {b.name.charAt(0)}
            </div>
            <span className="mt-1 rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-ink border border-sage-200 shadow-sm">
              {b.distanceKm} km
            </span>
          </div>
        ))}

        <div className="absolute top-3 right-3 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-sage-800 shadow backdrop-blur-sm">
          Offline Map Cached
        </div>
      </div>

      {/* Bottom Sheet Buyer Cards */}
      <div className="rounded-2xl border border-sage-200 bg-white p-4 shadow-sm">
        <h4 className="font-bold text-sm text-sage-900 mb-3 flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-accent" />
          <span>Nearest buyers & mandis</span>
        </h4>

        <div className="divide-y divide-sage-100">
          {buyers.map(b => (
            <div key={b.id} className="flex items-center justify-between py-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-block h-3 w-3 ${
                      b.shape === 'circle'
                        ? 'rounded-full bg-accent'
                        : b.shape === 'square'
                        ? 'rounded-sm bg-sage-600'
                        : 'rotate-45 bg-warning'
                    }`}
                  />
                  <h5 className="font-bold text-sm text-ink">{b.name}</h5>
                </div>
                <p className="text-xs text-muted mt-0.5">{b.distanceKm} km away</p>
              </div>

              <div className="text-right">
                <span className="font-bold text-sm text-sage-800">{b.priceOffer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
