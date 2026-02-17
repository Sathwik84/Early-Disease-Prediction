export default function PredictButton({
  disease,
  inputData,
  patientId,
  setResult
}) {
  if (!disease || !patientId) return null;

  const isRadiology = disease === "lung" || disease === "brain";
  const isBiomarker = disease === "heart" || disease === "diabetes";

  // 🔒 Disable only if REQUIRED input missing
  const disabled =
    (isRadiology && !inputData.image) ||
    (isBiomarker && !inputData.report);

  const predict = async () => {
    const formData = new FormData();

    formData.append("patient_id", patientId);
    formData.append("disease", disease);

    // ✅ Radiology → image only
    if (isRadiology) {
      formData.append("image", inputData.image);
    }

    // ✅ Biomarker → report only
    if (isBiomarker) {
      formData.append("report", inputData.report);
    }

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      // 🔥 NORMALIZE BACKEND RESPONSE
      setResult({
        prediction: data.prediction,
        confidence: data.confidence,
        explanation: data.explanation || null
      });

    } catch (err) {
      alert("Prediction service unavailable");
      console.error(err);
    }
  };

  return (
    <>
      <button disabled={disabled} onClick={predict}>
        Generate Clinical Conclusion
      </button>

      {disabled && (
        <p className="warning">
          ⚠️ {isRadiology
            ? "Please upload an image"
            : "Please upload a report"}
        </p>
      )}
    </>
  );
}
