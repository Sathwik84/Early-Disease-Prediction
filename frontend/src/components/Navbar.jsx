export default function Navbar({ setPage, theme, setTheme, logout }) {
  return (
    <nav className="navbar">
      <h2 className="logo">Medical AI Dashboard</h2>

      <div className="nav-actions">
        <button onClick={() => setPage("predict")}>Predict</button>
        <button onClick={() => setPage("analysis")}>Analysis</button>
        <button onClick={() => setPage("profile")}>Profile</button>

        {/* 🌗 THEME TOGGLE */}
        <button
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
        >
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
