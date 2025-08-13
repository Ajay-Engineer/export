import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminBottomNav from './AdminBottomNav';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();


  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    setProducts(data);
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        alert('Failed to delete product');
        return;
      }
      fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2">
          <button onClick={() => navigate("/admin/products/add")} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white">+ Add Product</button>
          <button onClick={() => navigate("/admin/certificates")} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">Manage Certificates</button>
          <button onClick={() => navigate("/admin/testimonials")} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">Manage Testimonials</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              <th className="p-2">Category</th>
              <th className="p-2">Slug</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} className="border-b">
                <td className="p-2">
                  <img src={prod.images?.[0]} alt={prod.title} className="w-full max-w-[4rem] h-auto object-cover rounded mx-auto" />
                </td>
                <td className="p-2 font-medium">{prod.title}</td>
                <td className="p-2">{prod.category}</td>
                <td className="p-2">{prod.slug}</td>
                <td className="p-2 space-x-2">
                  <button variant="outline" size="icon" onClick={() => navigate(`/product/${prod.slug}`)}>
                    <Eye className="w-4 h-4" />
                  </button>
                  <button variant="outline" size="icon" onClick={() => navigate(`/admin/edit/${prod.id}`)}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button variant="destructive" size="icon" onClick={() => handleDelete(prod.id)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-20"></div> {/* Add spacing for bottom nav */}
      <AdminBottomNav />
    </div>
  );
};

export default AdminDashboard;
