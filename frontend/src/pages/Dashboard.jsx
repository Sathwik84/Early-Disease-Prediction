import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Overview from "./Overview";
import Profile from "./Profile";
import Analysis from "./Analysis";
import Predict from "./Predict";

export default function Dashboard({ user, onLogout }) {
  const [page, setPage] = useState("home");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("edp-theme") || "dark"
  );
  const [patients, setPatients] = useState([]);

  // Load patients after login
  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:8000/patients/${user.user_id}`)
      .then(res => res.json())
      .then(data => setPatients(Array.isArray(data) ? data : []))
      .catch(() => setPatients([]));
  }, [user]);

  // Persist & apply theme
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("edp-theme", theme);
  }, [theme]);

  return (
    <>
      <Navbar
        setPage={setPage}
        activePage={page}
        theme={theme}
        setTheme={setTheme}
        logout={onLogout}
      />

      <div className="content">
        {page === "home" && (
          <Overview
            user={user}
            patients={patients}
            setPage={setPage}
          />
        )}

        {page === "predict" && (
          <Predict
            patients={patients}
            updatePatients={setPatients}
            user={user}
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
