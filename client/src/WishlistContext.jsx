import React, { createContext, useState, useContext, useEffect } from 'react';
import useAuth from './hooks/useAuth';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import toast from 'react-hot-toast';
import { getImageUrl } from './axios';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

const mapServerWishlistToClient = (serverWishlist) => {
  if (!Array.isArray(serverWishlist)) return [];
  return serverWishlist.map(p => {
    if (!p) return null;
    const hasSalePrice = p.salePrice && p.salePrice > 0;
    const price = hasSalePrice ? p.salePrice : p.price;
    const originalPrice = hasSalePrice ? p.price : null;
    return {
      id: p._id,
      title: p.name,
      price,
      originalPrice,
      image: getImageUrl(p.images?.[0]),
    };
  }).filter(Boolean);
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (auth?.accessToken) {
      const fetchWishlist = async () => {
        try {
          const { data } = await axiosPrivate.get('/api/wishlist');
          setWishlistItems(mapServerWishlistToClient(data.wishlist));
        } catch (error) {
          console.error("Fetch wishlist error:", error);
        }
      };
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [auth?.accessToken, axiosPrivate]);

  const toggleWishlist = async (product) => {
    const exists = wishlistItems.some(item => item.id === product.id);
    if (auth?.accessToken) {
      try {
        if (exists) {
          const { data } = await axiosPrivate.delete(`/api/wishlist/remove/${product.id}`);
          setWishlistItems(mapServerWishlistToClient(data.wishlist));
        } else {
          const { data } = await axiosPrivate.post('/api/wishlist/add', {
            productId: product.id
          });
          setWishlistItems(mapServerWishlistToClient(data.wishlist));
        }
      } catch (error) {
        console.error("Toggle wishlist error:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to toggle wishlist");
        throw error;
      }
    } else {
      setWishlistItems(prevItems => {
        if (exists) {
          return prevItems.filter(item => item.id !== product.id);
        }
        return [...prevItems, product];
      });
    }
  };

  const removeFromWishlist = async (id) => {
    if (auth?.accessToken) {
      try {
        const { data } = await axiosPrivate.delete(`/api/wishlist/remove/${id}`);
        setWishlistItems(mapServerWishlistToClient(data.wishlist));
      } catch (error) {
        console.error("Remove from wishlist error:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to remove from wishlist");
        throw error;
      }
    } else {
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  const isInWishlist = (id) => {
    return wishlistItems.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
