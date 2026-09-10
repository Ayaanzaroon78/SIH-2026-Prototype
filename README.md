#  AI-Based Early Warning & Landslide Risk Monitoring System

### Smart India Hackathon 2026 | North Eastern Region (NER), India

An AI-powered early-warning and landslide-risk monitoring platform designed to help monitor vulnerable regions, analyse environmental telemetry, predict landslide risk using Machine Learning, visualise risk geographically, and support faster disaster-response decisions.

---

##  Overview

The **AI-Based Early Warning & Landslide Risk Monitoring System** is a full-stack disaster-management prototype developed for **Smart India Hackathon 2026**.

The system focuses on landslide-prone regions of India's **North Eastern Region (NER)**, where factors such as heavy rainfall, soil saturation, steep slopes, seismic activity, terrain conditions, and other environmental parameters can contribute to landslide hazards.

The platform combines:

* 🌧️ Environmental telemetry
* 🤖 Machine Learning
* 🗺️ Geospatial visualisation
* 📊 Real-time-style monitoring
* 🚨 Emergency alert management
* 📈 Historical trend analysis
* 🎛️ Interactive ML simulation
* 🖥️ Web-based decision-support dashboard

The goal is to transform raw environmental data into **understandable risk information and actionable early warnings**.

---

#  Problem Statement

### AI-Based Early Warning and Landslide Risk Monitoring System in NER

The North Eastern Region of India is geographically vulnerable to landslides due to:

* Heavy and prolonged rainfall
* Steep slopes
* Soil saturation
* Geological conditions
* Seismic activity
* Terrain characteristics
* Environmental changes
* Human-induced land-use changes

Traditional monitoring systems can involve manual observation and fragmented data sources, making it difficult to continuously assess changing risk conditions across large geographical areas.

There is a need for an intelligent platform capable of combining environmental observations, Machine Learning, geospatial information, and alert mechanisms into a unified monitoring system.

---

#  Proposed Solution

Our solution follows a complete:

> **Data → Processing → AI → Risk Assessment → Visualisation → Alert → Decision Support**

workflow.

```text
┌──────────────────────────┐
│ Environmental Telemetry  │
│ Weather / Terrain / IoT  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Data Collection &        │
│ Preprocessing            │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Feature Engineering      │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ XGBoost Machine Learning │
│ Risk Prediction Model    │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Landslide Risk Score     │
│ Low / Moderate / High /  │
│ Critical                 │
└────────────┬─────────────┘
             │
       ┌─────┴─────┐
       ▼           ▼
┌─────────────┐ ┌──────────────┐
│ GIS / Map   │ │ Alert Engine │
│ Dashboard   │ │              │
└──────┬──────┘ └──────┬───────┘
       │               │
       └───────┬───────┘
               ▼
      ┌──────────────────┐
      │ Decision Support │
      │     Dashboard    │
      └──────────────────┘
```

---

#  Key Features

## 1.  Regional Risk Monitoring

The dashboard provides an interactive map focused on the **North Eastern Region of India**.

The system currently demonstrates monitoring across **25 active nodes/locations**.

Risk levels are represented using intuitive categories:

| Risk Level  | Meaning                         |
| ----------- | ------------------------------- |
| 🟢 Low      | Low immediate risk              |
| 🟡 Moderate | Conditions require monitoring   |
| 🟠 High     | Significant landslide potential |
| 🔴 Critical | Immediate attention required    |

Critical locations are highlighted with a warning/pulsing visual effect on the map.

---

# 2.  AI-Based Landslide Risk Prediction

The system uses a pre-trained **XGBoost Machine Learning model** to estimate landslide risk.

The model processes environmental and terrain-related features and produces a risk prediction.

Example input parameters include:

* Rainfall over the last 24 hours
* Soil moisture saturation
* Slope angle
* Seismic trigger
* Other environmental/terrain features

The prediction is converted into an understandable risk score and risk category.

```text
Environmental Parameters
          │
          ▼
    Feature Processing
          │
          ▼
     XGBoost Model
          │
          ▼
     Risk Prediction
          │
          ▼
      Risk Score
          │
          ▼
 ┌────────┼────────┐
 ▼        ▼        ▼
LOW   MODERATE    HIGH
                   │
                   ▼
                CRITICAL
```

---

# 3.  Location Deep Analytics

Users can select a monitored location directly from the map or location list.

The analytics drawer provides detailed information such as:

* Landslide Hazard Score
* Risk classification
* Rainfall over 24 hours
* Soil moisture percentage
* Slope angle
* Seismic trigger status
* ML feature importance
* Risk drivers
* 7-day precipitation trend
* 7-day soil moisture trend

Example:

```text
Hazard Score
80.33 / 100

Risk Level
CRITICAL
```

This provides more information than simply showing a risk label.

---

# 4.  ML Feature Importance

The dashboard provides an interpretation of the ML prediction by displaying the contribution of important features.

This improves model transparency by helping users understand **why a location has been classified as high or critical risk**.

```text
Environmental Features
          │
          ▼
     XGBoost Model
          │
          ▼
    Feature Importance
          │
          ▼
    Risk Drivers Chart
```

This makes the system more useful as a **decision-support tool**, rather than a black-box prediction system.

---

# 5.  Historical Trend Analysis

The location analytics interface provides historical environmental trends.

The prototype displays:

* 7-day precipitation trends
* 7-day soil moisture trends

This allows users to identify whether environmental conditions are:

* Increasing
* Decreasing
* Stable
* Approaching potentially dangerous conditions

---

# 6.  Emergency Alert Dispatch

The platform includes an emergency alert mechanism.

When a high-risk or critical condition is identified, an authorised user can dispatch an alert.

The prototype simulates notification dispatch and records the event in the database.

The Alert Feed records information such as:

* Alert severity
* Timestamp
* Affected district
* Recipient details
* Dispatch information

```text
Critical Risk Detected
          │
          ▼
    Admin Review
          │
          ▼
   Dispatch Alert
          │
          ▼
   Alert Recorded
          │
          ▼
      Alert Feed
```

---

# 7.  Interactive ML Simulator

The **ML Simulator** allows users to test the prediction model under different environmental conditions.

Users can modify parameters such as:

* Rainfall (24h)
* Soil moisture saturation
* Slope angle

For example:

```text
Rainfall:              180 mm
Soil Moisture:          92 %
Slope Angle:             45°
```

The system passes these values through the trained XGBoost model and generates a risk prediction.

This feature is particularly useful for:

* Demonstrations
* Testing
* Scenario analysis
* Understanding model behaviour
* SIH judging/demo sessions

---

#  System Architecture

The platform follows a modular, layered architecture.

```text
                         ┌───────────────────────┐
                         │       USERS           │
                         │ Admin / Authorities   │
                         └───────────┬───────────┘
                                     │
                                     ▼
                    ┌────────────────────────────┐
                    │      REACT FRONTEND        │
                    │                            │
                    │ Dashboard                  │
                    │ GIS Map                    │
                    │ Analytics                  │
                    │ ML Simulator               │
                    │ Alert Feed                 │
                    │ Admin Panel                │
                    └──────────────┬─────────────┘
                                   │
                              REST API
                                   │
                                   ▼
                    ┌────────────────────────────┐
                    │      FASTAPI BACKEND       │
                    │                            │
                    │ API Endpoints              │
                    │ Data Ingestion             │
                    │ Risk Services              │
                    │ Alert Management           │
                    │ Background Scheduler        │
                    └───────┬──────────┬─────────┘
                            │          │
                 ┌──────────┘          └──────────┐
                 ▼                                ▼
       ┌───────────────────┐            ┌──────────────────┐
       │     DATABASE      │            │   ML ENGINE      │
       │                   │            │                  │
       │ SQLite / PostGIS  │            │ XGBoost Model    │
       │ Locations         │            │ Feature Analysis │
       │ Telemetry         │            │ Risk Prediction  │
       │ Alerts            │            └──────────────────┘
       │ Historical Data   │
       └───────────────────┘
```

---

#  Complete System Workflow

The complete workflow of the platform is:

```text
┌─────────────────────────┐
│ 1. Data Collection      │
│                         │
│ Environmental Data      │
│ Historical Data         │
│ Synthetic Telemetry     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 2. Data Preprocessing   │
│                         │
│ Cleaning                │
│ Validation              │
│ Transformation          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 3. Feature Engineering  │
│                         │
│ Rainfall                │
│ Soil Moisture           │
│ Slope                   │
│ Seismic Conditions      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 4. ML Risk Prediction   │
│                         │
│ XGBoost Model           │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 5. Risk Classification  │
│                         │
│ Low                     │
│ Moderate                │
│ High                    │
│ Critical                │
└────────────┬────────────┘
             │
       ┌─────┴─────┐
       ▼           ▼
┌─────────────┐ ┌──────────────┐
│ 6. Map &    │ │ 7. Alert     │
│ Dashboard   │ │ Generation   │
└──────┬──────┘ └──────┬───────┘
       │               │
       └───────┬───────┘
               ▼
       ┌─────────────────┐
       │ 8. Decision     │
       │ Support         │
       └─────────────────┘
```

---

#  Machine Learning Pipeline

The ML subsystem consists of a complete training and prediction workflow.

```text
Synthetic / Historical Dataset
              │
              ▼
       Data Generation
              │
              ▼
       Data Preprocessing
              │
              ▼
      Feature Engineering
              │
              ▼
       Model Training
              │
              ▼
       XGBoost Model
              │
              ▼
       Model Evaluation
              │
              ▼
       Model Artifacts
              │
              ▼
      Backend Integration
              │
              ▼
       Risk Prediction
```

The repository contains the ML training pipeline inside:

```text
landslide-risk-ner/ml/
```

Important ML files include:

```text
ml/
├── synthetic_landslide_dataset.csv
├── train_model.py
├── training_notebook.ipynb
├── data_generator.py
└── model_artifacts/
```

---

#  Synthetic Data Generation

The prototype includes a synthetic telemetry generation pipeline for development and demonstration purposes.

The system can generate:

> **90 days of synthetic telemetry for 25 NER locations**

This enables the ML and monitoring system to be tested without requiring a complete live sensor infrastructure.

To regenerate the data:

```bash
cd ml
python data_generator.py
```

---

#  Model Training

The XGBoost model can be retrained using:

```bash
cd ml
python train_model.py
```

The trained model artifacts are stored in:

```text
ml/model_artifacts/
```

The prototype training workflow reports an approximate:

```text
R² ≈ 0.97
```

> **Note:** This value applies to the prototype's synthetic/training setup and should not be interpreted as real-world predictive accuracy. Real deployment would require validated field data, appropriate validation methodology, and domain-specific evaluation.

---

# 🛠️ Technology Stack

## Frontend

* React
* Vite
* JavaScript / TypeScript
* Interactive dashboard components
* GIS/map visualisation
* Data visualisation

## Backend

* Python
* FastAPI
* Uvicorn
* REST APIs
* Background task scheduling

## Machine Learning

* Python
* XGBoost
* Pandas
* NumPy
* Scikit-learn
* Jupyter Notebook

## Database

### Local Development

* SQLite

### Containerized / Extended Deployment

* PostgreSQL
* PostGIS

PostGIS enables the system to support spatial/geographic database operations.

## Infrastructure

* Docker
* Docker Compose
* Nginx
* Git
* GitHub

---

#  Project Structure

```text
SIH-2026-Prototype/
│
└── landslide-risk-ner/
    │
    ├── backend/
    │   ├── app/
    │   │   ├── main.py
    │   │   └── ...
    │   ├── landslide_dev.db
    │   └── ...
    │
    ├── frontend/
    │   ├── src/
    │   ├── public/
    │   ├── package.json
    │   └── ...
    │
    ├── ml/
    │   ├── data_generator.py
    │   ├── synthetic_landslide_dataset.csv
    │   ├── train_model.py
    │   ├── training_notebook.ipynb
    │   └── model_artifacts/
    │
    ├── docker-compose.yml
    └── ...
```

---

#  Local Development

## Prerequisites

Before running the project on Windows, install:

### Python

**Python 3.10+**

The prototype has been tested with modern Python versions.

### Node.js

**Node.js 18+**

### Optional

**Docker Desktop**

Docker is optional for local development but required if you want to run the complete containerized architecture with PostgreSQL/PostGIS.

---

#  Method 1 — Local Development Mode

This is the **fastest and easiest method** for development and demonstrations.

It uses:

* SQLite
* FastAPI
* React
* Vite
* Local ML model

---

## Step 1 — Navigate to the Project

Open PowerShell or Command Prompt:

```powershell
cd "C:\Users\nashe\OneDrive\Desktop\sih project 2026\landslide-risk-ner"
```

---

# Step 2 — Generate Data and Train the Model

This step is optional because model artifacts are already included.

If you want to regenerate the synthetic dataset and retrain:

```powershell
cd ml
```

Generate synthetic telemetry:

```powershell
python data_generator.py
```

Train the XGBoost model:

```powershell
python train_model.py
```

Return to the project root:

```powershell
cd ..
```

Expected output:

```text
Model artifacts successfully saved to ...
```

---

# Step 3 — Start FastAPI Backend

Open **Terminal 1**.

Navigate to:

```powershell
cd "C:\Users\nashe\OneDrive\Desktop\sih project 2026\landslide-risk-ner\backend"
```

Start the FastAPI server:

```powershell
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Expected startup process:

```text
[FastAPI App] Initializing database tables...
[Ingestion Service] Seeding initial database with NER locations and historical data...
[FastAPI App] Background task scheduler started.

INFO: Application startup complete.
INFO: Uvicorn running on http://0.0.0.0:8000
```

### Verify Backend

Open:

```text
http://localhost:8000/docs
```

You should see the interactive **FastAPI Swagger API documentation**.

---

# Step 4 — Start React Frontend

Open **Terminal 2**.

Navigate to:

```powershell
cd "C:\Users\nashe\OneDrive\Desktop\sih project 2026\landslide-risk-ner\frontend"
```

Install dependencies if required:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

Expected output:

```text
VITE v5.4.21 ready

➜ Local: http://localhost:3000/
```

Open:

```text
http://localhost:3000/
```

The landslide monitoring dashboard should now be available.

---

#  Method 2 — Docker Compose

For a fully containerized setup, Docker Desktop can be used.

Navigate to the project root:

```powershell
cd "C:\Users\nashe\OneDrive\Desktop\sih project 2026\landslide-risk-ner"
```

Run:

```powershell
docker-compose up --build
```

This starts the complete containerized environment.

### Services

| Service              |   Port |
| -------------------- | -----: |
| PostgreSQL + PostGIS | `5432` |
| FastAPI Backend      | `8000` |
| React + Nginx        | `3000` |

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

---

#  Prototype Demo Checklist

The following workflow can be used during an SIH presentation or demonstration.

---

## 1. Open the Dashboard

Navigate to:

```text
http://localhost:3000
```

Verify the summary metrics including:

* **25 Active Nodes**
* High/Critical warnings
* Dispatched alerts
* Average Risk Index

---

## 2. Explore the NER Risk Map

The map is centered on the **North Eastern Region of India**.

Observe the colour-coded risk markers:

```text
🟢 Green    → Low
🟡 Yellow   → Moderate
🟠 Orange   → High
🔴 Red      → Critical
```

Critical markers use a warning/pulsing visual effect.

---

# 3. Open Location Analytics

Click a red/orange marker or select a location from the location list.

Example locations include:

* Cherrapunji
* Shillong Peak

The analytics drawer displays:

### Hazard Score

Example:

```text
80.33 / 100
Critical Risk
```

### Telemetry

* Rainfall — 24h
* Soil Moisture
* Slope Angle
* Seismic Trigger

### AI Analytics

* ML feature importance
* Risk-driver percentage chart

### Historical Trends

* 7-day precipitation
* 7-day soil moisture

---

# 4. Dispatch an Emergency Alert

From the location drawer or **Admin Panel**:

```text
Dispatch Alert
```

The prototype simulates alert dispatch and records it in the database.

Then open:

```text
Alert Feed
```

Verify:

* Severity
* Timestamp
* Affected district
* Recipient information
* Dispatch status

---

# 5. Test the ML Simulator

Open:

```text
ML Simulator
```

Set severe environmental conditions such as:

```text
Rainfall 24h          → 180 mm
Soil Moisture         → 92 %
Slope Angle           → 45°
```

Click:

```text
Calculate Risk Score
```

The XGBoost model generates a risk prediction and displays the feature breakdown.

The demonstration is designed to show how severe environmental conditions can result in a **Critical Risk** prediction.

---

#  Security Considerations

For development and deployment, the following security practices should be followed:

* Do not commit `.env` files.
* Do not expose API keys.
* Store secrets using environment variables.
* Validate API input.
* Implement authentication for administrative endpoints.
* Restrict alert-dispatch functionality to authorised users.
* Use HTTPS in production.
* Protect database credentials.
* Apply appropriate CORS policies.
* Maintain audit logs for critical operations.

---

#  Production Architecture

The prototype can be extended from local development into a cloud-based monitoring platform.

```text
                    ┌──────────────────────┐
                    │   IoT Sensor Nodes   │
                    │ Rain / Soil / Tilt / │
                    │ Seismic / Weather   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ IoT Gateway / MQTT   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Cloud Data Ingestion │
                    └──────────┬───────────┘
                               │
                     ┌─────────┴─────────┐
                     ▼                   ▼
              ┌─────────────┐     ┌──────────────┐
              │ PostgreSQL  │     │ Stream/Event │
              │ + PostGIS   │     │ Processing   │
              └──────┬──────┘     └──────┬───────┘
                     │                   │
                     └─────────┬─────────┘
                               ▼
                    ┌──────────────────────┐
                    │ AI / ML Risk Engine  │
                    │                      │
                    │ XGBoost / Advanced   │
                    │ ML Models            │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Risk Assessment      │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
             ┌──────────────┐      ┌──────────────┐
             │ GIS Dashboard│      │ Alert Engine │
             └──────┬───────┘      └──────┬───────┘
                    │                     │
                    └──────────┬──────────┘
                               ▼
                    ┌──────────────────────┐
                    │ Authorities / Users  │
                    └──────────────────────┘
```

---

#  Future Enhancements

The prototype can be expanded significantly.

## 1. Real IoT Integration

Integrate physical sensors such as:

* Rain gauges
* Soil moisture sensors
* Tilt sensors
* Accelerometers
* Ground displacement sensors
* Pore-water pressure sensors
* Seismic sensors

---

## 2. Satellite and Remote Sensing

Integrate satellite data for:

* Terrain analysis
* Surface deformation
* Vegetation monitoring
* Land-use changes
* Rainfall estimation
* Remote-sensing based hazard indicators

---

## 3. Real-Time Data Streaming

Future versions can introduce technologies such as:

* MQTT
* Apache Kafka
* Cloud event streaming
* Real-time processing pipelines

---

## 4. Advanced Machine Learning

Future models could include:

* Random Forest
* XGBoost
* LightGBM
* Gradient Boosting
* Neural Networks
* Time-series forecasting
* Ensemble models

---

## 5. Mobile Application

A mobile application could provide:

* Real-time alerts
* Location-based warnings
* Safety instructions
* Citizen reporting
* Emergency contacts

---

## 6. Multilingual Alerts

Warnings could be provided in regional languages to improve accessibility for local communities.

---

## 7. Government Control-Room Integration

The system can eventually integrate with disaster-management control rooms to provide:

* Regional risk maps
* Automated alerts
* Historical analytics
* Incident management
* Resource allocation
* Emergency response coordination

---

#  Expected Impact

The platform aims to shift landslide management from a primarily reactive approach toward a **proactive, data-driven early-warning approach**.

### Government Authorities

* Centralised monitoring
* Faster risk assessment
* Regional situational awareness
* Better resource allocation

### Disaster Response Teams

* Location-specific risk information
* Early warning support
* Historical environmental analytics
* Faster response planning

### Local Communities

* Earlier warnings
* Better awareness
* Location-specific information
* Potential reduction in loss of life and property

---

#  Why This System Is Different

Traditional approach:

```text
Environmental Data
        ↓
Manual Analysis
        ↓
Decision
        ↓
Response
```

Our proposed approach:

```text
Environmental Data
        ↓
Automated Processing
        ↓
Machine Learning
        ↓
Risk Prediction
        ↓
GIS Visualisation
        ↓
Early Warning
        ↓
Decision Support
        ↓
Response
```

The system is designed to assist human decision-makers rather than replace domain experts.

---

#  Smart India Hackathon 2026

This project has been developed as a prototype for:

## Smart India Hackathon 2026

### Focus Area

**AI-Based Early Warning and Landslide Risk Monitoring System in the North Eastern Region of India**

The project combines:

```text
Artificial Intelligence
        +
Machine Learning
        +
GIS
        +
Environmental Data
        +
Web Technology
        +
Disaster Management
        +
Early Warning
```

to create a unified platform for intelligent landslide-risk monitoring.

---

#  Contributing

Contributions, improvements, and suggestions are welcome.

### Clone the repository

```bash
git clone https://github.com/Ayaanzaroon78/SIH-2026-Prototype.git
```

### Enter the project

```bash
cd SIH-2026-Prototype
```

### Create a feature branch

```bash
git checkout -b feature/your-feature
```

### Commit your changes

```bash
git add .
git commit -m "Add: your feature"
```

### Push the branch

```bash
git push origin feature/your-feature
```

Then create a Pull Request.

---

#  Prototype Disclaimer

This project is a **prototype developed for Smart India Hackathon 2026**.

The current ML demonstration uses synthetic/generated telemetry for development and demonstration.

A production-grade disaster-management system would require:

* Validated real-world sensor data
* Extensive historical landslide datasets
* Domain-expert validation
* Field testing
* Continuous model evaluation
* Robust communication infrastructure
* Government/disaster-management integration
* Appropriate safety and reliability procedures

The prototype's ML results should therefore **not be interpreted as operational disaster warnings**.

---

#  License

This project is currently developed as an **SIH 2026 prototype**.

A formal open-source license can be added according to the team's intended distribution and usage requirements.

---

#  Repository

**GitHub:**

https://github.com/Ayaanzaroon78/SIH-2026-Prototype

---

#  Vision

> **From environmental data to intelligent early warning — enabling safer communities through AI-driven disaster intelligence.**

### Built for Smart India Hackathon 2026.
