from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np
from typing import Dict, Any

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Telecom Churn Prediction API", version="1.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
print("Loading model...")
try:
    model = pickle.load(open("model/churn_xgboost_model.pkl", "rb"))
    print("Model loaded successfully!")
    model_features = model.get_booster().feature_names
    print(f"Model expects {len(model_features)} features: {model_features}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    model_features = []

class CustomerData(BaseModel):
    gender: str
    SeniorCitizen: str
    has_partner: str
    has_dependents: str
    tenure: float
    has_phone: str
    MultipleLines: str
    OnlineSecurity: str
    OnlineBackup: str
    DeviceProtection: str
    TechSupport: str
    StreamingTV: str
    StreamingMovies: str
    paperless_billing: str
    InternetService: str
    Contract: str
    PaymentMethod: str
    MonthlyCharges: float
    TotalCharges: float

def preprocess_input(data: Dict[str, Any]) -> pd.DataFrame:
    """
    Convert string inputs to numeric features matching model expectations
    """
    if model is None:
        raise ValueError("Model not loaded")
    
    df = pd.DataFrame(np.zeros((1, len(model_features))), columns=model_features)
    
    # Binary mappings (0=No/internet none, 1=Yes)
    yes_no_map = {"No": 0, "Yes": 1, "No phone service": 0, "No internet service": 0}
    
    # Gender: Male=0, Female=1 → is_female
    if 'is_female' in df.columns:
        df['is_female'] = 1 if data.get('gender') == "Female" else 0
    
    # Binary features
    binary_fields = [
        'SeniorCitizen', 'has_partner', 'has_dependents', 'has_phone', 'MultipleLines',
        'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport',
        'StreamingTV', 'StreamingMovies', 'paperless_billing'
    ]
    for field in binary_fields:
        if field in df.columns:
            df[field] = yes_no_map.get(data.get(field, "No"), 0)
    
    # InternetService dummies (0,1,2 mapped to dummies)
    internet_map = {"No": "internet_No", "DSL": "internet_DSL", "Fiber optic": "internet_Fiber optic"}
    internet_service = data.get('InternetService', "No")
    internet_col = internet_map.get(internet_service)
    if internet_col and internet_col in df.columns:
        df[internet_col] = 1
    
    # Contract dummies
    contract_map = {
        "Month-to-month": "contract_Month-to-month",
        "One year": "contract_One year",
        "Two year": "contract_Two year"
    }
    contract = data.get('Contract', "Month-to-month")
    contract_col = contract_map.get(contract)
    if contract_col and contract_col in df.columns:
        df[contract_col] = 1
    
    # PaymentMethod dummies - exact column match
    payment = data.get('PaymentMethod', "Electronic check")
    payment_col = f"payment_{payment}"
    if payment_col in df.columns:
        df[payment_col] = 1
    
    # Numeric features
    numeric_fields = ['tenure', 'MonthlyCharges', 'TotalCharges']
    for field in numeric_fields:
        if field in df.columns:
            df[field] = float(data.get(field, 0.0))
    
    return df

@app.get("/")
def root():
    return {"message": "Telecom Churn Prediction API", "features": model_features if model_features else []}

@app.post("/predict")
def predict(data: CustomerData):
    try:
        df = preprocess_input(data.dict())
        pred_prob = model.predict_proba(df)[:, 1][0]
        pred_class = "Churn" if pred_prob > 0.5 else "Not Churn"
        if pred_prob >= 0.6:
            risk_level = "High"
        elif pred_prob >= 0.3:
            risk_level = "Medium"
        else:
            risk_level = "Low"
        return {
            "prediction": pred_class,
            "churn_probability": float(pred_prob),
            "risk_level": risk_level
        }
    except Exception as e:
        return {
            "prediction": "Error",
            "churn_probability": 0.0,
            "risk_level": "Error",
            "message": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

