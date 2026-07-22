import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  isLoading: false,
  error: null,
};

/**
 * Cart Slice
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.total += action.payload.price * action.payload.quantity;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        state.total -= item.price * item.quantity;
        state.items = state.items.filter((item) => item.id !== action.payload);
      }
    },
    updateCartItem: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        state.total -= item.price * item.quantity;
        item.quantity = action.payload.quantity;
        state.total += item.price * item.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateCartItem, clearCart, setCartLoading } = cartSlice.actions;
export default cartSlice.reducer;
