"""
Geocoding, OpenStreetMap & OSRM Routing Service
Section 6 & 6B: Nominatim geocoding & OSRM road distance/travel time matrix
Used for: Market access factor (10%), nearest mandis and buyer distances.
"""

import requests
from typing import Dict, Any, List, Tuple, Optional

NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search"
OSRM_ROUTE_URL = "https://router.project-osrm.org/route/v1/driving"

def geocode_location(query: str) -> Optional[Tuple[float, float, str]]:
    """
    Geocode a village, block or district name to (lat, lon, display_name).
    """
    try:
        headers = {"User-Agent": "GramUdyamAI-RuralAdvisor/1.0 (contact@gramudyam.ai)"}
        params = {"q": f"{query}, India", "format": "json", "limit": 1}
        r = requests.get(NOMINATIM_SEARCH_URL, params=params, headers=headers, timeout=4)
        if r.status_code == 200:
            results = r.json()
            if results:
                lat = float(results[0]["lat"])
                lon = float(results[0]["lon"])
                name = results[0].get("display_name", query)
                return (lat, lon, name)
    except Exception:
        pass
    return None

def compute_travel_distance_time(
    from_coords: Tuple[float, float],
    to_coords: Tuple[float, float]
) -> Dict[str, Any]:
    """
    Compute real road distance (km) and travel duration (minutes) using OSRM.
    """
    lat1, lon1 = from_coords
    lat2, lon2 = to_coords
    
    try:
        url = f"{OSRM_ROUTE_URL}/{lon1},{lat1};{lon2},{lat2}?overview=false"
        r = requests.get(url, timeout=4)
        if r.status_code == 200:
            data = r.json()
            routes = data.get("routes", [])
            if routes:
                dist_km = round(routes[0]["distance"] / 1000.0, 1)
                duration_mins = round(routes[0]["duration"] / 60.0)
                return {
                    "status": "live",
                    "source": "OSRM Open Source Routing Machine",
                    "distance_km": dist_km,
                    "duration_minutes": duration_mins,
                    "road_viable": dist_km <= 40.0
                }
    except Exception:
        pass

    # Haversine distance fallback estimate
    from math import radians, cos, sin, asin, sqrt
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    approx_km = round(6371 * c * 1.3, 1) # 1.3 road curvature factor
    approx_mins = round(approx_km * 2.2) # ~25-30 km/h rural road speed

    return {
        "status": "cached",
        "source": "Haversine Rural Road Model Fallback",
        "distance_km": approx_km,
        "duration_minutes": approx_mins,
        "road_viable": approx_km <= 40.0
    }

def get_market_access_score(distance_km: float) -> float:
    """
    Normalize market access to 0..1 for Opportunity Score:
    <= 10 km -> 1.0
    10 - 25 km -> 0.85
    25 - 40 km -> 0.65
    > 40 km -> 0.40
    """
    if distance_km <= 10:
        return 1.0
    elif distance_km <= 25:
        return 0.85
    elif distance_km <= 40:
        return 0.65
    else:
        return 0.40

def test_nominatim_connection() -> Dict[str, Any]:
    try:
        headers = {"User-Agent": "GramUdyamAI-Test/1.0"}
        r = requests.get(f"{NOMINATIM_SEARCH_URL}?q=Madurai,India&format=json&limit=1", headers=headers, timeout=4)
        if r.status_code == 200:
            return {
                "service": "OpenStreetMap Nominatim Geocoding",
                "status": "healthy",
                "code": 200,
                "latency_ms": int(r.elapsed.total_seconds() * 1000),
                "message": "Connected to Nominatim Geocoder"
            }
        return {"service": "OpenStreetMap Nominatim", "status": "warning", "code": r.status_code}
    except Exception as e:
        return {"service": "OpenStreetMap Nominatim", "status": "fallback_active", "message": str(e)}

def test_osrm_connection() -> Dict[str, Any]:
    try:
        r = requests.get(f"{OSRM_ROUTE_URL}/78.1198,9.9252;78.2000,9.9500?overview=false", timeout=4)
        if r.status_code == 200:
            return {
                "service": "OSRM Routing & Travel Time Engine",
                "status": "healthy",
                "code": 200,
                "latency_ms": int(r.elapsed.total_seconds() * 1000),
                "message": "Connected to OSRM road distance server"
            }
        return {"service": "OSRM Routing", "status": "warning", "code": r.status_code}
    except Exception as e:
        return {"service": "OSRM Routing", "status": "fallback_active", "message": str(e)}
