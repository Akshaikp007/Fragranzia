import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Compenents/Navbar/Navbar';
import { useCart } from '../../CartContext';
import Footer from '../../Compenents/Footer/Footer';

const Cart = () => {
  const { cartItems: items, removeFromCart, updateQuantity } = useCart();

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalOriginalPrice = items.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const totalDiscount = totalOriginalPrice - totalPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-2">
            
            {/* Header */}
            <div className="pb-4 mb-4">
              <h1 className="text-4xl font-extrabold text-[#000] mb-2 tracking-tight">Cart</h1>
              <div className="text-sm text-gray-600 font-medium">
                <span className="hover:text-gray-900 cursor-pointer">Home</span> <span className="mx-1">&gt;</span> <span>Cart</span>
              </div>
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="py-8 text-center text-gray-500 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 rounded-xl">Your cart is empty.</div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="p-6 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 rounded-xl flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full md:w-40 flex-shrink-0 flex items-center justify-center">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-auto object-contain max-h-[160px]"
                      />
                    </div>

                    {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                          
                          {/* Quantity Selector */}
                          <div className="flex items-center w-max border border-gray-300 rounded text-lg font-medium">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-4 py-1 hover:bg-gray-100 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-4 py-1 hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          {/* Price Display */}
                          <div className="flex items-end gap-3 mt-4">
                            <span className="text-2xl font-bold text-gray-900">
                              Rs {item.price}
                            </span>
                            <span className="text-sm text-gray-500 line-through mb-1">
                              Rs {item.originalPrice}
                            </span>
                            <span className="text-sm font-bold text-green-600 mb-1">
                              {item.discount}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-5 mt-6">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="w-[150px] py-2.5 border-[2px] border-[#e33737] text-[#e33737] font-semibold hover:bg-red-50 transition-colors rounded-[4px]"
                          >
                            Delete
                          </button>
                          <button className="w-[150px] py-2.5 border-[2px] border-[#111] text-[#111] font-semibold hover:bg-gray-50 transition-colors rounded-[4px]">
                            Share
                          </button>
                          <button className="w-[160px] py-2.5 bg-[#063344] text-white font-bold hover:bg-[#042431] transition-colors rounded-[4px] shadow-sm">
                            Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
            </div>
          </div>

          {/* Right Column: Checkout Summary */}
          <div className="lg:col-span-1 pt-8 lg:pt-[100px]">
            <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 p-6 sticky top-24 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Check Out</h2>
              
              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between items-center text-lg">
                  <span>Price ({totalItems} item{totalItems !== 1 && 's'})</span>
                  <span className="font-bold text-black">Rs {totalOriginalPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center text-lg">
                  <span>Discount</span>
                  <span className="font-bold text-black">Rs {totalDiscount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center text-lg">
                  <span>Delivery Charge</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                
                <div className="border-t border-gray-200 pt-5 mt-5 flex justify-between items-center text-xl font-bold text-black">
                  <span>Total Amount</span>
                  <span>Rs {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Link to="/payment" className="w-full mt-8 py-3 bg-[#063344] text-white text-[16px] font-bold hover:bg-[#042431] transition-colors rounded-[4px] shadow-sm tracking-wide text-center block">
                Proceed to Buy
              </Link>

              <p className="text-center text-[11px] text-gray-500 mt-5 max-w-[85%] mx-auto leading-relaxed">
                Safe and Secure Payments. Easy returns. 100% Authentic products.
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  
  );
};

export default Cart;

