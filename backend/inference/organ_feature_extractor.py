import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import (
    Input, Conv2D, MaxPooling2D,
    Flatten, Dense, Dropout
)
import numpy as np

def build_feature_extractor():
    inputs = Input(shape=(224, 224, 1))

    x = Conv2D(32, (3, 3), activation="relu")(inputs)
    x = MaxPooling2D((2, 2))(x)

    x = Conv2D(64, (3, 3), activation="relu")(x)
    x = MaxPooling2D((2, 2))(x)

    x = Conv2D(128, (3, 3), activation="relu")(x)
    x = MaxPooling2D((2, 2))(x)

    x = Conv2D(256, (3, 3), activation="relu")(x)
    x = MaxPooling2D((2, 2))(x)

    x = Flatten()(x)
    features = Dense(512, activation="relu", name="feature_vector")(x)
    features = Dropout(0.5)(features)

    model = Model(inputs, features)
    return model

# build once
feature_extractor = build_feature_extractor()

def extract_features(image):
    """
    image: numpy array (224,224) or (224,224,1)
    returns: 512-d feature vector
    """
    if image.ndim == 2:
        image = np.expand_dims(image, axis=-1)

    image = image.reshape(1, 224, 224, 1)
    features = feature_extractor.predict(image, verbose=0)
    return features[0]
