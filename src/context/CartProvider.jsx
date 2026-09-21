import { useState } from "react";
import { CartContext } from "./CartContext";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function addToCart(service) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.id === service.id ||
          item.serviceId === service.serviceId ||
          item.title === service.title
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.title === service.title
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...service,

          // Make sure every cart item has a serviceId
          serviceId:
            service.serviceId ||
            service.id,

          quantity: 1
        }
      ];
    });
  }

  function removeFromCart(title) {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.title !== title
      )
    );
  }

  function increaseQuantity(title) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.title === title
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );
  }

  function decreaseQuantity(title) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.title === title
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}