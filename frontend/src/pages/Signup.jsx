import { useState } from "react";

export default function Signup({ setAuthPage }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    const res = await fetch("http://localhost:8000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    if (res.ok) {
      alert("Account created");
      setAuthPage("login");
    } else {
      alert("Email already exists");
    }
  };

  return (
    <div className="center">
      <div className="card">
        <h2>Create Account</h2>

        <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

        <button onClick={signup}>Sign Up</button>

        <p className="link">
          Already have an account?{" "}
          <span onClick={() => setAuthPage("login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
