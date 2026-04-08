import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return loggedIn ? (
    <Dashboard onLogout={logout} dark={dark} setDark={setDark} />
  ) : (
    <Login onLogin={() => setLoggedIn(true)} dark={dark} />
  );
}

export default App;