import pandas as pd
import joblib
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

# Load data
data = pd.read_csv("dataset/Heart Disease (Biomarker Data)/heart.csv")
X = data.drop("target", axis=1)
y = data["target"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Load model
model = joblib.load("models/heart_disease_model.pkl")

# Predict
y_pred = model.predict(X_test)

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=["No Disease", "Possible Disease"]
)

disp.plot(cmap=plt.cm.Blues)
plt.title("Confusion Matrix – Heart Disease")
plt.show()
