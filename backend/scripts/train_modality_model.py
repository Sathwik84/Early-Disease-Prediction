import tensorflow as tf
from tensorflow.keras import layers, models
import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split

# --------------------------------------------------
# PATHS
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/
DATASET_DIR = os.path.join(BASE_DIR, "MODALITY_DATASET")
MODEL_SAVE_PATH = os.path.join(BASE_DIR, "inference", "modality_model.h5")

IMG_SIZE = 224
EPOCHS = 15
BATCH_SIZE = 16

# --------------------------------------------------
# LOAD IMAGES RECURSIVELY (SUBFOLDER SAFE)
# --------------------------------------------------
def load_images(root, label):
    images, labels = [], []

    for r, _, files in os.walk(root):
        for f in files:
            if f.lower().endswith((".jpg", ".png", ".jpeg")):
                p = os.path.join(r, f)
                img = cv2.imread(p, cv2.IMREAD_GRAYSCALE)
                if img is None:
                    continue

                img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
                img = img / 255.0
                img = np.expand_dims(img, -1)

                images.append(img)
                labels.append(label)

    return images, labels


brain_imgs, brain_lbls = load_images(
    os.path.join(DATASET_DIR, "brain_mri"), 0
)

lung_imgs, lung_lbls = load_images(
    os.path.join(DATASET_DIR, "chest_xray"), 1
)

X = np.array(brain_imgs + lung_imgs)
y = np.array(brain_lbls + lung_lbls)
y = tf.keras.utils.to_categorical(y, 2)

print("Brain MRI:", len(brain_imgs))
print("Chest X-ray:", len(lung_imgs))

# --------------------------------------------------
# SPLIT
# --------------------------------------------------
X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=42, shuffle=True
)

# --------------------------------------------------
# MODEL
# --------------------------------------------------
model = models.Sequential([
    layers.Input((224, 224, 1)),
    layers.Conv2D(32, 3, activation="relu"),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, activation="relu"),
    layers.MaxPooling2D(),
    layers.Conv2D(128, 3, activation="relu"),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(128, activation="relu"),
    layers.Dropout(0.4),
    layers.Dense(2, activation="softmax")
])

model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# --------------------------------------------------
# TRAIN
# --------------------------------------------------
model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=EPOCHS,
    batch_size=BATCH_SIZE
)

# --------------------------------------------------
# SAVE
# --------------------------------------------------
model.save(MODEL_SAVE_PATH)
print("✅ Modality model saved")
print("Class order: 0=brain_mri, 1=chest_xray")
