import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const fetched = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(fetched);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
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
        <button onClick={() => navigate("/admin/add")} className="bg-red-600 hover:bg-red-700">
          + Add Product
        </button>
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
                  <img src={prod.images?.[0]} alt={prod.title} className="w-16 h-16 object-cover rounded" />
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
    </div>
  );
};

export default AdminDashboard;
