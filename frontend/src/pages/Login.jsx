import { useState } from "react";

export default function Login({ setUser, setAuthPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) { alert("Please fill all fields"); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Invalid credentials");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    } catch (err) {
      alert("Backend not reachable");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") login(); };

  return (
    <div className="center">
      <div className="auth-box">
        <div className="auth-header">
          <div className="auth-icon">🧬</div>
          <h2>Welcome back</h2>
          <p>Sign in to your MedicalAI account</p>
        </div>

        <div className="field">
          <label>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>

        <button onClick={login} disabled={loading}>
          {loading ? <><span className="spinner" /> Signing in…</> : "Sign In"}
        </button>

        <p className="auth-footer">
          Don't have an account?{" "}
          <span onClick={() => setAuthPage("signup")}>Create one</span>
        </p>
      </div>
    </div>
  );
}
