import numpy as np
import os

BASE_DIR = os.path.dirname(__file__)
PROFILE_PATH = os.path.join(BASE_DIR, "artifacts", "organ_profiles.npy")

profiles = np.load(PROFILE_PATH, allow_pickle=True).item()

brain_mean = profiles["brain_mean"]
lung_mean = profiles["lung_mean"]

# 🔒 Thresholds (empirically safe defaults)
BRAIN_THRESHOLD = 25.0
LUNG_THRESHOLD = 25.0

def validate_features(features, selected_module):
    """
    Validates whether extracted CNN features
    belong to the selected organ module.
    """

    dist_brain = np.linalg.norm(features - brain_mean)
    dist_lung = np.linalg.norm(features - lung_mean)

    if selected_module == "brain":
        return dist_brain < BRAIN_THRESHOLD

    if selected_module == "lung":
        return dist_lung < LUNG_THRESHOLD

    return False
