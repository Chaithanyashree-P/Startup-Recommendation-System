"""
Macro Indicators & Benchmark Service
Section 6: World Bank Indicators API & MoSPI Baselines
Used for: National macro benchmark context for SDG 8 (Decent Work & Economic Growth).
"""

import requests
from typing import Dict, Any

WORLDBANK_API_URL = "https://api.worldbank.org/v2/country/IN/indicator/NV.AGR.TOTL.ZS?format=json"

def fetch_world_bank_agriculture_indicator() -> Dict[str, Any]:
    """
    Fetch national level agricultural value-added % of GDP.
    """
    try:
        r = requests.get(WORLDBANK_API_URL, timeout=4)
        if r.status_code == 200:
            data = r.json()
            if len(data) > 1 and data[1]:
                latest_entry = next((item for item in data[1] if item.get("value") is not None), None)
                if latest_entry:
                    val = round(latest_entry["value"], 2)
                    year = latest_entry["date"]
                    return {
                        "status": "live",
                        "source": "World Bank Indicators API",
                        "indicator": "Agriculture, forestry, and fishing (% of GDP)",
                        "country": "India",
                        "value": val,
                        "year": year,
                        "benchmark_text": f"Agri & allied sectors generate {val}% of national GDP ({year}), supporting over 44% of rural workforce."
                    }
    except Exception:
        pass

    return {
        "status": "cached",
        "source": "World Bank Historical Baseline",
        "indicator": "Agriculture, forestry, and fishing (% of GDP)",
        "country": "India",
        "value": 16.23,
        "year": "2024-2026",
        "benchmark_text": "Agri & allied sectors generate ~16.2% of national GDP, supporting over 44% of rural workforce."
    }

def test_worldbank_connection() -> Dict[str, Any]:
    try:
        r = requests.get(WORLDBANK_API_URL, timeout=4)
        if r.status_code == 200:
            return {
                "service": "World Bank Indicators API",
                "status": "healthy",
                "code": 200,
                "latency_ms": int(r.elapsed.total_seconds() * 1000),
                "message": "Connected to World Bank API"
            }
        return {"service": "World Bank API", "status": "warning", "code": r.status_code}
    except Exception as e:
        return {"service": "World Bank API", "status": "fallback_active", "message": str(e)}
