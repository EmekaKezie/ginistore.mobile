import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthStore } from "../../types/IAuth";

const initialState: IAuthStore = {
  isAuthenticated: false,
  auth: {
    token: "",
    user_id: "",
    email: "",
    firstname: "",
    lastname: "",
    is_temporal_password: 0,
    is_verified: 0,
    employee_id: "",
    role_id: "",
    role_name: "",
    company_id: "",
    company_name: "",
    company_slug: "",
    store_id: "",
    store_name: "",
    store_created_date: "",
    store_slug: "",
    currency_code: "",
    country_code: "",
    country_flag_url: "",
    role_privileges: [],
  },
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    onLogin: (state, action: PayloadAction<IAuthStore>) => {
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        auth: action.payload.auth,
      };
    },
    onLogout: (state) => {
      return {
        ...state,
        isAuthenticated: false,
        auth: {
          token: "",
          user_id: "",
          email: "",
          firstname: "",
          lastname: "",
          is_temporal_password: 0,
          is_verified: 0,
          employee_id: "",
          role_id: "",
          role_name: "",
          company_id: "",
          company_name: "",
          company_slug: "",
          store_id: "",
          store_name: "",
          store_created_date: "",
          store_slug: "",
          currency_code: "",
          country_code: "",
          country_flag_url: "",
          role_privileges: [],
        },
      };
    },
  },
});

export const { onLogin, onLogout } = authSlice.actions;
export default authSlice.reducer;
