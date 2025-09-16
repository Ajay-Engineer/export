import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios/axios.config';

const API_URL = '/certificates';

import AdminBottomNav from './AdminBottomNav';

const AdminCertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [form, setForm] = useState({ title: '', image: null });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_URL);
      const { success, data } = res.data;
      if (!success || !Array.isArray(data)) {
        throw new Error('Invalid response format');
      }
      setCertificates(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
      setError('Failed to load certificates. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    if (!form.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!editingId && !form.image) {
      setError('Image is required for new certificates');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      if (form.image) {
        // Validate file type
        if (!form.image.type.startsWith('image/')) {
          setError('Please select a valid image file');
          setLoading(false);
          return;
        }
        // Validate file size (5MB)
        if (form.image.size > 5 * 1024 * 1024) {
          setError('Image size must be less than 5MB');
          setLoading(false);
          return;
        }
        formData.append('image', form.image);
      }

      let url = `${API_URL}/add`;
      if (editingId) {
        url = `${API_URL}/edit/${editingId}`;
      }

      const response = editingId
        ? await axiosInstance.put(url, formData)
        : await axiosInstance.post(url, formData);

      const data = response.data;

      if (!data.success) {
        throw new Error(data.error || 'Failed to save certificate');
      }

      // Reset form and refresh certificates
      setForm({ title: '', image: null });
      setEditingId(null);
      await fetchCertificates(); // Refresh the list
    } catch (error) {
      console.error('Error saving certificate:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save certificate. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cert) => {
    setForm({ title: cert.title, image: null });
    setEditingId(cert._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.delete(`${API_URL}/delete/${id}`);

      const data = response.data;

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete certificate');
      }

      await fetchCertificates(); // Refresh the list
      setError(''); // Clear any existing errors
    } catch (error) {
      console.error('Error deleting certificate:', error);
      setError('Failed to delete certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Certificate Management</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Certificate Title"
            className={`border p-2 w-full rounded ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            required
            disabled={loading}
          />
        </div>
        <div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className={`border p-2 w-full rounded ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            required={!editingId}
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Accepts JPG, PNG, GIF up to 5MB
          </p>
        </div>
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {editingId ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            `${editingId ? 'Update' : 'Add'} Certificate`
          )}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setEditingId(null); setForm({ title: '', image: null }); }}
            className={`ml-2 px-4 py-2 rounded text-white ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-400 hover:bg-gray-500'}`}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </form>
      <div>
        {loading ? (
          <p>Loading certificates...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <div key={cert._id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                {cert.image && (
                  <div className="aspect-w-3 aspect-h-2 mb-4">
                    <img
                      src={cert.image || '/placeholder-certificate.png'}
                      alt={cert.title}
                      className="w-full h-48 object-contain rounded bg-gray-50"
                      onError={(e) => {
                        console.error('Image load error for:', cert.image);
                        (e.target instanceof HTMLImageElement) && (e.target.src = '/placeholder-certificate.png');
                      }}
                    />
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-3 text-center">{cert.title}</h3>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(cert)}
                    className={`px-3 py-1 rounded transition-colors text-white ${loading ? 'bg-yellow-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDelete(cert._id)}
                    className={`px-3 py-1 rounded transition-colors text-white ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="h-20"></div> {/* Add spacing for bottom nav */}
      <AdminBottomNav />
    </div>
  );
};

export default AdminCertificate;
