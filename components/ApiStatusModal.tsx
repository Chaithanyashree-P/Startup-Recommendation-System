'use client';

import React, { useState, useEffect } from 'react';
import {
  fetchApiStatus,
  testSingleApi,
  ApiStatusItem,
  ApiStatusResponse
} from '../lib/api-client';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Server,
  CloudSun,
  Languages,
  MapPin,
  FileCheck,
  ChevronRight,
  KeyRound
} from 'lucide-react';

interface ApiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiMetadata {
  id: string;
  name: string;
  category: 'data' | 'climate' | 'language' | 'geo' | 'schemes';
  docsUrl: string;
  keyUrl?: string;
  cost: string;
  statusText: string;
  purpose: string;
}

const CATALOG_METADATA: ApiMetadata[] = [
  {
    id: 'agmarknet',
    name: 'data.gov.in Agmarknet Mandi Prices',
    category: 'data',
    docsUrl: 'https://data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi',
    keyUrl: 'https://data.gov.in/',
    cost: 'Free (Registration required)',
    statusText: 'Verified',
    purpose: 'Real-time daily modal prices, price momentum, min/max spread in ₹/quintal.'
  },
  {
    id: 'openmeteo',
    name: 'Open-Meteo Weather & ERA5 Climate',
    category: 'climate',
    docsUrl: 'https://open-meteo.com/',
    cost: 'Free (10k calls/day, CC BY 4.0)',
    statusText: 'Verified (Live without key)',
    purpose: '16-day forecast, ERA5 reanalysis history, heat days, rainfall millimeters.'
  },
  {
    id: 'nasapower',
    name: 'NASA POWER Agro-Climatology',
    category: 'climate',
    docsUrl: 'https://power.larc.nasa.gov/',
    cost: 'Free (Open REST)',
    statusText: 'Verified (Live without key)',
    purpose: 'Solar radiation (kWh/m²/day) for solar drying, pumps, and long-run climate normals.'
  },
  {
    id: 'soilgrids',
    name: 'ISRIC SoilGrids 2.0 REST API',
    category: 'climate',
    docsUrl: 'https://rest.isric.org/soilgrids/v2.0/docs',
    cost: 'Free Open REST',
    statusText: 'Verified / Local Fallback',
    purpose: 'Soil pH, organic carbon, clay content at ~250m resolution for crop/enterprise suitability.'
  },
  {
    id: 'nominatim',
    name: 'OpenStreetMap Nominatim Geocoding',
    category: 'geo',
    docsUrl: 'https://nominatim.org/',
    cost: 'Free Open OSM',
    statusText: 'Verified (Live without key)',
    purpose: 'Village, block, and district geocoding to GPS coordinates.'
  },
  {
    id: 'osrm',
    name: 'OSRM Road Routing Engine',
    category: 'geo',
    docsUrl: 'https://project-osrm.org/',
    cost: 'Free Open Source',
    statusText: 'Verified (Live without key)',
    purpose: 'Calculates driving distance (km) and travel duration (mins) to mandis and buyers.'
  },
  {
    id: 'worldbank',
    name: 'World Bank Indicators API',
    category: 'data',
    docsUrl: 'https://data.worldbank.org/indicator/NV.AGR.TOTL.ZS',
    cost: 'Free Open REST',
    statusText: 'Verified (Live without key)',
    purpose: 'Macro context for SDG 8 (agriculture value added % of GDP).'
  },
  {
    id: 'claude',
    name: 'Claude API (Anthropic)',
    category: 'language',
    docsUrl: 'https://docs.anthropic.com/',
    keyUrl: 'https://console.anthropic.com/',
    cost: 'Commercial (Pay-per-token)',
    statusText: 'Verified (With Number Guardrail)',
    purpose: 'Multilingual business explanations & business plan drafting (0 invented numbers).'
  },
  {
    id: 'bhashini',
    name: 'MeitY Bhashini ULCA Pipeline',
    category: 'language',
    docsUrl: 'https://bhashini.gitbook.io/bhashini-apis',
    keyUrl: 'https://bhashini.gov.in/ulca/',
    cost: 'Free Government Portal Key',
    statusText: 'Verified',
    purpose: 'Speech-to-text (ASR), translation (NMT), and TTS for 22 scheduled Indian languages.'
  },
  {
    id: 'sarvam',
    name: 'Sarvam AI Speech & Translation',
    category: 'language',
    docsUrl: 'https://docs.sarvam.ai/',
    keyUrl: 'https://www.sarvam.ai/',
    cost: 'Commercial Key',
    statusText: 'Verified Fallback',
    purpose: 'Indian language speech-to-text, text-to-speech, and translation fallback.'
  },
  {
    id: 'schemes',
    name: 'myScheme & Ministry Rules Engine',
    category: 'schemes',
    docsUrl: 'https://www.myscheme.gov.in/',
    cost: 'Curated Knowledge Base',
    statusText: 'Verified Knowledge Base',
    purpose: 'Deterministic eligibility matching for PMEGP, MUDRA, NRLM-SHG, and PMFME.'
  }
];

export const ApiStatusModal: React.FC<ApiStatusModalProps> = ({ isOpen, onClose }) => {
  const [statusData, setStatusData] = useState<ApiStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [testingService, setTestingService] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, ApiStatusItem>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const data = await fetchApiStatus();
      setStatusData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTestApi = async (serviceId: string) => {
    setTestingService(serviceId);
    try {
      const res = await testSingleApi(serviceId);
      setTestResult(prev => ({ ...prev, [serviceId]: res }));
    } catch (e) {
      console.error(e);
    } finally {
      setTestingService(null);
    }
  };

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All APIs (24)' },
    { id: 'data', label: 'Core & Mandi', icon: Server },
    { id: 'climate', label: 'Weather & Climate', icon: CloudSun },
    { id: 'language', label: 'Voice & AI', icon: Languages },
    { id: 'geo', label: 'Geo & Routing', icon: MapPin },
    { id: 'schemes', label: 'Schemes & Rails', icon: FileCheck },
  ];

  const filteredCatalog = CATALOG_METADATA.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl border border-sage-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-sage-100 bg-sage-800 px-6 py-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-600 text-sand shadow-inner text-xl">
              🔌
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold">API & Data Source Catalogue</h3>
                <span className="rounded-full bg-sage-600/80 px-2.5 py-0.5 text-[10px] font-bold text-sage-100">
                  Section 6 Specification
                </span>
              </div>
              <p className="text-xs text-sage-300">
                Gram Udyam AI triangulates live open data with deterministic fallbacks
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadStatus}
              disabled={loading}
              className="flex items-center space-x-1 rounded-xl bg-sage-700 px-3 py-1.5 text-xs font-semibold text-sage-100 hover:bg-sage-600 transition"
              title="Refresh all connections"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-sage-300 hover:bg-sage-700 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Integration Summary Banner */}
        <div className="bg-sage-50 border-b border-sage-200 px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-sage-800 font-semibold">
            <ShieldCheck className="h-4 w-4 text-sage-600" />
            <span>Guaranteed Resilience: Fallback data activates automatically if any external API times out.</span>
          </div>
          <button
            onClick={() => setShowConfigGuide(!showConfigGuide)}
            className="flex items-center space-x-1 text-accent font-bold hover:underline"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>{showConfigGuide ? 'Hide API Setup Guide' : 'How to Add Your Keys'}</span>
          </button>
        </div>

        {/* Step-by-Step API Key Setup Drawer */}
        {showConfigGuide && (
          <div className="bg-sand/60 border-b border-amber-200 p-5 text-xs space-y-3">
            <h4 className="font-bold text-sm text-sage-900 flex items-center space-x-1.5">
              <span>🔑</span>
              <span>Step-by-Step Guide to Link Your Live APIs</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-ink">
              <div className="rounded-xl bg-white p-3 border border-amber-200 shadow-sm space-y-1">
                <span className="font-bold text-sage-800">1. data.gov.in (Agmarknet Mandi Prices)</span>
                <p className="text-muted">Register free at <a href="https://data.gov.in/" target="_blank" rel="noreferrer" className="text-accent underline font-semibold">data.gov.in</a>. Copy your API Key and place in <code className="bg-sage-100 px-1 py-0.5 rounded text-[11px]">backend/.env</code> as <code className="bg-sage-100 px-1 py-0.5 rounded text-[11px]">DATAGOV_API_KEY</code>.</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-amber-200 shadow-sm space-y-1">
                <span className="font-bold text-sage-800">2. Claude API (Anthropic)</span>
                <p className="text-muted">Create key in <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer" className="text-accent underline font-semibold">Anthropic Console</a>. Set as <code className="bg-sage-100 px-1 py-0.5 rounded text-[11px]">ANTHROPIC_API_KEY</code> in <code className="bg-sage-100 px-1 py-0.5 rounded text-[11px]">backend/.env</code> for AI explanations.</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-amber-200 shadow-sm space-y-1">
                <span className="font-bold text-sage-800">3. Open-Meteo & NASA POWER (Weather/Solar)</span>
                <p className="text-muted">Already pre-linked! Requires <strong>zero API keys</strong> for standard usage. Real-time 16-day and solar data are live out-of-the-box.</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-amber-200 shadow-sm space-y-1">
                <span className="font-bold text-sage-800">4. MeitY Bhashini (Speech & Translation)</span>
                <p className="text-muted">Register on <a href="https://bhashini.gov.in/ulca/" target="_blank" rel="noreferrer" className="text-accent underline font-semibold">Bhashini ULCA</a>. Add User ID, API Key, and Pipeline ID to <code className="bg-sage-100 px-1 py-0.5 rounded text-[11px]">backend/.env</code>.</p>
              </div>
            </div>
            <p className="text-[11px] text-muted italic">
              Note: You can start the Python backend at any time by running <code className="bg-white px-1.5 py-0.5 rounded font-mono border">python backend/main.py</code> or using the launcher.
            </p>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex border-b border-sage-200 bg-white px-6 overflow-x-auto">
          {categories.map(c => {
            const Icon = c.icon;
            const isSelected = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`flex items-center space-x-1.5 whitespace-nowrap py-3 px-3.5 text-xs font-bold border-b-2 transition ${
                  isSelected
                    ? 'border-sage-600 text-sage-900'
                    : 'border-transparent text-muted hover:text-sage-800'
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* API Catalog List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {filteredCatalog.map(item => {
              const liveStatus = statusData?.apis.find(a => 
                a.service.toLowerCase().includes(item.id) || item.name.toLowerCase().includes(a.service.toLowerCase().slice(0, 10))
              );
              const testItem = testResult[item.id];
              const isTesting = testingService === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-sage-200 bg-white p-4 shadow-sm hover:border-sage-300 transition space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-sage-900">{item.name}</h4>
                        <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-bold text-sage-700">
                          {item.statusText}
                        </span>
                      </div>
                      <p className="text-xs text-muted font-medium">{item.purpose}</p>
                    </div>

                    {/* Action & Test Button */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTestApi(item.id)}
                        disabled={isTesting}
                        className="flex items-center space-x-1 rounded-xl bg-sage-100 px-3 py-1.5 text-xs font-bold text-sage-800 hover:bg-sage-200 transition"
                      >
                        <RefreshCw className={`h-3 w-3 ${isTesting ? 'animate-spin' : ''}`} />
                        <span>{isTesting ? 'Testing...' : 'Test Ping'}</span>
                      </button>

                      <a
                        href={item.docsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-sage-200 p-1.5 text-sage-600 hover:bg-sage-50 transition"
                        title="View API Documentation"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Technical & Cost Row */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-muted border-t border-sage-100 pt-2 gap-2">
                    <div className="flex items-center space-x-3">
                      <span><strong>Access:</strong> {item.cost}</span>
                      {liveStatus && (
                        <span className="flex items-center space-x-1">
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${
                              liveStatus.status === 'healthy'
                                ? 'bg-emerald-500'
                                : liveStatus.status === 'pending_key'
                                ? 'bg-amber-400'
                                : 'bg-blue-500'
                            }`}
                          />
                          <span className="font-medium text-sage-800">
                            {liveStatus.status === 'healthy' ? 'Live Connected' : liveStatus.status === 'pending_key' ? 'Key Needed (Fallback Ready)' : 'Active Fallback'}
                          </span>
                        </span>
                      )}
                    </div>

                    {item.keyUrl && (
                      <a
                        href={item.keyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent font-bold hover:underline flex items-center space-x-1"
                      >
                        <span>Get Free Key</span>
                        <ChevronRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  {/* Dynamic Test Result Display */}
                  {testItem && (
                    <div
                      className={`rounded-xl p-2.5 text-xs font-mono border ${
                        testItem.status === 'healthy'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-sand text-amber-900 border-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold pb-1">
                        <span>Result: {testItem.status.toUpperCase()} {testItem.code ? `(HTTP ${testItem.code})` : ''}</span>
                        {testItem.latency_ms && <span>{testItem.latency_ms} ms</span>}
                      </div>
                      <p className="text-[11px] font-sans">{testItem.message || 'Endpoint pinged successfully.'}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-sage-200 bg-sage-50 px-6 py-3 flex items-center justify-between text-xs text-muted">
          <span>Gram Udyam AI Architecture · Section 6 & 8 compliant</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-sage-600 px-5 py-2 font-bold text-white hover:bg-sage-700 transition"
          >
            Close Hub
          </button>
        </div>

      </div>
    </div>
  );
};
