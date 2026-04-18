import type { Cipher, CipherConfig } from "../types/cipher.types";

function shiftChar(char: string, shift: number): string {
  const code = char.charCodeAt(0);
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
  }
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
  }
  return char;
}

function applyShift(input: string, shift: number): string {
  let out = "";
  for (let i = 0; i < input.length; i++) out += shiftChar(input[i], shift);
  return out;
}

export const caesarCipher: Cipher = {
  type: "caesar",
  name: "Caesar Cipher",
  shortName: "Caesar",
  description: "Shift each letter by N positions. Case preserved, non-letters untouched.",
  accent: "cyan",
  configurable: true,
  configFields: [
    {
      name: "shift",
      type: "number",
      label: "Shift",
      min: -25,
      max: 25,
      default: 3,
      description: "Letter offset (-25..25)",
    },
  ],
  defaultConfig: { shift: 3 },
  validate(config: CipherConfig) {
    const s = Number(config.shift);
    if (!Number.isFinite(s)) return { ok: false, reason: "Shift must be a number" };
    if (s < -25 || s > 25) return { ok: false, reason: "Shift must be in [-25, 25]" };
    return { ok: true };
  },
  encrypt(input: string, config: CipherConfig) {
    return applyShift(input, Number(config.shift) | 0);
  },
  decrypt(input: string, config: CipherConfig) {
    return applyShift(input, -(Number(config.shift) | 0));
  },
};
