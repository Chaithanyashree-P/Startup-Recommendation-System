'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, ChevronRight, Keyboard } from 'lucide-react';

interface VoiceVisualizerProps {
  currentStep: number;
  totalSteps: number;
  question: string;
  subPrompt: string;
  defaultText: string;
  onAnswerSubmit: (answer: string) => void;
  onTypeInstead: () => void;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  currentStep,
  totalSteps,
  question,
  subPrompt,
  defaultText,
  onAnswerSubmit,
  onTypeInstead,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState(defaultText);

  // Web Speech API Voice Recognition setup
  useEffect(() => {
    setSpokenText(defaultText);
  }, [defaultText, currentStep]);

  const toggleListen = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is simulated in this browser session.');
      setIsListening(!isListening);
      if (!isListening) {
        setSpokenText('My village is Melur, I have half an acre of land and 50,000 savings.');
      }
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    if (!isListening) {
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setSpokenText(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 text-center py-4">
      {/* Step Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-sage-600">
          Step {currentStep} of {totalSteps}
        </span>
        <div className="mx-auto h-1.5 w-full max-w-xs rounded-full bg-sage-200 overflow-hidden">
          <div
            className="h-full bg-sage-600 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question */}
      <div>
        <h2 className="text-2xl font-bold text-sage-900">{question}</h2>
        <p className="mt-1 text-sm text-muted">{subPrompt}</p>
      </div>

      {/* Large Terracotta Mic Button & Pulsing Visualizer */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative flex items-center justify-center">
          {/* Animated Waveform rings */}
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-accent/30 mic-pulse scale-150" />
          )}

          <button
            onClick={toggleListen}
            className={`relative flex h-24 w-24 items-center justify-center rounded-full text-white shadow-xl transition transform active:scale-95 ${
              isListening ? 'bg-accent-strong ring-8 ring-accent/30' : 'bg-accent hover:bg-accent-strong'
            }`}
          >
            {isListening ? (
              <MicOff className="h-10 w-10 animate-bounce" />
            ) : (
              <Mic className="h-10 w-10" />
            )}
          </button>
        </div>

        {/* Waveform indicator bars */}
        <div className="mt-6 flex items-center justify-center space-x-1.5 h-6">
          {[12, 24, 18, 32, 20, 28, 14, 26, 16].map((h, i) => (
            <span
              key={i}
              className={`w-1.5 rounded-full bg-sage-600 transition-all duration-150 ${
                isListening ? 'animate-pulse' : 'opacity-40'
              }`}
              style={{
                height: isListening ? `${Math.floor(Math.random() * 20) + 10}px` : `${h}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Spoken Text Box */}
      <div className="rounded-2xl bg-white p-4 text-left border border-sage-200 shadow-sm">
        <span className="text-[11px] font-semibold text-muted uppercase">Spoken Transcript</span>
        <textarea
          value={spokenText}
          onChange={e => setSpokenText(e.target.value)}
          className="mt-1 w-full border-none bg-transparent text-sm font-medium text-ink focus:outline-none resize-none"
          rows={2}
        />
      </div>

      {/* Footer Navigation Controls */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onTypeInstead}
          className="flex items-center justify-center space-x-1.5 rounded-xl border border-sage-300 bg-white py-3 text-xs font-semibold text-sage-800 hover:bg-sage-50"
        >
          <Keyboard className="h-4 w-4" />
          <span>Type instead</span>
        </button>

        <button
          onClick={() => onAnswerSubmit(spokenText)}
          className="flex items-center justify-center space-x-1 rounded-xl bg-sage-600 py-3 text-xs font-bold text-white shadow hover:bg-sage-700"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
