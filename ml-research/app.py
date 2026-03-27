from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import pickle
import numpy as np

app = FastAPI(title="FinanceEdge AI Engine API / v2.0")

class Transaction(BaseModel):
    description: str
    amount: float
    is_weekend: bool = False

class PredictReq(BaseModel):
    lags: list[float]  # [lag_1, lag_7, rolling_7]

# Load Models
try:
    with open('nlp_categorizer.pkl', 'rb') as f:
        vectorizer, nlp_model = pickle.load(f)
    kmeans = joblib.load('spending_clusters.pkl')
    iso_forest = joblib.load('fraud_isolation_forest.pkl')
    forecaster = joblib.load('expense_forecaster.pkl')
    MODELS_READY = True
except Exception as e:
    print(f"Warning: Models offline ({e})")
    MODELS_READY = False

@app.post("/api/v2/categorize")
def categorize(txn: Transaction):
    if not MODELS_READY: raise HTTPException(503, "Models Loading")
    X = vectorizer.transform([txn.description])
    category = nlp_model.predict(X)[0]
    return {"category": category, "confidence": float(np.max(nlp_model.predict_proba(X)))}

@app.post("/api/v2/forecast")
def forecast(req: PredictReq):
    if not MODELS_READY: raise HTTPException(503, "Models Loading")
    if len(req.lags) < 3: raise HTTPException(400, "Need 3 lag features")
    X = np.array([req.lags])
    prediction = forecaster.predict(X)[0]
    return {"predicted_amount": float(prediction), "model": "XGBoost v2"}

@app.post("/api/v2/risk-profile")
def risk_profile(stats: dict):
    # Expects {'avg_spend': x, 'weekend_dependency': y, 'tx_count': z}
    if not MODELS_READY: raise HTTPException(503, "Models Loading")
    X = np.array([[stats['avg_spend'], stats['weekend_dependency'], stats['tx_count']]])
    cluster = kmeans.predict(X)[0]
    
    profiles = {
        0: {"label": "Balanced", "risk": "Low", "advice": "Maintain current diversification."},
        1: {"label": "High Burner", "risk": "High", "advice": "Emergency fund depleted. Reduce lifestyle spend."},
        2: {"label": "Disciplined", "risk": "Minimal", "advice": "Surplus detected. Shift to aggressive equity."}
    }
    return profiles.get(cluster, profiles[0])

@app.get("/api/v2/health")
def health():
    return {"status": "Operational", "engine": "XGBoost + LogReg + K-Means", "ready": MODELS_READY}
