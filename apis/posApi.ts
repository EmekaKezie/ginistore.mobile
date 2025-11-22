import { AUTH_STORE_TOKEN, getStorage } from "@/core/storage/authStorage";
import { IPosInput } from "@/types/IPos";
import { api } from "./api";

export const ApiGetPosProducts = async () => {
  const token = await getStorage(AUTH_STORE_TOKEN);
  try {
    const url = `${api}/pos/products`;
    const response = await fetch(url, {
      method: "get",
      //body: JSON.stringify(param),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const ApiGetPosProductBatches = async (product_id: string) => {
  const token = await getStorage(AUTH_STORE_TOKEN);
  try {
    const url = `${api}/pos/products/${product_id}/batches`;
    const response = await fetch(url, {
      method: "get",
      //body: JSON.stringify(param),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};

export const ApiPosConfirmSale = async (param: IPosInput) => {
  const token = await getStorage(AUTH_STORE_TOKEN);
  try {
    const url = `${api}/pos/confirm_sale`;
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify(param),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};
