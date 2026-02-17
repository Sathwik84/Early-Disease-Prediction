import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam

# ----------------------------
# PATHS
# ----------------------------
DATASET_PATH = "Dataset/Lung Diseases (Pneumonia  Lung Infection)/chest_xray"

TRAIN_DIR = DATASET_PATH + "/train"
VAL_DIR   = DATASET_PATH + "/val"

# ----------------------------
# PARAMETERS
# ----------------------------
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 5   # fine-tuning epochs

# ----------------------------
# DATA GENERATORS
# ----------------------------
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=15,
    zoom_range=0.1,
    horizontal_flip=True
)

val_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="binary"
)

val_generator = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="binary"
)

# ----------------------------
# LOAD EXISTING MODEL
# ----------------------------
model = tf.keras.models.load_model("lung_pneumonia_model.h5")

# ----------------------------
# UNFREEZE LAST RESNET LAYERS
# ----------------------------
for layer in model.layers[-30:]:
    layer.trainable = True

# ----------------------------
# RE-COMPILE (LOW LR)
# ----------------------------
model.compile(
    optimizer=Adam(learning_rate=1e-5),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# ----------------------------
# FINE-TUNE
# ----------------------------
model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS
)

# ----------------------------
# SAVE IMPROVED MODEL
# ----------------------------
model.save("lung_pneumonia_model_v2.h5")
print("✅ Improved model saved as lung_pneumonia_model_v2.h5")
