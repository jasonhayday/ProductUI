import React, { useState } from "react";
import API from "../services/api";
import Toast from "./Toast";

function ProductForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [toast, setToast] = useState(null);

  const submit = async () => {
    await API.post("/products", {
      name,
      description,
      price: parseFloat(price),
    });

    setName("");
    setDescription("");
    setPrice("");

    setToast({ message: "Product added!", type: "success" });

    onSuccess();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-5 dark:text-white">
        Add Product
      </h2>

      <input
        className="w-full mb-3 p-3 border rounded-xl dark:bg-gray-700 dark:text-white"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full mb-3 p-3 border rounded-xl dark:bg-gray-700 dark:text-white"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="w-full mb-4 p-3 border rounded-xl dark:bg-gray-700 dark:text-white"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button
        onClick={submit}
        className="w-full bg-green-500 text-white p-3 rounded-xl"
      >
        Save
      </button>

      {toast && (
        <Toast {...toast} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

export default ProductForm;