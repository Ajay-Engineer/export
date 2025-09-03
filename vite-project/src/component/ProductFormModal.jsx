import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ProductFormModal = ({ isEdit, product, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    stock: '',
    features: [],
    specifications: {},
    images: []
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && product) {
      setForm({
        title: product.title,
        description: product.description,
        category: product.category,
        subcategory: product.subcategory || '',
        price: product.price,
        stock: product.stock,
        features: product.features || [],
        specifications: product.specifications || {},
        images: product.images || []
      });
      setImagePreview(product.images.map(img => `http://localhost:3001${img}`));
    }
  }, [isEdit, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm(prev => ({
      ...prev,
      images: files
    }));

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...form.features];
    newFeatures[index] = value;
    setForm(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setForm(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('subcategory', form.subcategory);
      formData.append('price', form.price);
      formData.append('stock', form.stock);
      formData.append('features', JSON.stringify(form.features));
      formData.append('specifications', JSON.stringify(form.specifications));

      // Append images
      if (form.images.length > 0) {
        form.images.forEach(image => {
          formData.append('images', image);
        });
      }

      await onSubmit(formData, isEdit);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{isEdit ? 'Edit' : 'Add'} Product</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="health-mix">Health Mix</option>
                <option value="egg">Egg Products</option>
                <option value="handicraft">Handicrafts</option>
                <option value="decor-items">Decor Items</option>
                <option value="home-textile">Home Textile</option>
                <option value="bamboo-products">Bamboo Products</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subcategory</label>
              <input
                type="text"
                name="subcategory"
                value={form.subcategory}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Features</label>
              {form.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="px-2 py-1 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                + Add Feature
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <input
                type="file"
                onChange={handleImageChange}
                multiple
                accept="image/*"
                className="mt-1 block w-full"
                required={!isEdit}
              />
              {imagePreview.length > 0 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {imagePreview.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
