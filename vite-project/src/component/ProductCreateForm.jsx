import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axios.config";
import axios from 'axios';

const categories = [
  { name: "Herbal Extract Products", value: "herbal" },
  { name: "Palm Jaggery Products", value: "palm-jaggery" },
  { name: "Coir Products", value: "coir" },
  { name: "Tea Varieties", value: "tea" },
  { name: "Health Mix", value: "health-mix" },
  { name: "Handicrafts", value: "handicraft" },
  { name: "Egg Products", value: "egg" },
];

/** @type {React.FC<{ label: string }>} */
const RequiredLabel = ({ label }) => (
  <label className="block font-medium mb-1">
    {label} <span className="text-red-600">*</span>
  </label>
);

const initialForm = {
  title: "",
  slug: "",
  category: "",
  visibility: "public",
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
  certifications: [
    { src: "", alt: "GST", file: undefined },
    { src: "", alt: "FSSAI", file: undefined },
    { src: "", alt: "Export License", file: undefined }
  ],
  faqs: [{ q: "", a: "" }],
  related: [{ title: "", image: "", link: "" }]
};

/** @type {React.FC<{ isEdit?: boolean, product?: any, onSubmit?: Function, onClose?: Function }>} */
const ProductCreateForm = function({ isEdit = false, product = null, onSubmit, onClose }) {
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
        // Use the admin route to fetch all products
        const response = await axiosInstance.get('/products/admin');
        console.log('Products response:', response.data);
        
        // Handle different response formats
        let productsArray = [];
        if (Array.isArray(response.data)) {
          productsArray = response.data;
        } else if (response.data.products && Array.isArray(response.data.products)) {
          productsArray = response.data.products;
        } else if (response.data.success && Array.isArray(response.data.products)) {
          productsArray = response.data.products;
        }
        
        setProducts(productsArray);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Error fetching products. Please try again.');
        setProducts([]);
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
    setImageFiles(prev => {
      const filteredFiles = prev.filter(f => f !== undefined);
      if (filteredFiles.length >= 4 && file) {
        alert('Maximum 4 images allowed');
        return prev;
      }

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
    if (imageFiles.filter(f => f !== undefined).length >= 4) {
      alert('Maximum 4 images allowed');
      return;
    }
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

const uploadCertificate = async (file) => {
    try {
      console.log('Preparing to upload certificate:', file.name);
      
      // Validate file size before upload
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds 5MB limit. Please compress the image or choose a smaller file.`);
      }

      // Ensure file type is correct
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      const certFormData = new FormData();
      certFormData.append('file', file);
      
      // Upload to cloudinary through our backend
      const response = await axiosInstance.post('/certificates/upload', certFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 120000, // 2 minute timeout for larger files
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      });

      if (!response.data.url) {
        throw new Error('Upload successful but no URL returned');
      }

      console.log('Certificate uploaded successfully:', response.data);
      return response.data.url;
    } catch (error) {
      console.error('Error uploading certificate:', error);
      if (error.response?.status === 404) {
        throw new Error('Certificate upload service is not available. Please contact support.');
      } else if (error.response?.status === 413) {
        throw new Error('File is too large. Please upload a smaller file.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timed out. Please try again with a smaller file or better connection.');
      }
      throw new Error(`Failed to upload certificate: ${error.response?.data?.message || error.message}`);
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      const requiredFields = ['title', 'slug', 'category', 'shortDescription', 'description'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Create FormData
      const formDataToSend = new FormData();

      // Handle certificates first
      const processedCerts = [];
      if (formData.certifications && Array.isArray(formData.certifications)) {
        for (const cert of formData.certifications) {
          if (cert.file instanceof File) {
            const url = await uploadCertificate(cert.file);
            processedCerts.push({
              alt: cert.alt,
              src: url
            });
          } else if (cert.src) {
            processedCerts.push({
              alt: cert.alt,
              src: cert.src
            });
          }
        }
      }

      // Add certificates to form data
      formDataToSend.append('certificates', JSON.stringify(processedCerts));

      // Handle images
      const existingImages = imageFiles.filter(file => 
        typeof file === 'string' && file.includes('cloudinary')
      );
      const newImages = imageFiles.filter(file => file instanceof File);

      formDataToSend.append('existingImages', JSON.stringify(existingImages));
      newImages.forEach(file => {
        formDataToSend.append('images', file);
      });

      // Add other fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('specifications', JSON.stringify(formData.specifications));
      formDataToSend.append('benefits', JSON.stringify(formData.benefits));
      if (formData.videoUrl) formDataToSend.append('videoUrl', formData.videoUrl);
      if (formData.datasheetUrl) formDataToSend.append('datasheetUrl', formData.datasheetUrl);

      // Submit to server
      const result = await axiosInstance[editId ? 'put' : 'post'](
        editId ? `/products/${editId}` : '/products',
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (result.data.success) {
        setProducts(prev => 
          editId 
            ? prev.map(p => p._id === editId ? result.data.product : p)
            : [...prev, result.data.product]
        );

        setFormData(initialForm);
        setImageFiles([undefined]);
        setEditId(null);
        alert(editId ? 'Product updated successfully!' : 'Product created successfully!');
      } else {
        throw new Error(result.data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit product: pre-fill form
  const handleEdit = async (prod) => {
    try {
      console.log('Editing product:', prod);
      
      // Create formatted data with all necessary fields
      const formattedData = {
        title: prod.title || '',
        slug: prod.slug || '',
        category: prod.category || '',
        shortDescription: prod.shortDescription || '',
        description: prod.description || '',
        videoUrl: prod.videoUrl || '',
        datasheetUrl: prod.datasheetUrl || '',
        benefits: Array.isArray(prod.benefits) ? prod.benefits : [],
        specifications: prod.specifications || initialForm.specifications,
        packaging: Array.isArray(prod.packaging) ? prod.packaging : [],
        certifications: Array.isArray(prod.certifications) 
          ? prod.certifications.map(cert => ({
              alt: cert.alt || '',
              src: cert.src || cert.url || '', // Try both src and url fields
              file: undefined
            }))
          : initialForm.certifications,
        faqs: Array.isArray(prod.faqs) ? prod.faqs : [],
        related: Array.isArray(prod.related) ? prod.related : [],
      };

      console.log('Formatted data:', formattedData);

      // Handle existing images
      if (prod.images && Array.isArray(prod.images)) {
        const existingImages = prod.images.map(img => typeof img === 'string' ? img : undefined);
        setImageFiles(existingImages.length > 0 ? existingImages : [undefined]);
      } else {
        setImageFiles([undefined]);
      }

      // Set form data and edit ID
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
            <RequiredLabel label="Visibility" />
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="public">Public - Visible to all</option>
              <option value="tea-only">Tea Category Only</option>
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
                    name="images"
                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                    className="hidden"
                    id={`image-input-${index}`}
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
                                onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                              />
                              <span className="text-sm text-gray-600">{file.name}</span>
                            </>
                          ) : (
                            <>
                              <img 
                                src={file} 
                                alt="Existing" 
                                className="h-24 object-contain mr-2"
                                onError={(e) => {
                                  console.error('Image load error:', e);
                                  e.target.src = 'placeholder.jpg';
                                }}
                              />
                              <span className="text-sm text-gray-600">
                                {typeof file === 'string' ? 'Current image (click to change)' : 'Click to upload'}
                              </span>
                            </>
                          )}
                        </div>
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
                      {cert.alt} Certificate
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        name="certificateFiles"
                        className="hidden"
                        id={`cert-${index}`}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const updatedCert = {
                              ...formData.certifications[index],
                              file: file,
                              src: URL.createObjectURL(file),
                            };
                            const updatedCerts = [...formData.certifications];
                            updatedCerts[index] = updatedCert;
                            setFormData(prev => ({
                              ...prev,
                              certifications: updatedCerts
                            }));
                          }
                        }}
                      />
                      <label
                        htmlFor={`cert-${index}`}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        {cert.file || cert.url ? 'Change' : 'Upload'} {cert.alt} Certificate
                      </label>
                      {(cert.file || cert.url) && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Certificate uploaded
                        </div>
                      )}
                      {cert.src && (
                        <div className="flex items-center mt-2">
                          <img
                            src={cert.src}
                            alt={cert.alt}
                            className="h-24 object-contain mr-2"
                          />
                          <span className="text-sm text-gray-600">
                            {cert.alt || "Click to change"}
                          </span>
                        </div>
                      )}
                    </div>
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
          <div>
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

      {/* Product List for Edit/Delete */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">All Products</h3>
          <div className="text-sm text-gray-500">{Array.isArray(products) ? products.length : 0} products</div>
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
                {Array.isArray(products) && products.map((prod) => (
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
                {(!Array.isArray(products) || products.length === 0) && (
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
}

ProductCreateForm.propTypes = {
  isEdit: PropTypes.bool,
  product: PropTypes.object,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
};

export default ProductCreateForm;