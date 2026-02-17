import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Profile from "./Profile";
import Analysis from "./Analysis";
import Predict from "./Predict";

export default function Dashboard({ user, onLogout }) {
  const [page, setPage] = useState("predict");
  const [theme, setTheme] = useState("light");
  const [patients, setPatients] = useState([]);

  // 🔄 Load patients after login
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8000/patients/${user.user_id}`)
      .then(res => res.json())
      .then(data => setPatients(Array.isArray(data) ? data : []))
      .catch(() => setPatients([]));
  }, [user]);

  // 🌗 Apply theme safely
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <>
      <Navbar
        setPage={setPage}
        theme={theme}
        setTheme={setTheme}
        logout={onLogout}   // ✅ clean logout
      />

      <div className="content">
        {page === "predict" && (
          <Predict
            patients={patients}
            updatePatients={setPatients}
          />
        )}

        {page === "analysis" && (
          <Analysis patients={patients} />
        )}

        {page === "profile" && (
          <Profile
            user={user}
            patients={patients}
            updatePatients={setPatients}
          />
        )}
      </div>
    </>
  );
}
