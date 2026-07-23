import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../Compenents/Navbar/Navbar';
import Footer from '../../Compenents/Footer/Footer';
import { useCart } from '../../CartContext';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { FiHome, FiBriefcase, FiMapPin, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Payment = () => {
  const { cartItems, updateQuantity, clearCart } = useCart();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('gpay');
  const [primaryAddress, setPrimaryAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePayNow = async () => {
    if (!primaryAddress) {
      toast.error('Please add a delivery address in your profile before placing an order.');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setIsPlacing(true);
    try {
      await axiosPrivate.post('/api/orders/create', {
        shippingAddress: primaryAddress._id,
        paymentMethod: selectedPayment,
      });

      toast.success('Order placed successfully!');
      await clearCart();
      navigate('/profile', { state: { activeTab: 'orders' } });
    } catch (err) {
      console.error('Failed to place order:', err);
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axiosPrivate.get('/api/addresses');
        const defaultAddr = data.find(a => a.isDefault) || data[0] || null;
        setPrimaryAddress(defaultAddr);
      } catch (err) {
        console.error('Failed to fetch addresses:', err);
      } finally {
        setAddressLoading(false);
      }
    };
    fetchAddresses();
  }, [axiosPrivate]);

  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalOriginalPrice = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const totalDiscount = totalOriginalPrice - totalPrice;


  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column */}
          <div className="w-full lg:w-[60%] flex flex-col gap-8">
            
            {/* Product Details Cards */}
            {cartItems.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <p className="text-gray-500 mb-4">Your cart is empty.</p>
                <Link to="/products" className="text-[#063344] font-bold underline hover:text-[#042431]">Go Shopping</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full md:w-48 flex-shrink-0 flex items-center justify-center bg-white">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-auto object-contain max-h-[180px]"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=Perfume';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h2 className="text-[22px] font-bold text-gray-900 mb-1 leading-tight">{item.title}</h2>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[15px] text-gray-800 font-medium">{item.brand || 'Brand'}</span>
                        <div className="flex items-center text-[14px] font-bold">
                          {item.rating || 4.5} <span className="text-green-500 ml-1 text-sm">★</span>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center w-max border-[1.5px] border-gray-300 rounded-[6px] mb-4 overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-3.5 py-1 text-lg font-medium hover:bg-gray-100 transition-colors">-</button>
                        <span className="px-4 py-1 text-[16px] font-bold border-x-[1.5px] border-gray-300">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-3.5 py-1 text-lg font-medium hover:bg-gray-100 transition-colors">+</button>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[24px] font-extrabold text-gray-900">Rs {item.price}</span>
                        <span className="text-[16px] text-gray-500 line-through font-medium mt-1">Rs {item.originalPrice}</span>
                        <span className="text-[15px] font-bold text-green-600 mt-1">{item.discount || 'Special offer'} off</span>
                      </div>

                      {/* Delivery Info */}
                      <div className="mt-1">
                        <p className="text-[14px] text-gray-700 font-medium flex items-center gap-1.5 mb-1">
                          Delivered by August 29, Free delivery 
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
                        </p>
                        <p className="text-[14px] text-green-600 font-medium">7 day return policy</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Delivery Address Section */}
            <div>
              <h2 className="text-[24px] font-bold text-gray-900 mb-5 tracking-tight">Delivery Address</h2>

              {addressLoading ? (
                <div className="p-5 rounded-[8px] bg-white border-2 border-gray-200 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="h-3 bg-gray-100 rounded w-64 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-48 mb-4"></div>
                  <div className="h-3 bg-gray-100 rounded w-36"></div>
                </div>
              ) : primaryAddress ? (
                <div className="p-5 rounded-[8px] bg-white border-2 border-[#063344] shadow-sm">
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 bg-[#063344] text-white text-[11px] font-bold py-1 px-2.5 rounded-[4px]">
                        {primaryAddress.addressType === 'Home' && <FiHome className="w-3 h-3" />}
                        {primaryAddress.addressType === 'Office' && <FiBriefcase className="w-3 h-3" />}
                        {primaryAddress.addressType === 'Other' && <FiMapPin className="w-3 h-3" />}
                        {primaryAddress.addressType}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 py-1 px-2.5 rounded-full">
                        ✓ Primary
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="text-[13px] font-bold text-[#0082b4] hover:text-[#00719d] transition-colors underline"
                    >
                      Change
                    </Link>
                  </div>

                  <h4 className="text-[16px] font-bold text-gray-900 mb-2">{primaryAddress.fullName}</h4>
                  <p className="text-[14px] text-gray-600 leading-relaxed mb-3">
                    {primaryAddress.street}{primaryAddress.landmark ? `, ${primaryAddress.landmark}` : ''},{' '}
                    {primaryAddress.city}, {primaryAddress.state} – {primaryAddress.pincode}
                  </p>
                  <p className="text-[14px] text-gray-700 font-bold flex items-center gap-1">
                    <span>📞</span> {primaryAddress.phone}
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-[8px] bg-white border-2 border-dashed border-gray-300 flex flex-col items-center gap-3 text-center">
                  <FiAlertCircle className="w-8 h-8 text-amber-500" />
                  <p className="text-[15px] font-semibold text-gray-700">No primary address set</p>
                  <p className="text-[13px] text-gray-500">Please add and set a primary address in your profile to continue.</p>
                  <Link
                    to="/profile"
                    className="mt-1 bg-[#063344] text-white text-[13px] font-bold py-2 px-6 rounded-[6px] hover:bg-[#052633] transition-colors"
                  >
                    Go to Profile → Address
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[40%] flex flex-col gap-6">
            
            {/* Price Details */}
            <div className="bg-white p-6 rounded-[12px] border border-gray-200 shadow-sm">
              <h2 className="text-[20px] font-extrabold text-gray-900 mb-6">Price Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[15px] text-gray-800 font-medium">Price ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                  <div className="flex gap-2 items-center">
                    <span className="text-[15px] font-bold text-gray-900">Rs {totalPrice}</span>
                    {totalOriginalPrice > totalPrice && (
                      <span className="text-[14px] text-gray-400 line-through font-medium">Rs {totalOriginalPrice}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[15px] text-gray-800 font-medium">Discount</span>
                  <span className="text-[15px] font-bold text-gray-900">Rs {totalDiscount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[15px] text-gray-800 font-medium">Delivery Charge</span>
                  <span className="text-[15px] font-bold text-green-600">Free Delivery</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-200 flex justify-between items-center">
                <span className="text-[16px] font-bold text-gray-900">Total Amount</span>
                <span className="text-[22px] font-extrabold text-gray-900">Rs {totalPrice}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-6 rounded-[12px] border border-gray-200 shadow-sm">
              <h2 className="text-[20px] font-extrabold text-gray-900 mb-6">Payment Methods</h2>
              
              <div className="space-y-5 mb-8">
                {/* Google Pay */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#4285F4" d="M23.64 12.2c0-.82-.07-1.63-.2-2.43H12v4.61h6.53c-.28 1.48-1.12 2.74-2.39 3.59v2.98h3.87c2.26-2.09 3.57-5.18 3.57-8.75z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.87-2.98c-1.08.72-2.46 1.15-4.08 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.08C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 15.3A7.13 7.13 0 0 1 4.9 12c0-1.14.2-2.25.56-3.3V5.62H1.27A11.96 11.96 0 0 0 0 12c0 1.93.46 3.76 1.27 5.38l4-2.08z"/><path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.43-3.43C17.96 1.18 15.24 0 12 0 7.31 0 3.26 2.7 1.27 6.62l4 3.08c.95-2.85 3.6-4.95 6.73-4.95z"/></svg>
                    </div>
                    <span className="text-[15px] font-bold text-gray-900 group-hover:text-gray-700 transition-colors">Google Pay</span>
                  </div>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="gpay"
                    checked={selectedPayment === 'gpay'}
                    onChange={() => setSelectedPayment('gpay')}
                    className="w-5 h-5 text-[#063344] focus:ring-[#063344] border-gray-300"
                  />
                </label>

                {/* COD */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                    </div>
                    <span className="text-[15px] font-bold text-gray-900 group-hover:text-gray-700 transition-colors">Cash on delivery (cash/UPI)</span>
                  </div>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod"
                    checked={selectedPayment === 'cod'}
                    onChange={() => setSelectedPayment('cod')}
                    className="w-5 h-5 text-[#063344] focus:ring-[#063344] border-gray-300"
                  />
                </label>

                {/* Wallets */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                    </div>
                    <span className="text-[15px] font-bold text-gray-900 group-hover:text-gray-700 transition-colors">Paytm/Phone Pay/Amazon Pay etc</span>
                  </div>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="wallet"
                    checked={selectedPayment === 'wallet'}
                    onChange={() => setSelectedPayment('wallet')}
                    className="w-5 h-5 text-[#063344] focus:ring-[#063344] border-gray-300"
                  />
                </label>

                {/* Cards */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                    </div>
                    <span className="text-[15px] font-bold text-gray-900 group-hover:text-gray-700 transition-colors">Credit/Debit card</span>
                  </div>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="card"
                    checked={selectedPayment === 'card'}
                    onChange={() => setSelectedPayment('card')}
                    className="w-5 h-5 text-[#063344] focus:ring-[#063344] border-gray-300"
                  />
                </label>

                {/* Net Banking */}
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="20" width="20" height="2"/><rect x="4" y="10" width="4" height="10"/><rect x="10" y="10" width="4" height="10"/><rect x="16" y="10" width="4" height="10"/><path d="M2 10l10-8 10 8z"/></svg>
                    </div>
                    <span className="text-[15px] font-bold text-gray-900 group-hover:text-gray-700 transition-colors">Net Banking</span>
                  </div>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="netbanking"
                    checked={selectedPayment === 'netbanking'}
                    onChange={() => setSelectedPayment('netbanking')}
                    className="w-5 h-5 text-[#063344] focus:ring-[#063344] border-gray-300"
                  />
                </label>
              </div>

              <button 
                onClick={handlePayNow}
                disabled={isPlacing || addressLoading || cartItems.length === 0}
                className="w-full py-3.5 bg-[#063344] text-white text-[16px] font-bold rounded-[6px] hover:bg-[#042431] transition-colors shadow-sm disabled:opacity-55 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPlacing ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
