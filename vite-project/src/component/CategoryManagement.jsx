import React, { useState, useEffect } from 'react';
// Removed direct SQL client import. Use API calls only.
import { Loader2 } from 'lucide-react';
import axiosInstance from '../axios/axios.config';
import AdminBottomNav from './AdminBottomNav';
const API_URL = '/api/categories';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    path: '',
    icon: '',
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
        const res = await axiosInstance.get(API_URL);
        const data = res.data;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const validateCategory = (category) => {
    if (!category.name || !category.path) {
      setError('Name and path are required');
      return false;
    }
    // Convert to lowercase and remove special characters for path
    const validPath = category.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    return { ...category, path: validPath };
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const validatedCategory = validateCategory(newCategory);
    if (!validatedCategory) return;

    try {
      setLoading(true);
      setError('');
      await axiosInstance.post(API_URL, validatedCategory);
      setNewCategory({ name: '', path: '', icon: '', description: '' });
      await fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (categoryId, updatedData) => {
    const validatedCategory = validateCategory(updatedData);
    if (!validatedCategory) return;

    try {
      setLoading(true);
      setError('');
      await axiosInstance.put(`${API_URL}/${categoryId}`, validatedCategory);
      await fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryPath) => {
    if (!window.confirm('Are you sure you want to delete this category? This will delete all products in this category and remove it from the navigation.')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await axiosInstance.delete(`${API_URL}/${categoryId}`);
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Category Management</h1>

      {/* Add New Category Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="e.g., Organic Products"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Icon
            </label>
            <select
              value={newCategory.icon}
              onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="">Select an icon</option>
              <option value="Leaf">Leaf - Plants & Herbs</option>
              <option value="CakeSlice">Cake Slice - Food Products</option>
              <option value="Flower2">Flower - Natural Products</option>
              <option value="Coffee">Coffee - Beverages</option>
              <option value="HeartPulse">Heart Pulse - Health Products</option>
              <option value="Hand">Hand - Handicrafts</option>
              <option value="Egg">Egg - Dairy & Eggs</option>
              <option value="Apple">Apple - Fruits</option>
              <option value="Bike">Bike - Sports</option>
              <option value="Book">Book - Education</option>
              <option value="Box">Box - Packages</option>
              <option value="Briefcase">Briefcase - Business</option>
              <option value="Camera">Camera - Electronics</option>
              <option value="Car">Car - Automotive</option>
              <option value="Gem">Gem - Jewelry</option>
              <option value="Gift">Gift - Gifts</option>
              <option value="Globe">Globe - International</option>
              <option value="Heart">Heart - Health</option>
              <option value="Home">Home - Home Products</option>
              <option value="Music">Music - Entertainment</option>
              <option value="Palette">Palette - Arts</option>
              <option value="ShoppingBag">Shopping Bag - Retail</option>
              <option value="Star">Star - Featured</option>
              <option value="Sun">Sun - Energy</option>
              <option value="Truck">Truck - Shipping</option>
              <option value="Umbrella">Umbrella - Protection</option>
              <option value="Watch">Watch - Time</option>
              <option value="Zap">Zap - Electronics</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Choose an icon that best represents your category
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              rows={3}
              placeholder="Category description"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin mr-2" size={18} />
                Adding...
              </span>
            ) : (
              'Add Category'
            )}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{category.name}</h3>
                  <p className="text-gray-600">Path: /products/{category.path}</p>
                  <p className="text-gray-600">Icon: {category.icon}</p>
                  <p className="text-gray-600">{category.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const newName = prompt('Enter new name:', category.name);
                      if (newName) {
                        handleUpdateCategory(category.id, {
                          ...category,
                          name: newName,
                        });
                      }
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.path)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-20"></div>
      <AdminBottomNav />
    </div>
  );
}
