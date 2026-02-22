import { useState } from "react";

// SVG circular confidence gauge
function ConfidenceGauge({ pct }) {
  const r = 54;
  const circ = 2 * Math.PI * r;

  // Use rounded percentage for the graph consistent with the label
  const displayPct = Math.round(pct);
  const filled = (displayPct / 100) * circ;

  const color = displayPct >= 75 ? "#818cf8" : displayPct >= 50 ? "#facc15" : "#f87171";

  return (
    <div className="gauge-wrap">
      <svg width="130" height="130" viewBox="0 0 130 130">
        {/* Track */}
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
        {/* Progress */}
        <circle
          cx="65" cy="65" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={displayPct === 100 ? `${circ} 0` : `${filled} ${circ}`}
          strokeDashoffset={circ / 4}   /* start at top */
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        {/* Label */}
        <text x="65" y="60" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="Inter,sans-serif">
          {displayPct}%
        </text>
        <text x="65" y="80" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="Inter,sans-serif">
          confidence
        </text>
      </svg>
    </div>
  );
}

export default function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);
  const pct = parseFloat((result.confidence * 100).toFixed(1));

  const isPositive =
    result.prediction?.toLowerCase().includes("detected") ||
    result.prediction?.toLowerCase().includes("possible") ||
    result.prediction?.toLowerCase().includes("glioma") ||
    result.prediction?.toLowerCase().includes("meningioma") ||
    result.prediction?.toLowerCase().includes("pituitary") ||
    result.prediction?.toLowerCase().includes("pneumonia");

  const copyReport = () => {
    const text = [
      "=== MedicalAI Clinical Report ===",
      `Date      : ${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}`,
      `Module    : ${result.disease?.toUpperCase()}`,
      `Prediction: ${result.prediction}`,
      `Confidence: ${pct}%`,
      "",
      "⚠️ For educational purposes only. Consult a certified physician.",
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const printReport = () => {
    const win = window.open("", "_blank");

    /* ── build the analysis section ─────────────────────────────── */
    const exp = result.explanation || {};
    const biomarkers = exp.biomarkers || [];
    const isBiomarker = ["heart", "diabetes"].includes(result.disease?.toLowerCase());
    const isRadiology = ["brain", "lung"].includes(result.disease?.toLowerCase());

    let analysisHTML = "";

    if (isBiomarker && biomarkers.length > 0) {
      const rows = biomarkers.map(b => `
        <tr style="background:${b.abnormal ? "#fff1f2" : "white"}">
          <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6">${b.biomarker}${b.unit ? ` <span style="color:#9ca3af;font-size:0.8em">(${b.unit})</span>` : ""}</td>
          <td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #f3f4f6">${b.observed}</td>
          <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6">${b.normal_range || "-"}</td>
          <td style="padding:7px 10px;font-weight:700;color:${b.difference?.startsWith("+") ? "#dc2626" : "#16a34a"};border-bottom:1px solid #f3f4f6">${b.difference || "-"}</td>
          <td style="padding:7px 10px;font-weight:600;color:${b.abnormal ? "#dc2626" : "#16a34a"};border-bottom:1px solid #f3f4f6">${b.status}</td>
        </tr>`).join("");
      analysisHTML = `
        <h2 style="color:#4f46e5;margin-top:28px;font-size:1rem;border-bottom:1px solid #e5e7eb;padding-bottom:6px">🔬 Biomarker Analysis</h2>
        <table style="width:100%;border-collapse:collapse;font-size:0.85rem;margin-top:10px">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="text-align:left;padding:8px 10px">Biomarker</th>
              <th style="text-align:left;padding:8px 10px">Your Value</th>
              <th style="text-align:left;padding:8px 10px">Normal Range</th>
              <th style="text-align:left;padding:8px 10px">Difference</th>
              <th style="text-align:left;padding:8px 10px">Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>`;
    }

    if (isRadiology && exp.summary) {
      const riskColor = exp.risk_level === "High" ? "#dc2626" : exp.risk_level === "Moderate" ? "#d97706" : "#16a34a";
      const symList = (exp.symptoms || []).map(s => `<li>${s}</li>`).join("");
      const rfList = (exp.risk_factors || []).map(r => `<li>${r}</li>`).join("");
      const nsList = (exp.next_steps || []).map(s => `<li>${s}</li>`).join("");
      analysisHTML = `
        <div style="margin-top:28px">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e5e7eb;padding-bottom:8px;margin-bottom:12px">
            <h2 style="color:#4f46e5;margin:0;font-size:1rem">🧠 AI Clinical Explanation</h2>
            ${exp.risk_level ? `<span style="padding:3px 12px;border-radius:999px;font-size:0.78rem;font-weight:700;background:${riskColor}22;color:${riskColor}">${exp.risk_level} Risk</span>` : ""}
          </div>
          <p style="background:#f5f3ff;border-left:3px solid #6d28d9;padding:12px;border-radius:0 8px 8px 0;margin:0 0 16px;font-size:0.88rem;line-height:1.65">${exp.summary}</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            ${symList ? `<div><div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#6d28d9;margin-bottom:6px">🩺 Symptoms</div><ul style="margin:0;padding-left:18px;font-size:0.84rem;line-height:1.7">${symList}</ul></div>` : ""}
            ${rfList ? `<div><div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#6d28d9;margin-bottom:6px">⚠️ Risk Factors</div><ul style="margin:0;padding-left:18px;font-size:0.84rem;line-height:1.7">${rfList}</ul></div>` : ""}
          </div>
          ${nsList ? `<div style="margin-top:14px"><div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#6d28d9;margin-bottom:6px">✅ Next Steps</div><ol style="margin:0;padding-left:18px;font-size:0.84rem;line-height:1.7">${nsList}</ol></div>` : ""}
        </div>`;
    }

    /* ── write the print window ─────────────────────────────────── */
    win.document.write(`
      <html><head><title>MedicalAI Report</title>
      <style>
        body{font-family:'Segoe UI',sans-serif;padding:40px;max-width:680px;margin:0 auto;color:#111;}
        h1{color:#4f46e5;border-bottom:2px solid #4f46e5;padding-bottom:8px;}
        .banner{padding:14px 16px;border-radius:8px;margin:16px 0;
          background:${isPositive ? "#fee2e2" : "#dcfce7"};
          color:${isPositive ? "#991b1b" : "#166534"};font-weight:700;font-size:1.05rem;}
        .row{display:flex;justify-content:space-between;margin:6px 0;padding:6px 0;border-bottom:1px solid #f3f4f6;}
        .label{color:#6b7280;font-size:0.88rem;}
        .disclaimer{margin-top:28px;font-size:0.77rem;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:12px;}
        @media print{button{display:none;}}
      </style></head><body>
        <h1>🧬 MedicalAI Clinical Report</h1>
        <div class="row"><span class="label">Date</span><span>${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</span></div>
        <div class="row"><span class="label">Module</span><span><b>${result.disease?.toUpperCase()}</b></span></div>
        <div class="banner">${isPositive ? "⚠️" : "✅"} ${result.prediction}</div>
        <div class="row"><span class="label">Model Confidence</span><span style="font-weight:700">${pct}%</span></div>
        ${analysisHTML}
        <p class="disclaimer">⚠️ This AI output is for educational purposes only. It must not replace the judgement of a certified medical professional.</p>
        <script>window.print();<\/script>
      </body></html>`);
    win.document.close();
  };


  return (
    <div className="card result-card fade-in">
      <div className="result-header">
        <h2 style={{ margin: 0 }}>🩺 Diagnosis Result</h2>
        <div className="result-actions">
          <button className={`copy-btn${copied ? " copied" : ""}`} onClick={copyReport}>
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
          <button className="copy-btn" onClick={printReport} title="Print / Save as PDF">
            🖨️ Print
          </button>
        </div>
      </div>

      <div className="result-body">
        {/* Gauge */}
        <ConfidenceGauge pct={pct} />

        {/* Status */}
        <div className={`result-status ${isPositive ? "positive" : "negative"}`} style={{ flex: 1 }}>
          <div className="result-icon">{isPositive ? "⚠️" : "✅"}</div>
          <div>
            <div className="result-label">Prediction</div>
            <div className="result-value">{result.prediction}</div>

            <div className="model-info" style={{
              marginTop: 12,
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ color: 'var(--muted)', fontWeight: 600 }}>ML ENGINE: </span>
              <span style={{ color: 'var(--text)' }}>
                {result.disease?.toLowerCase() === 'brain' || result.disease?.toLowerCase() === 'lung'
                  ? 'ResNet50 (Deep CNN) architecture with ImageNet weights.'
                  : 'Random Forest Ensemble (200 Decision Trees) with balanced weights.'}
              </span>
            </div>

            <div style={{ marginTop: 8, fontSize: "0.8rem", color: isPositive ? "#fca5a5" : "#86efac" }}>
              {isPositive
                ? "Consult a specialist for further evaluation."
                : "No significant finding. Maintain regular check-ups."}
            </div>
          </div>
        </div>
      </div>

      <p className="disclaimer">
        ⚠️ AI-generated result for educational purposes only. Not a substitute for clinical judgement.
      </p>
    </div>
  );
}
