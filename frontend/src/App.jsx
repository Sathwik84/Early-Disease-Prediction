import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState("login");

  // 🔐 Load user once on app start
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // 🚪 Central logout (IMPORTANT)
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setAuthPage("login");
  };

  // 🔑 Not logged in → show auth pages
  if (!user) {
    return authPage === "login" ? (
      <Login setUser={setUser} setAuthPage={setAuthPage} />
    ) : (
      <Signup setAuthPage={setAuthPage} />
    );
  }

  // ✅ Logged in → dashboard
  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
    />
  );
}
