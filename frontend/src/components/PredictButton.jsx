import { useState } from "react";

export default function PredictButton({
  disease,
  inputData,
  patientId,
  setResult,
  setError
}) {
  const [loading, setLoading] = useState(false);

  if (!disease || !patientId) return null;

  const isRadiology = disease === "lung" || disease === "brain";
  const isBiomarker = disease === "heart" || disease === "diabetes";

  const disabled =
    (isRadiology && !inputData.image) ||
    (isBiomarker && !inputData.report);

  const predict = async () => {
    const formData = new FormData();
    formData.append("patient_id", patientId);
    formData.append("disease", disease);

    if (isRadiology) formData.append("image", inputData.image);
    if (isBiomarker) formData.append("report", inputData.report);

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      // ❌ Backend returned a validation / modality error
      if (data.status === "error") {
        setError(data.message || "An error occurred. Please try again.");
        return;
      }

      // ✅ Success
      setResult({
        prediction: data.prediction,
        confidence: data.confidence,
        explanation: data.explanation || null,
        disease
      });

    } catch (err) {
      setError("Prediction service unavailable. Make sure the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "8px" }}>
      <button disabled={disabled || loading} onClick={predict}>
        {loading
          ? <><span className="spinner" /> Analysing…</>
          : "⚡ Generate Clinical Conclusion"}
      </button>

      {disabled && (
        <p className="warning">
          ⚠️ {isRadiology ? "Please upload an image first" : "Please upload a biomarker PDF first"}
        </p>
      )}
    </div>
  );
}
