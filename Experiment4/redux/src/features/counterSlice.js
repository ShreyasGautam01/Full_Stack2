import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: { 
    value: 0,
    lastAction: 'None' 
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
      state.lastAction = 'INCREMENT';
    },
    decrement: (state) => {
      state.value -= 1;
      state.lastAction = 'DECREMENT';
    },
    reset: (state) => {
      state.value = 0;
      state.lastAction = 'RESET';
    }
  },
});

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;