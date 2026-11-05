import { BusinessIdea, UserProfile, ConfidenceLevel } from './types';

export interface ScoredIdea extends BusinessIdea {
  fitScore: number; // 0 - 100
  confidenceDots: number; // 1, 2, or 3
}

export function calculateFitScore(idea: BusinessIdea, profile: UserProfile): ScoredIdea {
  let score = 0;

  // 1. Investment & Capital Fit (weight: 35%)
  const savings = profile.savings || 50000;
  const maxAffordable = savings + (profile.shgMember ? 100000 : 50000); // potential micro loan
  if (savings >= idea.setupCost) {
    score += 35;
  } else if (maxAffordable >= idea.setupCost) {
    score += 28;
  } else if (maxAffordable * 1.5 >= idea.setupCost) {
    score += 20;
  } else {
    score += 10;
  }

  // 2. Skills Match (weight: 30%)
  const userSkills = profile.skills || [];
  const skillMatchCount = idea.skillsRequired.filter(s => userSkills.includes(s)).length;
  if (skillMatchCount > 0) {
    score += 30;
  } else if (userSkills.length > 0) {
    score += 15; // transferable skills
  } else {
    score += 10;
  }

  // 3. Land & Space Match (weight: 15%)
  if (idea.spaceRequired === 'Home room' || idea.spaceRequired === 'Verandah') {
    score += 15;
  } else if (profile.land !== 'None' && idea.landRequired !== '3+') {
    score += 15;
  } else if (profile.land === '3+') {
    score += 15;
  } else {
    score += 8;
  }

  // 4. Time & Risk Alignment (weight: 20%)
  const riskWeights: Record<string, number> = { Low: 1, 'Low-Med': 2, Medium: 3, High: 4 };
  const userRiskVal = riskWeights[profile.riskComfort || 'Low'] || 1;
  const ideaRiskVal = riskWeights[idea.riskLevel] || 2;
  
  if (ideaRiskVal <= userRiskVal) {
    score += 12;
  } else if (ideaRiskVal === userRiskVal + 1) {
    score += 8;
  } else {
    score += 4;
  }

  // Time preference
  if (profile.time === 'Part-time' && (idea.paybackMonths <= 12 || idea.spaceRequired === 'Home room')) {
    score += 8;
  } else {
    score += 8;
  }

  const finalScore = Math.min(98, Math.max(50, Math.round(score)));
  
  let confidenceDots = 2;
  if (idea.confidence === 'High') confidenceDots = 3;
  if (idea.confidence === 'Low') confidenceDots = 1;

  return {
    ...idea,
    fitScore: finalScore,
    confidenceDots
  };
}

export function rankIdeasForProfile(ideas: BusinessIdea[], profile: UserProfile): ScoredIdea[] {
  return ideas
    .map(idea => calculateFitScore(idea, profile))
    .sort((a, b) => b.fitScore - a.fitScore);
}

export function generateWhyFitsText(idea: BusinessIdea, profile: UserProfile): string[] {
  const reasons: string[] = [];

  if (profile.village) {
    reasons.push(`${idea.name.split(' ')[0]} raw material grows well near ${profile.village}`);
  } else {
    reasons.push(`${idea.name.split(' ')[0]} raw material grows well near you`);
  }

  if (profile.savings >= idea.setupCost) {
    reasons.push(`Fits directly within your ₹${profile.savings.toLocaleString('en-IN')} savings`);
  } else {
    reasons.push(`Fits your ₹${profile.savings.toLocaleString('en-IN')} savings with MUDRA loan`);
  }

  const matchingSkills = idea.skillsRequired.filter(s => profile.skills.includes(s));
  if (matchingSkills.length > 0) {
    reasons.push(`You already have the required ${matchingSkills.join(' & ')} skills`);
  } else {
    reasons.push(`Simple 3-day training available at nearby KVK`);
  }

  return reasons;
}
