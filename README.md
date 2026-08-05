# ✨ Fragranzia — Luxury Perfume E-Commerce Platform

<div align="center">
  <img src="./banner.png" alt="Fragranzia Banner" width="100%" />
</div>

<br />

**Fragranzia** is a modern, premium full-stack e-commerce web application designed for browsing and purchasing luxury perfumes. Built with the MERN stack (MongoDB, Express, React, Node.js), Redux Toolkit, and Tailwind CSS, the platform delivers a fast, responsive, and visually stunning shopping experience.

---

## 🔗 Live Deployments

* **Frontend (React/Vite)**: [https://fragranzia-ten.vercel.app](https://fragranzia-ten.vercel.app)
* **Backend API (Node/Express)**: [https://fragranziaweb-api.vercel.app](https://fragranziaweb-api.vercel.app)

---

## 🚀 Key Features

* **🛡️ Secure Authentication**: Supports traditional email/password login and one-click Google OAuth 2.0 Sign-In.
* **🛒 Cart & Wishlist System**: Interactive, real-time shopping cart and persistent user wishlist, synchronized with MongoDB.
* **💳 Seamless Checkout & Orders**: Address management system, order creation, order tracking, and order cancellation.
* **⚡ Admin Dashboard**: Complete administrative panel containing:
  * Key sales stats and charts
  * Customer status management (active/blocked)
  * CRUD operations for products (image uploads via Cloudinary)
  * CRUD operations for categories
  * Real-time order status tracking (Pending, Shipped, Delivered)
* **🌌 Premium Dark Design**: Modern UI/UX incorporating sleek dark modes, micro-animations, and responsive layouts.
* **☁️ Cloud Image Storage**: Image handling powered by Cloudinary.

---

## 🛠️ Tech Stack

<div align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,redux,nodejs,express,mongodb,js,tailwind,html,css,git,github,vscode,postman" alt="Skill Icons" />
  </a>
</div>

### Frontend:
* **React 19** & **Vite** for high-performance builds.
* **Redux Toolkit** & **Context API** for efficient global state management.
* **Tailwind CSS** & **Autoprefixer** for styling and responsive designs.
* **React Router DOM v7** for single-page application routing.
* **React Hot Toast** for sleek user notifications.

### Backend:
* **Node.js** & **Express** server architecture.
* **Mongoose (MongoDB)** for database modelling.
* **JWT (JSON Web Tokens)** & **Cookie Parser** for secure cookie-based session management.
* **Multer** & **Cloudinary** for cloud-based media storage.

---

## 📦 Local Installation & Setup

### Prerequisites
* Node.js (v18+)
* MongoDB Atlas cluster or local database instance
* Cloudinary Account
* Google Cloud Console OAuth Client ID

### 1. Clone the Repository
```bash
git clone https://github.com/Akshaikp007/Fragranzia.git
cd Fragranzia
```

### 2. Configure the Backend
Navigate to the `server` directory, install dependencies, and create a `.env` file:
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder with these values:
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

### 3. Configure the Frontend
Navigate to the `client` directory, install dependencies, and create a `.env` file:
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` folder:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Run Locally
Start the backend server (from the `server` folder):
```bash
npm run dev
```
Start the frontend dev server (from the `client` folder):
```bash
npm run dev
```

---

## 📜 License
This project is licensed under the ISC License.
