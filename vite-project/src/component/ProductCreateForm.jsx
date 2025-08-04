
import React, { useState, useEffect } from "react";
import { productService } from "../firebase/services/productService";

const productCategories = [
  { name: "Herbal Extract Products", value: "herbal" },
  { name: "Palm Jaggery Products", value: "palm-jaggery" },
  { name: "Coir Products", value: "coir" },
  { name: "Tea Varieties", value: "tea" },
  { name: "Health Mix", value: "health-mix" },
  { name: "Handicrafts", value: "handicraft" },
  { name: "Egg Products", value: "egg" },
];

const RequiredLabel = ({ label }) => (
  <label className="block font-medium mb-1">
    {label} <span className="text-red-600">*</span>
  </label>
);


const initialForm = {
  title: "",
  slug: "",
  category: "",
  shortDescription: "",
  description: "",
  videoUrl: "",
  datasheetUrl: "",
  benefits: [{ title: "", description: "" }],
  specifications: {
    "Botanical Source": "",
    Form: "",
    Color: "",
    Moisture: "",
    "Ash Content": "",
    "Shelf Life": "",
    pH: "",
    MOQ: "",
  },
  packaging: [{ title: "", content: "" }],
  certifications: [{ src: "", alt: "" }],
  faqs: [{ q: "", a: "" }],
  related: [{ title: "", image: "", link: "" }],
};

const ProductCreateForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState([null]);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all products for edit/delete
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await productService.getAllProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, file) => {
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);
  };

  const addImageField = () => {
    setImageFiles((prev) => [...prev, null]);
  };

  const removeImageField = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    const updated = [...formData[arrayName]];
    updated[index][field] = value;
    setFormData({ ...formData, [arrayName]: updated });
  };

  const addArrayItem = (arrayName, defaultItem) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItem],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imagesToUpload = imageFiles.filter(Boolean);
      const productData = { ...formData, images: imagesToUpload };
      if (editId) {
        await productService.updateProduct(editId, productData, formData.category);
        alert("Product updated successfully!");
      } else {
        await productService.addProduct(productData, formData.category);
        alert("Product created successfully!");
      }
      setFormData(initialForm);
      setImageFiles([null]);
      setEditId(null);
      // Refresh product list
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      alert("Error: " + (err.message || err));
    }
    setLoading(false);
  };

  // Edit product: pre-fill form
  const handleEdit = (prod) => {
    setFormData({ ...prod, images: undefined });
    setImageFiles(prod.images ? prod.images.map(() => null) : [null]);
    setEditId(prod.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      if (editId === id) {
        setFormData(initialForm);
        setImageFiles([null]);
        setEditId(null);
      }
    } catch (err) {
      alert("Error deleting: " + (err.message || err));
    }
    setLoading(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6 bg-white rounded-xl shadow max-w-4xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-red-600 mb-4">{editId ? "Edit Product" : "Create Product"}</h2>

        {/* Basic Inputs */}
        {["title", "slug", "shortDescription", "description"].map((field) => (
          <div key={field}>
            <RequiredLabel label={field.replace(/([A-Z])/g, " $1")} />
            <input
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        ))}

        {/* Category Dropdown */}
        <div>
          <RequiredLabel label="Category" />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {productCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Video and Datasheet URLs */}
        {["videoUrl", "datasheetUrl"].map((field) => (
          <div key={field}>
            <label className="block font-medium mb-1 capitalize">{field}</label>
            <input
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}

        {/* Dynamic Image Upload */}
        <div>
          <RequiredLabel label="Upload Images" />
          {imageFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, e.target.files[0])}
                className="border p-2 rounded w-full"
                required={!file && !editId}
              />
              {imageFiles.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="text-blue-600 text-sm"
          >
            + Add another image
          </button>
        </div>

        {/* Specifications */}
        {Object.entries(formData.specifications).map(([key, val]) => (
          <div key={key}>
            <RequiredLabel label={key} />
            <input
              value={val}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specifications: {
                    ...prev.specifications,
                    [key]: e.target.value,
                  },
                }))
              }
              className="w-full border p-2 rounded"
              required
            />
          </div>
        ))}

        {/* Dynamic Sections: benefits, packaging, certifications, faqs, related */}
        {["benefits", "packaging", "certifications", "faqs", "related"].map((section) => (
          <div key={section} className="space-y-2">
            <label className="block font-semibold text-lg capitalize">{section}</label>
            {formData[section].map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(item).map(([key, val]) => (
                  <input
                    key={key}
                    placeholder={key}
                    value={val}
                    onChange={(e) =>
                      handleArrayChange(section, idx, key, e.target.value)
                    }
                    className="border p-2 rounded"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => removeArrayItem(section, idx)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addArrayItem(
                  section,
                  Object.fromEntries(Object.keys(formData[section][0]).map((k) => [k, ""]))
                )
              }
              className="text-blue-600 text-sm"
            >
              + Add more
            </button>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          disabled={loading}
        >
          {editId ? "Update Product" : "Create Product"}
        </button>
        {editId && (
          <button
            type="button"
            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded mt-2"
            onClick={() => {
              setFormData(initialForm);
              setImageFiles([null]);
              setEditId(null);
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Product List for Edit/Delete */}
      <div className="max-w-4xl mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">All Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">Title</th>
                <th className="px-2 py-1 border">Category</th>
                <th className="px-2 py-1 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} className="border-t">
                  <td className="px-2 py-1 border">{prod.title}</td>
                  <td className="px-2 py-1 border">{prod.category}</td>
                  <td className="px-2 py-1 border flex gap-2">
                    <button
                      className="text-blue-600 underline"
                      onClick={() => handleEdit(prod)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 underline"
                      onClick={() => handleDelete(prod.id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProductCreateForm;
