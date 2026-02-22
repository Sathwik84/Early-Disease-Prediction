# Project Report: Early Disease Prediction (EDP) System

## 1. Executive Summary
The Early Disease Prediction (EDP) system is a comprehensive medical AI platform designed to assist healthcare professionals in the early detection and analysis of various conditions. By leveraging Deep Learning for medical imaging (Vision) and automated biomarker analysis for clinical reports (Clinical), EDP provides a holistic approach to disease prediction with a strong emphasis on transparency and explainability.

---

## 2. Project Overview & Objectives
Early detection is critical for effective treatment outcomes. The EDP project aims to bridge the gap between complex AI models and clinical utility through:
- **Multi-modal Diagnostics**: Support for both imaging (MRI, X-ray) and clinical data (Biomarker reports).
- **Explainable AI (XAI)**: Providing clear justifications for predictions to build clinical trust.
- **Automated Workflow**: Reducing manual effort in report parsing and modality identification.
- **User-Centric Design**: A modern, responsive dashboard for intuitive data management.

---

## 3. System Architecture

### Frontend Architecture
The frontend is built as a Single Page Application (SPA) using **React**.
- **Pages**: Dashboard, Patient Overview, Prediction Interface, Detailed Analysis, and Profile Management.
- **State Management**: React Context API for global state (e.g., patient context).
- **Visualization**: **Chart.js** integrated via `react-chartjs-2` for trend analysis and biomarker visualization.
- **Styling**: Modern, responsive design using Vanilla CSS.

### Backend Architecture
The backend is a high-performance **FastAPI** service.
- **API Model**: Modular router-based architecture (`auth`, `predict`, `predictions`, `patients`).
- **Processing Layer**: Asynchronous handling of file uploads and ML inference.
- **Inference Integration**: Decoupled ML modules for Brain, Lung, Heart, and Diabetes units.

### Database Schema
A **MySQL** database handles storage:
- **Patients**: DEMographic and clinical metadata.
- **Predictions**: Historical records of AI analysis, confidence scores, and timestamps.
- **Authentication**: Secure user credentials managed with `bcrypt`.

---

## 4. Technical Deep Dive

### Medical Vision Modules
- **Brain MRI Analysis**: Utilizes Deep Convolutional Neural Networks (CNNs) to detect abnormalities in brain scans.
- **Lung X-ray Analysis**: Optimized for identifying pulmonary conditions (e.g., Pneumonia) from chest radiographs.
- **Modality Detection**: An automated gatekeeper model that verifies if the uploaded image matches the selected disease module (e.g., ensuring a Brain MRI isn't uploaded to the Lung module).

### Clinical Biomarker Engines
- **Report Extraction**: Uses `pdfplumber` to extract raw text from laboratory reports.
- **Pattern Matching**: Specialized parsers for Heart (Lipid profile, BP) and Diabetes (Glucose, HbA1c) biomarkers.
- **Predictive Modeling**: Scikit-learn and joblib-based models for risk assessment.

### Explainability (XAI)
The system doesn't just provide a "Yes/No" prediction. It includes:
- **Biomarker Explanation**: Highlighting which specific values (e.g., LDL levels) contributed to a high-risk prediction.
- **Disease Context**: Educational summaries explaining the nature of the predicted condition.

---

## 5. Technology Stack

| Layer | Tools & Technologies |
| :--- | :--- |
| **Frontend** | React, React-Scripts, Chart.js, Vanilla CSS |
| **Backend** | Python, FastAPI, Uvicorn |
| **Machine Learning** | TensorFlow, Keras, Scikit-learn, NumPy, Pandas |
| **Processing** | PIL (Image), pdfplumber (Text), joblib |
| **Database** | MySQL, mysql-connector-python |
| **Security** | bcrypt |

---

## 6. User Flow
1. **Authentication**: Secure login/signup.
2. **Dashboard**: View overall patient statistics and recent activities.
3. **Patient Selection**: Choose or create a patient profile.
4. **Prediction**: Upload an image (MRI/X-ray) or a biomarker PDF.
5. **Results & Analysis**: Review AI prediction, confidence scores, and detailed XAI panels.

---

## 7. Future Scope
- Integration with FHIR/HL7 standards for direct EHR connectivity.
- Expansion to more modalities (e.g., Skin Lesion analysis, Retinal scans).
- Real-time collaboration features for multi-doctor consultations.
