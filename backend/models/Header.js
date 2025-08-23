const mongoose = require('mongoose');

const headerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  buttonText: {
    type: String
  },
  buttonLink: {
    type: String
  },
  backgroundImage: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Header', headerSchema);
