"""
Synthetic Data Generator for SIH26001: AI-Based Landslide Risk Monitoring System (NER)
Generates realistic location profiles across North Eastern Region (NER) of India
and 90 days of sensor readings incorporating meteorological, terrain, soil, and seismic factors.
"""

import os
import json
import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# List of 25 North Eastern Region (NER) Locations with real geographical coordinates & terrain properties
NER_LOCATIONS = [
    {"name": "Shillong Peak", "district": "East Khasi Hills", "state": "Meghalaya", "latitude": 25.5788, "longitude": 91.8933, "elevation": 1525, "slope_angle": 34.5},
    {"name": "Cherrapunji (Sohra)", "district": "East Khasi Hills", "state": "Meghalaya", "latitude": 25.2702, "longitude": 91.7323, "elevation": 1430, "slope_angle": 42.0},
    {"name": "Gangtok Ridge", "district": "East Sikkim", "state": "Sikkim", "latitude": 27.3389, "longitude": 88.6065, "elevation": 1650, "slope_angle": 38.0},
    {"name": "Mangan North Slope", "district": "North Sikkim", "state": "Sikkim", "latitude": 27.5042, "longitude": 88.5364, "elevation": 1310, "slope_angle": 48.5},
    {"name": "Itanagar Hills", "district": "Papum Pare", "state": "Arunachal Pradesh", "latitude": 27.0844, "longitude": 93.6053, "elevation": 320, "slope_angle": 28.0},
    {"name": "Tawang Pass", "district": "Tawang", "state": "Arunachal Pradesh", "latitude": 27.5861, "longitude": 91.8594, "elevation": 3048, "slope_angle": 44.0},
    {"name": "Aizawl Ridge", "district": "Aizawl", "state": "Mizoram", "latitude": 23.7271, "longitude": 92.7176, "elevation": 1132, "slope_angle": 40.2},
    {"name": "Lunglei South", "district": "Lunglei", "state": "Mizoram", "latitude": 22.8879, "longitude": 92.7336, "elevation": 1222, "slope_angle": 36.0},
    {"name": "Kohima Town Slope", "district": "Kohima", "state": "Nagaland", "latitude": 25.6751, "longitude": 94.1086, "elevation": 1444, "slope_angle": 35.5},
    {"name": "Mokokchung Heights", "district": "Mokokchung", "state": "Nagaland", "latitude": 26.3161, "longitude": 94.5244, "elevation": 1325, "slope_angle": 31.0},
    {"name": "Imphal West Foothills", "district": "Imphal West", "state": "Manipur", "latitude": 24.8170, "longitude": 93.9368, "elevation": 786, "slope_angle": 22.0},
    {"name": "Ukhrul East Range", "district": "Ukhrul", "state": "Manipur", "latitude": 25.1167, "longitude": 94.3667, "elevation": 1662, "slope_angle": 39.8},
    {"name": "Agartala Tillas", "district": "West Tripura", "state": "Tripura", "latitude": 23.8315, "longitude": 91.2868, "elevation": 128, "slope_angle": 18.5},
    {"name": "Dharmanagar Hills", "district": "North Tripura", "state": "Tripura", "latitude": 24.3800, "longitude": 92.1600, "elevation": 115, "slope_angle": 19.0},
    {"name": "Haflong Hill Station", "district": "Dima Hasao", "state": "Assam", "latitude": 25.1667, "longitude": 93.0167, "elevation": 512, "slope_angle": 37.2},
    {"name": "Diphu Reserve Slope", "district": "Karbi Anglong", "state": "Assam", "latitude": 25.8400, "longitude": 93.4300, "elevation": 186, "slope_angle": 24.0},
    {"name": "Darjeeling Mall Road", "district": "Darjeeling", "state": "West Bengal (NER Zone)", "latitude": 27.0410, "longitude": 88.2663, "elevation": 2045, "slope_angle": 45.0},
    {"name": "Kalimpong Viewpoint", "district": "Kalimpong", "state": "West Bengal (NER Zone)", "latitude": 27.0600, "longitude": 88.4700, "elevation": 1250, "slope_angle": 41.5},
    {"name": "Nongpoh Highway Belt", "district": "Ri-Bhoi", "state": "Meghalaya", "latitude": 25.9000, "longitude": 91.8800, "elevation": 485, "slope_angle": 29.0},
    {"name": "Jowai Plateau Edge", "district": "West Jaintia Hills", "state": "Meghalaya", "latitude": 25.4500, "longitude": 92.2000, "elevation": 1380, "slope_angle": 33.0},
    {"name": "Namchi Helipad Hill", "district": "South Sikkim", "state": "Sikkim", "latitude": 27.1667, "longitude": 88.3500, "elevation": 1315, "slope_angle": 37.5},
    {"name": "Bomdila Pass", "district": "West Kameng", "state": "Arunachal Pradesh", "latitude": 27.2500, "longitude": 92.4000, "elevation": 2217, "slope_angle": 43.2},
    {"name": "Champhai Border Ridge", "district": "Champhai", "state": "Mizoram", "latitude": 23.4700, "longitude": 93.3200, "elevation": 1678, "slope_angle": 35.0},
    {"name": "Wokha Mountain", "district": "Wokha", "state": "Nagaland", "latitude": 26.1000, "longitude": 94.2600, "elevation": 1313, "slope_angle": 32.8},
    {"name": "Senapati Valley Slope", "district": "Senapati", "state": "Manipur", "latitude": 25.2600, "longitude": 94.0100, "elevation": 1245, "slope_angle": 36.4}
]

def compute_ground_truth_risk(rainfall_24h, rainfall_cumulative_3d, rainfall_intensity_trend, slope_angle, soil_moisture_pct, elevation, seismic_activity):
    """
    Physically-based heuristic ground truth score (0-100) with realistic non-linear interactions.
    High rainfall + steep slope + saturated soil + seismic trigger = high risk score.
    """
    # 1. Slope factor (0-30 pts): threshold around 30 degrees
    slope_factor = min(30.0, (slope_angle / 50.0) ** 1.8 * 30.0)

    # 2. Soil moisture saturation factor (0-25 pts): sharp increase past 70% saturation
    soil_factor = min(25.0, (soil_moisture_pct / 100.0) ** 2.2 * 25.0)

    # 3. Rainfall factor (0-30 pts): 24h & 3-day cumulative soaking
    rain_24h_factor = min(15.0, (rainfall_24h / 150.0) * 15.0)
    rain_3d_factor = min(15.0, (rainfall_cumulative_3d / 300.0) * 15.0)
    rain_factor = rain_24h_factor + rain_3d_factor

    # 4. Intensity trend multiplier (0-8 pts): acceleration of storm event
    trend_factor = min(8.0, max(0.0, (rainfall_intensity_trend - 0.3) * 10.0))

    # 5. Seismic trigger (0-12 pts): ground disturbance
    seismic_factor = min(12.0, (seismic_activity / 4.0) ** 1.5 * 12.0)

    # Elevation modifier (high elevation has more exposed slope face)
    elevation_factor = min(5.0, (elevation / 3000.0) * 5.0)

    raw_score = slope_factor + soil_factor + rain_factor + trend_factor + seismic_factor + elevation_factor

    # Add controlled random noise (+/- 4.0 pts)
    noise = np.random.normal(0, 2.5)
    final_score = np.clip(raw_score + noise, 0.0, 100.0)
    return round(float(final_score), 2)

def categorize_risk(score):
    if score <= 25.0:
        return "Low"
    elif score <= 50.0:
        return "Moderate"
    elif score <= 75.0:
        return "High"
    else:
        return "Critical"

def generate_synthetic_data(num_days=90):
    np.random.seed(42)
    random.seed(42)

    start_date = datetime.now() - timedelta(days=num_days)
    readings = []

    print(f"Generating synthetic dataset for {len(NER_LOCATIONS)} locations over {num_days} days...")

    for loc_id, loc in enumerate(NER_LOCATIONS, 1):
        # Create base climate pattern for location (e.g. Cherrapunji is wetter)
        is_rainy_zone = "Khasi" in loc["district"] or "Sikkim" in loc["district"] or "Darjeeling" in loc["district"]
        base_rain_prob = 0.45 if is_rainy_zone else 0.25

        # Simulate time series
        current_soil_moisture = random.uniform(30.0, 50.0)

        for day in range(num_days):
            timestamp = start_date + timedelta(days=day)

            # Check monsoon spell event (periodic 3-5 day heavy rain spells)
            in_heavy_spell = (day % 14) in [3, 4, 5] if is_rainy_zone else (day % 20) in [7, 8]

            if in_heavy_spell:
                rainfall_24h = random.uniform(80.0, 220.0)
            elif random.random() < base_rain_prob:
                rainfall_24h = random.uniform(10.0, 75.0)
            else:
                rainfall_24h = random.uniform(0.0, 8.0)

            # Cumulative rainfall (simulate 3d sum)
            if day >= 2:
                prev_rain_1 = readings[-1]["rainfall_24h"]
                prev_rain_2 = readings[-2]["rainfall_24h"]
                rainfall_3d = rainfall_24h + prev_rain_1 + prev_rain_2
            else:
                rainfall_3d = rainfall_24h * 2.5

            # Intensity trend: ratio of 24h rain to 3d rain (0.33 is steady, >0.5 means sudden cloudburst)
            rainfall_intensity_trend = round(float(rainfall_24h / (rainfall_3d + 1.0)), 3)

            # Soil moisture dynamics: increases with rain, slowly drains without
            if rainfall_24h > 30.0:
                current_soil_moisture = min(98.0, current_soil_moisture + rainfall_24h * 0.25)
            else:
                current_soil_moisture = max(20.0, current_soil_moisture - random.uniform(1.5, 4.0))

            temperature_c = round(float(28.0 - (loc["elevation"] / 200.0) + random.uniform(-3.0, 3.0)), 1)
            humidity_pct = round(float(min(100.0, max(45.0, 60.0 + (current_soil_moisture * 0.35) + random.uniform(-5.0, 5.0)))), 1)

            # Seismic activity (mostly quiet ~0.1-0.5, occasionally 1.5-3.8 in seismic NER zone V)
            if random.random() < 0.04: # 4% chance of tremor
                seismic_activity = round(float(random.uniform(1.8, 4.2)), 2)
            else:
                seismic_activity = round(float(random.uniform(0.0, 0.4)), 2)

            slope_angle = loc["slope_angle"]
            elevation = loc["elevation"]

            risk_score = compute_ground_truth_risk(
                rainfall_24h=rainfall_24h,
                rainfall_cumulative_3d=rainfall_3d,
                rainfall_intensity_trend=rainfall_intensity_trend,
                slope_angle=slope_angle,
                soil_moisture_pct=current_soil_moisture,
                elevation=elevation,
                seismic_activity=seismic_activity
            )
            risk_category = categorize_risk(risk_score)

            readings.append({
                "location_id": loc_id,
                "location_name": loc["name"],
                "district": loc["district"],
                "state": loc["state"],
                "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "rainfall_24h": round(float(rainfall_24h), 2),
                "rainfall_cumulative_3d": round(float(rainfall_3d), 2),
                "rainfall_intensity_trend": rainfall_intensity_trend,
                "soil_moisture_pct": round(float(current_soil_moisture), 2),
                "temperature_c": temperature_c,
                "humidity_pct": humidity_pct,
                "seismic_activity": seismic_activity,
                "slope_angle": slope_angle,
                "elevation": elevation,
                "latitude": loc["latitude"],
                "longitude": loc["longitude"],
                "risk_score": risk_score,
                "risk_category": risk_category
            })

    output_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(output_dir, "synthetic_landslide_dataset.csv")
    loc_path = os.path.join(output_dir, "ner_locations.json")

    df = pd.DataFrame(readings)
    df.to_csv(data_path, index=False)

    with open(loc_path, "w") as f:
        json.dump(NER_LOCATIONS, f, indent=2)

    print(f"Dataset successfully created at {data_path} with {len(df)} records.")
    print(f"Locations saved to {loc_path}.")
    print("\nRisk Category Breakdown:")
    print(df["risk_category"].value_counts())

    return df

if __name__ == "__main__":
    generate_synthetic_data()
