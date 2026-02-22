// ── ExplanationPanel ──────────────────────────────────────────────────────────
// Handles both biomarker (heart/diabetes) and radiology (brain/lung) results.

const RISK_META = {
  High: { label: "🔴 High Risk", cls: "risk-high" },
  Moderate: { label: "🟡 Moderate Risk", cls: "risk-moderate" },
  Low: { label: "🟢 Low Risk", cls: "risk-low" },
  Unknown: { label: "⚪ Unknown", cls: "risk-unknown" },
};

// ── Radiology (brain / lung) ────────────────────────────────────────────────
function RadiologyExplanation({ result }) {
  const exp = result.explanation || {};
  const risk = RISK_META[exp.risk_level] || RISK_META.Unknown;

  return (
    <div className="card fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0 }}>🧠 AI Clinical Explanation</h2>
        <span className={`risk-badge ${risk.cls}`}>{risk.label}</span>
      </div>

      {/* Summary */}
      {exp.summary && (
        <div className="explain-summary">
          <p>{exp.summary}</p>
        </div>
      )}

      <div className="explain-grid">
        {/* Symptoms */}
        {exp.symptoms?.length > 0 && (
          <div className="explain-section">
            <div className="explain-section-title">🩺 Common Symptoms</div>
            <ul className="explain-list">
              {exp.symptoms.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        {/* Risk Factors */}
        {exp.risk_factors?.length > 0 && (
          <div className="explain-section">
            <div className="explain-section-title">⚠️ Risk Factors</div>
            <ul className="explain-list">
              {exp.risk_factors.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Next Steps */}
      {exp.next_steps?.length > 0 && (
        <div className="explain-section" style={{ marginTop: 18 }}>
          <div className="explain-section-title">✅ Recommended Next Steps</div>
          <ol className="explain-list explain-steps">
            {exp.next_steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      )}

      <p className="disclaimer" style={{ marginTop: 20 }}>
        ⚠️ This AI analysis is for educational purposes only and must not replace clinical judgement.
      </p>
    </div>
  );
}

// ── Biomarker comparison table (heart / diabetes) ───────────────────────────
function BiomarkerTable({ result }) {
  const biomarkers = result.explanation?.biomarkers || [];
  const abnormalCount = biomarkers.filter(b => b.abnormal).length;
  const risk =
    abnormalCount === 0 ? RISK_META.Low
      : abnormalCount <= 2 ? RISK_META.Moderate
        : RISK_META.High;

  if (biomarkers.length === 0) return null;

  return (
    <div className="card fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0 }}>🔬 Biomarker Analysis</h2>
        <span className={`risk-badge ${risk.cls}`}>{risk.label}</span>
      </div>

      <p style={{ color: "var(--muted)", fontSize: "0.88rem", margin: "10px 0 16px" }}>
        {abnormalCount === 0
          ? "All biomarkers are within normal ranges."
          : `${abnormalCount} biomarker${abnormalCount > 1 ? "s" : ""} outside normal range — review recommended.`}
      </p>

      <div style={{ overflowX: "auto" }}>
        <table className="bio-table">
          <thead>
            <tr>
              <th>Biomarker</th>
              <th>Your Value</th>
              <th>Normal Range</th>
              <th>Difference</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {biomarkers.map((b, i) => (
              <tr key={i} className={b.abnormal ? "bio-row-abnormal" : ""}>
                <td>
                  <span style={{ fontWeight: 600 }}>{b.biomarker}</span>
                  {b.unit && <span style={{ color: "var(--muted)", fontSize: "0.78rem", marginLeft: 5 }}>({b.unit})</span>}
                </td>
                <td style={{ fontWeight: 700 }}>{b.observed}</td>
                <td>{b.normal_range}</td>
                <td>
                  <span className={
                    b.difference && b.difference.startsWith("+")
                      ? "diff-positive"
                      : b.difference && b.difference.startsWith("-")
                        ? "diff-negative"
                        : "diff-neutral"
                  }>
                    {b.difference}
                  </span>
                </td>
                <td>
                  <span className={b.abnormal ? "badge badge-danger" : "badge badge-success"}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* General AI explanation card for the disease */}
      <BiomarkerDiseaseInfo disease={result.disease} />

      <p className="disclaimer" style={{ marginTop: 20 }}>
        ⚠️ Reference ranges are general guidelines. Always consult a physician for personalised interpretation.
      </p>
    </div>
  );
}

// ── Short AI info blurb for heart/diabetes ──────────────────────────────────
const DISEASE_INFO = {
  heart: {
    title: "About Heart Disease",
    icon: "❤️",
    body: "Cardiovascular disease (CVD) is a leading cause of death worldwide. Risk increases with abnormal cholesterol, high blood pressure, elevated ST depression, and reduced exercise tolerance. Early detection significantly improves outcomes through lifestyle modification and, where necessary, medication or surgical intervention.",
    tips: [
      "Maintain total cholesterol below 200 mg/dL",
      "Keep resting blood pressure under 120 mmHg",
      "Exercise regularly (150+ min/week of moderate activity)",
      "Avoid smoking and control blood sugar"
    ]
  },
  diabetes: {
    title: "About Diabetes",
    icon: "💉",
    body: "Type 2 diabetes results from insulin resistance or insufficient insulin production. Persistently elevated blood glucose damages blood vessels and nerves over time. It is manageable through diet, exercise, medication, and regular monitoring.",
    tips: [
      "Keep fasting blood glucose between 70–140 mg/dL",
      "Maintain BMI in the healthy range (18.5–24.9)",
      "Eat a low-glycaemic, fibre-rich diet",
      "Check HbA1c every 3 months if diabetic"
    ]
  }
};

function BiomarkerDiseaseInfo({ disease }) {
  const info = DISEASE_INFO[disease];
  if (!info) return null;
  return (
    <div className="explain-info-box">
      <div className="explain-section-title">{info.icon} {info.title}</div>
      <p style={{ marginBottom: 10, lineHeight: 1.65, fontSize: "0.9rem" }}>{info.body}</p>
      <ul className="explain-list">
        {info.tips.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ExplanationPanel({ result }) {
  if (!result) return null;
  const { disease } = result;

  if (disease === "heart" || disease === "diabetes") {
    return <BiomarkerTable result={result} />;
  }

  if (disease === "brain" || disease === "lung") {
    return <RadiologyExplanation result={result} />;
  }

  return null;
}
