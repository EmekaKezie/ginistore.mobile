import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  counter: 0,
};

const testSlice = createSlice({
  name: "testSlice",
  initialState,
  reducers: {
    onIncrement: (state) => {
      state.counter += 1;
    },
    onDecrement: (state) => {
      state.counter -= 1;
    },
  },
});

export const { onIncrement, onDecrement } = testSlice.actions;
export default testSlice.reducer;
