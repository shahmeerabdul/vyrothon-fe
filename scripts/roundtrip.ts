import { roundTrip, runPipeline } from "../src/utils/pipeline";
import type { CipherNode } from "../src/types/cipher.types";

function n(type: CipherNode["type"], config: CipherNode["config"]): CipherNode {
  return { id: type + "-" + Math.random().toString(36).slice(2, 7), type, config };
}

const cases: Array<{ label: string; input: string; nodes: CipherNode[] }> = [
  {
    label: "Classic Caesar+XOR+Vigenère 'hello'",
    input: "hello",
    nodes: [
      n("caesar", { shift: 3 }),
      n("xor", { key: "abc" }),
      n("vigenere", { keyword: "key" }),
    ],
  },
  {
    label: "Mixed text with specials + Fortress 5",
    input: "The Quick Brown Fox 123 !@#$%^",
    nodes: [
      n("railfence", { rails: 4 }),
      n("caesar", { shift: 7 }),
      n("base64", {}),
      n("xor", { key: "hackathon" }),
      n("vigenere", { keyword: "CIPHER" }),
    ],
  },
  {
    label: "Long text 800 chars",
    input: "abcdefghijklmnopqrstuvwxyz0123456789".repeat(23),
    nodes: [
      n("vigenere", { keyword: "Vyrothon" }),
      n("caesar", { shift: -11 }),
      n("xor", { key: "𝕂𝔼𝕐" }),
      n("railfence", { rails: 5 }),
    ],
  },
  {
    label: "Letters only ATTACKATDAWN",
    input: "ATTACKATDAWN",
    nodes: [
      n("caesar", { shift: 11 }),
      n("vigenere", { keyword: "LEMON" }),
      n("railfence", { rails: 3 }),
    ],
  },
  {
    label: "Empty-ish (single char)",
    input: "A",
    nodes: [
      n("caesar", { shift: 5 }),
      n("xor", { key: "x" }),
      n("vigenere", { keyword: "Z" }),
    ],
  },
  {
    label: "UTF-8 emoji round-trip",
    input: "Hello 🌍 — привет!",
    nodes: [
      n("base64", {}),
      n("caesar", { shift: 4 }),
      n("xor", { key: "secret" }),
      n("vigenere", { keyword: "emoji" }),
    ],
  },
];

let pass = 0;
let fail = 0;

for (const c of cases) {
  const rt = roundTrip(c.input, c.nodes);
  const status = rt.ok ? "PASS" : "FAIL";
  if (rt.ok) pass++;
  else fail++;
  console.log(`[${status}] ${c.label}`);
  if (!rt.ok) {
    console.log("   input:    ", JSON.stringify(c.input));
    console.log("   encrypted:", JSON.stringify(rt.encrypted));
    console.log("   decrypted:", JSON.stringify(rt.decrypted));
  }
  const enc = runPipeline(c.input, c.nodes, "encrypt");
  console.log("   steps:", enc.intermediates.length, "final:", JSON.stringify(enc.finalOutput.slice(0, 60)));
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
