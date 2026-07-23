import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/user/Home';
import Productsinglepage from './Pages/user/Productsinglepage';
import Products from './Pages/user/Products';
import Cart from './Pages/user/Cart';
import About from './Pages/user/About';
import Wishlist from './Pages/user/Wishlist';
import Payment from './Pages/user/Payment';
import Profile from './Pages/user/Profile';
import Login from './Pages/user/Login';
import Signup from './Pages/user/Signup';

// Admin Imports
import AdminLayout from './Compenents/layout/AdminLayout';
import AdminDashboard from './Pages/admin/AdminDashboard';
import AdminProducts from './Pages/admin/AdminProducts';
import AddProduct from './Pages/admin/AddProduct';
import AdminCategories from './Pages/admin/AdminCategories';
import AdminOrders from './Pages/admin/AdminOrders';
import AdminCustomers from './Pages/admin/AdminCustomers';
import UserProtectedRoute from './Compenents/protected-route/UserProtectedRoute';
import AdminProtectedRoute from './Compenents/protected-route/AdminProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<Productsinglepage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/about" element={<About />} />
      <Route path="/wishlist" element={<Wishlist />} />

      <Route element={<UserProtectedRoute/>}>
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      {/* Admin Routes */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add-product" element={<AddProduct />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;