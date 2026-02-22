export default function DiseaseSelector({ disease, setDisease }) {
  const options = [
    {
      id: "brain",
      emoji: "🧠",
      label: "Brain Tumor",
      sub: "MRI Image",
      engine: "ResNet50 Deep CNN",
      cls: "di-brain"
    },
    {
      id: "lung",
      emoji: "🫁",
      label: "Lung Disease",
      sub: "Chest X-ray",
      engine: "ResNet50 Deep CNN",
      cls: "di-lung"
    },
    {
      id: "heart",
      emoji: "❤️",
      label: "Heart Disease",
      sub: "Biomarker PDF",
      engine: "Random Forest Ensemble",
      cls: "di-heart"
    },
    {
      id: "diabetes",
      emoji: "💉",
      label: "Diabetes",
      sub: "Biomarker PDF",
      engine: "Random Forest Classifier",
      cls: "di-diabetes"
    }
  ];

  return (
    <div className="field">
      <div className="section-label">Select Disease Module</div>
      <div className="disease-grid">
        {options.map(opt => (
          <button
            key={opt.id}
            className={`disease-card${disease === opt.id ? " selected" : ""}`}
            onClick={() => setDisease(opt.id)}
          >
            <div className={`di ${opt.cls}`}>{opt.emoji}</div>
            <span>
              <div style={{ fontWeight: 700 }}>{opt.label}</div>
              <small style={{ display: 'block', marginBottom: '4px' }}>{opt.sub}</small>
              <div style={{
                fontSize: '0.68rem',
                color: 'var(--primary)',
                fontWeight: 600,
                opacity: 0.9
              }}>
                🤖 {opt.engine}
              </div>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
