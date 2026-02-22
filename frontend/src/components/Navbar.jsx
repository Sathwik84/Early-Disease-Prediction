export default function Navbar({ setPage, theme, setTheme, logout, activePage }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="logo-icon">🧬</div>
        MedicalAI
      </div>

      <div className="nav-actions">
        <button
          className={`nav-btn ${activePage === "home" ? "active" : ""}`}
          onClick={() => setPage("home")}
        >
          🏠 Home
        </button>
        <button
          className={`nav-btn ${activePage === "predict" ? "active" : ""}`}
          onClick={() => setPage("predict")}
        >
          🔮 Predict
        </button>
        <button
          className={`nav-btn ${activePage === "analysis" ? "active" : ""}`}
          onClick={() => setPage("analysis")}
        >
          📊 Analysis
        </button>
        <button
          className={`nav-btn ${activePage === "profile" ? "active" : ""}`}
          onClick={() => setPage("profile")}
        >
          👤 Profile
        </button>

        <button
          className="nav-btn theme-btn"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <button className="nav-btn logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
