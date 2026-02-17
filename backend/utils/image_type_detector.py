import cv2
import numpy as np

def detect_modality(img_path):
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return "unknown"

    h, w = img.shape
    mean_intensity = img.mean()
    std_intensity = img.std()

    # Brain MRI: high contrast, dark background
    if std_intensity > 50 and mean_intensity < 120:
        return "brain"

    # Chest X-ray: brighter, smoother gradients
    if std_intensity < 50 and mean_intensity > 120:
        return "lung"

    return "unknown"
