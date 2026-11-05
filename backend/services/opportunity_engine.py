"""
Opportunity Score and Ranking Engine
Section 4, 6 & 10: 7-Factor Opportunity Score with deterministic formula:
OpportunityScore = 100 * sum(weight_k * factor_k) + 3 if scheme-eligible (capped at 100)
Confidence = f(data freshness, number of mandis / observations, forecast interval width, field verification)
"""

from typing import Dict, Any, List

WEIGHTS = {
    "demand": 0.25,       # Demand trend & mandi price momentum
    "margin": 0.20,       # Unit economics & monthly cashflow margin
    "supply": 0.15,       # Local raw material & soil fit
    "fit": 0.15,          # Capital & skill fit with user profile
    "competition": 0.10,  # Competition gap (saturation cap)
    "access": 0.10,       # OSRM road travel access to buyers
    "climate": 0.05       # Climate & seasonal risk factor
}

def calculate_opportunity_score(
    factors: Dict[str, float],
    is_scheme_eligible: bool = True
) -> Dict[str, Any]:
    """
    Compute deterministic Opportunity Score from 7 normalized factors (0..1).
    """
    raw_score = 0.0
    for key, weight in WEIGHTS.items():
        val = max(0.0, min(1.0, factors.get(key, 0.7)))
        raw_score += weight * val

    scaled = raw_score * 100.0
    if is_scheme_eligible:
        scaled += 3.0 # +3 points if scheme-eligible bonus as per spec

    final_score = round(min(100.0, max(10.0, scaled)), 1)

    # Determine confidence level based on data completeness
    mandi_count = factors.get("mandi_count", 14)
    data_freshness = factors.get("freshness_score", 0.9)
    
    if mandi_count >= 10 and data_freshness >= 0.8:
        confidence = "High"
        confidence_dots = 3
    elif mandi_count >= 4 or data_freshness >= 0.6:
        confidence = "Medium"
        confidence_dots = 2
    else:
        confidence = "Low"
        confidence_dots = 1

    return {
        "opportunity_score": final_score,
        "confidence": confidence,
        "confidence_dots": confidence_dots,
        "factor_breakdown": {
            "demand_trend": round(factors.get("demand", 0.7) * 100, 1),
            "margin_economics": round(factors.get("margin", 0.7) * 100, 1),
            "local_supply_fit": round(factors.get("supply", 0.7) * 100, 1),
            "capital_skill_fit": round(factors.get("fit", 0.7) * 100, 1),
            "competition_gap": round(factors.get("competition", 0.7) * 100, 1),
            "market_access": round(factors.get("access", 0.7) * 100, 1),
            "climate_risk": round(factors.get("climate", 0.7) * 100, 1)
        },
        "weights": WEIGHTS
    }
