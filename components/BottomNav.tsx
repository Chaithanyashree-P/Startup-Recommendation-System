'use client';

import React from 'react';
import { Home, Lightbulb, FileText, HelpCircle } from 'lucide-react';

export type ActiveTab = 'home' | 'ideas' | 'plan' | 'help';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  planProgressStep?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  planProgressStep = 3
}) => {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'ideas' as ActiveTab, label: 'Ideas', icon: Lightbulb },
    { id: 'plan' as ActiveTab, label: 'Plan', icon: FileText, badge: `${planProgressStep}/6` },
    { id: 'help' as ActiveTab, label: 'Help', icon: HelpCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-sage-100 border-t border-sage-200 shadow-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2 px-3">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-4 transition ${
                isActive ? 'text-sage-800 font-bold' : 'text-muted hover:text-sage-600'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  isActive ? 'bg-sage-600 text-white shadow-sm' : 'bg-transparent'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="mt-1 text-[12px] leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
