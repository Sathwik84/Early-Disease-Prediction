import { useState, useEffect } from "react";
import DiseaseSelector from "../components/DiseaseSelector";
import InputUploader from "../components/InputUploader";
import PredictButton from "../components/PredictButton";
import ResultCard from "../components/ResultCard";
import ExplanationPanel from "../components/ExplanationPanel";
import ErrorCard from "../components/ErrorCard";

const DISEASE_ICONS = { brain: "🧠", lung: "🫁", heart: "❤️", diabetes: "💉" };

export default function Predict({ patients }) {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [disease, setDisease] = useState("");
  const [inputData, setInputData] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [lastScan, setLastScan] = useState(null);

  const selectedPatient = patients.find(p => String(p.id) === String(selectedPatientId));

  const resetPrediction = () => { setResult(null); setError(null); };

  // Fetch last scan when patient changes
  useEffect(() => {
    if (!selectedPatientId) { setLastScan(null); return; }
    fetch(`http://localhost:8000/predictions/${selectedPatientId}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0)
          setLastScan(data[data.length - 1]);
        else setLastScan(null);
      })
      .catch(() => setLastScan(null));
  }, [selectedPatientId]);

  return (
    <div>
      {/* PATIENT SELECTION */}
      <div className="card">
        <h2>🔮 Disease Prediction</h2>

        {patients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <p>Add patients in the <strong>Profile</strong> tab first.</p>
          </div>
        ) : (
          <>
            <div className="field">
              <div className="section-label">Select Patient</div>
              <select
                value={selectedPatientId}
                onChange={e => {
                  setSelectedPatientId(e.target.value);
                  setDisease("");
                  setInputData({});
                  resetPrediction();
                }}
              >
                <option value="">— Choose a patient —</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.patient_name} ({p.age} yrs, {p.gender})
                  </option>
                ))}
              </select>
            </div>

            {selectedPatient && (
              <div className="patient-preview-row">
                <div className="patient-avatar">{selectedPatient.patient_name[0]}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{selectedPatient.patient_name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                    {selectedPatient.age} years · {selectedPatient.gender}
                  </div>
                </div>

                {/* Last scan badge */}
                {lastScan && (
                  <div className="last-scan-badge">
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginBottom: 2 }}>
                      Last scan
                    </span>
                    <span>
                      {DISEASE_ICONS[lastScan.disease]} {lastScan.prediction} · {(lastScan.confidence * 100).toFixed(1)}%
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)", marginLeft: 6 }}>({lastScan.date})</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* CONFIGURE ANALYSIS */}
      {selectedPatientId && (
        <div className="card fade-in">
          <h2>⚙️ Configure Analysis</h2>
          <DiseaseSelector
            disease={disease}
            setDisease={val => { setDisease(val); setInputData({}); resetPrediction(); }}
          />

          {disease && (
            <>
              <hr />
              <InputUploader disease={disease} inputData={inputData} setInputData={setInputData} />
              <PredictButton
                disease={disease}
                inputData={inputData}
                patientId={selectedPatientId}
                setResult={setResult}
                setError={setError}
              />
            </>
          )}
        </div>
      )}

      {error && <ErrorCard error={error} onDismiss={resetPrediction} />}
      {result && <><ResultCard result={result} /><ExplanationPanel result={result} /></>}
    </div>
  );
}
