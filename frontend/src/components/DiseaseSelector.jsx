export default function DiseaseSelector({ disease, setDisease }) {
  return (
    <div className="field">
      <label>Select Disease</label>
      <select value={disease} onChange={e => setDisease(e.target.value)}>
        <option value="">-- Select --</option>
        <option value="lung">Lung Disease (Chest X-ray)</option>
        <option value="brain">Brain Disease (MRI)</option>
        <option value="heart">Heart Disease (Biomarkers)</option>
        <option value="diabetes">Diabetes (Biomarkers)</option>
      </select>
    </div>
  );
}
