import { Eraser } from "lucide-react";
import type { Mode } from "../types/cipher.types";

interface Props {
  value: string;
  onChange: (v: string) => void;
  mode: Mode;
}

export function InputPanel({ value, onChange, mode }: Props) {
  const label = mode === "encrypt" ? "Plaintext Input" : "Ciphertext Input";
  const hint =
    mode === "encrypt"
      ? "Text to encrypt through the pipeline top → bottom."
      : "Ciphertext to decrypt (pipeline runs bottom → top).";

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900/70 backdrop-blur p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">{label}</h3>
          <p className="text-[11px] text-slate-400">{hint}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400">
            {value.length} chars
          </span>
          <button
            onClick={() => onChange("")}
            className="text-[11px] flex items-center gap-1 text-slate-400 hover:text-white"
            title="Clear"
          >
            <Eraser className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={
          mode === "encrypt"
            ? "Type or paste your message here…"
            : "Paste the ciphertext produced by encryption…"
        }
        className={`w-full resize-y rounded-xl bg-ink-950/80 border border-white/10 p-3 font-mono text-sm text-slate-100 focus:outline-none focus:ring-2 ${
          mode === "encrypt" ? "focus:ring-cyan-400/40" : "focus:ring-rose-400/40"
        }`}
      />
    </div>
  );
}
