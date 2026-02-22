import os
import sys
import pandas as pd
import numpy as np
import joblib
import tensorflow as tf
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Headless matplotlib for environments without display
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def print_header(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60)

def evaluate_bio_model(name, csv_path, target_col, model_path, labels):
    print(f"\nEvaluating Biomarker Model: {name}...")
    if not os.path.exists(csv_path) or not os.path.exists(model_path):
        print(f"  [ERROR] Missing files for {name}")
        return

    data = pd.read_csv(csv_path)
    X = data.drop(target_col, axis=1)
    y = data[target_col]
    _, X_test, _, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    model = joblib.load(model_path)
    y_pred = model.predict(X_test)
    
    acc = accuracy_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)
    cr = classification_report(y_test, y_pred, target_names=labels)
    
    print(f"  Accuracy: {acc*100:.2f}%")
    print("\n  Confusion Matrix:")
    print(cm)
    print("\n  Classification Report:")
    print(cr)

def evaluate_image_model(name, dataset_path, model_path, mode="categorical"):
    print(f"\nEvaluating Image Model: {name}...")
    if not os.path.exists(dataset_path) or not os.path.exists(model_path):
        print(f"  [ERROR] Missing files for {name}")
        return

    model = tf.keras.models.load_model(model_path)
    
    datagen = ImageDataGenerator(rescale=1./255)
    generator = datagen.flow_from_directory(
        dataset_path,
        target_size=(224, 224),
        batch_size=32,
        class_mode=mode,
        shuffle=False
    )
    
    predictions = model.predict(generator, verbose=0)
    
    if mode == "binary":
        y_pred = (predictions > 0.5).astype(int).flatten()
        labels = ["NORMAL", "PNEUMONIA"]
    else:
        y_pred = np.argmax(predictions, axis=1)
        labels = list(generator.class_indices.keys())
        
    y_true = generator.classes
    acc = accuracy_score(y_true, y_pred)
    cm = confusion_matrix(y_true, y_pred)
    cr = classification_report(y_true, y_pred, target_names=labels)
    
    print(f"  Accuracy: {acc*100:.2f}%")
    print("\n  Confusion Matrix:")
    print(cm)
    print("\n  Classification Report:")
    print(cr)

def main():
    root = os.getcwd()
    
    # --- 1. HEART DISEASE ---
    print_header("HEART DISEASE MODULE (Random Forest)")
    evaluate_bio_model(
        "Heart Disease",
        os.path.join(root, "backend", "BIO_MODULE", "dataset", "Heart Disease (Biomarker Data)", "heart.csv"),
        "target",
        os.path.join(root, "backend", "BIO_MODULE", "models", "heart_disease_model.pkl"),
        ["No Disease", "Heart Disease"]
    )
    
    # --- 2. DIABETES ---
    print_header("DIABETES MODULE (Random Forest)")
    evaluate_bio_model(
        "Diabetes",
        os.path.join(root, "backend", "BIO_MODULE", "dataset", "Diabetes (Biomarker Data)", "diabetes.csv"),
        "Outcome",
        os.path.join(root, "backend", "BIO_MODULE", "models", "diabetes_model.pkl"),
        ["No Diabetes", "Diabetes"]
    )
    
    # --- 3. LUNG (PNEUMONIA) ---
    print_header("LUNG MODULE (ResNet50 CNN)")
    evaluate_image_model(
        "Lung Disease",
        os.path.join(root, "backend", "LUNG_MODULE", "dataset", "Lung Diseases (Pneumonia  Lung Infection)", "chest_xray", "test"),
        os.path.join(root, "backend", "LUNG_MODULE", "models", "lung_pneumonia_model_v2.h5"),
        mode="binary"
    )
    
    # --- 4. BRAIN TUMOR ---
    print_header("BRAIN MODULE (ResNet50 CNN)")
    evaluate_image_model(
        "Brain Tumor",
        os.path.join(root, "backend", "BRAIN_MODULE", "dataset", "Brain Diseases (MRI – Tumors)", "Testing"),
        os.path.join(root, "backend", "BRAIN_MODULE", "models", "brain_tumor_model_v2.h5"),
        mode="categorical"
    )

if __name__ == "__main__":
    main()
