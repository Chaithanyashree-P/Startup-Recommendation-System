"""
Government Schemes Knowledge Base & Eligibility Engine
Section 6B & 8: myScheme, PMEGP, MUDRA, NRLM, PMFME
Matches government schemes deterministically based on user profile and idea cost.
"""

from typing import Dict, Any, List

SCHEME_DATABASE = [
    {
        "id": "pmegp",
        "code": "PMEGP",
        "name": "Prime Minister's Employment Generation Programme",
        "level": "Central",
        "subsidy": "Up to 35% for rural women / OBC / SC / ST (25% for general rural)",
        "max_project_cost": 5000000,
        "own_contribution": "5% for special categories, 10% for general",
        "portal_url": "https://www.kviconline.gov.in/pmegpeportal/",
        "required_docs": ["Aadhaar Card", "PAN Card", "Educational Qualification (8th pass for > ₹10L)", "Caste/Special Category Certificate", "Project Report (Gram Udyam generated)"]
    },
    {
        "id": "mudra",
        "code": "MUDRA",
        "name": "Pradhan Mantri MUDRA Yojana",
        "level": "Central",
        "subsidy": "Collateral-free loan with subvented interest",
        "max_project_cost": 1000000,
        "tiers": ["Shishu (up to ₹50,000)", "Kishore (₹50,001 to ₹5,00,000)", "Tarun (₹5,00,001 to ₹10,00,000)"],
        "portal_url": "https://www.udyamimitra.in/",
        "required_docs": ["Aadhaar Card", "Voter ID / Ration Card", "Bank Statement (last 6 months)", "Quotation of machinery/inputs", "Gram Udyam Business Summary"]
    },
    {
        "id": "nrlm",
        "code": "NRLM-SHG",
        "name": "Deendayal Antyodaya Yojana - NRLM (SHG Revolving & CIF)",
        "level": "Central / State",
        "subsidy": "Interest subvention to 7% p.a. + Community Investment Fund grant",
        "max_project_cost": 200000,
        "portal_url": "https://aajeevika.gov.in/",
        "required_docs": ["SHG Passbook & Resolution copy", "Individual SHG Member KYC", "Gram Panchayat verification"]
    },
    {
        "id": "pmfme",
        "code": "PMFME",
        "name": "PM Formalisation of Micro Food Processing Enterprises",
        "level": "Central",
        "subsidy": "35% credit-linked capital subsidy up to ₹10 Lakhs",
        "max_project_cost": 3000000,
        "portal_url": "https://pmfme.mofpi.gov.in/",
        "required_docs": ["FSSAI registration / application", "Aadhaar & PAN", "Bank Account Statement", "Detailed Project Report"]
    }
]

def match_schemes_for_profile(
    idea_setup_cost: float,
    is_shg_member: bool = False,
    gender: str = "Female",
    category: str = "General",
    idea_category: str = "Food Processing"
) -> List[Dict[str, Any]]:
    """
    Evaluate eligibility rules against profile and project cost.
    """
    matched = []

    # 1. MUDRA is applicable to all micro enterprises under 10L
    if idea_setup_cost <= 1000000:
        mudra = next(s for s in SCHEME_DATABASE if s["code"] == "MUDRA").copy()
        tier = "Shishu" if idea_setup_cost <= 50000 else ("Kishore" if idea_setup_cost <= 500000 else "Tarun")
        mudra["matched_tier"] = tier
        mudra["eligibility_reason"] = f"Eligible for {tier} collateral-free loan covering setup capital of ₹{int(idea_setup_cost):,}."
        matched.append(mudra)

    # 2. PMEGP applies to projects
    if idea_setup_cost >= 40000:
        pmegp = next(s for s in SCHEME_DATABASE if s["code"] == "PMEGP").copy()
        is_special = (gender.lower() == "female") or (category.upper() in ["SC", "ST", "OBC"])
        subsidy_rate = "35%" if is_special else "25%"
        own_contrib = "5%" if is_special else "10%"
        pmegp["eligibility_reason"] = f"Rural applicant qualifies for {subsidy_rate} government capital subsidy with only {own_contrib} own equity."
        matched.append(pmegp)

    # 3. NRLM-SHG
    if is_shg_member:
        nrlm = next(s for s in SCHEME_DATABASE if s["code"] == "NRLM-SHG").copy()
        nrlm["eligibility_reason"] = "Active SHG membership qualifies for 7% interest subvention and CIF group funding."
        matched.append(nrlm)

    # 4. PMFME for food processing
    if "food" in idea_category.lower() or "millet" in idea_category.lower() or "processing" in idea_category.lower():
        pmfme = next(s for s in SCHEME_DATABASE if s["code"] == "PMFME").copy()
        pmfme["eligibility_reason"] = "Eligible under One District One Product (ODOP) food processing scheme for 35% subsidy."
        matched.append(pmfme)

    return matched
