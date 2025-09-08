import React, { useEffect, useState } from "react";
import { productService } from "../firebase/services/productService";


const productCategories = [
  { name: "All", value: "" },
  { name: "Herbal Extract Products", value: "herbal" },
  { name: "Palm Jaggery Products", value: "palm-jaggery" },
  { name: "Coir Products", value: "coir" },
  { name: "Tea Varieties", value: "tea" },
  { name: "Health Mix", value: "health-mix" },
  { name: "Handicrafts", value: "handicraft" },
  { name: "Egg Products", value: "egg" },
];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let data = await productService.getAllProducts();
      if (selectedCategory) {
        data = data.filter((p) => p.category === selectedCategory);
      }
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [selectedCategory]);

  // Edit, update, view handlers
  const handleEdit = (prod) => setEditProduct(prod);
  const handleView = (prod) => setViewProduct(prod);
  const handleUpdate = async (updated) => {
    setLoading(true);
    await productService.updateProduct(updated.id, updated);
    setEditProduct(null);
    // Refresh
    let data = await productService.getAllProducts();
    if (selectedCategory) {
      data = data.filter((p) => p.category === selectedCategory);
    }
    setProducts(data);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      <div className="mb-4">
        <label className="font-semibold mr-2">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          {productCategories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.name}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div>Loading products...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Images</th>
                <th className="px-4 py-2 border">Created</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} className="border-t">
                  <td className="px-4 py-2 border">{prod.title}</td>
                  <td className="px-4 py-2 border">{prod.category}</td>
                  <td className="px-4 py-2 border">
                    {prod.images && prod.images.length > 0 && (
                      <img src={prod.images[0]} alt={prod.title} className="w-full max-w-[3rem] h-auto object-cover rounded mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-2 border text-xs">{prod.createdAt ? new Date(prod.createdAt).toLocaleString() : ""}</td>
                  <td className="px-4 py-2 border flex gap-2">
                    <button className="text-blue-600 underline" onClick={() => handleView(prod)}>View</button>
                    <button className="text-green-600 underline" onClick={() => handleEdit(prod)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setViewProduct(null)}>&times;</button>
            <h2 className="text-2xl font-bold mb-2">{viewProduct.title}</h2>
            <div className="mb-2">Category: {viewProduct.category}</div>
            <div className="mb-2">Description: {viewProduct.description}</div>
            {viewProduct.images && viewProduct.images.length > 0 && (
              <img src={viewProduct.images[0]} alt={viewProduct.title} className="w-full max-w-xs h-auto object-cover rounded mb-2 mx-auto" />
            )}
            <div className="text-xs text-gray-500">Created: {viewProduct.createdAt ? new Date(viewProduct.createdAt).toLocaleString() : ""}</div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editProduct && (
        <EditProductModal product={editProduct} onClose={() => setEditProduct(null)} onSave={handleUpdate} />
      )}
    </div>
  );
};

// Edit Modal Component
const EditProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState(product);
  const [saving, setSaving] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose} type="button">&times;</button>
        <h2 className="text-2xl font-bold mb-2">Edit Product</h2>
        <div className="mb-2">
          <label className="block font-medium mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-1">Category</label>
          <input name="category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-2">
          <label className="block font-medium mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
      </form>
    </div>
  );
};

export default AdminDashboard;

