import {
  CartInterface,
  CartItemInterface,
  ProductInterface,
} from "@/app/types";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cart";

const safeParseCart = (value: string | null): CartInterface => {
  try {
    if (!value) {
      return { total: "0", cartItems: [] };
    }

    const parsed = JSON.parse(value);

    return {
      total: parsed?.total ?? "0",
      cartItems: Array.isArray(parsed?.cartItems) ? parsed.cartItems : [],
    };
  } catch (err) {
    console.error("Invalid cart in localStorage", err);
    return { total: "0", cartItems: [] };
  }
};

const clampQuantity = (qty: number, stock: number) => {
  return Math.max(1, Math.min(qty, stock));
};

const calculateTotals = (cartItems: CartItemInterface[]) => {
  const updatedCartItems = cartItems.map((item) => {
    const subtotal = Number((item.price * item.quantity).toFixed(2));
    return { ...item, subtotal };
  });

  const total = updatedCartItems
    .reduce((acc, item) => acc + item.subtotal, 0)
    .toFixed(2);

  return { updatedCartItems, total };
};

const useCart = () => {
  const [cart, setCart] = useState<CartInterface>({
    total: "0",
    cartItems: [],
  });

  const [stockMessage, setStockMessage] = useState("");

  // Load cart ONCE
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setCart(safeParseCart(stored));
  }, []);

  // Persist cart safely
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to save cart", err);
    }
  }, [cart]);

  const handleAddToCart = (product: ProductInterface) => {
    setCart((prev) => {
      const existing = prev.cartItems.find((item) => item.id === product.id);

      let updatedItems: CartItemInterface[];

      if (existing) {
        updatedItems = prev.cartItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: clampQuantity(item.quantity + 1, item.stock),
              }
            : item,
        );
      } else {
        updatedItems = [
          ...prev.cartItems,
          {
            id: product.id,
            imageUrl: product.imageUrl,
            name: product.name,
            price: product.price,
            quantity: 1,
            subtotal: product.price,
            notes: "",
            stock: product.stock,
          },
        ];
      }

      const { updatedCartItems, total } = calculateTotals(updatedItems);

      return {
        ...prev,
        cartItems: updatedCartItems,
        total,
      };
    });
  };

  const handleRemove = (id: number | null) => {
    setCart((prev) => {
      if (id == null) return prev;

      const updatedItems =
        id === 0 ? [] : prev.cartItems.filter((item) => item.id !== id);

      const { updatedCartItems, total } = calculateTotals(updatedItems);

      return {
        ...prev,
        cartItems: updatedCartItems,
        total,
      };
    });
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity <= 0) {
      return handleRemove(id);
    }

    setCart((prev) => {
      const updatedItems = prev.cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: clampQuantity(quantity, item.stock),
            }
          : item,
      );

      const { updatedCartItems, total } = calculateTotals(updatedItems);

      return {
        ...prev,
        cartItems: updatedCartItems,
        total,
      };
    });
  };

  const handleNotesChange = (id: number, notes: string) => {
    setCart((prev) => {
      const updatedItems = prev.cartItems.map((item) =>
        item.id === id ? { ...item, notes } : item,
      );

      const { updatedCartItems, total } = calculateTotals(updatedItems);

      return {
        ...prev,
        cartItems: updatedCartItems,
        total,
      };
    });
  };

  return {
    cart,
    setCart,
    handleAddToCart,
    handleRemove,
    handleQuantityChange,
    handleNotesChange,
    stockMessage,
  };
};

export default useCart;
