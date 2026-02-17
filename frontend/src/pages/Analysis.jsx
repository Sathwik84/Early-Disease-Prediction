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

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const COLORS = {
  heart: "#ef4444",
  diabetes: "#22c55e",
  brain: "#3b82f6",
  lung: "#f97316"
};

export default function Analysis({ patients }) {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [predictions, setPredictions] = useState([]);

  // 🔥 ALWAYS FETCH WHEN patient changes
  useEffect(() => {
    if (!selectedPatientId) {
      setPredictions([]);
      return;
    }

    fetch(`http://localhost:8000/predictions/${selectedPatientId}`)
      .then(res => res.json())
      .then(data => {
        console.log("PREDICTIONS FROM API:", data); // 🔴 DEBUG LINE
        setPredictions(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Prediction fetch error:", err);
        setPredictions([]);
      });
  }, [selectedPatientId]);

  if (!patients || patients.length === 0) {
    return <p>No patients found.</p>;
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
    borderColor: COLORS[disease],
    borderWidth: 3,
    tension: 0.4,
    pointRadius: 5
  }));

  return (
    <div className="card">
      <h2>Patient Analysis</h2>

      <select
        value={selectedPatientId}
        onChange={e => setSelectedPatientId(e.target.value)}
      >
        <option value="">Select Patient</option>
        {patients.map(p => (
          <option key={p.id} value={p.id}>
            {p.patient_name}
          </option>
        ))}
      </select>

      <br /><br />

      {predictions.length === 0 && selectedPatientId && (
        <p>No prediction history found.</p>
      )}

      {predictions.length > 0 && (
        <>
          <Line
            data={{ labels: dates, datasets }}
            options={{ scales: { y: { min: 0, max: 100 } } }}
          />

          <h3>Prediction History</h3>
          <table width="100%" border="1">
            <thead>
              <tr>
                <th>Disease</th>
                <th>Result</th>
                <th>Confidence (%)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p, i) => (
                <tr key={i}>
                  <td>{p.disease.toUpperCase()}</td>
                  <td>{p.prediction}</td>
                  <td>{(p.confidence * 100).toFixed(2)}%</td>
                  <td>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
