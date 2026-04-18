import type { Cipher, CipherConfig } from "../types/cipher.types";

function normalizeKey(key: string): number[] {
  const shifts: number[] = [];
  for (let i = 0; i < key.length; i++) {
    const c = key.charCodeAt(i);
    if (c >= 97 && c <= 122) shifts.push(c - 97);
    else if (c >= 65 && c <= 90) shifts.push(c - 65);
  }
  return shifts;
}

function applyVigenere(input: string, keyword: string, sign: 1 | -1): string {
  const shifts = normalizeKey(keyword);
  if (shifts.length === 0) return input;
  let out = "";
  let ki = 0;
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    const s = sign * shifts[ki % shifts.length];
    if (code >= 97 && code <= 122) {
      out += String.fromCharCode(((code - 97 + s) % 26 + 26) % 26 + 97);
      ki++;
    } else if (code >= 65 && code <= 90) {
      out += String.fromCharCode(((code - 65 + s) % 26 + 26) % 26 + 65);
      ki++;
    } else {
      out += input[i];
    }
  }
  return out;
}

export const vigenereCipher: Cipher = {
  type: "vigenere",
  name: "Vigenère Cipher",
  shortName: "Vigenère",
  description:
    "Polyalphabetic substitution. Each keyword letter applies a different Caesar shift.",
  accent: "lime",
  configurable: true,
  configFields: [
    {
      name: "keyword",
      type: "text",
      label: "Keyword",
      placeholder: "KEY",
      default: "KEY",
      description: "Letters only. Non-letters are stripped.",
    },
  ],
  defaultConfig: { keyword: "KEY" },
  validate(config: CipherConfig) {
    const kw = String(config.keyword ?? "");
    if (kw.length === 0) return { ok: false, reason: "Keyword cannot be empty" };
    if (normalizeKey(kw).length === 0)
      return { ok: false, reason: "Keyword must contain at least one letter" };
    return { ok: true };
  },
  encrypt(input: string, config: CipherConfig) {
    return applyVigenere(input, String(config.keyword), 1);
  },
  decrypt(input: string, config: CipherConfig) {
    return applyVigenere(input, String(config.keyword), -1);
  },
};
