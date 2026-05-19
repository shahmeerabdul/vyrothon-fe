# CipherStack

A visual, node-based cascade encryption builder. Drop cipher nodes onto a pipeline, configure each one, and watch your plaintext flow through every stage. Hit **Decrypt** and the exact same pipeline walks backwards — bit-for-bit recovery of the original.

Built for Vyrothon in a single session. No external cipher libraries — every algorithm is implemented from scratch.

---

## Features

- **5 cipher algorithms** (4 configurable + 1 zero-config):
  - Caesar cipher (`shift` ∈ [-25, 25]) 
  - XOR cipher (arbitrary UTF-8 key, output Base64-encoded)
  - Vigenère cipher (alphabetic keyword)
  - Rail Fence cipher (2..32 rails)
  - Base64 (no config, always invertible)
- **Node-based pipeline** — add, remove, reorder (up/down), configure per node.
- **Bidirectional execution** — encrypt top→bottom, decrypt bottom→top.
- **Full intermediate visibility** — every node shows what it received, what it produced, and how long it took.
- **Round-trip verifier** — one-click proof that `decrypt(encrypt(x)) === x` exactly.
- **Live mode** — auto-executes as you type or edit nodes.
- **Import / Export** pipelines as JSON.
- **Presets** — 3 ready-to-run cascades to demo instantly.
- **Use-as-input** — one click pipes the output back into the input for chained experimentation.
- **Copy / download** output as text.
- **Keyboard shortcut** — `Ctrl`/`⌘` + `Enter` to execute.
- **Responsive, dark, modern UI** with per-cipher accent colors and animated data-flow connectors.

## Tech Stack

- React 19 + TypeScript (strict)
- Vite 8
- Tailwind CSS 3
- lucide-react icons
- nanoid for node IDs

## Quick Start

```bash
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173/`).

### Other scripts

```bash
npm run build     # production build into dist/
npm run preview   # preview the production build
npx tsx scripts/roundtrip.ts    # automated round-trip test harness
```

## How the Pipeline Works

```
ENCRYPT:   plaintext → N1.encrypt → N2.encrypt → … → Nn.encrypt → ciphertext
DECRYPT:   ciphertext → Nn.decrypt → … → N2.decrypt → N1.decrypt → plaintext
```

Each cipher implements a pure `encrypt(input, config)` and `decrypt(input, config)`. The pipeline engine (`src/utils/pipeline.ts`) walks nodes in the correct direction for the selected mode, captures every intermediate input/output, per-step timing, and surfaces errors inline.

### Safe chaining

XOR produces arbitrary bytes that would break letter-only ciphers downstream. CipherStack solves this by **Base64-encoding XOR output**, so any cipher can follow any other cipher in any order — and the inverse still recovers the original exactly. The included automated test harness covers UTF-8, emoji, 800-character payloads, and all-special-character inputs.

## Project Structure

```
src/
├── types/cipher.types.ts          # Cipher / Node / Pipeline interfaces
├── ciphers/
│   ├── caesar.ts
│   ├── xor.ts
│   ├── vigenere.ts
│   ├── railfence.ts
│   ├── base64.ts
│   └── index.ts                   # registry
├── utils/
│   ├── pipeline.ts                # execute + round-trip
│   ├── bytes.ts                   # UTF-8 / Base64 helpers
│   ├── presets.ts                 # demo cascades
│   └── accent.ts                  # per-cipher color tokens
├── components/
│   ├── CipherLibrary.tsx
│   ├── CipherNodeCard.tsx
│   ├── Pipeline.tsx
│   ├── InputPanel.tsx
│   ├── OutputPanel.tsx
│   ├── IntermediateOutputs.tsx
│   ├── RoundTripBanner.tsx
│   └── ToolBar.tsx
├── App.tsx
├── main.tsx
└── index.css
scripts/
└── roundtrip.ts                   # Node-runnable correctness tests
```

## Round-Trip Test Results

`npx tsx scripts/roundtrip.ts` — all pass:

- Classic Caesar+XOR+Vigenère on `"hello"`
- Mixed text with specials + 5-stage Fortress cascade
- 800-character mixed alphanumeric payload
- `"ATTACKATDAWN"` with Caesar → Vigenère → Rail Fence
- Single-char input
- UTF-8 emoji + Cyrillic round-trip

## Design Decisions

- **Base64 as XOR's output format** — keeps the pipeline printable/chainable while remaining lossless.
- **Non-letters preserved** in Caesar & Vigenère (spaces, punctuation stay put), matching textbook definitions and keeping the cascade reversible.
- **Live mode on by default** so configuration changes are instantly visible — great for demos and learning.
- **Per-cipher accent colors** make it trivial to eyeball pipeline structure at a glance.
- **Intermediate panel renders in visual (top→bottom) order regardless of mode** — when decrypting, it still reads top→bottom on screen, even though execution runs bottom→top, so users see the exact per-stage transformation alignment.


## License

MIT — built for Vyrothon.
