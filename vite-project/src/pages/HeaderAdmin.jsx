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
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function HeaderAdmin() {
  const [headers, setHeaders] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentHeader, setCurrentHeader] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    backgroundImage: null
  });

  useEffect(() => {
    fetchHeaders();
  }, []);

  const fetchHeaders = async () => {
    try {
      const response = await axios.get('/api/header');
      setHeaders(response.data);
    } catch (error) {
      console.error('Error fetching headers:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentHeader({
      title: '',
      subtitle: '',
      buttonText: '',
      buttonLink: '',
      backgroundImage: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(currentHeader).forEach(key => {
      formData.append(key, currentHeader[key]);
    });

    try {
      if (currentHeader._id) {
        await axios.put(`/api/header/${currentHeader._id}`, formData);
      } else {
        await axios.post('/api/header', formData);
      }
      fetchHeaders();
      handleClose();
    } catch (error) {
      console.error('Error saving header:', error);
    }
  };

  const handleEdit = (header) => {
    setCurrentHeader(header);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this header?')) {
      try {
        await axios.delete(`/api/header/${id}`);
        fetchHeaders();
      } catch (error) {
        console.error('Error deleting header:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setCurrentHeader(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <Box>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Add New Header
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Subtitle</TableCell>
              <TableCell>Button Text</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {headers.map((header) => (
              <TableRow key={header._id}>
                <TableCell>{header.title}</TableCell>
                <TableCell>{header.subtitle}</TableCell>
                <TableCell>{header.buttonText}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(header)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(header._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentHeader._id ? 'Edit Header' : 'Add New Header'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              name="title"
              label="Title"
              value={currentHeader.title}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="subtitle"
              label="Subtitle"
              value={currentHeader.subtitle}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="buttonText"
              label="Button Text"
              value={currentHeader.buttonText}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="buttonLink"
              label="Button Link"
              value={currentHeader.buttonLink}
              onChange={handleChange}
            />
            <input
              type="file"
              accept="image/*"
              name="backgroundImage"
              onChange={handleChange}
            />
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

export default HeaderAdmin;
