import tensorflow as tf
import numpy as np
import json
from tensorflow.keras.preprocessing import image
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# ----------------------------
# PATHS
# ----------------------------
MODEL_PATH = "models/brain_tumor_model.h5"
DATASET_PATH = "dataset/Brain Diseases (MRI – Tumors)/Training"
IMAGE_PATH = "test_images/sample_mri.jpg"

# ----------------------------
# LOAD MODEL
# ----------------------------
model = tf.keras.models.load_model(MODEL_PATH)

# ----------------------------
# GET TRUE CLASS INDICES
# ----------------------------
datagen = ImageDataGenerator(rescale=1./255)

temp_generator = datagen.flow_from_directory(
    DATASET_PATH,
    target_size=(224, 224),
    batch_size=1,
    class_mode="categorical",
    shuffle=False
)

class_indices = temp_generator.class_indices
index_to_class = {v: k for k, v in class_indices.items()}

print("✔ Class Mapping Used by Model:")
print(index_to_class)

# ----------------------------
# LOAD & PREPROCESS IMAGE
# ----------------------------
img = image.load_img(IMAGE_PATH, target_size=(224, 224))
img_array = image.img_to_array(img) / 255.0
img_array = np.expand_dims(img_array, axis=0)

# ----------------------------
# PREDICT
# ----------------------------
predictions = model.predict(img_array)[0]

predicted_index = np.argmax(predictions)
predicted_class = index_to_class[predicted_index]
confidence = predictions[predicted_index] * 100

# ----------------------------
# OUTPUT
# ----------------------------
print("\n🧠 Brain MRI Prediction (Correct Mapping)")
print(f"Predicted Class: {predicted_class.upper()}")
print(f"Confidence: {confidence:.2f}%")

print("\nAll class probabilities:")
for i, prob in enumerate(predictions):
    print(f"{index_to_class[i]} : {prob*100:.2f}%")

print("\nNote: This is an early screening result, not a diagnosis.")
