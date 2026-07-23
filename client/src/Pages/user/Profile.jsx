import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Compenents/Navbar/Navbar';
import Footer from '../../Compenents/Footer/Footer';
import { FiHome, FiBriefcase, FiUser, FiMapPin, FiTrash2, FiCheckCircle, FiClock, FiAlertTriangle, FiShoppingBag, FiLogOut } from 'react-icons/fi';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../axios';

const Profile = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile');
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [addressType, setAddressType] = useState('Home');
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrderToReturn, setSelectedOrderToReturn] = useState(null);
  const [returnReason, setReturnReason] = useState('Damaged Product');
  const [returnReasonOther, setReturnReasonOther] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const { data } = await axiosPrivate.get('/api/orders');
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, axiosPrivate]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancellingOrderId(orderId);
      await axiosPrivate.put(`/api/orders/cancel/${orderId}`);
      toast.success('Order cancelled successfully!');
      fetchOrders();
    } catch (err) {
      console.error('Failed to cancel order:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleInitiateReturn = (order) => {
    setSelectedOrderToReturn(order);
    setReturnReason('Damaged Product');
    setReturnReasonOther('');
    setShowReturnModal(true);
  };

  const handleSubmitReturn = async () => {
    if (!selectedOrderToReturn) return;
    const finalReason = returnReason === 'Other' ? (returnReasonOther || 'Other') : returnReason;
    try {
      await axiosPrivate.put(`/api/orders/return/${selectedOrderToReturn._id}`, {
        returnReason: finalReason
      });
      toast.success('Return request submitted successfully!');
      setShowReturnModal(false);
      setSelectedOrderToReturn(null);
      fetchOrders();
    } catch (err) {
      console.error('Failed to return order:', err);
      toast.error(err.response?.data?.message || 'Failed to request return.');
    }
  };

  const [modalData, setModalData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    landmark: '',
    pincode: '',
    altPhone: '',
    isDefault: false
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dob: '',
    gender: ''
  });

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosPrivate.get('/api/auth/me');
        const u = data.user;
        setFormData({
          fullName: u.name || '',
          email: u.email || '',
          phoneNumber: u.phone || '',
          dob: u.dob || '',
          gender: u.gender || ''
        });
      } catch (error) {
        console.error("Fetch profile error:", error);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [axiosPrivate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchAddresses = async () => {
    try {
      const { data } = await axiosPrivate.get('/api/addresses');
      setAddresses(data);
    } catch (error) {
      console.error("Fetch addresses error:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [axiosPrivate]);

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      const { data } = await axiosPrivate.put('/api/auth/me', {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        dob: formData.dob,
        gender: formData.gender
      });
      // Update name in AuthContext
      setAuth(prev => ({ ...prev, name: data.user.name }));
      localStorage.setItem('name', data.user.name);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Save profile error:", error);
      toast.error(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...modalData,
        addressType
      };
      const { data } = await axiosPrivate.post('/api/addresses', payload);
      setAddresses(data.addresses);
      setShowModal(false);
      setModalData({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        landmark: '',
        pincode: '',
        altPhone: '',
        isDefault: false
      });
      setAddressType('Home');
      toast.success("Address saved successfully!");
    } catch (error) {
      console.error("Save address error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const { data } = await axiosPrivate.delete(`/api/addresses/${id}`);
      setAddresses(data.addresses);
    } catch (error) {
      console.error("Delete address error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete address");
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      const { data } = await axiosPrivate.put(`/api/addresses/${id}/primary`);
      setAddresses(data.addresses);
    } catch (error) {
      console.error("Set primary address error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to set primary address");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-[32px] md:text-[36px] font-bold text-black tracking-tight">Profile</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 px-6 rounded-[6px] border border-red-200 transition-colors shadow-sm text-sm"
          >
            <FiLogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
        <div className="text-[14px] text-gray-500 mb-8 font-medium">
          Home &gt; <span className="text-black capitalize">{activeTab === 'profile' ? 'Profile' : activeTab === 'address' ? 'Address' : 'My Orders'}</span>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`font-semibold py-2.5 px-10 rounded-[6px] shadow-sm min-w-[140px] transition-colors border ${
              activeTab === 'profile' 
                ? 'bg-[#063344] text-white border-[#063344]' 
                : 'bg-white border-gray-200 text-[#555] hover:bg-gray-50'
            }`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab('address')}
            className={`font-semibold py-2.5 px-10 rounded-[6px] shadow-sm min-w-[140px] transition-colors border ${
              activeTab === 'address' 
                ? 'bg-[#063344] text-white border-[#063344]' 
                : 'bg-white border-gray-200 text-[#555] hover:bg-gray-50'
            }`}
          >
            Address
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`font-semibold py-2.5 px-10 rounded-[6px] shadow-sm min-w-[140px] transition-colors border ${
              activeTab === 'orders' 
                ? 'bg-[#063344] text-white border-[#063344]' 
                : 'bg-white border-gray-200 text-[#555] hover:bg-gray-50'
            }`}
          >
            My Orders
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'profile' && (
          <div>
            {profileLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 w-full mb-8 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-11 bg-gray-100 rounded-[6px] w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 w-full mb-8">
                  {/* Full Name */}
                  <div className="flex flex-col">
                    <label className="text-[14px] font-bold text-[#111] mb-2 tracking-wide">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="text-[15px] font-medium p-3 rounded-[6px] w-full outline-none transition-colors bg-white border border-gray-300 text-black focus:border-[#063344]"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label className="text-[14px] font-bold text-[#111] mb-2 tracking-wide">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                      className="text-[15px] font-medium p-3 rounded-[6px] w-full outline-none transition-colors bg-white border border-gray-300 text-black focus:border-[#063344]"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col">
                    <label className="text-[14px] font-bold text-[#111] mb-2 tracking-wide">Phone Number</label>
                    <input 
                      type="text" 
                      name="phoneNumber"
                      placeholder="Enter phone number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="text-[15px] font-medium p-3 rounded-[6px] w-full outline-none transition-colors bg-white border border-gray-300 text-black focus:border-[#063344]"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="flex flex-col">
                    <label className="text-[14px] font-bold text-[#111] mb-2 tracking-wide">Date of Birth</label>
                    <input 
                      type="date" 
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="text-[15px] font-medium p-3 rounded-[6px] w-full outline-none transition-colors bg-white border border-gray-300 text-black focus:border-[#063344]"
                    />
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col">
                    <label className="text-[14px] font-bold text-[#111] mb-2 tracking-wide">Gender</label>
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="text-[15px] font-medium p-3 rounded-[6px] w-full outline-none transition-colors bg-white border border-gray-300 text-black focus:border-[#063344]"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end w-full items-center gap-4">
                  {saveSuccess && (
                    <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm">
                      <FiCheckCircle className="w-4 h-4" /> Profile saved!
                    </span>
                  )}
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#063344] border-[2px] border-[#063344] text-white font-bold py-2 px-10 rounded-[6px] hover:bg-[#052633] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'address' && (
          <div>
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
              <div></div>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-[#0082b4] hover:bg-[#00719d] text-white font-bold py-3 px-8 rounded-[6px] transition-colors shadow-sm text-sm tracking-wide"
              >
                Add Address
              </button>
            </div>

            {/* Address Cards List */}
            {addresses.length === 0 ? (
              <div className="text-center py-16 text-gray-500 border border-dashed border-gray-200 rounded-xl">
                No addresses added yet. Click 'Add Address' to save an address.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addresses.map((addr, index) => (
                  <div key={addr._id} className={`p-6 bg-white border rounded-[8px] relative hover:shadow-md transition-all flex flex-col justify-between min-h-[220px] ${
                    addr.isDefault 
                      ? 'border-[#063344] ring-1 ring-[#063344] shadow-sm' 
                      : 'border-gray-200'
                  }`}>
                    <div>
                      {/* Badge Type */}
                      <div className="absolute top-5 right-5 bg-[#063344] text-white text-[12px] font-bold py-1.5 px-3.5 rounded-[4px] flex items-center gap-1.5 shadow-sm">
                        {addr.addressType === 'Home' && <FiHome className="w-[14px] h-[14px]" />}
                        {addr.addressType === 'Office' && <FiBriefcase className="w-[14px] h-[14px]" />}
                        {addr.addressType === 'Other' && <FiMapPin className="w-[14px] h-[14px]" />}
                        <span>{addr.addressType}</span>
                      </div>

                      <h3 className="text-[14px] font-bold text-gray-900 mb-4 tracking-wide flex items-center gap-2">
                        <span>Address {index + 1}</span>
                        {addr.isDefault && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold py-0.5 px-2 rounded-full">
                            Primary
                          </span>
                        )}
                      </h3>
                      
                      <h4 className="text-[14px] font-bold text-gray-900 mb-1">{addr.fullName}</h4>
                      <p className="text-[13px] text-gray-500 leading-relaxed font-medium mb-3 pr-10">
                        {addr.street}{addr.landmark ? `, ${addr.landmark}` : ''},<br />
                        {addr.city}, {addr.state} – {addr.pincode}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col gap-3">
                      <p className="text-[13px] text-gray-700 font-bold flex items-center gap-1">
                        <span className="text-sm">📞</span> {addr.phone}
                      </p>
                      
                      {/* Actions Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-1">
                        <div>
                          {addr.isDefault ? (
                            <span className="text-[12px] font-bold text-emerald-600 flex items-center gap-1">
                              ✓ Default Address
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetPrimary(addr._id)}
                              className="text-[12px] font-bold text-[#0082b4] hover:text-[#00719d] transition-colors"
                            >
                              Set as Primary
                            </button>
                          )}
                        </div>

                        <button 
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Address"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-[22px] font-bold text-gray-900 mb-2">Order History</h2>
            
            {ordersLoading ? (
              <div className="space-y-4">
                {[1, 2].map(n => (
                  <div key={n} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-pulse">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-24 h-24 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white text-center py-16 text-gray-500 border border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-3">
                <FiShoppingBag className="w-10 h-10 text-gray-400" />
                <p className="font-semibold text-lg text-gray-700">You haven't placed any orders yet</p>
                <p className="text-gray-500 text-sm max-w-sm">Browse our premium fragrances and add items to your cart to place your first order.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {orders.map((order) => {
                  const product = order.orderItems?.product;
                  const quantity = order.orderItems?.quantity || 1;
                  const address = order.shippingAddress;
                  
                  return (
                    <div key={order._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow text-left">
                      {/* Order Header */}
                      <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600">
                        <div>
                          <p className="font-medium text-gray-800">Order ID: <span className="font-mono text-[#063344] font-bold">#{order._id.substring(order._id.length - 8).toUpperCase()}</span></p>
                          <p className="text-xs mt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          {/* Payment status badge */}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            order.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            order.paymentStatus === 'Failed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            💳 Payment: {order.paymentStatus}
                          </span>
                          
                          {/* Delivery status badge */}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            order.deliveryStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            order.deliveryStatus === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            order.deliveryStatus === 'Processing' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                            order.deliveryStatus === 'Shipped' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                            order.deliveryStatus === 'Out for Delivery' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                            order.deliveryStatus === 'Returned' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            📦 Status: {order.deliveryStatus}
                          </span>
                        </div>
                      </div>
                      
                      {/* Order Body */}
                      <div className="p-6 flex flex-col md:flex-row gap-6">
                        {/* Product Image */}
                        <div className="w-24 h-24 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {product?.images?.[0] ? (
                            <img 
                              src={getImageUrl(product.images[0])} 
                              alt={product.name} 
                              className="w-full h-full object-contain max-h-[80px]"
                            />
                          ) : (
                            <span className="text-2xl">🧪</span>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h3 className="font-bold text-gray-900 text-[17px] truncate">{product?.name || 'Fragrance Product'}</h3>
                            <p className="text-sm text-gray-500 mt-0.5">{product?.description?.substring(0, 80)}...</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <p>Qty: <span className="font-bold text-gray-800">{quantity}</span></p>
                              <p>Price: <span className="font-bold text-gray-800">Rs {order.totalPrice / quantity}</span></p>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 gap-3">
                            <div>
                              <p className="text-xs text-gray-500">Total Price</p>
                              <p className="text-lg font-extrabold text-[#063344]">Rs {order.totalPrice}</p>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              {(order.deliveryStatus === 'Pending' || order.deliveryStatus === 'Processing') && (
                                <button
                                  onClick={() => handleCancelOrder(order._id)}
                                  disabled={cancellingOrderId === order._id}
                                  className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors disabled:opacity-50"
                                >
                                  {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                              )}
                              
                              {order.deliveryStatus === 'Delivered' && !order.isReturned && (
                                <button
                                  onClick={() => handleInitiateReturn(order)}
                                  className="px-4 py-2 text-xs font-bold text-[#063344] bg-[#063344]/5 hover:bg-[#063344]/10 border border-[#063344]/20 rounded-md transition-colors"
                                >
                                  Return Item
                                </button>
                              )}
                              
                              {order.isReturned && (
                                <div className="text-right">
                                  <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded">
                                    ↩ Return: {order.returnStatus}
                                  </span>
                                  <p className="text-[10px] text-gray-500 mt-1 max-w-[200px] truncate" title={order.returnReason}>Reason: {order.returnReason}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Shipping Info details */}
                      {address && (
                        <div className="bg-gray-50/20 border-t border-gray-150 px-6 py-3.5 text-xs text-gray-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <p>
                            <span className="font-semibold text-gray-700">Deliver to: </span> 
                            {address.fullName} ({address.phone}) — {address.street}, {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="flex-shrink-0 text-gray-500 font-medium">
                            Payment Method: <span className="uppercase font-semibold">{order.paymentMethod}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-4xl p-8 border border-gray-100 max-h-[90vh] overflow-y-auto relative animate-fade-in">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-[20px] font-bold transition-colors"
            >
              ✕
            </button>

            <h2 className="text-[16px] font-bold text-gray-900 mb-4 tracking-wide">Address Type</h2>
            
            {/* Address Type selection buttons */}
            <div className="flex gap-4 mb-6">
              <button 
                type="button" 
                onClick={() => setAddressType('Home')}
                className={`px-6 py-2.5 rounded-[6px] font-bold text-[14px] flex items-center gap-2 border transition-all ${
                  addressType === 'Home' 
                    ? 'bg-[#063344] text-white border-[#063344] shadow-sm' 
                    : 'bg-[#e5e7eb]/60 text-[#333] border-transparent hover:bg-gray-200'
                }`}
              >
                <FiHome size={16} /> Home
              </button>
              <button 
                type="button" 
                onClick={() => setAddressType('Office')}
                className={`px-6 py-2.5 rounded-[6px] font-bold text-[14px] flex items-center gap-2 border transition-all ${
                  addressType === 'Office' 
                    ? 'bg-[#063344] text-white border-[#063344] shadow-sm' 
                    : 'bg-[#e5e7eb]/60 text-[#333] border-transparent hover:bg-gray-200'
                }`}
              >
                <FiBriefcase size={16} /> Office
              </button>
              <button 
                type="button" 
                onClick={() => setAddressType('Other')}
                className={`px-6 py-2.5 rounded-[6px] font-bold text-[14px] flex items-center gap-2 border transition-all ${
                  addressType === 'Other' 
                    ? 'bg-[#063344] text-white border-[#063344] shadow-sm' 
                    : 'bg-[#e5e7eb]/60 text-[#333] border-transparent hover:bg-gray-200'
                }`}
              >
                <FiMapPin size={16} /> Other
              </button>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleSaveAddress} className="space-y-6">
              {/* Full Name & Phone Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-[14px] font-bold text-[#111] mb-2 tracking-wide">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    placeholder="Enter full name"
                    value={modalData.fullName}
                    onChange={handleModalChange}
                    required
                    className="text-[14px] font-semibold p-3.5 rounded-[6px] w-full outline-none border border-gray-300 text-black focus:border-[#063344]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[14px] font-bold text-[#111] mb-2 tracking-wide">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    placeholder="Enter 10-digit mobile number"
                    value={modalData.phone}
                    onChange={handleModalChange}
                    required
                    className="text-[14px] font-semibold p-3.5 rounded-[6px] w-full outline-none border border-gray-300 text-black focus:border-[#063344]"
                  />
                </div>
              </div>

              {/* Address Street details */}
              <div className="flex flex-col">
                <label className="text-[14px] font-bold text-[#111] mb-2 tracking-wide">Address</label>
                <textarea 
                  name="street"
                  placeholder="Enter house or building details"
                  value={modalData.street}
                  onChange={handleModalChange}
                  required
                  rows="3"
                  className="text-[14px] font-semibold p-3.5 rounded-[6px] w-full outline-none border border-gray-300 text-black focus:border-[#063344] resize-none"
                />
              </div>

              {/* City, State, Landmark */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label className="text-[14px] font-bold text-[#111] mb-2 tracking-wide">City/District</label>
                  <input 
                    type="text" 
                    name="city"
                    placeholder="Enter City/District"
                    value={modalData.city}
                    onChange={handleModalChange}
                    required
                    className="text-[14px] font-semibold p-3.5 rounded-[6px] w-full outline-none border border-gray-300 text-black focus:border-[#063344]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[14px] font-bold text-[#111] mb-2 tracking-wide">State</label>
                  <input 
                    type="text" 
                    name="state"
                    placeholder="Enter state"
                    value={modalData.state}
                    onChange={handleModalChange}
                    required
                    className="text-[14px] font-semibold p-3.5 rounded-[6px] w-full outline-none border border-gray-300 text-black focus:border-[#063344]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[14px] font-bold text-[#111] mb-2 tracking-wide">Land Mark</label>
                  <input 
                    type="text" 
                    name="landmark"
                    placeholder="Enter landmark"
                    value={modalData.landmark}
                    onChange={handleModalChange}
                    className="text-[14px] font-semibold p-3.5 rounded-[6px] w-full outline-none border border-gray-300 text-black focus:border-[#063344]"
                  />
                </div>
              </div>

              {/* PinCode, Alt Phone */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col col-span-1">
                  <label className="text-[14px] font-bold text-[#111] mb-2 tracking-wide">PinCode</label>
                  <input 
                    type="text" 
                    name="pincode"
                    placeholder="Enter pincode"
                    value={modalData.pincode}
                    onChange={handleModalChange}
                    required
                    className="text-[14px] font-semibold p-3.5 rounded-[6px] w-full outline-none border border-gray-300 text-black focus:border-[#063344]"
                  />
                </div>
                <div className="flex flex-col col-span-1">
                  <label className="text-[14px] font-bold text-[#111] mb-2 tracking-wide">Alternative Phone number(Optional)</label>
                  <input 
                    type="text" 
                    name="altPhone"
                    placeholder="Enter alternative phone number"
                    value={modalData.altPhone}
                    onChange={handleModalChange}
                    className="text-[14px] font-semibold p-3.5 rounded-[6px] w-full outline-none border border-gray-300 text-black focus:border-[#063344]"
                  />
                </div>
                <div className="col-span-1"></div>
              </div>

              {/* Set as primary checkbox */}
              <div className="flex items-center gap-2 mt-4 select-none">
                <input 
                  type="checkbox" 
                  id="isDefault" 
                  name="isDefault" 
                  checked={modalData.isDefault || false}
                  onChange={(e) => setModalData(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-[#0082b4] focus:ring-[#0082b4] cursor-pointer"
                />
                <label htmlFor="isDefault" className="text-[14px] font-bold text-[#111] cursor-pointer">
                  Set as primary address
                </label>
              </div>

              {/* Action save/cancel buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button 
                  type="submit"
                  className="bg-[#0082b4] hover:bg-[#00719d] text-white font-bold py-3.5 px-10 rounded-[6px] shadow-sm tracking-wide text-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Order Modal */}
      {showReturnModal && selectedOrderToReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-lg p-8 border border-gray-100 relative animate-fade-in text-left">
            
            <button 
              onClick={() => {
                setShowReturnModal(false);
                setSelectedOrderToReturn(null);
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-[20px] font-bold transition-colors"
            >
              ✕
            </button>

            <h2 className="text-[18px] font-bold text-gray-900 mb-1 tracking-tight">Request Return</h2>
            <p className="text-xs text-gray-500 mb-6">
              Order ID: #{selectedOrderToReturn._id.substring(selectedOrderToReturn._id.length - 8).toUpperCase()}
            </p>

            <div className="flex gap-4 mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-12 h-12 bg-white rounded border border-gray-100 flex items-center justify-center flex-shrink-0">
                {selectedOrderToReturn.orderItems?.product?.images?.[0] ? (
                  <img 
                    src={getImageUrl(selectedOrderToReturn.orderItems.product.images[0])} 
                    alt={selectedOrderToReturn.orderItems.product.name} 
                    className="w-full h-full object-contain max-h-[40px]"
                  />
                ) : (
                  <span>🧪</span>
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-gray-800 truncate">{selectedOrderToReturn.orderItems?.product?.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">Quantity: {selectedOrderToReturn.orderItems?.quantity}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[14px] font-bold text-gray-700 mb-2">Reason for Return</label>
                <select 
                  value={returnReason} 
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="text-[14px] font-semibold p-3.5 rounded-[6px] w-full outline-none border border-gray-300 text-black focus:border-[#063344] bg-white cursor-pointer"
                >
                  <option value="Damaged Product">Damaged Product</option>
                  <option value="Wrong Item Received">Wrong Item Received</option>
                  <option value="Defective Product">Defective Product</option>
                  <option value="Item Not as Described">Item Not as Described</option>
                  <option value="Size/Color Mismatch">Size/Color Mismatch</option>
                  <option value="Other">Other (Please specify)</option>
                </select>
              </div>

              {returnReason === 'Other' && (
                <div>
                  <label className="block text-[14px] font-bold text-gray-700 mb-2">Specify Reason</label>
                  <textarea
                    rows="3"
                    value={returnReasonOther}
                    onChange={(e) => setReturnReasonOther(e.target.value)}
                    placeholder="Describe the issue in detail..."
                    className="text-[14px] font-semibold p-3.5 rounded-[6px] w-full outline-none border border-gray-300 text-black focus:border-[#063344] resize-none"
                    required
                  ></textarea>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => {
                  setShowReturnModal(false);
                  setSelectedOrderToReturn(null);
                }}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-[6px] hover:bg-gray-50 transition-colors text-[14px]"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSubmitReturn}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-[6px] hover:bg-red-700 transition-colors text-[14px] shadow-sm"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;
