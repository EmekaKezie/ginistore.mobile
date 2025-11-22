import * as SecureStore from "expo-secure-store";

export const AUTH_STORE_EMAIL = "AUTH_STORE_EMAIL";
export const AUTH_STORE_PASSWORD = "AUTH_STORE_PASSWORD";
export const AUTH_STORE_TOKEN = "AUTH_STORE_TOKEN";
export const AUTH_STORE_ID = "AUTH_STORE_ID";

export const setStorage = async (key: string, value: string) => {
  return await SecureStore.setItemAsync(key, value);
};

export const getStorage = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};
