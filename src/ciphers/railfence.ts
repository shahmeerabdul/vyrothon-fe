import type { Cipher, CipherConfig } from "../types/cipher.types";

function railPattern(length: number, rails: number): number[] {
  if (rails <= 1 || length <= 1) return new Array(length).fill(0);
  const pattern: number[] = [];
  let row = 0;
  let dir = 1;
  for (let i = 0; i < length; i++) {
    pattern.push(row);
    if (row === 0) dir = 1;
    else if (row === rails - 1) dir = -1;
    row += dir;
  }
  return pattern;
}

function railEncrypt(input: string, rails: number): string {
  if (rails <= 1 || input.length <= 1) return input;
  const pattern = railPattern(input.length, rails);
  const rows: string[][] = Array.from({ length: rails }, () => []);
  for (let i = 0; i < input.length; i++) rows[pattern[i]].push(input[i]);
  return rows.map((r) => r.join("")).join("");
}

function railDecrypt(input: string, rails: number): string {
  if (rails <= 1 || input.length <= 1) return input;
  const pattern = railPattern(input.length, rails);
  const counts = new Array(rails).fill(0);
  for (const r of pattern) counts[r]++;

  const rowStrings: string[] = [];
  let cursor = 0;
  for (let r = 0; r < rails; r++) {
    rowStrings.push(input.slice(cursor, cursor + counts[r]));
    cursor += counts[r];
  }
  const rowIdx = new Array(rails).fill(0);
  let out = "";
  for (let i = 0; i < input.length; i++) {
    const r = pattern[i];
    out += rowStrings[r][rowIdx[r]++];
  }
  return out;
}

export const railFenceCipher: Cipher = {
  type: "railfence",
  name: "Rail Fence Cipher",
  shortName: "Rail Fence",
  description:
    "Zigzag transposition across N rails. Writes in a V pattern, reads row by row.",
  accent: "amber",
  configurable: true,
  configFields: [
    {
      name: "rails",
      type: "number",
      label: "Rails",
      min: 2,
      max: 32,
      default: 3,
      description: "Number of rails (2..32)",
    },
  ],
  defaultConfig: { rails: 3 },
  validate(config: CipherConfig) {
    const r = Number(config.rails);
    if (!Number.isInteger(r)) return { ok: false, reason: "Rails must be an integer" };
    if (r < 2) return { ok: false, reason: "Rails must be >= 2" };
    if (r > 32) return { ok: false, reason: "Rails must be <= 32" };
    return { ok: true };
  },
  encrypt(input: string, config: CipherConfig) {
    return railEncrypt(input, Number(config.rails) | 0);
  },
  decrypt(input: string, config: CipherConfig) {
    return railDecrypt(input, Number(config.rails) | 0);
  },
};
