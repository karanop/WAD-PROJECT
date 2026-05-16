import { createContext, useState, useEffect, useMemo } from 'react';

const CART_STORAGE_KEY = 'social_klub_cart';

export const CartContext = createContext();

function parsePrice(price) {
  if (price === 'Free' || price == null || price === '') return 0;
  const n = Number(price);
  return Number.isFinite(n) ? n : 0;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  const addItem = (item) => {
    const hasId = cart.some((i) => i.id === item.id);
    if (hasId) return false;
    setCart((prev) => [...prev, item]);
    return true;
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const isInCart = (id) => cart.some((i) => i.id === id);

  const cartCount = cart.length;

  const subtotal = useMemo(() => {
    return cart.reduce((sum, i) => sum + parsePrice(i.price), 0);
  }, [cart]);

  const value = {
    cart,
    addItem,
    removeItem,
    clearCart,
    isInCart,
    cartCount,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
