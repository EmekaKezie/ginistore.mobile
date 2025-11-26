import {
  AUTH_TOKEN,
  getStorage
} from "@/core/storage/authStorage";
import { ISwitchStore } from "@/types/IStore";
import { api } from "./api";

export const ApiGetStoreById = async (id: string) => {
  const token = await getStorage(AUTH_TOKEN);
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

export const ApiGetStoresByUserId = async (user_id: string) => {
  const token = await getStorage(AUTH_TOKEN);
  try {
    const url = `${api}/store/${user_id}/stores`;
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

export const ApiSwitchStore = async (param: ISwitchStore) => {
  const token = await getStorage(AUTH_TOKEN);
  try {
    const url = `${api}/store/switch_store`;
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
