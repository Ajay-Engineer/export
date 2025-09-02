require('dotenv').config();
const mongoose = require('mongoose');
const PackagingStandard = require('../models/PackagingStandard');

const packagingStandards = [
  {
    title: "Standard Wise Packing",
    description: "Our standard packing process is designed to meet global compliance regulations, providing reliable protection for goods during long-distance transportation. With a focus on universal standards, this packing method ensures that your products are safe, secure, and ready for any logistics environment.",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/5da5529c48a3afc50462368bb58ea5e86493b686?width=640",
    order: 0
  },
  {
    title: "Size Wise Packing",
    description: "Each product is packed precisely according to its size—ensuring minimal wasted space and maximum efficiency. Whether it's a delicate small item or a large bulky package, our packing strategy adjusts to suit the dimensions, reducing shipping costs and improving handling safety.",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/75b0ea4366e308189ef6997dd6615028e54e63bd?width=640",
    order: 1
  },
  {
    title: "Regional Wise Packing",
    description: "We understand the specific challenges faced during regional transport. That's why our regional-wise packing considers climate sensitivity, regulatory compliance, and optimal packaging materials suited for local infrastructure. This ensures safe arrival whether by land, air, or sea.",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/d88b2461594912b7fed0f4d03f76acf5dc74aaaf?width=640",
    order: 2
  }
];

const seedPackagingStandards = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing data
    await PackagingStandard.deleteMany({});
    console.log('Cleared existing packaging standards');

    // Insert new data
    await PackagingStandard.insertMany(packagingStandards);
    console.log('Added packaging standards successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedPackagingStandards();
