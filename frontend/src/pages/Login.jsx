import { useState } from "react";

export default function Login({ setUser, setAuthPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
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

      // ✅ USE localStorage (MATCH App.js)
      localStorage.setItem("user", JSON.stringify(data));

      // ✅ UPDATE APP STATE
      setUser(data);

    } catch (err) {
      alert("Backend not reachable");
      console.error(err);
    }
  };

  return (
    <div className="center">
      <div className="card">
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

        <p className="link">
          Don’t have an account?{" "}
          <span onClick={() => setAuthPage("signup")}>
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
