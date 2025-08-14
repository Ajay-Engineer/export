
import axiosInstance from '../../axios/axios.config';

export const productService = {
  async addProduct(product) {
    try {
      const response = await axiosInstance.post('/products', product);
      return response.data.id;
    } catch (error) {
      throw new Error('Failed to add product');
    }
  },

  async getAllProducts() {
    try {
      const response = await axiosInstance.get('/products');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  },

  async updateProduct(id, product) {
    try {
      const response = await axiosInstance.put(`/products/${id}`, product);
      return response.data.id;
    } catch (error) {
      throw new Error('Failed to update product');
    }
  },

  async deleteProduct(id) {
    try {
      await axiosInstance.delete(`/products/${id}`);
      return true;
    } catch (error) {
      throw new Error('Failed to delete product');
    }
  },
};
