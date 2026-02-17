import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

# Load trained model
model = tf.keras.models.load_model("models/brain_tumor_model.h5")

# Class labels (ORDER IS IMPORTANT)
class_names = ["glioma", "meningioma", "notumor", "pituitary"]

# Image path
img_path = "test_images/sample_mri.jpg"

# Load & preprocess image
img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = img_array / 255.0
img_array = np.expand_dims(img_array, axis=0)

# Predict
predictions = model.predict(img_array)[0]
predicted_class = class_names[np.argmax(predictions)]
confidence = np.max(predictions) * 100

# Output
print(f"🧠 Brain MRI Result: {predicted_class.upper()}")
print(f"Confidence: {confidence:.2f}%")
print("Note: This is an early screening result, not a diagnosis.")
