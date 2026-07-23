const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const Product = require('./models/Product');

// Load environment variables
dotenv.config();

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (!isCloudinaryConfigured) {
  console.error("Cloudinary credentials are not configured in your .env file!");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadsDir = path.join(__dirname, 'uploads');

async function migrate() {
  try {
    const dbUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fragrenzia";
    await mongoose.connect(dbUri);
    console.log("Database connected successfully!");

    const products = await Product.find({});
    console.log(`Found ${products.length} products to check.`);

    let migrationCount = 0;

    for (const product of products) {
      if (!product.images || product.images.length === 0) continue;

      const updatedImages = [];
      let updated = false;

      for (const image of product.images) {
        if (image.startsWith('http://') || image.startsWith('https://')) {
          // Already a remote/Cloudinary image URL
          updatedImages.push(image);
        } else {
          // It's a local filename, let's find it in the uploads folder and upload it
          const localPath = path.join(uploadsDir, image);
          if (fs.existsSync(localPath)) {
            console.log(`Uploading ${image} for product "${product.name}" to Cloudinary...`);
            try {
              const uploadResult = await cloudinary.uploader.upload(localPath, {
                folder: 'fragrenzia',
                public_id: path.parse(image).name
              });
              console.log(`Successfully uploaded to Cloudinary: ${uploadResult.secure_url}`);
              updatedImages.push(uploadResult.secure_url);
              updated = true;
            } catch (uploadErr) {
              console.error(`Failed to upload ${image}: ${uploadErr.message}`);
              updatedImages.push(image); // keep original
            }
          } else {
            console.warn(`Local file not found for product "${product.name}": ${localPath}`);
            updatedImages.push(image);
          }
        }
      }

      if (updated) {
        product.images = updatedImages;
        await product.save();
        console.log(`Updated product "${product.name}" in database.`);
        migrationCount++;
      }
    }

    console.log(`Migration finished! Successfully migrated images for ${migrationCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error(`Migration failed with error: ${error.message}`);
    process.exit(1);
  }
}

migrate();
