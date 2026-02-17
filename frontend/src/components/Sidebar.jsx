export default function Sidebar({ setPage }) {
  const logout = () => {
    // 🔴 CLEAR AUTH DATA
    localStorage.removeItem("user");
    // 🔁 Reload app to reset state
    window.location.reload();
  };

  return (
    <div className="sidebar">
      <button onClick={() => setPage("predict")}>Predict</button>
      <button onClick={() => setPage("analysis")}>Analysis</button>
      <button onClick={() => setPage("profile")}>Profile</button>

      <hr />

      <button onClick={logout}>Logout</button>
    </div>
  );
}
