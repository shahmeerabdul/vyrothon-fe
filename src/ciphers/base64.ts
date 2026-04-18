import type { Cipher, CipherConfig } from "../types/cipher.types";
import {
  base64ToBytes,
  bytesToBase64,
  bytesToStr,
  strToBytes,
} from "../utils/bytes";

export const base64Cipher: Cipher = {
  type: "base64",
  name: "Base64 Encoder",
  shortName: "Base64",
  description:
    "Standard Base64. No configuration — an always-valid, self-inverse pipeline stage.",
  accent: "rose",
  configurable: false,
  configFields: [],
  defaultConfig: {},
  validate(_config: CipherConfig) {
    return { ok: true };
  },
  encrypt(input: string, _config: CipherConfig) {
    return bytesToBase64(strToBytes(input));
  },
  decrypt(input: string, _config: CipherConfig) {
    return bytesToStr(base64ToBytes(input));
  },
};
