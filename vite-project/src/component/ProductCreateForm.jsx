
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';
const categories = [
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
  const navigate = useNavigate();

  // Fetch all products for edit/delete
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Error fetching products. Please try again.');
      }
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
      // Create FormData instance
      const formDataToSend = new FormData();
      
      // Log the entire form data for debugging
      console.log('Full form data:', {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        shortDescription: formData.shortDescription,
        description: formData.description
      });

      // Add all form fields to FormData
      formDataToSend.append('title', formData.title || '');
      formDataToSend.append('slug', formData.slug || '');
      formDataToSend.append('category', formData.category || '');
      formDataToSend.append('shortDescription', formData.shortDescription || '');
      formDataToSend.append('description', formData.description || '');
      
      // Validate required fields are not empty
      const requiredFields = ['title', 'slug', 'category', 'shortDescription', 'description'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }
      
      // Add remaining fields that are objects
      ['specifications', 'benefits', 'packaging', 'certifications', 'faqs', 'related'].forEach(field => {
        if (formData[field]) {
          formDataToSend.append(field, JSON.stringify(formData[field]));
        }
      });
      
      // Append image files
      imageFiles.forEach((file, index) => {
        if (file) {
          formDataToSend.append('images', file);
        }
      });

      // Log the final FormData content
      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      if (editId) {
        await axios.put(`${API_URL}/products/${editId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Product updated successfully!");
      } else {
        console.log('Sending POST request to:', `${API_URL}/products`);
        const response = await axios.post(`${API_URL}/products`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Server response:', response.data);
        alert("Product created successfully!");
      }

      setFormData(initialForm);
      setImageFiles([null]);
      setEditId(null);
      
      // Refresh product list
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
      
    } catch (err) {
      console.error('Error:', err);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  // Edit product: pre-fill form
  const handleEdit = async (prod) => {
    try {
      const response = await axios.get(`${API_URL}/products/${prod._id}`);
      const productData = response.data;
      setFormData({ 
        ...productData,
        images: undefined 
      });
      setImageFiles(productData.images ? [...productData.images.map(() => null)] : [null]);
      setEditId(prod._id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error('Error fetching product details:', err);
      alert('Error fetching product details. Please try again.');
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      if (editId === id) {
        setFormData(initialForm);
        setImageFiles([null]);
        setEditId(null);
      }
      alert('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert("Error deleting: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 p-8 bg-white rounded-xl shadow-lg max-w-4xl mx-auto mb-8"
      >
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {editId ? "Edit Product" : "Create New Product"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the information below to {editId ? 'update the' : 'create a new'} product
          </p>
        </div>

        {/* Basic Information Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {["title", "slug"].map((field) => (
              <div key={field}>
                <RequiredLabel label={field.replace(/([A-Z])/g, " $1")} />
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder={`Enter product ${field}`}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <RequiredLabel label="Category" />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <RequiredLabel label="Short Description" />
            <input
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="Brief description of the product"
            />
          </div>

          <div className="mt-4">
            <RequiredLabel label="Full Description" />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              rows={4}
              placeholder="Detailed description of the product"
            />
          </div>
        </div>

        {/* Media Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Media</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {["videoUrl", "datasheetUrl"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace("Url", "")} URL
                </label>
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter ${field.replace("Url", "")} URL`}
                />
              </div>
            ))}
          </div>

        {/* Image Upload Section */}
        <div className="mt-6">
          <RequiredLabel label="Product Images" />
          <div className="space-y-4">
            {imageFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                    className="hidden"
                    id={`image-input-${index}`}
                    required={!file && !editId}
                  />
                  <label
                    htmlFor={`image-input-${index}`}
                    className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-500 focus:outline-none"
                  >
                    <span className="flex items-center space-x-2">
                      {file ? (
                        <div className="text-sm text-gray-600">{file.name}</div>
                      ) : (
                        <>
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-sm text-gray-500">
                            Click to upload image {index + 1}
                          </span>
                        </>
                      )}
                    </span>
                  </label>
                </div>
                {imageFiles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Image
            </button>
          </div>
        </div>
        {/* Close Media Section div */}
        </div>

        {/* Specifications Section */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(formData.specifications).map(([key, val]) => (
              <div key={key} className="relative">
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
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter ${key.toLowerCase()}`}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Sections */}
        {["benefits", "packaging", "certifications", "faqs", "related"].map((section) => (
          <div key={section} className="mt-8 bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 capitalize">{section}</h3>
              <button
                type="button"
                onClick={() =>
                  addArrayItem(
                    section,
                    Object.fromEntries(Object.keys(formData[section][0]).map((k) => [k, ""]))
                  )
                }
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add {section.slice(0, -1)}
              </button>
            </div>
            <div className="space-y-4">
              {formData[section].map((item, idx) => (
                <div key={idx} className="relative p-4 bg-white rounded-md shadow-sm border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(item).map(([key, val]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {key}
                        </label>
                        <input
                          placeholder={`Enter ${key.toLowerCase()}`}
                          value={val}
                          onChange={(e) =>
                            handleArrayChange(section, idx, key, e.target.value)
                          }
                          className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeArrayItem(section, idx)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            className={`flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                {editId ? "Updating..." : "Creating..."}
              </>
            ) : (
              editId ? "Update Product" : "Create Product"
            )}
          </button>
          {editId && (
            <button
              type="button"
              className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              onClick={() => {
                setFormData(initialForm);
                setImageFiles([null]);
                setEditId(null);
              }}
              disabled={loading}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Product List for Edit/Delete */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">All Products</h3>
          <div className="text-sm text-gray-500">{products.length} products</div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{prod.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {prod.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 disabled:opacity-50"
                        onClick={() => handleEdit(prod)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 transition-colors duration-200 disabled:opacity-50"
                        onClick={() => handleDelete(prod._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCreateForm;
