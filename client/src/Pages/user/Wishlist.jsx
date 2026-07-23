import React from 'react';
import Navbar from '../../Compenents/Navbar/Navbar';
import { useWishlist } from '../../WishlistContext';
import { useCart } from '../../CartContext';
import Footer from '../../Compenents/Footer/Footer';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMoveToCart = async (item) => {
    if (!auth?.accessToken) {
      sessionStorage.setItem('pendingCartItem', JSON.stringify({ product: item, quantity: 1, removeWishlistId: item.id }));
      navigate('/login', { state: { from: location } });
      return;
    }
    try {
      await addToCart(item, 1);
      await removeFromWishlist(item.id);
      toast.success('Item moved to cart successfully!');
    } catch (error) {
      // Errors are handled in contexts
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <div className="pb-4 mb-4">
          <h1 className="text-4xl font-extrabold text-[#000] mb-2 tracking-tight">My Wishlist</h1>
          <div className="text-sm text-gray-600 font-medium">
            <Link to="/" className="hover:text-gray-900 cursor-pointer">Home</Link> <span className="mx-1">&gt;</span> <span>Wishlist</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {wishlistItems.length === 0 ? (
            <div className="py-16 text-center text-gray-500 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 rounded-xl flex flex-col items-center">
              <p className="text-xl font-semibold mb-4">Your wishlist is empty</p>
              <Link to="/products" className="bg-[#063344] text-white px-6 py-3 rounded-[4px] font-bold hover:bg-[#042431] transition-colors">
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map(item => (
                <div key={item.id} className="p-6 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 rounded-xl flex flex-col gap-4 relative">
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove from wishlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <Link to={`/products/${item.id}`} className="flex items-center justify-center h-48 mb-2">
                    <img 
                      src={item.image || item.img} 
                      alt={item.title || item.name} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </Link>

                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <Link to={`/products/${item.id}`}>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-[#063344] transition-colors">{item.title || item.name}</h3>
                      </Link>
                      
                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-xl font-bold text-gray-900">
                          Rs {item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through mb-1">
                            Rs {item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleMoveToCart(item)}
                      className="w-full py-2.5 bg-[#063344] text-white font-bold hover:bg-[#042431] transition-colors rounded-[4px] shadow-sm mt-auto"
                    >
                      Move to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
