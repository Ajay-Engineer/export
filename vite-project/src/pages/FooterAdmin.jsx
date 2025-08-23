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

function FooterAdmin() {
  const [footerData, setFooterData] = useState({});
  const [open, setOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState({
    title: '',
    content: '',
    type: 'link' // or 'text' or 'contact'
  });

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await axios.get('/api/footer');
      setFooterData(response.data);
    } catch (error) {
      console.error('Error fetching footer data:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentSection({
      title: '',
      content: '',
      type: 'link'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentSection._id) {
        await axios.put(`/api/footer/${currentSection._id}`, currentSection);
      } else {
        await axios.post('/api/footer', currentSection);
      }
      fetchFooterData();
      handleClose();
    } catch (error) {
      console.error('Error saving footer section:', error);
    }
  };

  const handleEdit = (section) => {
    setCurrentSection(section);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await axios.delete(`/api/footer/${id}`);
        fetchFooterData();
      } catch (error) {
        console.error('Error deleting footer section:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSection(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Add New Footer Section
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(footerData).map(([key, section]) => (
              <TableRow key={key}>
                <TableCell>{section.title}</TableCell>
                <TableCell>{section.type}</TableCell>
                <TableCell>{section.content}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(section)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(section._id)}>
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
          {currentSection._id ? 'Edit Footer Section' : 'Add New Footer Section'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              name="title"
              label="Section Title"
              value={currentSection.title}
              onChange={handleChange}
            />
            <TextField
              select
              fullWidth
              margin="normal"
              name="type"
              label="Section Type"
              value={currentSection.type}
              onChange={handleChange}
              SelectProps={{ native: true }}
            >
              <option value="link">Links</option>
              <option value="text">Text</option>
              <option value="contact">Contact Info</option>
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              name="content"
              label="Content"
              multiline
              rows={4}
              value={currentSection.content}
              onChange={handleChange}
              helperText="For links, use JSON format: [{text: 'Link Text', url: 'URL'}]"
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

export default FooterAdmin;
