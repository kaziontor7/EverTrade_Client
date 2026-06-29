"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { getCartAction, addToCartAction, updateCartAction, deleteFromCartAction, clearCartAction } from "@/lib/actions/cart";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const refreshCart = () => {
    if (session?.user?.id) {
      getCartAction(session.user.id)
        .then(data => {
          if (Array.isArray(data)) {
            setCartItems(data);
          }
          setIsLoaded(true);
        })
        .catch(err => {
          console.error("Failed to load cart from DB", err);
          setIsLoaded(true);
        });
    } else {
      setCartItems([]);
      setIsLoaded(true);
    }
  };

  // Load cart from DB when session loads
  useEffect(() => {
    if (isPending) return;
    refreshCart();
  }, [session, isPending]);

  const addToCart = async (product) => {
    if (!session?.user?.id) {
      alert("Please sign in to add to cart");
      return;
    }

    let newQuantity = 1;
    // Optimistic UI update
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => (item.productId || item._id) === product._id);
      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        const limit = product.stock !== undefined ? product.stock : 99;
        if (newItems[existingItemIndex].cartQuantity < limit) {
          newItems[existingItemIndex].cartQuantity += 1;
          newQuantity = newItems[existingItemIndex].cartQuantity;
        } else {
          newQuantity = limit;
        }
        return newItems;
      }
      return [...prevItems, { ...product, cartQuantity: 1, productId: product._id }];
    });

    // Background sync
    try {
      await addToCartAction({ userId: session.user.id, ...product, cartQuantity: newQuantity });
    } catch (e) {
      console.error(e);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!session?.user?.id) return;

    if (newQuantity < 1) {
      return removeFromCart(productId);
    }

    let updatedProduct = null;
    const effectiveId = productId; // Assuming the UI sends the original product _id, which corresponds to productId in DB

    // Optimistic UI update
    setCartItems((prevItems) =>
      prevItems.map(item => {
        if ((item.productId || item._id) === effectiveId) {
          const limit = item.stock !== undefined ? item.stock : 99;
          updatedProduct = { ...item, cartQuantity: Math.min(newQuantity, limit) };
          return updatedProduct;
        }
        return item;
      })
    );

    if (updatedProduct) {
      try {
        await updateCartAction({ userId: session.user.id, ...updatedProduct, _id: effectiveId });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const removeFromCart = async (productId) => {
    if (!session?.user?.id) return;

    setCartItems((prevItems) => prevItems.filter(item => (item.productId || item._id) !== productId));

    try {
      await deleteFromCartAction(productId, session.user.id);
    } catch (e) {
      console.error(e);
    }
  };

  const clearCart = async () => {
    if (!session?.user?.id) return;
    setCartItems([]);

    try {
      await clearCartAction(session.user.id);
    } catch (e) {
      console.error(e);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.cartQuantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isLoaded,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
