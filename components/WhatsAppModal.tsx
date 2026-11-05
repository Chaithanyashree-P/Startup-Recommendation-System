'use client';

import React, { useState } from 'react';
import { X, Send, Mic, Play, CheckCheck } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<
    { id: number; sender: 'user' | 'bot'; text: string; isAudio?: boolean; buttons?: string[] }[]
  >([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste! Send a voice note or type about your village, savings, and skills.',
    },
    {
      id: 2,
      sender: 'user',
      text: '🎙️ Voice note (0:12) - "My village is Melur, I have Rs 50,000 savings and cooking skills."',
      isAudio: true,
    },
    {
      id: 3,
      sender: 'bot',
      text: '🌟 Your Top 3 Recommended Businesses:\n1. Millet snacks (Score 86, Setup ₹1.2L)\n2. Goat farming (Score 81, Setup ₹70k)\n3. Mushroom unit (Score 78, Setup ₹45k)',
      buttons: ['See details', 'Schemes', 'Talk to agent'],
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = { id: Date.now(), sender: 'user' as const, text: inputText };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: `Got your request! Gram Udyam AI Recommendation: Millet snack unit is best suited for your setup cost and village demand. Reply 1 for PDF plan.`,
          buttons: ['Get PDF Plan', 'Check Schemes'],
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#E5DDD5] shadow-2xl overflow-hidden border-4 border-sage-900">
        {/* Phone Header */}
        <div className="bg-[#075E54] text-white p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-600 text-white font-bold text-sm">
              G
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Gram Udyam AI</h3>
              <p className="text-[10px] text-emerald-200">Online · Business Advisor</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-white/20">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Scroll Area */}
        <div className="h-80 overflow-y-auto p-3 space-y-3 text-xs">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-2.5 shadow-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#DCF8C6] text-ink rounded-tr-none'
                    : 'bg-white text-ink rounded-tl-none'
                }`}
              >
                {m.isAudio && (
                  <div className="flex items-center space-x-2 pb-1 border-b border-black/10 mb-1">
                    <Play className="h-4 w-4 text-emerald-700 fill-current" />
                    <div className="h-1.5 w-24 bg-emerald-200 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-emerald-700"></div>
                    </div>
                  </div>
                )}
                <p className="whitespace-pre-line">{m.text}</p>
                <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-muted">
                  <span>9:41 AM</span>
                  {m.sender === 'user' && <CheckCheck className="h-3 w-3 text-blue-500" />}
                </div>
              </div>

              {/* Quick Reply Buttons */}
              {m.buttons && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {m.buttons.map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputText(btn)}
                      className="rounded-full bg-white border border-emerald-600 px-3 py-1 text-[11px] font-semibold text-emerald-800 shadow-sm hover:bg-emerald-50"
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="bg-[#F0F0F0] p-2 flex items-center space-x-2 border-t border-gray-300">
          <button className="p-2 text-emerald-700 hover:bg-gray-200 rounded-full">
            <Mic className="h-5 w-5" />
          </button>
          <input
            type="text"
            placeholder="Type a message or speech..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 rounded-full bg-white px-4 py-2 text-xs border-none focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
          <button
            onClick={handleSend}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#075E54] text-white hover:bg-emerald-800"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
