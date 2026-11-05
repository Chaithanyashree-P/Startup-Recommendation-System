'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, BusinessIdea, Scheme, BuyerLocation, MarketItem, LanguageCode } from '../lib/types';
import ideasDataRaw from '../data/ideas.json';
import schemesDataRaw from '../data/schemes.json';
import mandisDataRaw from '../data/mandis.json';
import { rankIdeasForProfile, generateWhyFitsText, ScoredIdea } from '../lib/scoring';
import { getText, LANGUAGES } from '../lib/i18n';
import { generateBusinessPlanPDF } from '../lib/pdf-generator';

import { Navbar } from '../components/Navbar';
import { BottomNav, ActiveTab } from '../components/BottomNav';
import { IdeaCard } from '../components/IdeaCard';
import { CompareTable } from '../components/CompareTable';
import { PriceChart } from '../components/PriceChart';
import { CashflowChart } from '../components/CashflowChart';
import { MarketMap } from '../components/MarketMap';
import { WhatsAppModal } from '../components/WhatsAppModal';
import { IVRModal } from '../components/IVRModal';
import { OfficerDashboard } from '../components/OfficerDashboard';
import { VoiceVisualizer } from '../components/VoiceVisualizer';
import { ApiStatusModal } from '../components/ApiStatusModal';

import {
  Sparkles,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  FileDown,
  Volume2,
  PhoneCall,
  Sliders,
  ShieldAlert,
  WifiOff,
  RefreshCw,
  Search,
  Check,
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function Home() {
  // App Navigation & Screen State
  const [currentScreen, setCurrentScreen] = useState<'S1' | 'S2' | 'S3' | 'App'>('S1');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [ideasSubView, setIdeasSubView] = useState<'list' | 'compare' | 'detail' | 'moneyCheck' | 'market'>('list');
  const [planSubView, setPlanSubView] = useState<'schemes' | 'timeline' | 'checkin'>('timeline');

  // Interactive Simulators & Modals
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isIVROpen, setIsIVROpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isApiHubOpen, setIsApiHubOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  // User Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Lakshmi',
    village: 'Melur',
    block: 'Block B13',
    district: 'Madurai',
    savings: 50000,
    land: '< 1 acre',
    skills: ['Cooking', 'Farming'],
    time: 'Part-time',
    riskComfort: 'Low',
    shgMember: true,
    category: 'OBC',
    gender: 'Female',
    age: 34,
    language: 'en',
  });

  // Business Ideas & Schemes Datasets
  const rawIdeas = ideasDataRaw as unknown as BusinessIdea[];
  const schemesList = schemesDataRaw as unknown as Scheme[];
  const marketTickers = mandisDataRaw.marketTickers as MarketItem[];
  const buyersList = mandisDataRaw.buyerLocations as BuyerLocation[];

  // Ranked ideas computed dynamically based on current user profile
  const scoredIdeas = rankIdeasForProfile(rawIdeas, profile);
  const topIdea = scoredIdeas[0];

  // Selected idea for detail / compare view
  const [selectedIdea, setSelectedIdea] = useState<ScoredIdea>(scoredIdeas[0]);
  const [compareList, setCompareList] = useState<ScoredIdea[]>([scoredIdeas[0], scoredIdeas[1]]);

  // Category filter state for S5
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // S2 Voice Onboarding Step State
  const [onboardingStep, setOnboardingStep] = useState(1);

  // Text-to-speech audio state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Handle language change
  const handleLanguageSelect = (lang: LanguageCode) => {
    setProfile(prev => ({ ...prev, language: lang }));
  };

  // Text-to-speech player hook
  const playTTS = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis audio player simulated in this browser session.');
      return;
    }
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Filter ideas by category chip
  const filteredIdeas = scoredIdeas.filter(idea => {
    if (categoryFilter === 'All') return true;
    if (categoryFilter === 'Low capital') return idea.setupCost <= 60000;
    if (categoryFilter === 'Home-based') return idea.spaceRequired === 'Home room' || idea.spaceRequired === 'Verandah';
    return idea.category === categoryFilter;
  });

  // Handle compare select
  const handleCompareToggle = (idea: ScoredIdea) => {
    if (compareList.some(i => i.id === idea.id)) {
      setCompareList(compareList.filter(i => i.id !== idea.id));
    } else {
      if (compareList.length >= 2) {
        setCompareList([compareList[1], idea]);
      } else {
        setCompareList([...compareList, idea]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-sage-50 text-ink pb-20 font-sans antialiased">
      {/* Navbar (visible in main app mode) */}
      {currentScreen === 'App' && (
        <Navbar
          profile={profile}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          onOpenIVR={() => setIsIVROpen(true)}
          onOpenDashboard={() => setIsDashboardOpen(true)}
          onOpenApiHub={() => setIsApiHubOpen(true)}
          isOffline={isOffline}
          onToggleOffline={() => setIsOffline(!isOffline)}
        />
      )}

      {/* Offline Mode Banner (Page 16 design spec) */}
      {isOffline && currentScreen === 'App' && (
        <div className="bg-warning text-sage-900 p-2.5 text-center text-xs font-bold flex items-center justify-center space-x-2 shadow-sm">
          <WifiOff className="h-4 w-4" />
          <span>You are offline. Showing saved ideas & plan from yesterday.</span>
        </div>
      )}

      <main className="mx-auto max-w-lg p-4">
        {/* =================================================================== */}
        {/* SCREEN 1 (S1): Splash & Language Selection                          */}
        {/* =================================================================== */}
        {currentScreen === 'S1' && (
          <div className="flex min-h-[90vh] flex-col justify-between rounded-3xl bg-sage-600 text-white p-6 shadow-2xl">
            {/* Header Brand Icon */}
            <div className="text-center pt-8 space-y-3">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-sage-500/40 text-4xl shadow-inner border border-sage-400/40">
                🌿
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Gram Udyam AI</h1>
              <p className="text-sm font-medium text-sage-100">Find the right business for your village</p>
            </div>

            {/* Language Selection Chips */}
            <div className="space-y-4 py-6">
              <h3 className="text-center text-xs font-semibold uppercase tracking-wider text-sage-200">
                {getText(profile.language, 'chooseLanguage')}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map(lang => {
                  const isSelected = profile.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`flex items-center justify-between rounded-2xl p-3.5 text-left text-xs font-bold transition shadow-sm ${
                        isSelected
                          ? 'bg-white text-sage-800 shadow-md ring-2 ring-white'
                          : 'bg-sage-700/70 text-sage-100 hover:bg-sage-700'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-xs font-normal opacity-80">{lang.nativeName}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-center text-[11px] text-sage-200 font-medium pt-1">
                +14 more Indian regional languages available
              </p>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setIsApiHubOpen(true)}
                  className="inline-flex items-center space-x-1.5 rounded-full bg-sage-700/80 px-3.5 py-1.5 text-[11px] font-semibold text-sage-100 hover:bg-sage-700 border border-sage-500/50 shadow-sm transition"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  <span>API Catalogue & Live Status (24 Sources)</span>
                </button>
              </div>
            </div>

            {/* Continue CTA */}
            <button
              onClick={() => setCurrentScreen('S2')}
              className="w-full rounded-2xl bg-white py-4 font-bold text-sage-800 shadow-xl hover:bg-sage-50 transition text-sm"
            >
              {getText(profile.language, 'continue')}
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* SCREEN 2 (S2): Voice Onboarding Wizard                              */}
        {/* =================================================================== */}
        {currentScreen === 'S2' && (
          <div className="min-h-[85vh] flex flex-col justify-between py-2">
            {onboardingStep === 1 && (
              <VoiceVisualizer
                currentStep={1}
                totalSteps={5}
                question="Where is your village?"
                subPrompt="Say the village, block and district"
                defaultText="Melur village, Block B13, Madurai district."
                onAnswerSubmit={ans => {
                  setProfile(p => ({ ...p, village: ans.split(' ')[0] || 'Melur' }));
                  setOnboardingStep(2);
                }}
                onTypeInstead={() => setCurrentScreen('S3')}
              />
            )}

            {onboardingStep === 2 && (
              <VoiceVisualizer
                currentStep={2}
                totalSteps={5}
                question="How much savings can you invest?"
                subPrompt="Say the amount in rupees (e.g. 50,000)"
                defaultText="I can invest 50,000 rupees from savings."
                onAnswerSubmit={ans => {
                  setOnboardingStep(3);
                }}
                onTypeInstead={() => setCurrentScreen('S3')}
              />
            )}

            {onboardingStep === 3 && (
              <VoiceVisualizer
                currentStep={3}
                totalSteps={5}
                question="What land do you have?"
                subPrompt="Say none, half acre, or 1 to 3 acres"
                defaultText="I have half an acre of agricultural land."
                onAnswerSubmit={ans => {
                  setOnboardingStep(4);
                }}
                onTypeInstead={() => setCurrentScreen('S3')}
              />
            )}

            {onboardingStep === 4 && (
              <VoiceVisualizer
                currentStep={4}
                totalSteps={5}
                question="What skills do you have?"
                subPrompt="Say cooking, tailoring, farming, driving..."
                defaultText="I know cooking and basic farming work."
                onAnswerSubmit={ans => {
                  setOnboardingStep(5);
                }}
                onTypeInstead={() => setCurrentScreen('S3')}
              />
            )}

            {onboardingStep === 5 && (
              <VoiceVisualizer
                currentStep={5}
                totalSteps={5}
                question="Time and risk comfort?"
                subPrompt="Part-time or full-time? Low or medium risk?"
                defaultText="Part-time work with low risk comfort."
                onAnswerSubmit={ans => {
                  setCurrentScreen('S3');
                }}
                onTypeInstead={() => setCurrentScreen('S3')}
              />
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* SCREEN 3 (S3): Profile Check & Edit                                 */}
        {/* =================================================================== */}
        {currentScreen === 'S3' && (
          <div className="space-y-6 rounded-3xl bg-sage-600 text-white p-6 shadow-2xl">
            <div>
              <h2 className="text-2xl font-bold">Your details</h2>
              <p className="text-xs text-sage-200 mt-0.5">Check and edit anything before viewing ideas</p>
            </div>

            {/* Savings Slider */}
            <div className="space-y-2 rounded-2xl bg-sage-700/80 p-4 border border-sage-500/40">
              <div className="flex justify-between items-center text-xs font-medium">
                <span>Savings you can invest</span>
                <span className="text-base font-bold text-sand">₹{profile.savings.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="200000"
                step="5000"
                value={profile.savings}
                onChange={e => setProfile({ ...profile, savings: parseInt(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            {/* Land Chips */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-sage-200">Land Holding</label>
              <div className="grid grid-cols-4 gap-2">
                {(['None', '< 1 acre', '1-3', '3+'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setProfile({ ...profile, land: l })}
                    className={`rounded-xl py-2 text-xs font-bold transition ${
                      profile.land === l ? 'bg-white text-sage-800 shadow' : 'bg-sage-700 text-sage-100'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Chips */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-sage-200">Skills</label>
              <div className="flex flex-wrap gap-2">
                {['Cooking', 'Farming', 'Tailoring', 'Mobile repair', 'Driving', 'Animal care'].map(sk => {
                  const hasSkill = profile.skills.includes(sk);
                  return (
                    <button
                      key={sk}
                      onClick={() => {
                        const newSkills = hasSkill
                          ? profile.skills.filter(s => s !== sk)
                          : [...profile.skills, sk];
                        setProfile({ ...profile, skills: newSkills });
                      }}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                        hasSkill ? 'bg-white text-sage-800 shadow' : 'bg-sage-700 text-sage-200'
                      }`}
                    >
                      {sk}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Availability */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-sage-200">Time you can give</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Part-time', 'Full-time'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setProfile({ ...profile, time: t })}
                    className={`rounded-xl py-2 text-xs font-bold transition ${
                      profile.time === t ? 'bg-white text-sage-800 shadow' : 'bg-sage-700 text-sage-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Comfort */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-sage-200">Risk Comfort</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Low', 'Medium', 'High'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setProfile({ ...profile, riskComfort: r })}
                    className={`rounded-xl py-2 text-xs font-bold transition ${
                      profile.riskComfort === r ? 'bg-white text-sage-800 shadow' : 'bg-sage-700 text-sage-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Show My Ideas CTA */}
            <button
              onClick={() => {
                setCurrentScreen('App');
                setActiveTab('home');
              }}
              className="w-full rounded-2xl bg-white py-4 font-bold text-sage-800 shadow-xl hover:bg-sage-50 transition text-sm"
            >
              Show my ideas
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* MAIN APP CONTAINER (TAB NAVIGATION S4 - S14)                       */}
        {/* =================================================================== */}
        {currentScreen === 'App' && (
          <div className="space-y-5">
            {/* TAB 1: HOME (S4) */}
            {activeTab === 'home' && (
              <div className="space-y-5">
                {/* Greeting Banner */}
                <div className="rounded-3xl bg-sage-600 text-white p-5 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Good morning</h2>
                      <p className="text-xs text-sage-200 mt-0.5">
                        {profile.name} · today in {profile.block || 'your block'}
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentScreen('S3')}
                      className="rounded-full bg-sage-700 p-2 text-xs font-semibold text-sage-100 hover:bg-sage-500"
                    >
                      Edit details
                    </button>
                  </div>
                </div>

                {/* Top Recommended Idea Card (S4 Widget) */}
                <div className="rounded-3xl bg-white p-5 border border-sage-200 shadow-sm space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sage-600">
                    YOUR TOP IDEA TODAY
                  </span>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-sage-900">{topIdea.name}</h3>
                      <p className="text-xs text-muted font-medium mt-0.5">
                        Setup {topIdea.setupCostFormatted} · ₹{(topIdea.monthlyProfit / 1000).toFixed(1)}k/mo profit
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-800 text-white font-bold text-lg shadow">
                      {topIdea.fitScore}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-sage-100 pt-3">
                    <div className="flex items-center space-x-1.5 text-xs text-muted">
                      <span className="font-semibold text-sage-700">{topIdea.confidence} confidence</span>
                      <span className="flex space-x-0.5">
                        <span className="h-2 w-2 rounded-full bg-sage-600"></span>
                        <span className="h-2 w-2 rounded-full bg-sage-600"></span>
                        <span className="h-2 w-2 rounded-full bg-sage-300"></span>
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedIdea(topIdea);
                        setActiveTab('ideas');
                        setIdeasSubView('detail');
                      }}
                      className="rounded-xl bg-sage-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-sage-700"
                    >
                      See why
                    </button>
                  </div>
                </div>

                {/* Local Commodity Prices Ticker (S4 Widget) */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted uppercase tracking-wider">
                    Prices near you (illustrative)
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    {marketTickers.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="rounded-2xl bg-white p-3 border border-sage-200 shadow-sm">
                        <span className="text-[11px] font-semibold text-muted block truncate">
                          {item.commodity.split(' ')[0]}
                        </span>
                        <span className="text-sm font-bold text-sage-900 mt-1 block">
                          ₹{item.currentPrice.toLocaleString('en-IN')}
                        </span>
                        <div
                          className={`mt-1 flex items-center text-[10px] font-bold ${
                            item.isIncrease ? 'text-sage-600' : 'text-error'
                          }`}
                        >
                          {item.isIncrease ? (
                            <TrendingUp className="h-3 w-3 mr-0.5" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-0.5" />
                          )}
                          <span>{item.changePercent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick App Modules Grid */}
                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                  <button
                    onClick={() => {
                      setActiveTab('ideas');
                      setIdeasSubView('list');
                    }}
                    className="flex flex-col items-center justify-center rounded-2xl bg-sage-100 p-3 border border-sage-200 hover:bg-sage-200"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-600 text-white font-bold mb-1">
                      I
                    </div>
                    <span className="text-xs font-bold text-sage-900">Ideas</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('plan');
                      setPlanSubView('schemes');
                    }}
                    className="flex flex-col items-center justify-center rounded-2xl bg-sage-100 p-3 border border-sage-200 hover:bg-sage-200"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-600 text-white font-bold mb-1">
                      S
                    </div>
                    <span className="text-xs font-bold text-sage-900">Schemes</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('ideas');
                      setIdeasSubView('market');
                    }}
                    className="flex flex-col items-center justify-center rounded-2xl bg-sage-100 p-3 border border-sage-200 hover:bg-sage-200"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-600 text-white font-bold mb-1">
                      M
                    </div>
                    <span className="text-xs font-bold text-sage-900">Market</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('plan');
                      setPlanSubView('timeline');
                    }}
                    className="flex flex-col items-center justify-center rounded-2xl bg-sage-100 p-3 border border-sage-200 hover:bg-sage-200"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-600 text-white font-bold mb-1">
                      P
                    </div>
                    <span className="text-xs font-bold text-sage-900">Plan</span>
                  </button>
                </div>

                {/* Plan Progress Bar (S4 Widget) */}
                <div className="rounded-2xl bg-white p-4 border border-sage-200 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-sage-900">
                    <span>Your plan: step 3 of 6</span>
                    <span className="text-sage-600">50% Complete</span>
                  </div>
                  <div className="h-2.5 w-full bg-sage-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sage-600 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: IDEAS (S5, S6, S7, S8, S9) */}
            {activeTab === 'ideas' && (
              <div className="space-y-4">
                {/* Sub View Switcher Header */}
                <div className="flex items-center space-x-2 border-b border-sage-200 pb-3 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setIdeasSubView('list')}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                      ideasSubView === 'list'
                        ? 'bg-sage-700 text-white shadow'
                        : 'bg-white text-sage-800 border border-sage-200'
                    }`}
                  >
                    Ranked Ideas (S5)
                  </button>

                  <button
                    onClick={() => setIdeasSubView('compare')}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                      ideasSubView === 'compare'
                        ? 'bg-sage-700 text-white shadow'
                        : 'bg-white text-sage-800 border border-sage-200'
                    }`}
                  >
                    Compare (S6)
                  </button>

                  <button
                    onClick={() => setIdeasSubView('market')}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                      ideasSubView === 'market'
                        ? 'bg-sage-700 text-white shadow'
                        : 'bg-white text-sage-800 border border-sage-200'
                    }`}
                  >
                    Market Pulse (S9)
                  </button>
                </div>

                {/* SUB VIEW 1: Ranked Ideas List (S5) */}
                {ideasSubView === 'list' && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-sage-900">Best for you</h2>
                      <p className="text-xs text-muted font-medium mt-0.5">
                        Based on your village ({profile.village}), budget (₹{profile.savings.toLocaleString('en-IN')}), and skills
                      </p>
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
                      {['All', 'Low capital', 'Home-based', 'Agro-processing', 'Services'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`flex-shrink-0 rounded-full px-3.5 py-1 text-xs font-bold transition ${
                            categoryFilter === cat
                              ? 'bg-sage-800 text-white shadow-sm'
                              : 'bg-white text-sage-700 border border-sage-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Ranked Idea Cards List */}
                    <div className="space-y-3">
                      {filteredIdeas.map((idea, index) => (
                        <IdeaCard
                          key={idea.id}
                          idea={idea}
                          isTopPick={index === 0}
                          onSelect={selected => {
                            setSelectedIdea(selected);
                            setIdeasSubView('detail');
                          }}
                          onCompareToggle={handleCompareToggle}
                          isCompared={compareList.some(i => i.id === idea.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB VIEW 2: Compare Ideas (S6) */}
                {ideasSubView === 'compare' && (
                  <CompareTable
                    ideaA={compareList[0] || scoredIdeas[0]}
                    ideaB={compareList[1] || scoredIdeas[1]}
                    onChoose={chosen => {
                      setSelectedIdea(chosen);
                      setIdeasSubView('detail');
                    }}
                    onBack={() => setIdeasSubView('list')}
                  />
                )}

                {/* SUB VIEW 3: Idea Detail (S7) */}
                {ideasSubView === 'detail' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setIdeasSubView('list')}
                        className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-sage-800 border border-sage-200 shadow-sm"
                      >
                        ‹ Back to list
                      </button>

                      <div className="flex items-center space-x-1.5 text-xs font-bold text-sage-800">
                        <span>Score:</span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage-800 text-white text-xs">
                          {selectedIdea.fitScore}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-sage-900">{selectedIdea.name}</h2>

                    {/* 90-day price outlook line chart */}
                    <PriceChart data={selectedIdea.priceOutlook} />

                    {/* 3 Key Metric Tiles */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-2xl bg-sage-100 p-3 text-center border border-sage-200">
                        <span className="text-base font-bold text-sage-900">
                          ₹{(selectedIdea.monthlyProfit / 1000).toFixed(1)}k
                        </span>
                        <span className="text-[10px] font-semibold text-muted block mt-0.5">Net a month</span>
                      </div>

                      <div className="rounded-2xl bg-sage-100 p-3 text-center border border-sage-200">
                        <span className="text-sm font-bold text-sage-900">{selectedIdea.riskLevel}</span>
                        <span className="text-[10px] font-semibold text-muted block mt-0.5">Risk</span>
                      </div>

                      <div className="rounded-2xl bg-sage-100 p-3 text-center border border-sage-200">
                        <span className="text-base font-bold text-sage-900">{selectedIdea.buyersWithinKm}</span>
                        <span className="text-[10px] font-semibold text-muted block mt-0.5">Buyers ≤25 km</span>
                      </div>
                    </div>

                    {/* Why this fits you card */}
                    <div className="rounded-2xl bg-white p-4 border border-sage-200 shadow-sm space-y-2">
                      <h4 className="font-bold text-sm text-sage-900">Why this fits you</h4>
                      <div className="space-y-2 text-xs font-medium text-ink">
                        {generateWhyFitsText(selectedIdea, profile).map((reason, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-sage-600 flex-shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Schemes eligible */}
                    <div className="rounded-2xl bg-sage-100 p-3.5 border border-sage-200 text-xs font-semibold text-sage-800">
                      Eligible Schemes: {selectedIdea.schemesEligible.join(' · ')}
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        onClick={() => setIdeasSubView('moneyCheck')}
                        className="rounded-2xl border border-sage-600 bg-white py-3.5 font-bold text-sage-800 shadow-sm hover:bg-sage-50 text-xs sm:text-sm"
                      >
                        Money check (S8)
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('plan');
                          setPlanSubView('timeline');
                        }}
                        className="rounded-2xl bg-sage-600 py-3.5 font-bold text-white shadow-md hover:bg-sage-700 text-xs sm:text-sm"
                      >
                        Get business plan
                      </button>
                    </div>
                  </div>
                )}

                {/* SUB VIEW 4: Money Check & Stress Test (S8) */}
                {ideasSubView === 'moneyCheck' && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIdeasSubView('detail')}
                        className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-sage-800 border border-sage-200 shadow-sm"
                      >
                        ‹ Back to detail
                      </button>
                      <h2 className="text-xl font-bold text-sage-900">Money check (S8)</h2>
                    </div>

                    <CashflowChart
                      data={selectedIdea.year1Cashflow}
                      basePaybackMonth={selectedIdea.paybackMonths}
                      monthlyProfit={selectedIdea.monthlyProfit}
                      onSavePlan={() => {
                        setActiveTab('plan');
                        setPlanSubView('timeline');
                      }}
                    />
                  </div>
                )}

                {/* SUB VIEW 5: Market Pulse Map (S9) */}
                {ideasSubView === 'market' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-sage-900">Market pulse (S9)</h2>
                    <p className="text-xs text-muted font-medium">Map of nearby mandis and buyers with live offers</p>
                    <MarketMap buyers={buyersList} />
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PLAN (S10, S11, S13) */}
            {activeTab === 'plan' && (
              <div className="space-y-4">
                {/* Sub View Switcher Header */}
                <div className="flex items-center space-x-2 border-b border-sage-200 pb-3 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setPlanSubView('timeline')}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                      planSubView === 'timeline'
                        ? 'bg-sage-700 text-white shadow'
                        : 'bg-white text-sage-800 border border-sage-200'
                    }`}
                  >
                    My Plan (S11)
                  </button>

                  <button
                    onClick={() => setPlanSubView('schemes')}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                      planSubView === 'schemes'
                        ? 'bg-sage-700 text-white shadow'
                        : 'bg-white text-sage-800 border border-sage-200'
                    }`}
                  >
                    Schemes (S10)
                  </button>

                  <button
                    onClick={() => setPlanSubView('checkin')}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                      planSubView === 'checkin'
                        ? 'bg-sage-700 text-white shadow'
                        : 'bg-white text-sage-800 border border-sage-200'
                    }`}
                  >
                    Check-ins (S13)
                  </button>
                </div>

                {/* SUB VIEW 1: My Plan Timeline (S11) */}
                {planSubView === 'timeline' && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-sage-900">My plan</h2>
                      <p className="text-xs text-sage-700 font-bold mt-0.5">{topIdea.name}</p>
                    </div>

                    {/* 6 Step Visual Timeline */}
                    <div className="rounded-3xl bg-white p-5 border border-sage-200 shadow-sm space-y-4">
                      {[
                        { step: 1, title: 'Choose idea', status: 'Done', detail: 'Completed Millet snack choice' },
                        { step: 2, title: 'Check schemes', status: 'Done', detail: 'PMEGP & MUDRA pre-approved' },
                        { step: 3, title: 'Gather documents', status: 'In Progress', detail: '4 of 6 ready (Aadhaar, Passbook)' },
                        { step: 4, title: 'Visit bank or CSC', status: 'Upcoming', detail: 'Book a visit at Melur CSC' },
                        { step: 5, title: 'Buy inputs and equipment', status: 'Upcoming', detail: 'Supplier list ready' },
                        { step: 6, title: 'Start and record sales', status: 'Upcoming', detail: 'Weekly check-ins' },
                      ].map(st => (
                        <div key={st.step} className="flex items-start space-x-3">
                          <div
                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white mt-0.5 ${
                              st.status === 'Done'
                                ? 'bg-sage-600'
                                : st.status === 'In Progress'
                                ? 'bg-accent ring-4 ring-accent/20'
                                : 'bg-sage-300'
                            }`}
                          >
                            {st.status === 'Done' ? '✓' : st.step}
                          </div>
                          <div className="flex-1 border-b border-sage-100 pb-3">
                            <h4 className="font-bold text-sm text-ink">{st.title}</h4>
                            <p className="text-xs text-muted mt-0.5">{st.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Download PDF & Listen Action Bar */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => generateBusinessPlanPDF(topIdea, profile, schemesList)}
                        className="flex items-center justify-center space-x-2 rounded-2xl bg-sage-700 py-3.5 font-bold text-white shadow hover:bg-sage-800 transition text-xs sm:text-sm"
                      >
                        <FileDown className="h-4 w-4" />
                        <span>Download PDF</span>
                      </button>

                      <button
                        onClick={() =>
                          playTTS(
                            `Here is your business plan for ${topIdea.name}. Step 1, Choose idea is done. Step 2, Check schemes is done. Step 3, Gather documents: 4 of 6 documents are ready. Please visit nearest bank or CSC.`
                          )
                        }
                        className="flex items-center justify-center space-x-2 rounded-2xl border border-sage-600 bg-white py-3.5 font-bold text-sage-800 shadow-sm hover:bg-sage-50 transition text-xs sm:text-sm"
                      >
                        <Volume2 className={`h-4 w-4 ${isSpeaking ? 'text-accent animate-pulse' : ''}`} />
                        <span>{isSpeaking ? 'Playing...' : 'Listen'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* SUB VIEW 2: Schemes Matcher (S10) */}
                {planSubView === 'schemes' && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-sage-900">Schemes for you</h2>
                      <p className="text-xs text-muted font-medium mt-0.5">3 likely matches. Confirm at the bank.</p>
                    </div>

                    <div className="space-y-3">
                      {schemesList.map(sc => (
                        <div key={sc.id} className="rounded-2xl bg-white p-4 border border-sage-200 shadow-sm space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-base text-sage-900">{sc.code}</h3>
                              <p className="text-xs text-muted font-medium">{sc.description}</p>
                            </div>
                            <span className="rounded-full bg-sage-100 px-2.5 py-1 text-[11px] font-bold text-sage-800">
                              {sc.statusText}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-xs font-semibold text-muted pt-2 border-t border-sage-100">
                            <span>Documents Progress</span>
                            <span className="text-sage-800 font-bold">{sc.documentsReady} of {sc.documentsTotal} ready</span>
                          </div>

                          <div className="h-2 w-full bg-sage-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sage-600 rounded-full"
                              style={{ width: `${(sc.documentsReady / sc.documentsTotal) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setPlanSubView('timeline')}
                      className="w-full rounded-2xl bg-sage-600 py-3.5 font-bold text-white shadow-md hover:bg-sage-700 transition"
                    >
                      Prepare my documents
                    </button>
                  </div>
                )}

                {/* SUB VIEW 3: 30/90/180-Day Check-ins (S13) */}
                {planSubView === 'checkin' && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-sage-900">30-day check-in (S13)</h2>
                      <p className="text-xs text-muted font-medium mt-0.5">A few quick questions to track your progress</p>
                    </div>

                    <div className="rounded-3xl bg-white p-5 border border-sage-200 shadow-sm space-y-4">
                      <h3 className="font-bold text-base text-center text-sage-900">
                        Did you start your business?
                      </h3>

                      <div className="space-y-2">
                        <button className="w-full rounded-2xl bg-sage-600 py-3.5 font-bold text-white shadow hover:bg-sage-700">
                          Yes, I started
                        </button>
                        <button className="w-full rounded-2xl border border-sage-300 bg-white py-3.5 font-bold text-sage-800 hover:bg-sage-50">
                          Not yet
                        </button>
                        <button className="w-full rounded-2xl bg-accent py-3.5 font-bold text-white shadow hover:bg-accent-strong">
                          I need help
                        </button>
                      </div>

                      {/* Optional Sales Recording */}
                      <div className="pt-3 border-t border-sage-100 space-y-2">
                        <label className="text-xs font-semibold text-muted">Sales last month (optional)</label>
                        <div className="flex items-center rounded-2xl bg-sage-50 p-3 border border-sage-200">
                          <span className="font-bold text-sage-800 text-sm mr-2">₹</span>
                          <input
                            type="number"
                            placeholder="12,000"
                            className="w-full bg-transparent text-sm font-bold focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Milestones Celebrations */}
                      <div className="flex justify-around pt-2">
                        <div className="flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-600 text-white font-bold">
                            ✓
                          </div>
                          <span className="text-[10px] font-bold text-sage-800 mt-1">Plan</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-600 text-white font-bold">
                            ✓
                          </div>
                          <span className="text-[10px] font-bold text-sage-800 mt-1">Loan</span>
                        </div>
                        <div className="flex flex-col items-center opacity-40">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-200 text-sage-700 font-bold">
                            ◯
                          </div>
                          <span className="text-[10px] font-bold text-sage-800 mt-1">First sale</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: HELP & SETTINGS (S12, S14) */}
            {activeTab === 'help' && (
              <div className="space-y-5">
                {/* Voice / Type Help Search Bar (S12) */}
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-sage-900">Help</h2>
                  <p className="text-xs text-muted font-medium">We are here for you</p>

                  <div className="flex items-center rounded-2xl bg-sand p-3.5 border border-amber-200 shadow-sm">
                    <Search className="h-5 w-5 text-accent mr-2" />
                    <input
                      type="text"
                      placeholder="Ask by voice or type..."
                      className="w-full bg-transparent text-sm font-semibold text-ink focus:outline-none"
                    />
                  </div>

                  {/* Suggested Question Chips */}
                  <div className="space-y-2">
                    {[
                      'How do I apply for a loan?',
                      'Which documents do I need?',
                      'Is the price falling?',
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => alert(`Showing answer for: "${q}"`)}
                        className="w-full text-left rounded-2xl bg-white p-3 text-xs font-semibold text-sage-800 border border-sage-200 shadow-sm hover:bg-sage-50"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nearby Human Help Cards (S12) */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-bold text-sm text-sage-900">Nearby help</h3>

                  {[
                    { title: 'Field agent (SHG)', dist: '2 km · Mon to Sat', initial: 'F' },
                    { title: 'Farm science centre (KVK)', dist: '18 km', initial: 'F' },
                    { title: 'Common service centre (CSC)', dist: '4 km', initial: 'C' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-2xl bg-white p-4 border border-sage-200 shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-100 text-sage-800 font-bold text-base">
                          {item.initial}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-ink">{item.title}</h4>
                          <p className="text-xs text-muted mt-0.5">{item.dist}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Calling ${item.title}...`)}
                        className="flex items-center space-x-1 rounded-xl bg-sage-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-sage-700"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                        <span>Call</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Settings & Privacy Controls (S14) */}
                <div className="rounded-3xl bg-white p-5 border border-sage-200 shadow-sm space-y-4 pt-4">
                  <h3 className="font-bold text-base text-sage-900 border-b border-sage-100 pb-2">
                    Settings & privacy (S14)
                  </h3>

                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Language</span>
                    <button
                      onClick={() => setCurrentScreen('S1')}
                      className="text-sage-700 underline font-semibold"
                    >
                      {LANGUAGES.find(l => l.code === profile.language)?.name} ›
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-sage-100">
                    <span>High contrast</span>
                    <input type="checkbox" className="accent-sage-600 h-4 w-4" />
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-sage-100">
                    <span>Data saver</span>
                    <input type="checkbox" defaultChecked className="accent-sage-600 h-4 w-4" />
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-sage-100">
                    <span>Share plan with lenders</span>
                    <input type="checkbox" className="accent-sage-600 h-4 w-4" />
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete all saved profile data?')) {
                        alert('Data cleared.');
                      }
                    }}
                    className="w-full text-center text-xs font-bold text-error pt-2 hover:underline"
                  >
                    Delete my data
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation Tabs */}
      {currentScreen === 'App' && (
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} planProgressStep={3} />
      )}

      {/* Interactive Modals */}
      <WhatsAppModal isOpen={isWhatsAppOpen} onClose={() => setIsWhatsAppOpen(false)} />
      <IVRModal isOpen={isIVROpen} onClose={() => setIsIVROpen(false)} />
      <OfficerDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
      <ApiStatusModal isOpen={isApiHubOpen} onClose={() => setIsApiHubOpen(false)} />
    </div>
  );
}
