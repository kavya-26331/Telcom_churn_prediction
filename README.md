# Telecom Customer Churn Prediction Project

## 🎯 Project Overview (Tech Deep Dive)

**Telco Churn Prediction API + Dashboard** (XGBoost → FastAPI → React)

**Dataset**: 7,043 samples × 21 raw features → 45 engineered features after OHE + binary encoding

```
Key pipeline: TotalCharges→numeric | Yes/No→{0,1} | Contract/PM/Internet→dummies
Imbalance fix: scale_pos_weight = len(0)/len(1) = 3.75
```

**Model**: XGBoost (500 estimators, lr=0.03, max_depth=5)

```
Test: Acc=82% | Prec=68% | Rec=75% | F1=71% | AUC=0.85
Top feats: tenure(↑), MonthlyCharges(↑), contract_Month-to-month(↑), TotalCharges(↓)
```

**Stack**:

```
Frontend: React 18 + MUI + Recharts (port:3000)
Backend: FastAPI + Uvicorn + Pickle (port:8000)
Dataflow: JSON(in) → preprocess_input() → model.predict_proba() → {pred, prob, risk}
```

**Risk tiers**: prob<0.3=Low | 0.3-0.6=Med | >0.6=High

Churn rate: **26.5%** | Live @ `run_server.bat` → localhost:3000

## 🏗️ Tech Stack

| Component      | Technology             | Purpose                                |
| -------------- | ---------------------- | -------------------------------------- |
| **Backend**    | FastAPI + Uvicorn      | ML model serving API                   |
| **ML Model**   | XGBoost                | Binary classification (Churn/No Churn) |
| **Frontend**   | React + MUI + Recharts | Interactive dashboard                  |
| **Data**       | Pandas + CSV           | Telco customer dataset (7,043 samples) |
| **Deployment** | Batch scripts          | One-click local development            |

## 📊 Dataset

**Source**: Telco Customer Churn (Kaggle: blastchar/telco-customer-churn)

**Features**: 21 features including:

```
tenure, MonthlyCharges, TotalCharges, gender, SeniorCitizen, Partner, Dependents,
PhoneService, MultipleLines, InternetService, Contract, PaymentMethod, and service add-ons
```

**Preprocessing**:

- ✅ Numeric conversion (TotalCharges)
- ✅ Binary encoding (Yes/No → 0/1)
- ✅ One-hot encoding (Contract, PaymentMethod, InternetService)
- ✅ Feature scaling
- ✅ Class imbalance handling (scale_pos_weight)

## 🤖 ML Model Details

**Algorithm**: XGBoost Classifier

```
n_estimators=500, learning_rate=0.03, max_depth=5
scale_pos_weight=3.75 (handles 73.5%→26.5% imbalance)
```

**Key Metrics** (Test Set):

```
Accuracy: ~82%
Precision: ~68% (Churn)
Recall: ~75% (Churn)
F1-Score: ~71% (Churn)
AUC-ROC: ~0.85
```

**Top Features** (by importance):

1. `tenure`
2. `MonthlyCharges`
3. `contract_Month-to-month`
4. `TotalCharges`
5. `internet_Fiber optic`

**Saved Models**:

- `model/churn_xgboost_model.pkl` ← **Production model**
- `model/churn_model_champion.pkl`

## 🚀 Quick Start

### 1. Prerequisites

```bash
# Python 3.8+
pip install -r requirements.txt

# Node.js 16+
cd telecom-churn-viz
npm install
```

### 2. One-Click Launch

```bash
# Start both services
run_server.bat
```

**Or manually**:

**Backend** (Port 8000):

```bash
start_fastapi.bat
# Or: uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend** (Port 3000):

```bash
start_react.bat
# Or: cd telecom-churn-viz && npm start
```

### 3. API Documentation

Open [http://localhost:8000/docs](http://localhost:8000/docs)

**Sample Prediction**:

```bash
curl -X POST \"http://localhost:8000/predict\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"gender\": \"Female\",
    \"SeniorCitizen\": \"No\",
    \"has_partner\": \"Yes\",
    \"has_dependents\": \"No\",
    \"tenure\": 12.0,
    \"has_phone\": \"Yes\",
    \"MultipleLines\": \"No\",
    \"OnlineSecurity\": \"No\",
    \"MonthlyCharges\": 65.6,
    \"TotalCharges\": 787.5,
    \"Contract\": \"Month-to-month\",
    \"PaymentMethod\": \"Electronic check\"
  }'
```

**Response**:

```json
{
  \"prediction\": \"Churn\",
  \"churn_probability\": 0.67,
  \"risk_level\": \"High\"
}
```

## 📱 Frontend Features

- **Live Prediction**: Enter customer data → instant churn risk
- **Risk Levels**: Low (<30%), Medium (30-60%), High (>60%)
- **Feature Importance**: Interactive XGBoost feature chart
- **Responsive**: Material-UI design

**Open Dashboard**: [http://localhost:3000](http://localhost:3000)

## 🛠️ Project Structure

```
Telecomcustomerchurn/
├── main.py                 # FastAPI backend
├── requirements.txt        # Python deps
├── telco_churn.ipynb       # EDA + Model training
├── telco-customer-churn.csv # Raw dataset
├── model/
│   ├── churn_xgboost_model.pkl  # Trained model
│   └── telco_fully_cleaned.csv  # Preprocessed data
├── telecom-churn-viz/      # React frontend
│   ├── src/App.js
│   └── src/FeatureImportanceChart.js
├── *.bat                   # Launch scripts
└── README.md              # This file!
```

## 🔍 Model Inspection

Run to verify model features:

```bash
python inspect_model.py
```

**Expected Features**: 45 engineered features matching preprocessing pipeline.

## 📈 Key Insights from Analysis

1. **Month-to-month contracts**: 2.7x higher churn vs 2-year
2. **Fiber optic users**: 1.6x higher churn vs DSL
3. **Electronic check payments**: Highest churn risk
4. **Low tenure + High charges**: Strong churn signal
5. **No TechSupport**: Increases churn by 20%

## 🤝 Contributing

1. Clone repo
2. Run `run_server.bat`
3. Make changes
4. Submit PR

## 📄 License

MIT License - Feel free to use/modify/deploy!

---

**Built with ❤️ for Telecom Analytics** | **Status**: 🚀 **Production Ready** | **Accuracy**: 82%+ | **Latency**: <50ms
