const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rebecca-exim', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function migrateCertificates() {
  try {
    console.log('Starting certificate migration...');
    
    // Find all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to migrate`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      let needsUpdate = false;
      const updatedCertifications = [];
      
      if (product.certifications && Array.isArray(product.certifications)) {
        for (const cert of product.certifications) {
          // Check if certificate has old structure
          if (cert.url && !cert.src) {
            // Convert old structure to new structure
            updatedCertifications.push({
              src: cert.url,
              alt: cert.alt || 'Certificate'
            });
            needsUpdate = true;
          } else if (cert.src) {
            // Already in new structure, keep as is
            updatedCertifications.push({
              src: cert.src,
              alt: cert.alt || 'Certificate'
            });
          }
        }
      }
      
      if (needsUpdate) {
        console.log(`Updating product: ${product.title} (${product._id})`);
        console.log('Old certifications:', product.certifications);
        console.log('New certifications:', updatedCertifications);
        
        await Product.findByIdAndUpdate(product._id, {
          $set: { certifications: updatedCertifications }
        });
        
        updatedCount++;
      }
    }
    
    console.log(`Migration completed! Updated ${updatedCount} products`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run migration
migrateCertificates();
