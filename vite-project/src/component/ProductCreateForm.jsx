import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axios.config";
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
  certifications: [{ src: "", alt: "", file: undefined }],
  faqs: [{ q: "", a: "" }],
  related: [{ title: "", image: "", link: "" }],
};

const ProductCreateForm = ({ isEdit = false, product = null, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState([undefined]);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    const baseUrl = import.meta.env.MODE === 'production'
      ? 'https://rebecca-exim-api.herokuapp.com'
      : 'http://localhost:3001';
    return img.startsWith('/') ? `${baseUrl}${img}` : `${baseUrl}/${img}`;
  };

  // Fetch all products for edit/delete
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Error fetching products. Please try again.");
      }
    };
    fetchProducts();
  }, []);

  // If the component is used for edit and a product is passed, prefill the form
  useEffect(() => {
    if (isEdit && product) {
      const formatted = { ...product };
      // Ensure certifications shape
      if (!formatted.certifications || !Array.isArray(formatted.certifications)) {
        formatted.certifications = [{ src: "", alt: "", file: null }];
      } else {
        formatted.certifications = formatted.certifications.map((c) => ({
          ...c,
          file: null,
          src: c.src ? formatImageUrl(c.src) : c.src,
        }));
      }

      // Prefill images as absolute URLs for preview
      if (formatted.images && formatted.images.length > 0) {
        setImageFiles(formatted.images.map((img) => formatImageUrl(img)));
      } else {
        setImageFiles([null]);
      }

      // Fill the form excluding images (handled separately)
      const { images, ...rest } = formatted;
      setFormData((prev) => ({ ...prev, ...rest }));
      setEditId(product._id || null);
    }
  }, [isEdit, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup image previews
      imageFiles.forEach((file) => {
        if (file instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(file));
        }
      });
      // Cleanup certificate previews
      formData.certifications.forEach((cert) => {
        if (cert.src && cert.src.startsWith("blob:")) {
          URL.revokeObjectURL(cert.src);
        }
      });
    };
  }, [imageFiles, formData.certifications]);

  const handleImageChange = (index, file) => {
    setImageFiles((prev) => {
      const newFiles = [...prev];
      // If there's an existing file at this index and it's a File object,
      // revoke its object URL to prevent memory leaks
      if (newFiles[index] instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(newFiles[index]));
      }
      newFiles[index] = file;
      return newFiles;
    });
  };

  const addImageField = () => {
    setImageFiles((prev) => [...prev, undefined]);
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
      
      // Log attempt to create product
      console.log("Attempting to create product...");
      // Log the entire form data for debugging
      console.log("Full form data:", {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        shortDescription: formData.shortDescription,
        description: formData.description,
      });

      // Validate required fields are not empty
      const requiredFields = [
        "title",
        "slug",
        "category",
        "shortDescription",
        "description",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        throw new Error(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
      }

      // Append all fields directly (not as nested object)
      formDataToSend.append("title", formData.title || "");
      formDataToSend.append("category", formData.category || "");
      formDataToSend.append(
        "shortDescription",
        formData.shortDescription || ""
      );
      formDataToSend.append("description", formData.description || "");

      // Append additional fields
      if (formData.specifications) {
        formDataToSend.append(
          "specifications",
          JSON.stringify(formData.specifications)
        );
      }
      if (formData.benefits) {
        formDataToSend.append("features", JSON.stringify(formData.benefits));
      }
      if (formData.videoUrl) {
        formDataToSend.append("videoUrl", formData.videoUrl);
      }
      if (formData.datasheetUrl) {
        formDataToSend.append("datasheetUrl", formData.datasheetUrl);
      }

      // Handle certificate uploads
      const certificationsData = [];
      formData.certifications.forEach((cert, index) => {
        if (cert.file instanceof File) {
          // This is a new file upload
          formDataToSend.append(`certificateFile_${index}`, cert.file);
          certificationsData.push({
            alt: cert.alt,
            index: index,
            isNew: true,
          });
        } else if (cert.src) {
          // This is an existing certificate
          certificationsData.push({
            alt: cert.alt,
            src: cert.src,
            index: index,
            isNew: false,
          });
        }
      });

      formDataToSend.append(
        "certificationsData",
        JSON.stringify(certificationsData)
      );

      // Append image files
      imageFiles.forEach((file, index) => {
        if (file instanceof File) {
          // This is a new file upload
          formDataToSend.append("images", file);
        }
      });

      // Log the final FormData content
      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      let result;
      if (typeof onSubmit === "function") {
        // Delegate submission to parent (AdminDashboard)
        result = await onSubmit(formDataToSend, !!editId);
      } else {
        if (editId) {
          result = await axiosInstance.put(
            `/products/${editId}`,
            formDataToSend,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          // Update form with response data
          if (result.data.product) {
            if (result.data.product.images) {
              setImageFiles(result.data.product.images);
            }
            if (result.data.product.certifications) {
              setFormData((prev) => ({
                ...prev,
                certifications: result.data.product.certifications.map((cert) => ({
                  ...cert,
                  file: null,
                })),
              }));
            }
          }
          alert("Product updated successfully!");
        } else {
          result = await axiosInstance.post("/products", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("Server response:", result.data);
        }
      }

      setFormData(initialForm);
      setImageFiles([undefined]);
      setEditId(null);

      // Refresh product list locally
      try {
        const productsResponse = await axiosInstance.get("/products");
        setProducts(productsResponse.data);
      } catch {}

      // close parent modal if provided
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error("Error submitting form:", err);

      // Log detailed information about the error
      if (err.response) {
        console.log("Response status:", err.response.status);
        console.log("Response data:", err.response.data);
        console.log("Response headers:", err.response.headers);
      }

      // Log form data for debugging
      console.log("Form data structure:");
      try {
        for (let [key, value] of formDataToSend.entries()) {
          if (value instanceof File) {
            console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
          } else if (typeof value === "string" && value.startsWith("{")) {
            try {
              console.log(`${key}:`, JSON.parse(value));
            } catch {
              console.log(`${key}:`, value);
            }
          } else {
            console.log(`${key}:`, value);
          }
        }
      } catch (error) {
        console.log("Error logging form data:", error);
      }

      const errorMessage = err.response?.data?.error || err.message || "An unexpected error occurred";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Edit product: pre-fill form
  const handleEdit = async (prod) => {
    try {
      const response = await axiosInstance.get(`/products/${prod._id}`);
      const productData = response.data;
      const formattedData = {
        ...productData,
        images: undefined, // Remove images from form data as we handle it separately
      };

      // Set existing images in the imageFiles state
      if (productData.images && productData.images.length > 0) {
        setImageFiles(productData.images);
      } else {
        setImageFiles([null]);
      }

      // Set the form data
      setFormData(formattedData);
      setEditId(prod._id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error fetching product details:", err);
      alert("Error fetching product details. Please try again.");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    setLoading(true);
    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      if (editId === id) {
        setFormData(initialForm);
        setImageFiles([null]);
        setEditId(null);
      }
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
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
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {editId ? "Edit Product" : "Create New Product"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the information below to{" "}
            {editId ? "update the" : "create a new"} product
          </p>
        </div>

        {/* Basic Information Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Basic Information
          </h3>
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
                      onChange={(e) =>
                        handleImageChange(index, e.target.files[0])
                      }
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
                          <div className="flex items-center">
                            {file instanceof File ? (
                              <>
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt="Preview"
                                  className="h-24 object-contain mr-2"
                                  onLoad={(e) =>
                                    URL.revokeObjectURL(e.target.src)
                                  }
                                />
                                <span className="text-sm text-gray-600">
                                  {file.name}
                                </span>
                              </>
                            ) : (
                              <>
                                <img
                                  src={file}
                                  alt="Existing"
                                  className="h-24 object-contain mr-2"
                                />
                                <span className="text-sm text-gray-600">
                                  Current image
                                </span>
                              </>
                            )}
                          </div>
                        ) : (
                          <>
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
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
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
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
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Another Image
              </button>
            </div>
          </div>
          {/* Close Media Section div */}
        </div>

        {/* Certificates Section */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Certificates
          </h3>
          <div className="space-y-4">
            {formData.certifications.map((cert, index) => (
              <div
                key={index}
                className="relative p-4 bg-white rounded-md shadow-sm border border-gray-200"
              >
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certificate Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const updatedCert = {
                            ...formData.certifications[index],
                            file: file,
                            src: URL.createObjectURL(file), // Create preview URL
                          };
                          const updatedCerts = [...formData.certifications];
                          updatedCerts[index] = updatedCert;
                          setFormData((prev) => ({
                            ...prev,
                            certifications: updatedCerts,
                          }));
                        }
                      }}
                      className="hidden"
                      id={`cert-input-${index}`}
                    />
                    <label
                      htmlFor={`cert-input-${index}`}
                      className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-500 focus:outline-none"
                    >
                      {cert.src ? (
                        <div className="flex items-center">
                          <img
                            src={cert.src}
                            alt={cert.alt}
                            className="h-24 object-contain mr-2"
                          />
                          <span className="text-sm text-gray-600">
                            {cert.alt || "Click to change"}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <span className="text-sm text-gray-500">
                            Upload Certificate Image
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certificate Description
                    </label>
                    <input
                      type="text"
                      value={cert.alt}
                      onChange={(e) =>
                        handleArrayChange(
                          "certifications",
                          index,
                          "alt",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter certificate description"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem("certifications", index)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 focus:outline-none"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addArrayItem("certifications", { src: "", alt: "", file: null })
              }
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Certificate
            </button>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Product Specifications
          </h3>
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
        {["benefits", "packaging", "certifications", "faqs", "related"].map(
          (section) => (
            <div key={section} className="mt-8 bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 capitalize">
                  {section}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem(
                      section,
                      Object.fromEntries(
                        Object.keys(formData[section][0]).map((k) => [k, ""])
                      )
                    )
                  }
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add {section.slice(0, -1)}
                </button>
              </div>
              <div className="space-y-4">
                {formData[section].map((item, idx) => (
                  <div
                    key={idx}
                    className="relative p-4 bg-white rounded-md shadow-sm border border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(item).map(([key, val]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                            {key}
                          </label>
                          <input
                            placeholder={`Enter ${key.toLowerCase()}`}
                            value={val || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                section,
                                idx,
                                key,
                                e.target.value
                              )
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
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            className={`flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              loading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {editId ? "Updating..." : "Creating..."}
              </>
            ) : editId ? (
              "Update Product"
            ) : (
              "Create Product"
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
    </>
  );
};

export default ProductCreateForm;
