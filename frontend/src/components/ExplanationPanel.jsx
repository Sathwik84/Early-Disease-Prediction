export default function ExplanationPanel({ result, disease }) {
  if (!result || !result.explanation) return null;

  const { explanation } = result;

  // 🧪 BIOMARKER MODULES
  if (disease === "heart" || disease === "diabetes") {
    return (
      <div className="card">
        <h3>🧪 Biomarker Analysis</h3>

        <table className="biomarker-table">
          <thead>
            <tr>
              <th>Biomarker</th>
              <th>Observed</th>
              <th>Normal Range</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {explanation.biomarkers.map((b, idx) => (
              <tr key={idx}>
                <td>{b.biomarker}</td>
                <td>{b.observed}</td>
                <td>{b.normal_range}</td>
                <td>
                  {b.status.includes("⚠️") ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {b.status}
                    </span>
                  ) : (
                    b.status
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <small className="disclaimer">
          ⚠️ Consult a doctor before making medical decisions.
        </small>
      </div>
    );
  }

  // 🧠🫁 RADIOLOGY MODULES
  return (
    <div className="card">
      <h3>📌 Clinical Explanation</h3>
      <p>{explanation.summary}</p>

      <small className="disclaimer">
        ⚠️ AI-assisted interpretation, not a final diagnosis.
      </small>
    </div>
  );
}
