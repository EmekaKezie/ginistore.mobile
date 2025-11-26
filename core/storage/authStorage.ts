import * as SecureStore from "expo-secure-store";

export const AUTH_EMAIL = "AUTH_EMAIL";
export const AUTH_PASSWORD = "AUTH_PASSWORD";
export const AUTH_TOKEN = "AUTH_TOKEN";

export const setStorage = async (key: string, value: string) => {
  return await SecureStore.setItemAsync(key, value);
};

export const getStorage = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};

export const deleteStorage = async (key: string) => {
  return await SecureStore.deleteItemAsync(key);
};
