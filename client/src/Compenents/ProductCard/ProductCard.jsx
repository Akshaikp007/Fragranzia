import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { useWishlist } from "../../WishlistContext";
import { useCart } from "../../CartContext";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleWishlistClick = (e) => {
    e.preventDefault(); // Prevent navigating to single product page
    toggleWishlist(product);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    const cartProduct = {
      id: product.id,
      title: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: discount ? `${discount}% off` : "",
      image: product.img
    };

    if (!auth?.accessToken) {
      sessionStorage.setItem('pendingCartItem', JSON.stringify({ product: cartProduct, quantity: 1 }));
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      await addToCart(cartProduct, 1);
      toast.success('Item added to cart successfully!');
    } catch (error) {
      // Handled in context
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="w-full h-full flex flex-col justify-between group no-underline">

      {/* Leaf shape card */}
      <div className="w-full p-6 shadow-lg border border-gray-200 rounded-tr-[70px] rounded-bl-[70px] sm:rounded-tr-[100px] sm:rounded-bl-[100px] overflow-hidden transition-all duration-500 hover:rounded-br-[100px] hover:rounded-tl-[100px] hover:rounded-tr-none hover:rounded-bl-none bg-white">

        {/* Aspect square keeps the image proportional in any layout */}
        <div className="relative w-full aspect-square flex items-center justify-center p-2 sm:p-5">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-contain drop-shadow-md scale-110 transition-transform duration-500 group-hover:scale-125"
          />
          {product.quantity <= 0 && (
            <span className="absolute bottom-3 left-3 bg-red-600 text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-1 rounded-[4px] shadow z-10 tracking-wide uppercase">
              Out of stock
            </span>
          )}
          {/* Premium Floating Wishlist Button */}
          <button 
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 w-[44px] h-[44px] rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.18)] bg-white/90 backdrop-blur-md z-10 transition-all duration-300 hover:scale-110 ${isInWishlist(product.id) ? 'bg-red-50/95' : ''}`}
          >
            <FiHeart className={`w-[24px] h-[24px] transition-colors duration-300 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-[#333] hover:text-black'}`} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="pt-4 flex items-start justify-center flex-col flex-grow">
        <p className="text-xs sm:text-sm text-gray-800 font-medium leading-snug line-clamp-2 min-h-[36px]">
          {product.name}
        </p>
        <div className="flex items-center justify-start gap-2 mt-2">
          <span className="font-bold text-gray-900 text-sm sm:text-base">
            RS {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 text-xs line-through">
              RS {product.originalPrice}
            </span>
          )}
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={product.quantity <= 0}
          className={`w-full mt-4 text-xs sm:text-sm py-2.5 rounded-lg transition-colors font-bold ${
            product.quantity <= 0 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
              : "bg-[#00354B] hover:bg-[#00344be5] text-white"
          }`}
        >
          {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>

    </Link>
  );
};

export default ProductCard;