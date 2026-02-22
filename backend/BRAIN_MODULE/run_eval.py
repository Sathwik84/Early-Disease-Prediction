import tensorflow as tf
import numpy as np
import os
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "Brain Diseases (MRI – Tumors)")
TEST_DIR = os.path.join(DATASET_PATH, "Testing")
MODEL_PATH = os.path.join(BASE_DIR, "models", "brain_tumor_model_v2.h5")

# Load Model
model = tf.keras.models.load_model(MODEL_PATH)

# Data Generator
datagen = ImageDataGenerator(rescale=1./255)
test_generator = datagen.flow_from_directory(
    TEST_DIR,
    target_size=(224, 224),
    batch_size=32,
    class_mode="categorical",
    shuffle=False
)

# Predict
predictions = model.predict(test_generator)
y_pred = np.argmax(predictions, axis=1)
y_true = test_generator.classes
class_labels = list(test_generator.class_indices.keys())

# Metrics
acc = accuracy_score(y_true, y_pred)
cm = confusion_matrix(y_true, y_pred)
cr = classification_report(y_true, y_pred, target_names=class_labels)

print("\n" + "="*50)
print("  BRAIN MODULE EVALUATION")
print("="*50)
print(f"Accuracy: {acc*100:.2f}%")
print("\nConfusion Matrix:")
print(cm)
print("\nClassification Report:")
print(cr)
