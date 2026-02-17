import { useState } from "react";

export default function Profile({ user, patients, updatePatients }) {
  // ✅ ALL HOOKS MUST BE AT TOP
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: ""
  });

  // 🛡️ Safety: ensure array
  const safePatients = Array.isArray(patients) ? patients : [];

  // 🚫 AFTER hooks → conditional return is OK
  if (!user) {
    return <p>Please login again</p>;
  }

  // ➕ ADD PATIENT
  const addPatient = async () => {
    if (!form.name || !form.age || !form.gender) {
      alert("Fill all fields");
      return;
    }

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

      // 🔄 Reload patients
      const list = await fetch(
        `http://localhost:8000/patients/${user.user_id}`
      ).then(r => r.json());

      updatePatients(Array.isArray(list) ? list : []);
      setForm({ name: "", age: "", gender: "" });

    } catch (err) {
      console.error(err);
      alert("Failed to add patient");
    }
  };

  // ❌ DELETE PATIENT
  const deletePatient = async (id) => {
    if (!window.confirm("Delete patient?")) return;

    await fetch(`http://localhost:8000/patients/${id}`, {
      method: "DELETE"
    });

    const list = await fetch(
      `http://localhost:8000/patients/${user.user_id}`
    ).then(r => r.json());

    updatePatients(Array.isArray(list) ? list : []);
  };

  return (
    <div className="card">
      <h2>Profile</h2>

      <p><b>User:</b> {user.username}</p>

      <h3>Add Patient</h3>

      <input
        placeholder="Patient Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="number"
        placeholder="Age"
        value={form.age}
        onChange={e => setForm({ ...form, age: e.target.value })}
      />

      <select
        value={form.gender}
        onChange={e => setForm({ ...form, gender: e.target.value })}
      >
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <button onClick={addPatient}>Add Patient</button>

      <hr />

      <h3>Patients List</h3>

      {safePatients.length === 0 && <p>No patients added yet.</p>}

      <ul>
        {safePatients.map(p => (
          <li key={p.id}>
            {p.patient_name} ({p.age}, {p.gender})
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => deletePatient(p.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
