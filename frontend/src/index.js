import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";   // 🔥 FIX HERE
import "./styles.css";

document.body.classList.add("light");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
