import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Eye, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../axios/axios.config';
import AdminBottomNav from './AdminBottomNav';
import ProductCreateForm from './ProductCreateForm';

const categories = [
  { value: "", label: "All Products" },
  { value: "herbal", label: "Herbal Extract Products" },
  { value: "palm-jaggery", label: "Palm Jaggery Products" },
  { value: "coir", label: "Coir Products" },
  { value: "tea", label: "Tea Varieties" },
  { value: "health-mix", label: "Health Mix" },
  { value: "handicraft", label: "Handicrafts" },
  { value: "egg", label: "Egg Products" },
];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = selectedCategory 
        ? `/products/category/${selectedCategory}`
        : `/products`;
      const response = await axiosInstance.get(url);
      setProducts(response.data.products || response.data || []); // Handle both response formats
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]); // Re-fetch when category changes

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(`${API_URL}/products/${id}`);
        // After successful deletion, refresh the product list
        await fetchProducts();
        if (response.status !== 200) throw new Error('Failed to delete product');
        alert('Product deleted successfully');
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleSubmit = async (formData, isEdit = false) => {
    try {
      const url = isEdit 
        ? `${API_URL}/products/${selectedProduct._id}`
        : `${API_URL}/products`;
      
      const response = await axios({
        method: isEdit ? 'PUT' : 'POST',
        url: url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status !== 201 && response.status !== 200) {
        throw new Error('Failed to save product');
      }
      
      alert(isEdit ? 'Product updated successfully' : 'Product created successfully');
      await fetchProducts();
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product: ' + error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]); // Re-fetch when category changes

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2">
          <button 
            onClick={() => setShowAddModal(true)} 
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </button>
          <button onClick={() => navigate("/admin/certificates")} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">Manage Certificates</button>
          <button onClick={() => navigate("/admin/testimonials")} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">Manage Testimonials</button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-md min-w-[200px]"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">Loading products...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No products found</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.images && product.images[0] && (
                      <img 
                        src={`http://localhost:3001${product.images[0]}`}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'placeholder-image-url';
                        }}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4">{product.title}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.shortDescription}</td>
                  <td className="px-6 py-4">{product.description?.substring(0, 50)}...</td>
                  <td className="px-6 py-4 space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowViewModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowEditModal(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <ProductCreateForm
          isEdit={showEditModal}
          product={selectedProduct}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* View Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedProduct.title}</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Category</h3>
                  <p>{selectedProduct.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Price</h3>
                  <p>₹{selectedProduct.price}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Stock</h3>
                  <p>{selectedProduct.stock}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p>{selectedProduct.description}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Images</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.images.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:3001${image}`}
                      alt={`${selectedProduct.title} ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-20"></div>
      <AdminBottomNav />
    </div>
  );
};

export default AdminDashboard;
