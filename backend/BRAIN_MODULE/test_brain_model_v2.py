import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

# Load improved model
model = tf.keras.models.load_model("models/brain_tumor_model_v2.h5")

# IMPORTANT: class order from training
class_names = ["glioma", "meningioma", "notumor", "pituitary"]

# Image path
img_path = "test_images/Sample_mri.jpg"

# Load and preprocess image
img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img) / 255.0
img_array = np.expand_dims(img_array, axis=0)

# Predict
pred = model.predict(img_array)[0]
predicted_class = class_names[np.argmax(pred)]
confidence = np.max(pred) * 100

print(f"🧠 Brain MRI Result (V2): {predicted_class.upper()}")
print(f"Confidence: {confidence:.2f}%")
print("Note: Early screening result, not a diagnosis.")
