import { AUTH_TOKEN, getStorage } from "@/core/storage/authStorage";
import { api } from "../api";

export const ApiGetCollectionAccounts = async () => {
  const token = await getStorage(AUTH_TOKEN);
  try {
    const url = `${api}/collectionaccount/get_collection_accounts/store`;
    const response = await fetch(url, {
      method: "get",
      //body: param,
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
