BIOMARKER-BASED DISEASE PREDICTION MODULE
(Heart Disease & Diabetes – Early Screening)

Project: AI-Assisted Early Disease Screening and Diagnostic Support System
Module: BIO_MODULE (Biomarker Data)

--------------------------------------------------
1. MODULE OVERVIEW
--------------------------------------------------
This module implements early screening for biomarker-based diseases using
structured clinical data. Two diseases are covered in this module:
1) Heart Disease
2) Diabetes Mellitus

Machine learning models analyze patient biomarker values and generate
early warning predictions indicating potential disease risk.

This system is designed as a screening and decision-support tool and does
not provide definitive medical diagnosis.

--------------------------------------------------
2. DATASETS USED
--------------------------------------------------

A) Heart Disease Dataset
Source: UCI / Kaggle (CSV version)
Features include:
- Age
- Sex
- Chest pain type
- Blood pressure
- Cholesterol
- ECG results
- Heart rate
- Exercise-induced angina
- Other clinical parameters

Target:
- 0: No heart disease
- 1: Possible heart disease

File Location:
dataset/Heart Disease (Biomarker Data)/heart.csv

--------------------------------------------------

B) Diabetes Dataset
Source: PIMA Indians Diabetes Dataset
Features include:
- Pregnancies
- Glucose
- Blood pressure
- Skin thickness
- Insulin
- BMI
- Diabetes pedigree function
- Age

Target:
- 0: No diabetes
- 1: Possible diabetes

File Location:
dataset/Diabetes (Biomarker Data)/diabetes.csv

--------------------------------------------------
3. MODEL DETAILS
--------------------------------------------------
Algorithm Used: Random Forest Classifier
Framework: Scikit-learn

Separate models were trained for heart disease and diabetes due to
different biomarker features and prediction objectives.

Saved Models:
- models/heart_disease_mod
