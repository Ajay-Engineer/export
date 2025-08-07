

const API_URL = '/api/products';

export const productService = {
  async addProduct(product) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to add product');
    return (await res.json()).id;
  },

  async getAllProducts() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  },

  async updateProduct(id, product) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return (await res.json()).id;
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
    return true;
  },
};
