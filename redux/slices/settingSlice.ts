import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  biometricLogin: false,
  biometricSale: false,
};

const settingSlice = createSlice({
  name: "settingSlice",
  initialState,
  reducers: {
    onToggleBiometricLogin: (state, action: PayloadAction<boolean>) => {
      state.biometricLogin = action.payload;
    },
    onToggleBiometricSale: (state, action: PayloadAction<boolean>) => {
      state.biometricSale = action.payload;
    },
  },
});

export const { onToggleBiometricLogin, onToggleBiometricSale } =
  settingSlice.actions;
export default settingSlice.reducer;
