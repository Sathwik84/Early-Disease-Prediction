import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

# Load trained model
model = tf.keras.models.load_model("lung_pneumonia_model_v2.h5")

# Image path (CHANGE filename if needed)
img_path = "test_images/sample_xray.jpg"

# Load & preprocess image
img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = img_array / 255.0
img_array = np.expand_dims(img_array, axis=0)

# Predict
prediction = model.predict(img_array)[0][0]

# Output
if prediction > 0.5:
    print(f"PNEUMONIA detected (Confidence: {prediction*100:.2f}%)")
else:
    print(f"NORMAL lungs (Confidence: {(1-prediction)*100:.2f}%)")
