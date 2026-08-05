# Fragranzia — Luxury Perfume E-Commerce Platform

Fragranzia is a full-stack e-commerce web application for luxury perfumes built using the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

---

## 🔗 Live Links

* **Website**: [https://fragranzia-ten.vercel.app](https://fragranzia-ten.vercel.app)
* **Backend API**: [https://fragranziaweb-api.vercel.app](https://fragranziaweb-api.vercel.app)

---

## 🚀 Features

* Secure User Login and Google OAuth 2.0 Sign-In.
* Real-time shopping cart and wishlist system.
* Checkout flow with order tracking and cancellation.
* Complete Admin Panel to manage products, categories, orders, and customers.
* Product image uploads powered by Cloudinary.

---

## 📦 How to Run Locally

### 1. Clone the Project
```bash
git clone https://github.com/Akshaikp007/Fragranzia.git
cd Fragranzia
```

### 2. Run the Backend
1. Go to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `server` folder with your keys:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Run the Frontend
1. Open a new terminal and go to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `client` folder:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
