import React, { useState } from "react";
import API from "../services/api";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      const res = await API.post("api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 w-full max-w-sm p-8 rounded-2xl shadow-lg">
        
        <h2 className="text-2xl font-bold text-center mb-2 dark:text-white">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Login to continue
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <input
          className="w-full mb-3 p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;