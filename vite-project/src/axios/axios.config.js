import axios from 'axios';

const BASE_URL = import.meta.env.PROD 
  ? 'https://rebecca-backendfinal.el.r.appspot.com/api'
  : 'http://192.168.29.17:3000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  maxContentLength: Infinity,
  maxBodyLength: Infinity
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching for GET requests
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }

    // Remove Content-Type for FormData requests
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse = {
      message: 'An error occurred',
      status: error.response?.status || 500,
      data: error.response?.data || null,
      url: error.config?.url || 'unknown endpoint'
    };

    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          errorResponse.message = 'Unauthorized access';
          // Redirect to login if needed
          if (window.location.pathname.startsWith('/management')) {
            window.location.href = '/management/login';
          }
          break;
        case 403:
          errorResponse.message = 'Access forbidden';
          break;
        case 404:
          errorResponse.message = 'Resource not found';
          break;
        case 429:
          errorResponse.message = 'Too many requests, please try again later';
          break;
        case 500:
          errorResponse.message = 'Server error, please try again later';
          break;
        default:
          errorResponse.message = error.response.data?.message || 'An error occurred';
      }
    } else if (error.request) {
      // Network error
      errorResponse.message = 'Network error, please check your connection';
    }

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        endpoint: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: errorResponse.message
      });
    }

    return Promise.reject(errorResponse);
  }
);

// Utility function to construct image URLs using the same base URL as axios
const formatImageUrl = (img) => {
  if (!img) return null;
  if (typeof img !== 'string') return img;
  if (img.startsWith('http')) return img;

  // Use the same BASE_URL as axios instance
  return img.startsWith('/') ? `${BASE_URL}${img}` : `${BASE_URL}/${img}`;
};

// API utility functions
const api = {
  get: async (url, config = {}) => {
    try {
      const response = await axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  put: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (url, config = {}) => {
    try {
      const response = await axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  upload: async (url, formData, config = {}) => {
    try {
      const response = await axiosInstance.post(url, formData, {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export { formatImageUrl, api };
export default axiosInstance;
