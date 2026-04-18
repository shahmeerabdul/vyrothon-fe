import { nanoid } from "nanoid";
import type { CipherConfig, CipherNode, CipherType } from "../types/cipher.types";

export interface Preset {
  id: string;
  name: string;
  description: string;
  sampleInput: string;
  buildNodes: () => CipherNode[];
}

function node(type: CipherType, config: CipherConfig): CipherNode {
  return { id: nanoid(8), type, config };
}

export const PRESETS: Preset[] = [
  {
    id: "classic",
    name: "Classic Cascade",
    description: "Caesar(3) → XOR('key') → Vigenère('VYROTHON')",
    sampleInput: "Hello, CipherStack!",
    buildNodes: () => [
      node("caesar", { shift: 3 }),
      node("xor", { key: "key" }),
      node("vigenere", { keyword: "VYROTHON" }),
    ],
  },
  {
    id: "fortress",
    name: "Fortress (5 stages)",
    description: "Rail Fence → Caesar → Base64 → XOR → Vigenère",
    sampleInput: "The quick brown fox jumps over the lazy dog.",
    buildNodes: () => [
      node("railfence", { rails: 4 }),
      node("caesar", { shift: 7 }),
      node("base64", {}),
      node("xor", { key: "hackathon" }),
      node("vigenere", { keyword: "CIPHER" }),
    ],
  },
  {
    id: "letters",
    name: "Letters Only",
    description: "Caesar → Vigenère → Rail Fence (alphabet-safe)",
    sampleInput: "ATTACKATDAWN",
    buildNodes: () => [
      node("caesar", { shift: 11 }),
      node("vigenere", { keyword: "LEMON" }),
      node("railfence", { rails: 3 }),
    ],
  },
];
