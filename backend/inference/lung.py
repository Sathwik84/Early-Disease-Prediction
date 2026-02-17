import tensorflow as tf
import numpy as np
import cv2
import os

# --------------------------------------------------
# 📁 SAFE MODEL PATH
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/
MODEL_PATH = os.path.join(
    BASE_DIR,
    "LUNG_MODULE",
    "models",
    "lung_pneumonia_model_v2.h5"
)

model = tf.keras.models.load_model(MODEL_PATH)

# --------------------------------------------------
# 🔒 UNICODE-SAFE RGB IMAGE LOADER
# --------------------------------------------------
def load_lung_image(path):
    data = np.fromfile(path, dtype=np.uint8)
    img = cv2.imdecode(data, cv2.IMREAD_COLOR)  # RGB

    if img is None:
        raise ValueError("Unable to read lung image")

    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)  # (1,224,224,3)

    return img

# --------------------------------------------------
# 🔮 LUNG PREDICTION
# --------------------------------------------------
def predict_lung(img_path: str):
    img = load_lung_image(img_path)

    pred = model.predict(img, verbose=0)[0][0]

    if pred > 0.5:
        return "Pneumonia Detected", float(pred)
    else:
        return "Normal Lungs", float(1 - pred)
