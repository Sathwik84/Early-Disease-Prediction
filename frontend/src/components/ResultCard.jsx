export default function ResultCard({ result }) {
  return (
    <div className="card">
      <h2>Diagnosis Result</h2>

      <p>
        <b>Prediction:</b> {result.prediction}
      </p>

      {/* ✅ FIX: confidence already in percentage */}
      <p>
        <b>Confidence:</b> {result.confidence * 100 .toFixed(2)}%
      </p>

      {/* ✅ Confidence bar */}
      <div className="bar">
        <div
          className="fill"
          style={{ width: `${result.confidence*100 }%` }}
        ></div>
      </div>
    </div>
  );
}
