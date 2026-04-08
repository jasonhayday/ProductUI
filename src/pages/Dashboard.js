import React from "react";
import ProductList from "../components/ProductList";

function Dashboard({ onLogout, dark, setDark }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">
          Product Management
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <ProductList />
    </div>
  );
}

export default Dashboard;