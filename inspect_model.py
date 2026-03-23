import pickle
import xgboost as xgb
import pandas as pd

print("Loading model...")
with open('model/churn_xgboost_model.pkl', 'rb') as f:
    model = pickle.load(f)

print(f"Model type: {type(model)}")
if hasattr(model, 'feature_names_'):
    print(f"Feature names: {model.feature_names_}")
elif hasattr(model, 'feature_name'):
    print(f"Feature names: {model.feature_name}")
else:
    print("No feature_names attribute")

if hasattr(model, 'n_features_in_'):
    print(f"n_features_in_: {model.n_features_in_}")
else:
    print("No n_features_in_")

# Load CSV feature names
df = pd.read_csv('model/telco_fully_cleaned.csv')
feature_names = [col for col in df.columns if col not in ['Churn', 'customerID']]
print(f"CSV feature names length: {len(feature_names)}")
print("CSV features sample:", feature_names[:10])

print("Booster feature names:", model.get_booster().feature_names)
print("Model inspection complete.")
