'use client';

import React from 'react';
import { UserProfile } from '../lib/types';
import { MessageSquare, PhoneCall, LayoutDashboard, Wifi, WifiOff } from 'lucide-react';

interface NavbarProps {
  profile: UserProfile;
  onOpenWhatsApp: () => void;
  onOpenIVR: () => void;
  onOpenDashboard: () => void;
  onOpenApiHub?: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenWhatsApp,
  onOpenIVR,
  onOpenDashboard,
  onOpenApiHub,
  isOffline,
  onToggleOffline,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-sage-800 text-white shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-600 text-sand font-bold text-lg shadow-inner">
            🌿
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight tracking-wide text-sage-50">
              Gram Udyam AI
            </h1>
            <p className="text-[11px] text-sage-300">
              {profile.village || 'Melur'}, {profile.block || 'Block B13'}
            </p>
          </div>
        </div>

        {/* Top Actions & Channels */}
        <div className="flex items-center space-x-2">
          {/* API Hub Button */}
          {onOpenApiHub && (
            <button
              onClick={onOpenApiHub}
              className="flex items-center space-x-1.5 rounded-lg bg-sage-700/90 px-2.5 py-1 text-xs font-semibold text-sage-100 hover:bg-sage-600 border border-sage-500/40 shadow-sm"
              title="Open API & Data Source Hub"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>API Hub</span>
            </button>
          )}

          {/* Offline Toggle */}
          <button
            onClick={onToggleOffline}
            className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              isOffline
                ? 'bg-warning text-sage-900 font-bold'
                : 'bg-sage-700/80 text-sage-100 hover:bg-sage-700'
            }`}
            title="Toggle offline simulated mode"
          >
            {isOffline ? <WifiOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5 text-sage-300" />}
            <span className="hidden sm:inline">{isOffline ? 'Offline' : 'Online'}</span>
          </button>

          {/* WhatsApp Bot Simulation */}
          <button
            onClick={onOpenWhatsApp}
            className="flex items-center space-x-1 rounded-lg bg-sage-700 px-2.5 py-1 text-xs font-medium text-sage-100 hover:bg-sage-600"
            title="Open WhatsApp Bot simulation"
          >
            <MessageSquare className="h-3.5 w-3.5 text-accent" />
            <span className="hidden md:inline">WhatsApp</span>
          </button>

          {/* IVR Call Menu Simulation */}
          <button
            onClick={onOpenIVR}
            className="flex items-center space-x-1 rounded-lg bg-sage-700 px-2.5 py-1 text-xs font-medium text-sage-100 hover:bg-sage-600"
            title="Open IVR Phone Menu simulation"
          >
            <PhoneCall className="h-3.5 w-3.5 text-warning" />
            <span className="hidden md:inline">IVR Call</span>
          </button>

          {/* Officer Dashboard */}
          <button
            onClick={onOpenDashboard}
            className="flex items-center space-x-1 rounded-lg bg-accent px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-accent-strong"
            title="Open Officer Web Dashboard"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Officer View</span>
          </button>
        </div>
      </div>
    </header>
  );
};
