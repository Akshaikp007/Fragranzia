import React, { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiBell, FiUser, FiHeart, FiX } from 'react-icons/fi';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useWishlist } from '../../WishlistContext';

const Navbar = () => {
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (location.pathname !== '/products') {
      navigate(val.trim() ? `/products?search=${encodeURIComponent(val)}` : '/products');
    } else {
      if (val.trim()) {
        setSearchParams({ search: val }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (location.pathname === '/products') {
      setSearchParams({}, { replace: true });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== '/products') {
      navigate(searchTerm.trim() ? `/products?search=${encodeURIComponent(searchTerm.trim())}` : '/products');
    }
  };
  
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive
      ? "text-[#033b4a] font-bold text-[16px] border-b-2 border-[#033b4a] pb-0.5"
      : "text-[#555555] hover:text-[#033b4a] font-medium text-[16px] transition-colors pb-0.5";
  };

  return (
    <nav className="flex items-center justify-between px-10 py-5 bg-white border-b border-gray-100 font-sans">
      {/* 1. Logo */}
      <div className="flex-shrink-0">
        <Link to="/" className="text-[28px] font-black text-[#033b4a] tracking-tight">
          Fragranzia
        </Link>
      </div>

      {/* 2. Navigation Links */}
      <div className="hidden lg:flex items-center justify-center gap-x-10 flex-1">
        <Link to="/" className={getLinkClass('/')}>Home</Link>
        <Link to="/products" className={getLinkClass('/products')}>Products</Link>
        <Link to="/about" className={getLinkClass('/about')}>About</Link>
      </div>

      {/* 3. Search Input and Icons */}
      <div className="flex items-center gap-x-4 flex-shrink-0">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative hidden xl:block md:block mr-2">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FiSearch className="text-[#333333] w-[18px] h-[18px]" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            className="w-[280px] h-[46px] pl-11 pr-10 py-2 border border-[#E5E5E5] rounded-full text-[14px] font-[500] focus:outline-none focus:border-[#033b4a] focus:ring-1 focus:ring-[#033b4a] text-[#000000] placeholder-[#777777]"
            placeholder="Search perfumes..."
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-gray-700"
            >
              <FiX size={16} />
            </button>
          )}
        </form>

        {/* Icons */}
        <div className="flex items-center gap-x-3">
          <Link to="/wishlist" className="relative flex items-center justify-center w-[46px] h-[46px] border border-[#E5E5E5] rounded-full hover:bg-gray-50 transition-colors">
            <FiHeart className="w-[18px] h-[18px] text-[#222222]" strokeWidth={2.5} />
            {wishlistItems && wishlistItems.length > 0 && (
              <span className="absolute top-0 right-0 w-[18px] h-[18px] bg-[#033b4a] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="flex items-center justify-center w-[46px] h-[46px] border border-[#E5E5E5] rounded-full hover:bg-gray-50 transition-colors">
            <FiShoppingCart className="w-[18px] h-[18px] text-[#222222]" strokeWidth={2.5} />
          </Link>
          <button className="flex items-center justify-center w-[46px] h-[46px] border border-[#E5E5E5] rounded-full hover:bg-gray-50 transition-colors">
            <FiBell className="w-[18px] h-[18px] text-[#222222]" strokeWidth={2.5} />
          </button>
          <Link to="/profile" className="flex items-center justify-center w-[46px] h-[46px] border border-[#E5E5E5] bg-[#063344] rounded-full transition-colors hover:bg-[#042431]">
            <FiUser className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
