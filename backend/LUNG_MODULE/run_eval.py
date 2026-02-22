import tensorflow as tf
import numpy as np
import os
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "Lung Diseases (Pneumonia  Lung Infection)", "chest_xray")
TEST_DIR = os.path.join(DATASET_PATH, "test")
MODEL_PATH = os.path.join(BASE_DIR, "models", "lung_pneumonia_model_v2.h5")

# Load Model
model = tf.keras.models.load_model(MODEL_PATH)

# Data Generator
datagen = ImageDataGenerator(rescale=1./255)
test_generator = datagen.flow_from_directory(
    TEST_DIR,
    target_size=(224, 224),
    batch_size=32,
    class_mode="binary",
    shuffle=False
)

# Predict
predictions = model.predict(test_generator)
y_pred = (predictions > 0.5).astype(int).flatten()
y_true = test_generator.classes

# Debug prints
print(f"y_pred unique: {np.unique(y_pred)}")
print(f"y_true unique: {np.unique(y_true)}")

# Metrics
acc = accuracy_score(y_true, y_pred)
cm = confusion_matrix(y_true, y_pred)
cr = classification_report(y_true, y_pred, target_names=["NORMAL", "PNEUMONIA"])

print("\n" + "="*50)
print("  LUNG MODULE EVALUATION")
print("="*50)
print(f"Accuracy: {acc*100:.2f}%")
print("\nConfusion Matrix:")
print(cm)
print("\nClassification Report:")
print(cr)
