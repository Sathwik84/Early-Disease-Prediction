import { useState } from "react";
import DiseaseSelector from "../components/DiseaseSelector";
import InputUploader from "../components/InputUploader";
import PredictButton from "../components/PredictButton";
import ResultCard from "../components/ResultCard";
import ExplanationPanel from "../components/ExplanationPanel";

export default function Predict({ patients }) {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [disease, setDisease] = useState("");
  const [inputData, setInputData] = useState({});
  const [result, setResult] = useState(null);

  return (
    <div className="card">
      <h2>Predict Disease</h2>

      {patients.length === 0 && (
        <p>Add patients in Profile first.</p>
      )}

      {patients.length > 0 && (
        <>
          <label>Select Patient</label>
          <select
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
          >
            <option value="">-- Select Patient --</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.patient_name}
              </option>
            ))}
          </select>
        </>
      )}

      <hr />

      {selectedPatientId && (
        <>
          <DiseaseSelector
            disease={disease}
            setDisease={setDisease}
          />

          <InputUploader
            disease={disease}
            inputData={inputData}
            setInputData={setInputData}
          />

          <PredictButton
            disease={disease}
            inputData={inputData}
            patientId={selectedPatientId}
            setResult={setResult}
          />

          {result && (
            <>
              <ResultCard result={result} />
              <ExplanationPanel result={result} />
            </>
          )}
        </>
      )}
    </div>
  );
}
