"""
evaluate_models.py
==================
Comprehensive evaluation of Heart Disease and Diabetes ML models.

Produces (inside BIO_MODULE/evaluation_results/):
  - confusion_matrix_heart.png
  - confusion_matrix_diabetes.png
  - model_evaluation_report.txt   ← full accuracy / classification report

Run from BIO_MODULE directory:
    python evaluate_models.py
"""

import os
import sys
import pandas as pd
import joblib
import numpy as np
import matplotlib
matplotlib.use("Agg")          # headless – no GUI required
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    confusion_matrix, classification_report,
    accuracy_score, roc_auc_score, f1_score,
    ConfusionMatrixDisplay
)

# ─── paths ────────────────────────────────────────────────────────────────────
BASE    = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(BASE, "evaluation_results")
os.makedirs(OUT_DIR, exist_ok=True)

HEART_CSV    = os.path.join(BASE, "dataset", "Heart Disease (Biomarker Data)", "heart.csv")
DIABETES_CSV = os.path.join(BASE, "dataset", "Diabetes (Biomarker Data)", "diabetes.csv")
HEART_PKL    = os.path.join(BASE, "models", "heart_disease_model.pkl")
DIABETES_PKL = os.path.join(BASE, "models", "diabetes_model.pkl")


# ─── helper ───────────────────────────────────────────────────────────────────
def styled_cm_plot(cm, labels, title, out_path, cmap="Blues"):
    """Save a styled confusion-matrix heatmap."""
    fig, ax = plt.subplots(figsize=(6, 5))
    sns.heatmap(
        cm, annot=True, fmt="d", cmap=cmap,
        xticklabels=labels, yticklabels=labels,
        linewidths=0.5, linecolor="lightgrey",
        ax=ax, annot_kws={"size": 16, "weight": "bold"}
    )
    ax.set_xlabel("Predicted Label", fontsize=12, labelpad=10)
    ax.set_ylabel("True Label", fontsize=12, labelpad=10)
    ax.set_title(title, fontsize=14, fontweight="bold", pad=14)
    plt.tight_layout()
    fig.savefig(out_path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  ✅ Saved: {out_path}")


def evaluate(name, csv_path, target_col, model_path, labels, report_lines):
    """Load data + model → compute all metrics → save CM plot → append to report."""
    print(f"\n{'='*55}")
    print(f"  Evaluating: {name}")
    print(f"{'='*55}")

    # ── data ──────────────────────────────────────────────────────
    data = pd.read_csv(csv_path)
    X    = data.drop(target_col, axis=1)
    y    = data[target_col]
    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # ── model ─────────────────────────────────────────────────────
    model  = joblib.load(model_path)
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else None

    # ── metrics ───────────────────────────────────────────────────
    acc    = accuracy_score(y_test, y_pred)
    f1     = f1_score(y_test, y_pred, average="weighted")
    auc    = roc_auc_score(y_test, y_prob) if y_prob is not None else None
    cm     = confusion_matrix(y_test, y_pred)
    cr     = classification_report(y_test, y_pred, target_names=labels)

    tn, fp, fn, tp = cm.ravel()
    sensitivity    = tp / (tp + fn) if (tp + fn) else 0   # recall for positive class
    specificity    = tn / (tn + fp) if (tn + fp) else 0

    print(f"  Accuracy    : {acc*100:.2f}%")
    print(f"  F1 Score    : {f1:.4f}")
    if auc: print(f"  ROC-AUC     : {auc:.4f}")
    print(f"  Sensitivity : {sensitivity*100:.2f}%  |  Specificity: {specificity*100:.2f}%")

    # ── confusion matrix PNG ───────────────────────────────────────
    cmap  = "Reds" if "Heart" in name else "Greens"
    fname = f"confusion_matrix_{'heart' if 'Heart' in name else 'diabetes'}.png"
    styled_cm_plot(cm, labels, f"Confusion Matrix – {name}", os.path.join(OUT_DIR, fname), cmap=cmap)

    # ── append to report text ─────────────────────────────────────
    report_lines += [
        f"\n{'='*55}",
        f"  MODEL: {name}",
        f"{'='*55}",
        f"  Dataset Rows (Test Split 20%): {len(X_test)}",
        f"  Accuracy        : {acc*100:.2f}%",
        f"  Weighted F1     : {f1:.4f}",
        f"  ROC-AUC         : {auc:.4f}" if auc else "  ROC-AUC         : N/A",
        f"  Sensitivity     : {sensitivity*100:.2f}%",
        f"  Specificity     : {specificity*100:.2f}%",
        "",
        "  Confusion Matrix:",
        f"    TP={tp}  FP={fp}",
        f"    FN={fn}  TN={tn}",
        "",
        "  Classification Report:",
    ] + [f"    {l}" for l in cr.splitlines()] + [""]


# ─── main ─────────────────────────────────────────────────────────────────────
def main():
    report_lines = [
        "MedicalAI — Biomarker Model Evaluation Report",
        f"Generated: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "=" * 55,
        "",
        "Models evaluated: Heart Disease (Logistic/RF) · Diabetes (Logistic/RF)",
        "Test size: 20% stratified split | Random seed: 42",
    ]

    evaluate(
        name       = "Heart Disease",
        csv_path   = HEART_CSV,
        target_col = "target",
        model_path = HEART_PKL,
        labels     = ["No Disease", "Heart Disease"],
        report_lines = report_lines,
    )

    evaluate(
        name       = "Diabetes",
        csv_path   = DIABETES_CSV,
        target_col = "Outcome",
        model_path = DIABETES_PKL,
        labels     = ["No Diabetes", "Diabetes"],
        report_lines = report_lines,
    )

    # ── save text report ─────────────────────────────────────────
    report_path = os.path.join(OUT_DIR, "model_evaluation_report.txt")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))
    print(f"\n  ✅ Text report saved: {report_path}")
    print(f"\n  📁 All outputs in: {OUT_DIR}\n")


if __name__ == "__main__":
    main()
