import {
  AUTH_STORE_ID,
  AUTH_STORE_TOKEN,
  getStorage,
} from "@/core/storage/authStorage";
import { api } from "../api";

export const ApiGetStoreById = async () => {
  const token = await getStorage(AUTH_STORE_TOKEN);
  const id = await getStorage(AUTH_STORE_ID);
  try {
    const url = `${api}/store/${id}`;
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

// export const ApiCreateStore = async (token: string, param: FormData) => {
//   try {
//     const url = `${api}/store/create_with_upload`;
//     const response = await fetch(url, {
//       method: "post",
//       body: param,
//       headers: {
//         //"Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.json();
//   } catch (error) {
//     return error;
//   }
// };
