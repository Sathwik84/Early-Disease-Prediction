import tensorflow as tf
import numpy as np
import cv2
import os

# --------------------------------------------------
# 📁 LOAD MODEL
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/
MODEL_PATH = os.path.join(BASE_DIR, "inference", "modality_model.h5")

model = tf.keras.models.load_model(MODEL_PATH)

LABELS = ["brain_mri", "chest_xray"]

# --------------------------------------------------
# 🖼️ SAFE IMAGE LOADER
# --------------------------------------------------
def load_image(path):
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError("Invalid image")

    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=(0, -1))  # (1,224,224,1)
    return img

# --------------------------------------------------
# 🔒 STRICT MODALITY DETECTOR
# --------------------------------------------------
def detect_modality(image_path: str):
    img = load_image(image_path)
    preds = model.predict(img, verbose=0)[0]

    brain_score = float(preds[0])
    lung_score = float(preds[1])

    # 🚨 HARD REJECTION ZONE
    if abs(brain_score - lung_score) < 0.30:
        return "unknown", max(brain_score, lung_score)

    predicted = LABELS[np.argmax(preds)]
    confidence = max(brain_score, lung_score)

    return predicted, confidence
