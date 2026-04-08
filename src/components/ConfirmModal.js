import React from "react";

function ConfirmModal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-80">
        <h2 className="text-lg font-bold mb-4 dark:text-white">
          Confirm Delete
        </h2>

        <p className="mb-5 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this product?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;