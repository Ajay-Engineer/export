import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const formatImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    const base = import.meta.env.MODE === 'production' ? 'https://rebecca-exim-api.herokuapp.com' : 'http://localhost:3001';
    return img.startsWith('/') ? `${base}${img}` : `${base}/${img}`;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = selectedCategory ? `/products/category/${selectedCategory}` : `/products`;
      const res = await axiosInstance.get(url);
      const data = res.data.products || res.data || [];
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axiosInstance.delete(`/products/${id}`);
        if (response.data.success) {
          alert('Product deleted successfully');
          await fetchProducts(); // Refresh the product list
        } else {
          throw new Error(response.data.error || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleSubmit = async (formData, isEdit = false) => {
    try {
      const url = isEdit ? `/products/${selectedProduct?._id}` : `/products`;
      const method = isEdit ? 'put' : 'post';
      const res = await axiosInstance({ method, url, data: formData, headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.status === 200 || res.status === 201) {
        await fetchProducts();
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedProduct(null);
      }
      return res;
    } catch (err) {
      console.error('Save failed', err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-64">
          <div className="bg-white rounded-lg shadow p-4">
            <nav className="space-y-2">
              <button onClick={() => navigate('/admin')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Dashboard</button>
              <button onClick={() => navigate('/admin/products')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Products</button>
              <button onClick={() => navigate('/admin/categories')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Categories</button>
              <button onClick={() => navigate('/admin/certificates')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Certificates</button>
              <button onClick={() => navigate('/admin/testimonials')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Testimonials</button>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded">
                <Plus className="w-4 h-4" /> Add Product
              </button>
              <div>
                <label className="block text-sm font-medium text-gray-700">Filter</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-2 border rounded-md min-w-[200px]">
                  <option value="">All Products</option>
                  {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <button onClick={() => fetchProducts()} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Refresh</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            {loading ? (
              <div className="text-center py-8">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">No products found</div>
            ) : (
              <>
                {/* Mobile cards */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {products.map((product) => (
                    <div key={product._id} className="p-4 border rounded-lg flex items-start gap-4">
                      <div className="w-20 h-20 flex-shrink-0">
                        {product.images?.[0] && (
                          <img src={formatImageUrl(product.images[0])} alt={product.title || product.name} className="w-full h-full object-cover rounded" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.title || product.name}</h3>
                        <p className="text-sm text-gray-600">{product.shortDescription}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button onClick={() => { setSelectedProduct(product); setShowEditModal(true); }} className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">Edit</button>
                          <button onClick={() => handleDelete(product._id)} className="px-2 py-1 rounded bg-red-100 text-red-700">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden md:block">
                  <table className="min-w-full w-full table-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Description</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td className="px-4 py-3">
                            {product.images && product.images[0] && (
                              <img src={formatImageUrl(product.images[0])} alt={product.title || product.name} className="w-12 h-12 object-cover rounded" />
                            )}
                          </td>
                          <td className="px-4 py-3">{product.title || product.name}</td>
                          <td className="px-4 py-3">{product.category}</td>
                          <td className="px-4 py-3">{product.shortDescription}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => { setSelectedProduct(product); setShowEditModal(true); }} className="text-yellow-600 hover:text-yellow-800 mr-3"><Pencil className="w-5 h-5" /></button>
                            <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowAddModal(false); setShowEditModal(false); setSelectedProduct(null); }} />
          <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{showEditModal ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); setSelectedProduct(null); }} className="p-2 text-gray-600 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
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
