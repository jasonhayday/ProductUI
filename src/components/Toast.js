import React, { useEffect } from "react";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, []);

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
  };

  return (
    <div className={`fixed top-5 right-5 px-5 py-3 text-white rounded-xl shadow-lg ${colors[type]}`}>
      {message}
    </div>
  );
}

export default Toast;