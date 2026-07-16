'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // 1. Load cart and wishlist from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('urban_fit_cart');
    const savedWishlist = localStorage.getItem('urban_fit_wishlist');
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart", error);
      }
    }
    
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Failed to parse wishlist", error);
      }
    }
  }, []);

  // 2. Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0 || localStorage.getItem('urban_fit_cart')) {
      localStorage.setItem('urban_fit_cart', JSON.stringify(cart));
    }
  }, [cart]);

  // 3. Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (wishlist.length > 0 || localStorage.getItem('urban_fit_wishlist')) {
      localStorage.setItem('urban_fit_wishlist', JSON.stringify(wishlist));
    } else {
      localStorage.removeItem('urban_fit_wishlist');
    }
  }, [wishlist]);

  // --- CART HELPERS ---
  
  // Custom add to cart supporting size variants
  const addToCart = (product, size = 'M') => {
    setCart((prevCart) => {
      // Find if this exact product ID WITH this exact size already exists in cart
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        // If found, increment its quantity
        return prevCart.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // If not found, add a new line item with its unique selected size
      return [...prevCart, { ...product, quantity: 1, selectedSize: size }];
    });
    setIsCartOpen(true); 
  };

  // Remove matching both product ID and specific size
  const removeFromCart = (productId, size) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) => !(item.id === productId && item.selectedSize === size)
      );
      if (updatedCart.length === 0) {
        localStorage.removeItem('urban_fit_cart');
      }
      return updatedCart;
    });
  };

  // Update quantity matching both product ID and specific size
  const updateQuantity = (productId, size, amount) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => {
          if (item.id === productId && item.selectedSize === size) {
            const newQty = item.quantity + amount;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      if (updatedCart.length === 0) {
        localStorage.removeItem('urban_fit_cart');
      }
      return updatedCart;
    });
  };

  // --- WISHLIST HELPERS ---
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
    return wishlist.some((item) => item.id === productId);
  };

  // Totals
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
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