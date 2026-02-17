import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# ----------------------------
# PATHS
# ----------------------------
DATASET_PATH = "dataset/Lung Diseases (Pneumonia  Lung Infection)/chest_xray"
TEST_DIR = DATASET_PATH + "/test"

MODEL_PATH = "models/lung_pneumonia_model_v2.h5"

# ----------------------------
# LOAD MODEL
# ----------------------------
model = tf.keras.models.load_model(MODEL_PATH)

# ----------------------------
# DATA GENERATOR
# ----------------------------
datagen = ImageDataGenerator(rescale=1./255)

test_generator = datagen.flow_from_directory(
    TEST_DIR,
    target_size=(224, 224),
    batch_size=32,
    class_mode="binary",
    shuffle=False
)

# ----------------------------
# PREDICTIONS
# ----------------------------
predictions = model.predict(test_generator)
y_pred = (predictions > 0.7).astype(int)   # threshold adjusted
y_true = test_generator.classes

# ----------------------------
# CONFUSION MATRIX
# ----------------------------
cm = confusion_matrix(y_true, y_pred)

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=["NORMAL", "PNEUMONIA"]
)

disp.plot(cmap=plt.cm.Blues)
plt.title("Confusion Matrix - Lung Disease Detection")
plt.show()
