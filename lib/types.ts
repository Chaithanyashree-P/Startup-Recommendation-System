export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml' | 'mr' | 'bn';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export type RiskLevel = 'Low' | 'Low-Med' | 'Medium' | 'High';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type LandOption = 'None' | '< 1 acre' | '1-3' | '3+';
export type TimeOption = 'Part-time' | 'Full-time';

export interface UserProfile {
  name: string;
  village: string;
  block: string;
  district: string;
  savings: number;
  land: LandOption;
  skills: string[];
  time: TimeOption;
  riskComfort: RiskLevel;
  shgMember: boolean;
  category: 'General' | 'OBC' | 'SC' | 'ST';
  gender: 'Female' | 'Male' | 'Other';
  age: number;
  language: LanguageCode;
}

export interface BusinessIdea {
  id: string;
  name: string;
  shortName: string;
  category: string;
  setupCost: number; // in Rupees
  setupCostFormatted: string; // e.g. "₹1.2L"
  monthlyProfit: number; // in Rupees
  paybackMonths: number;
  spaceRequired: string;
  skillsRequired: string[];
  landRequired: LandOption;
  riskLevel: RiskLevel;
  confidence: ConfidenceLevel;
  confidenceMandis: number;
  buyersWithinKm: number;
  schemesEligible: string[];
  whyFits: string[];
  description: string;
  priceOutlook: {
    day: number;
    forecastPrice: number;
    upperBound: number;
    lowerBound: number;
  }[];
  year1Cashflow: {
    month: number;
    revenue: number;
    expenses: number;
    netProfit: number;
  }[];
}

export interface Scheme {
  id: string;
  code: string;
  name: string;
  description: string;
  maxLoanAmount: number;
  subsidyPercentage: number;
  eligibilityText: string;
  requirements: string[];
  statusText: 'Likely eligible' | 'Check eligibility';
  documentsTotal: number;
  documentsReady: number;
  requiredDocuments: string[];
}

export interface MarketItem {
  commodity: string;
  currentPrice: number;
  unit: string;
  changePercent: number;
  isIncrease: boolean;
}

export interface BuyerLocation {
  id: string;
  name: string;
  type: 'Mandi' | 'Snack retailer' | 'Cooperative' | 'Wholesaler';
  distanceKm: number;
  priceOffer: string;
  shape: 'circle' | 'square' | 'triangle';
  x: number; // grid percentage for map
  y: number;
}

export interface PlanStepItem {
  id: number;
  title: string;
  status: 'Done' | 'In Progress' | 'Upcoming';
  detail: string;
  actionText?: string;
}

export interface CheckInRecord {
  started: 'yes' | 'not_yet' | 'need_help' | null;
  salesLastMonth: number;
  date: string;
  period: '30-day' | '90-day' | '180-day';
}

export interface OfficerBlockData {
  blockId: string;
  blockName: string;
  demandScore: number; // 1 to 5
  milletUnitsCount: number;
  activeUsers: number;
  status: 'High Opportunity' | 'Moderate' | 'Saturated' | 'Gap Spotted';
}
