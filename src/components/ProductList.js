import React, { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [errors, setErrors] = useState({});

  const [page, setPage] = useState(1);
  const perPage = 5;

  const [showExport, setShowExport] = useState(false);

  const modalRef = useRef();

  const fetch = async () => {
    const res = await API.get(`/api/products/search?name=${search}`);
    setProducts(res.data);
    setPage(1);
  };

  useEffect(() => {
    fetch();
    const handleClickOutside = (e) => {
      if (
        showModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setShowModal(false);
        setEditingProduct(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  const validate = (data) => {
    let err = {};
    if (!data.name || !/^[A-Za-z0-9\s]+$/.test(data.name)) {
      err.name = "Name must contain only letters and numbers";
    }
    if (!data.description) {
      err.description = "Description is required";
    }
    if (!data.price || isNaN(formData.price.replace(/,/g, ""))) {
      err.price = "Price must be a valid number";
    }
    return err;
  };

  const formatPriceInput = (value) => {
    let num = value.replace(/,/g, "").replace(/[^\d]/g, "");
    if (!num) return "";
    return Number(num).toLocaleString();
  };

  const saveProduct = async () => {
    const err = validate(formData);
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price.replace(/,/g, "")),
    };

    try {
      if (editingProduct) {
        await API.put(`/api/products/${editingProduct.id}`, payload);
        toast.success("Product updated successfully");
      } else {
        await API.post("/api/products", payload);
        toast.success("Product added successfully");
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: "", description: "", price: "" });
      fetch();
    } catch (err) {
      toast.error("Failed to save product");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    await API.delete(`/api/products/${id}`);
    toast.success("Product deleted successfully");
    fetch();
  };

  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  const start = (page - 1) * perPage;
  const paginated = products.slice(start, start + perPage);

  const handleExport = (type) => {
    if (type === "csv" || type === "excel") {
      const ws = XLSX.utils.json_to_sheet(products);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Products");
      const fileName = `products.${type === "csv" ? "csv" : "xlsx"}`;
      XLSX.writeFile(wb, fileName);
    } else if (type === "pdf") {
      const doc = new jsPDF();
      let y = 10;
      doc.setFontSize(12);
      doc.text("Products", 14, y);
      y += 10;
      doc.text(
        ["ID", "Name", "Description", "Price"].join(" | "),
        14,
        y
      );
      y += 6;
      products.forEach((p) => {
        const line = [p.id, p.name, p.description, p.price.toLocaleString()].join(
          " | "
        );
        doc.text(line, 14, y);
        y += 6;
      });
      doc.save("products.pdf");
    }
    setShowExport(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
      <ToastContainer />

      {/* Toolbar */}
      <div className="flex justify-start gap-3 mb-6 relative">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-5 py-2 rounded-lg"
        >
          + Add Product
        </button>

        <div className="relative">
          <button
            onClick={() => setShowExport(!showExport)}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg"
          >
            Export Data
          </button>

          {showExport && (
            <div className="absolute top-full left-0 bg-white border rounded shadow mt-1 z-50 w-40">
              {["csv", "excel", "pdf"].map((t) => (
                <div
                  key={t}
                  onClick={() => handleExport(t)}
                  className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {t.toUpperCase()}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-5">
        <input
          className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetch()}
        />
        <button
          onClick={fetch}
          className="bg-blue-500 text-white px-4 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-left">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Description</th>
            <th className="p-3">Price</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-6 text-gray-400">
                No data
              </td>
            </tr>
          ) : (
            paginated.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.description}</td>
                <td className="p-3">${p.price.toLocaleString()}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setFormData({
                        name: p.name,
                        description: p.description,
                        price: p.price?.toString() || "",
                      });
                      setShowModal(true);
                    }}
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(p.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          disabled={page === 1 || products.length === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="flex items-center">{products.length === 0 ? 0 : page} / {products.length === 0 ? 0 : totalPages}</span>
        <button
          disabled={page === totalPages || products.length === 0}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div ref={modalRef} className="bg-white p-6 rounded-xl w-80">
            <h2 className="text-lg font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <input
              placeholder="Name"
              className="w-full mb-3 p-2 border rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && <div className="text-red-500 text-sm mb-2">{errors.name}</div>}

            <input
              placeholder="Description"
              className="w-full mb-3 p-2 border rounded"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            {errors.description && <div className="text-red-500 text-sm mb-2">{errors.description}</div>}

            <input
              placeholder="Price"
              className="w-full mb-3 p-2 border rounded"
              value={formatPriceInput(formData.price?.toString() || "")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: formatPriceInput(e.target.value),
                })
              }
            />
            {errors.price && <div className="text-red-500 text-sm mb-2">{errors.price}</div>}

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProduct(null);
                }}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveProduct}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;