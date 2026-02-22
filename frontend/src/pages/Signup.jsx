import { useState } from "react";

export default function Signup({ setAuthPage }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (!username || !email || !password) { alert("Please fill all fields"); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      if (res.ok) {
        alert("Account created! Please sign in.");
        setAuthPage("login");
      } else {
        alert("Email already exists");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <div className="auth-box">
        <div className="auth-header">
          <div className="auth-icon">✨</div>
          <h2>Create account</h2>
          <p>Join MedicalAI to get started</p>
        </div>

        <div className="field">
          <label>Username</label>
          <input
            placeholder="Dr. Smith"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button onClick={signup} disabled={loading}>
          {loading ? <><span className="spinner" /> Creating account…</> : "Create Account"}
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => setAuthPage("login")}>Sign in</span>
        </p>
      </div>
    </div>
  );
}
