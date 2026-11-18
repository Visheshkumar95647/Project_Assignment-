import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  items: [],
  restaurantId: null,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.restaurantId = action.payload.restaurantId || null;
    },

    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
    },
  },
});

export const {
  setCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;