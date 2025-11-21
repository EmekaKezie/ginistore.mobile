// import { ILogin } from "@/types/IAuth";
import { ILogin } from "../types/IAuth";
import { api } from "./api";

export const apiLogin = async (param: ILogin) => {
  try {
    const url = `${api}/auth/login`;
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify(param),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};
