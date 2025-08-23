import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function OurProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    category: '',
    image: null,
    featured: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/our-products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProduct({
      name: '',
      description: '',
      category: '',
      image: null,
      featured: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(currentProduct).forEach(key => {
      formData.append(key, currentProduct[key]);
    });

    try {
      if (currentProduct._id) {
        await axios.put(`/api/our-products/${currentProduct._id}`, formData);
      } else {
        await axios.post('/api/our-products', formData);
      }
      fetchProducts();
      handleClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/our-products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value
    }));
  };

  return (
    <Box>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Add New Product
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.featured ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {currentProduct._id ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Product Name"
              value={currentProduct.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={currentProduct.description}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={currentProduct.category}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="herbal">Herbal</MenuItem>
                <MenuItem value="palm-jaggery">Palm Jaggery</MenuItem>
                <MenuItem value="coir">Coir</MenuItem>
                <MenuItem value="tea">Tea</MenuItem>
                <MenuItem value="health-mix">Health Mix</MenuItem>
                <MenuItem value="handicraft">Handicraft</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={currentProduct.featured}
                  onChange={handleChange}
                />
                Featured Product
              </label>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default OurProductsAdmin;
