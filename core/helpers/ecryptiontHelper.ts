import * as Crypto from "expo-crypto";

export const generateCode = (length: number) => {
  return Array.from(Crypto.getRandomValues(new Uint8Array(length)))
    .map((num) => (num % 10).toString())
    .join("");
};