import type { Cipher, CipherType } from "../types/cipher.types";
import { caesarCipher } from "./caesar";
import { xorCipher } from "./xor";
import { vigenereCipher } from "./vigenere";
import { railFenceCipher } from "./railfence";
import { base64Cipher } from "./base64";

export const CIPHERS: Record<CipherType, Cipher> = {
  caesar: caesarCipher,
  xor: xorCipher,
  vigenere: vigenereCipher,
  railfence: railFenceCipher,
  base64: base64Cipher,
};

export const CIPHER_LIST: Cipher[] = [
  caesarCipher,
  xorCipher,
  vigenereCipher,
  railFenceCipher,
  base64Cipher,
];

export function getCipher(type: CipherType): Cipher {
  const c = CIPHERS[type];
  if (!c) throw new Error(`Unknown cipher type: ${type}`);
  return c;
}
