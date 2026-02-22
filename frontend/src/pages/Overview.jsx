import { useEffect, useState } from "react";

const DISEASE_ICONS = { brain: "🧠", lung: "🫁", heart: "❤️", diabetes: "💉" };
const GREET = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

export default function Overview({ user, patients, setPage }) {
    const [recentPredictions, setRecentPredictions] = useState([]);
    const [loadingRecent, setLoadingRecent] = useState(false);

    // Fetch last 3 predictions from each patient and merge
    useEffect(() => {
        if (!patients || patients.length === 0) { setRecentPredictions([]); return; }

        setLoadingRecent(true);
        Promise.all(
            patients.map(p =>
                fetch(`http://localhost:8000/predictions/${p.id}`)
                    .then(r => r.json())
                    .then(data =>
                        Array.isArray(data)
                            ? data.map(d => ({ ...d, patient_name: p.patient_name }))
                            : []
                    )
                    .catch(() => [])
            )
        ).then(results => {
            const all = results.flat().sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            );
            setRecentPredictions(all.slice(0, 8));
        }).finally(() => setLoadingRecent(false));
    }, [patients]);

    const totalPredictions = recentPredictions.length;
    const diseasesUsed = [...new Set(recentPredictions.map(p => p.disease))].length;

    return (
        <div>
            {/* Welcome Banner */}
            <div className="overview-banner">
                <div>
                    <div className="overview-greet">{GREET()}, {user?.username} 👋</div>
                    <div className="overview-sub">
                        Here's your MedicalAI dashboard — {patients.length} patient{patients.length !== 1 ? "s" : ""} registered.
                    </div>
                </div>
                <div className="overview-banner-icon">🧬</div>
            </div>

            {/* Stats Strip */}
            <div className="stats-strip">
                <div className="stat-box">
                    <div className="stat-value">{patients.length}</div>
                    <div className="stat-label">Patients</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value">{totalPredictions}</div>
                    <div className="stat-label">Scans</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value">{diseasesUsed}</div>
                    <div className="stat-label">Modules Used</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="overview-actions">
                <div className="quick-action-card" onClick={() => setPage("predict")}>
                    <div className="qa-icon">🔮</div>
                    <div className="qa-label">New Prediction</div>
                    <div className="qa-sub">Run ML diagnosis for a patient</div>
                </div>
                <div className="quick-action-card" onClick={() => setPage("analysis")}>
                    <div className="qa-icon">📊</div>
                    <div className="qa-label">View Analysis</div>
                    <div className="qa-sub">Charts and prediction history</div>
                </div>
                <div className="quick-action-card" onClick={() => setPage("profile")}>
                    <div className="qa-icon">👤</div>
                    <div className="qa-label">Manage Patients</div>
                    <div className="qa-sub">Add or remove patient records</div>
                </div>
            </div>

            {/* Recent Predictions */}
            <div className="card">
                <h2>🕐 Recent Scans</h2>

                {loadingRecent && (
                    <div style={{ textAlign: "center", padding: 20 }}>
                        <span className="spinner" style={{ margin: "0 auto", display: "block" }} />
                    </div>
                )}

                {!loadingRecent && recentPredictions.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <p>No predictions yet. <span
                            style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 600 }}
                            onClick={() => setPage("predict")}
                        >Run your first scan →</span></p>
                    </div>
                )}

                {!loadingRecent && recentPredictions.length > 0 && (
                    <div style={{ overflowX: "auto" }}>
                        <table className="bio-table">
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Module</th>
                                    <th>Result</th>
                                    <th>Confidence</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPredictions.map((p, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 600 }}>{p.patient_name}</td>
                                        <td>
                                            <span className="badge" style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}>
                                                {DISEASE_ICONS[p.disease] || "🔬"} {p.disease?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>{p.prediction}</td>
                                        <td>{(p.confidence * 100).toFixed(1)}%</td>
                                        <td style={{ color: "var(--muted)" }}>{p.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modules Overview */}
            <div className="card">
                <h2>🔬 Available Modules</h2>
                <div className="module-grid">
                    {[
                        { icon: "🧠", name: "Brain MRI", desc: "Glioma · Meningioma · Pituitary · No Tumor", engine: "ResNet50 CNN", key: "brain" },
                        { icon: "🫁", name: "Chest X-ray", desc: "Pneumonia Detection", engine: "ResNet50 CNN", key: "lung" },
                        { icon: "❤️", name: "Heart Disease", desc: "Cardiovascular risk from biomarkers", engine: "Random Forest", key: "heart" },
                        { icon: "💉", name: "Diabetes", desc: "Type-2 risk from blood panel", engine: "Random Forest", key: "diabetes" },
                    ].map(m => (
                        <div key={m.key} className={`module-card module-${m.key}`} onClick={() => setPage("predict")}>
                            <div className="module-icon">{m.icon}</div>
                            <div className="module-name">{m.name}</div>
                            <div className="module-desc">{m.desc}</div>
                            <div className="module-engine" style={{
                                marginTop: '10px',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                color: 'var(--primary)',
                                borderTop: '1px solid var(--border)',
                                paddingTop: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                🤖 Engine: {m.engine}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
