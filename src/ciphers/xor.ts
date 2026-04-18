import type { Cipher, CipherConfig } from "../types/cipher.types";
import {
  base64ToBytes,
  bytesToBase64,
  bytesToStr,
  strToBytes,
} from "../utils/bytes";

function xorBytes(data: Uint8Array, key: Uint8Array): Uint8Array {
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    out[i] = data[i] ^ key[i % key.length];
  }
  return out;
}

export const xorCipher: Cipher = {
  type: "xor",
  name: "XOR Cipher",
  shortName: "XOR",
  description:
    "Byte-wise XOR with a repeating key. Output is Base64-encoded so it can chain into other ciphers.",
  accent: "violet",
  configurable: true,
  configFields: [
    {
      name: "key",
      type: "text",
      label: "Key",
      placeholder: "secret",
      default: "key",
      description: "Any non-empty string. UTF-8 bytes are used.",
    },
  ],
  defaultConfig: { key: "key" },
  validate(config: CipherConfig) {
    const k = String(config.key ?? "");
    if (k.length === 0) return { ok: false, reason: "Key cannot be empty" };
    return { ok: true };
  },
  encrypt(input: string, config: CipherConfig) {
    const key = strToBytes(String(config.key));
    const data = strToBytes(input);
    const xored = xorBytes(data, key);
    return bytesToBase64(xored);
  },
  decrypt(input: string, config: CipherConfig) {
    const key = strToBytes(String(config.key));
    let bytes: Uint8Array;
    try {
      bytes = base64ToBytes(input);
    } catch {
      throw new Error("XOR decrypt expects valid Base64 input");
    }
    const xored = xorBytes(bytes, key);
    return bytesToStr(xored);
  },
};
