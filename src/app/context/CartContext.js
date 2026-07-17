'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Load initial state safely on mount (client-side only)
  useEffect(() => {
    const savedCart = localStorage.getItem('urban_fit_cart');
    const savedWishlist = localStorage.getItem('urban_fit_wishlist');
    
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      } catch (error) {
        console.error("Failed to parse cart", error);
      }
    }
    
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) setWishlist(parsed);
      } catch (error) {
        console.error("Failed to parse wishlist", error);
      }
    }
  }, []);

  // Save changes to localStorage safely
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('urban_fit_cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('urban_fit_cart');
    }
  }, [cart]);

  useEffect(() => {
    if (wishlist.length > 0) {
      localStorage.setItem('urban_fit_wishlist', JSON.stringify(wishlist));
    } else {
      localStorage.removeItem('urban_fit_wishlist');
    }
  }, [wishlist]);

  const addToCart = (product, size = 'M') => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity: 1, selectedSize: size }];
    });
    setIsCartOpen(true); 
  };

  const removeFromCart = (productId, size) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) => !(item.id === productId && item.selectedSize === size)
      );
      return updatedCart;
    });
  };

  const updateQuantity = (productId, size, amount) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => {
          if (item.id === productId && item.selectedSize === size) {
            return { ...item, quantity: item.quantity + amount };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('urban_fit_cart');
  };

  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.find((item) => item.id === product.id);
      if (exists) {
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        return [...prevWishlist, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return Array.isArray(wishlist) && wishlist.some((item) => item.id === productId);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}