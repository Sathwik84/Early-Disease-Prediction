import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import os

# --------------------------------------------------
# 📁 SAFE MODEL PATH
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/
MODEL_PATH = os.path.join(
    BASE_DIR,
    "BRAIN_MODULE",
    "models",
    "brain_tumor_model_v2.h5"
)

model = tf.keras.models.load_model(MODEL_PATH)

class_names = ["glioma", "meningioma", "notumor", "pituitary"]

# --------------------------------------------------
# 🔮 BRAIN MRI PREDICTION
# --------------------------------------------------
def predict_brain(img_path: str):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    pred = model.predict(img_array, verbose=0)[0]
    idx = int(np.argmax(pred))

    return class_names[idx], float(pred[idx])
