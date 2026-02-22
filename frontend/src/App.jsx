import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { ToastProvider } from "./components/Toast";
import "./styles.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState("login");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setAuthPage("login");
  };

  return (
    <ToastProvider>
      {!user ? (
        authPage === "login"
          ? <Login setUser={setUser} setAuthPage={setAuthPage} />
          : <Signup setAuthPage={setAuthPage} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </ToastProvider>
  );
}
