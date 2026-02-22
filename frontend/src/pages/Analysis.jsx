import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const COLORS = {
  heart: "#ef4444",
  diabetes: "#22c55e",
  brain: "#818cf8",
  lung: "#f97316"
};

const CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: "#94a3b8",
        font: { family: "Inter", size: 12 }
      }
    },
    tooltip: {
      backgroundColor: "rgba(15,23,42,0.95)",
      titleColor: "#e2e8f0",
      bodyColor: "#94a3b8",
      borderColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
      callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw?.toFixed(1)}%` }
    }
  },
  scales: {
    y: {
      min: 0, max: 100,
      ticks: { color: "#64748b", callback: v => `${v}%` },
      grid: { color: "rgba(255,255,255,0.06)" }
    },
    x: {
      ticks: { color: "#64748b" },
      grid: { color: "rgba(255,255,255,0.06)" }
    }
  }
};

export default function Analysis({ patients }) {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const exportCSV = () => {
    if (predictions.length === 0) return;
    const header = ["Patient ID", "Module", "Result", "Confidence (%)", "Date"];
    const rows = predictions.map(p => [
      selectedPatientId,
      p.disease?.toUpperCase(),
      p.prediction,
      (p.confidence * 100).toFixed(1),
      p.date
    ]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `predictions_patient_${selectedPatientId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!selectedPatientId) { setPredictions([]); return; }
    setLoading(true);
    fetch(`http://localhost:8000/predictions/${selectedPatientId}`)
      .then(res => res.json())
      .then(data => setPredictions(Array.isArray(data) ? data : []))
      .catch(() => setPredictions([]))
      .finally(() => setLoading(false));
  }, [selectedPatientId]);

  if (!patients || patients.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>No patients found. Add patients first in the Profile section.</p>
        </div>
      </div>
    );
  }

  const dates = [...new Set(predictions.map(p => p.date))];

  const grouped = {};
  predictions.forEach(p => {
    if (!grouped[p.disease]) grouped[p.disease] = {};
    grouped[p.disease][p.date] = p.confidence * 100;
  });

  const datasets = Object.keys(grouped).map(disease => ({
    label: disease.toUpperCase(),
    data: dates.map(d => grouped[disease][d] ?? null),
    borderColor: COLORS[disease] || "#818cf8",
    backgroundColor: (COLORS[disease] || "#818cf8") + "22",
    borderWidth: 2.5,
    tension: 0.4,
    pointRadius: 5,
    pointHoverRadius: 7,
    fill: true
  }));

  // Stats computed from predictions
  const diseasesCovered = [...new Set(predictions.map(p => p.disease))];
  const lastDate = predictions.length ? predictions[predictions.length - 1].date : "—";

  return (
    <div>
      <div className="card">
        <h2>📊 Patient Analysis</h2>
        <div className="field">
          <div className="section-label">Select Patient</div>
          <select
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
          >
            <option value="">— Select a patient —</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.patient_name}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <span className="spinner" style={{ margin: "0 auto", display: "block" }} />
          </div>
        )}

        {!loading && selectedPatientId && predictions.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No prediction history for this patient yet.</p>
          </div>
        )}
      </div>

      {predictions.length > 0 && (
        <>
          {/* ── Stats Strip ── */}
          <div className="stats-strip fade-in">
            <div className="stat-box">
              <div className="stat-value">{predictions.length}</div>
              <div className="stat-label">Total Predictions</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{diseasesCovered.length}</div>
              <div className="stat-label">Modules Used</div>
            </div>
            <div className="stat-box">
              <div className="stat-value" style={{ fontSize: "1.1rem" }}>{lastDate}</div>
              <div className="stat-label">Last Scan Date</div>
            </div>
          </div>

          {/* ── Confidence Trend ── */}
          <div className="card">
            <h3>📈 Confidence Trend</h3>
            <div className="chart-wrap">
              <Line data={{ labels: dates, datasets }} options={CHART_OPTIONS} />
            </div>
          </div>

          {/* ── Prediction History Table ── */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>📋 Prediction History</h3>
              <button className="copy-btn" onClick={exportCSV} title="Download as CSV">⬇️ Export CSV</button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="bio-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Result</th>
                    <th>Confidence</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((p, i) => (
                    <tr key={i}>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: (COLORS[p.disease] || "#818cf8") + "22",
                            color: COLORS[p.disease] || "#818cf8"
                          }}
                        >
                          {p.disease.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{p.prediction}</td>
                      <td>{(p.confidence * 100).toFixed(1)}%</td>
                      <td style={{ color: "var(--muted)" }}>{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
