import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Load data
data = pd.read_csv("dataset/Heart Disease (Biomarker Data)/heart.csv")

# Expecting target column named 'target'
X = data.drop(columns=["target"])
y = data["target"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Model
model = RandomForestClassifier(
    n_estimators=200, random_state=42, class_weight="balanced"
)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print(f"Heart Disease Accuracy: {acc*100:.2f}%")
print(classification_report(y_test, y_pred))

# Save
joblib.dump(model, "models/heart_disease_model.pkl")
print("✅ Saved: models/heart_disease_model.pkl")
