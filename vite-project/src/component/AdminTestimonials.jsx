import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import AdminBottomNav from './AdminBottomNav';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    country: '',
    quote: '',
    image: null
  });
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const { data } = await response.json();
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch testimonials');
      setTestimonials([]); // Set empty array on error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('companyName', formData.companyName);
    formDataObj.append('country', formData.country);
    formDataObj.append('quote', formData.quote);
    if (formData.image) {
      formDataObj.append('image', formData.image);
    }

    try {
      const url = editId 
        ? `/api/testimonials/${editId}`
        : '/api/testimonials';
      
      const method = editId ? 'PATCH' : 'POST';
      
      console.log('Submitting form data:', {
        url,
        method,
        formData: Object.fromEntries(formDataObj.entries())
      });
      
      const response = await fetch(url, {
        method,
        body: formDataObj,
        credentials: 'include',
        headers: {
          // Don't set Content-Type header when sending FormData
          // The browser will set it automatically with the correct boundary
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to save testimonial');
      }

      const result = await response.json();
      console.log('Testimonial saved successfully:', result);
      
      // Reset form
      setFormData({
        name: '',
        companyName: '',
        country: '',
        quote: '',
        image: null
      });
      setImagePreview('');
      setEditId(null);
      
      // Refresh testimonials list
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      // Here you can add UI feedback for the error, like a toast notification
      alert('Failed to save testimonial: ' + error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
        } else {
          setImagePreview('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete testimonial');
      }

      console.log('Testimonial deleted successfully');
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial: ' + error.message);
    }
  };

  const handleEdit = (testimonial) => {
    setFormData({
      name: testimonial.name,
      companyName: testimonial.companyName,
      country: testimonial.country,
      quote: testimonial.quote,
      image: null
    });
    if (testimonial.image) {
      setImagePreview(`http://localhost:3001${testimonial.image}`);
    }
    setEditId(testimonial._id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Testimonials</h1>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{editId ? 'Edit' : 'Add'} Testimonial</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quote</label>
            <textarea
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              className="w-full p-2 border rounded h-24"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
              accept="image/*"
              required={!editId}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editId ? 'Update' : 'Add'} Testimonial
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: '',
                    companyName: '',
                    country: '',
                    quote: '',
                    image: null
                  });
                  setImagePreview('');
                  setEditId(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className=" p-4 rounded-lg shadow flex gap-4">
            <img
              src={`http://localhost:3001${testimonial.image}`}
              alt={testimonial.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{testimonial.name}.{testimonial.companyName}</h3>
              <div className="text-gray-500 text-sm">
                {testimonial.companyName && <span>{testimonial.companyName}</span>}
                {testimonial.companyName && testimonial.country && <span> • </span>}
                {testimonial.country && <span>{testimonial.country}</span>}
              </div>
              <p className="text-gray-600 text-sm mt-1">{testimonial.quote}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Pencil className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial._id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-20"></div> {/* Add spacing for bottom nav */}
      <AdminBottomNav />
    </div>
  );
};

export default AdminTestimonials;
