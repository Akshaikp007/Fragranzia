import React, { createContext, useState, useContext, useEffect } from 'react';
import useAuth from './hooks/useAuth';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const mapServerCartToClient = (serverCart) => {
  if (!Array.isArray(serverCart)) return [];
  return serverCart.map(item => {
    if (!item.product) return null;
    const p = item.product;
    const hasSalePrice = p.salePrice && p.salePrice > 0;
    const price = hasSalePrice ? p.salePrice : p.price;
    const originalPrice = hasSalePrice ? p.price : null;
    const discount = originalPrice ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% off` : "";
    return {
      id: p._id,
      title: p.name,
      price,
      originalPrice,
      discount,
      image: p.images?.[0] ? `http://localhost:5000/uploads/${p.images[0]}` : "https://via.placeholder.com/150",
      quantity: item.quantity
    };
  }).filter(Boolean);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (auth?.accessToken) {
      const fetchCart = async () => {
        try {
          const { data } = await axiosPrivate.get('/api/cart');
          let currentCart = mapServerCartToClient(data.cart);
          setCartItems(currentCart);

          // Check for pending cart item
          const pending = sessionStorage.getItem('pendingCartItem');
          if (pending) {
            try {
              const { product, quantity, removeWishlistId } = JSON.parse(pending);
              sessionStorage.removeItem('pendingCartItem');
              
              // Add to cart on server
              const addRes = await axiosPrivate.post('/api/cart/add', {
                productId: product.id,
                quantity
              });
              setCartItems(mapServerCartToClient(addRes.data.cart));
              
              if (removeWishlistId) {
                try {
                  await axiosPrivate.delete(`/api/wishlist/remove/${removeWishlistId}`);
                } catch (wishlistErr) {
                  console.error("Failed to remove from wishlist:", wishlistErr);
                }
              }
              
              toast.success('Item added to cart successfully!');
            } catch (err) {
              console.error("Error processing pending cart item:", err);
            }
          }
        } catch (error) {
          console.error("Fetch cart error:", error);
        }
      };
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [auth?.accessToken, axiosPrivate]);

  const addToCart = async (product, quantity) => {
    if (auth?.accessToken) {
      try {
        const { data } = await axiosPrivate.post('/api/cart/add', {
          productId: product.id,
          quantity
        });
        setCartItems(mapServerCartToClient(data.cart));
      } catch (error) {
        console.error("Add to cart error:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to add to cart");
        throw error;
      }
    } else {
      setCartItems(prevItems => {
        const existing = prevItems.find(item => item.id === product.id);
        if (existing) {
          return prevItems.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevItems, { ...product, quantity }];
      });
    }
  };

  const removeFromCart = async (id) => {
    if (auth?.accessToken) {
      try {
        const { data } = await axiosPrivate.delete(`/api/cart/remove/${id}`);
        setCartItems(mapServerCartToClient(data.cart));
      } catch (error) {
        console.error("Remove from cart error:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to remove from cart");
        throw error;
      }
    } else {
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  const updateQuantity = async (id, amount) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;
    const newQuantity = item.quantity + amount;
    if (newQuantity < 1) return;

    if (auth?.accessToken) {
      try {
        const { data } = await axiosPrivate.put('/api/cart/update', {
          productId: id,
          quantity: newQuantity
        });
        setCartItems(mapServerCartToClient(data.cart));
      } catch (error) {
        console.error("Update quantity error:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to update quantity");
        throw error;
      }
    } else {
      setCartItems(prevItems => prevItems.map(item => {
        if (item.id === id) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      }));
    }
  };

  const clearCart = async () => {
    if (auth?.accessToken) {
      try {
        await axiosPrivate.delete('/api/cart/clear');
        setCartItems([]);
      } catch (error) {
        console.error("Clear cart error:", error);
      }
    } else {
      setCartItems([]);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
