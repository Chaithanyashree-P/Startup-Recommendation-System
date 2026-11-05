'use client';

import React, { useState } from 'react';
import { X, PhoneCall, Volume2, PhoneOff } from 'lucide-react';

interface IVRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IVRModal: React.FC<IVRModalProps> = ({ isOpen, onClose }) => {
  const [activeVoicePrompt, setActiveVoicePrompt] = useState<string>(
    'Welcome to Gram Udyam Voice Service. Press 1 for top business ideas. Press 2 for schemes. Press 3 for market prices. Press 4 to talk to a field agent.'
  );

  if (!isOpen) return null;

  const handleKeyPress = (key: string) => {
    switch (key) {
      case '1':
        setActiveVoicePrompt(
          'Playing top business ideas for your block: 1. Millet snack unit (score 86, payback 10 months). 2. Goat farming (score 81). Press 0 to repeat.'
        );
        break;
      case '2':
        setActiveVoicePrompt(
          'Matching financial schemes: 1. PMEGP credit-linked 35 percent subsidy. 2. MUDRA Shishu up to Rs 50,000 collateral-free loan.'
        );
        break;
      case '3':
        setActiveVoicePrompt(
          'Local market mandi prices today: Millet Ragi at Rs 3,150 per quintal, up 2.4 percent. Groundnut at Rs 6,020 per quintal.'
        );
        break;
      case '4':
        setActiveVoicePrompt(
          'Connecting your call to nearest SHG Field Agent Anitha at Melur Block (2 km away)... Please hold.'
        );
        break;
      case '9':
        setActiveVoicePrompt(
          'Language changed to Tamil. கிராம உத்யம் குரல் சேவைக்கு நல்வரவு.'
        );
        break;
      case '0':
        setActiveVoicePrompt(
          'Welcome to Gram Udyam Voice Service. Press 1 for top business ideas. Press 2 for schemes. Press 3 for market prices.'
        );
        break;
      default:
        setActiveVoicePrompt(`Pressed ${key}. Option registered.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-3xl bg-sage-900 text-white shadow-2xl overflow-hidden border-4 border-sage-700 p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sage-700 pb-3">
          <div className="flex items-center space-x-2">
            <PhoneCall className="h-5 w-5 text-warning animate-pulse" />
            <span className="font-bold text-sm">IVR Toll-Free Call Menu</span>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-sage-800 text-sage-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Audio Waveform / Speaker Display */}
        <div className="rounded-2xl bg-sage-800 p-4 text-center border border-sage-700">
          <div className="flex justify-center items-center space-x-2 text-warning mb-2">
            <Volume2 className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Audio Playback</span>
          </div>
          <p className="text-xs text-sage-100 leading-relaxed font-medium min-h-[4rem] flex items-center justify-center">
            "{activeVoicePrompt}"
          </p>
        </div>

        {/* Keypad Menu Buttons */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { key: '1', label: 'Top Ideas' },
            { key: '2', label: 'Schemes' },
            { key: '3', label: 'Prices' },
            { key: '4', label: 'Field Agent' },
            { key: '9', label: 'Language' },
            { key: '0', label: 'Repeat' },
          ].map(k => (
            <button
              key={k.key}
              onClick={() => handleKeyPress(k.key)}
              className="flex flex-col items-center justify-center rounded-xl bg-sage-800 p-3 border border-sage-700 hover:bg-sage-700 active:scale-95 transition"
            >
              <span className="font-bold text-lg text-sage-50">{k.key}</span>
              <span className="text-[10px] text-sage-300 mt-0.5">{k.label}</span>
            </button>
          ))}
        </div>

        {/* End Call Button */}
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-error py-3 font-bold text-white shadow-md hover:bg-red-700"
        >
          <PhoneOff className="h-4 w-4" />
          <span>End Call</span>
        </button>
      </div>
    </div>
  );
};
