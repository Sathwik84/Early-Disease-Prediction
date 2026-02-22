import { useState } from "react";
import { useToast } from "../components/Toast";

export default function Profile({ user, patients, updatePatients }) {
  const [form, setForm] = useState({ name: "", age: "", gender: "" });
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const toast = useToast();

  const safePatients = Array.isArray(patients) ? patients : [];
  const filteredPatients = search.trim()
    ? safePatients.filter(p =>
      p.patient_name.toLowerCase().includes(search.toLowerCase())
    )
    : safePatients;

  if (!user) return <p style={{ color: "var(--muted)", padding: "24px" }}>Please login again.</p>;

  const addPatient = async () => {
    if (!form.name || !form.age || !form.gender) {
      toast.warning("Please fill in all patient details.");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("http://localhost:8000/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          patient_name: form.name,
          age: Number(form.age),
          gender: form.gender
        })
      });
      if (!res.ok) throw new Error("Add failed");
      const list = await fetch(`http://localhost:8000/patients/${user.user_id}`).then(r => r.json());
      updatePatients(Array.isArray(list) ? list : []);
      setForm({ name: "", age: "", gender: "" });
      toast.success(`Patient "${form.name}" added successfully.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add patient. Check your connection.");
    } finally {
      setAdding(false);
    }
  };

  const deletePatient = async (id, name) => {
    try {
      await fetch(`http://localhost:8000/patients/${id}`, { method: "DELETE" });
      const list = await fetch(`http://localhost:8000/patients/${user.user_id}`).then(r => r.json());
      updatePatients(Array.isArray(list) ? list : []);
      toast.info(`Patient "${name}" removed.`);
    } catch {
      toast.error("Failed to delete patient.");
    }
  };

  return (
    <div>
      {/* User Info */}
      <div className="card profile-header-card">
        <div className="profile-avatar-large">{user.username?.[0]?.toUpperCase()}</div>
        <div>
          <div className="profile-username">{user.username}</div>
          <div className="profile-email">{user.email}</div>
          <div className="profile-badge">
            <span className="badge badge-primary">
              {safePatients.length} Patient{safePatients.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Add Patient */}
      <div className="card">
        <h2>➕ Add New Patient</h2>
        <div className="field">
          <label>Patient Name</label>
          <input
            placeholder="e.g. John Doe"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="field">
            <label>Age</label>
            <input
              type="number"
              min="1" max="130"
              placeholder="25"
              value={form.age}
              onChange={e => setForm({ ...form, age: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Gender</label>
            <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <button onClick={addPatient} disabled={adding} style={{ marginTop: 8 }}>
          {adding ? <><span className="spinner" /> Adding…</> : "➕ Add Patient"}
        </button>
      </div>

      {/* Patient List */}
      <div className="card">
        <h2>🏥 Registered Patients
          <span className="badge badge-primary" style={{ marginLeft: 8, fontSize: "0.8rem" }}>
            {safePatients.length}
          </span>
        </h2>

        {/* Search */}
        {safePatients.length > 0 && (
          <div className="field" style={{ marginBottom: 16 }}>
            <input
              className="search-input"
              placeholder="🔍 Search patients…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        )}

        {filteredPatients.length === 0 && safePatients.length > 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>No patients match "{search}".</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🧑‍⚕️</div>
            <p>No patients registered yet. Add one above to get started.</p>
          </div>
        ) : (
          <div className="patient-list">
            {filteredPatients.map(p => (
              <div className="patient-item" key={p.id}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="patient-avatar">{p.patient_name[0]}</div>
                  <div className="patient-info">
                    <div className="pname">{p.patient_name}</div>
                    <div className="pmeta">{p.age} years · {p.gender}</div>
                  </div>
                </div>
                <button
                  className="btn-sm btn-danger"
                  onClick={() => deletePatient(p.id, p.patient_name)}
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
