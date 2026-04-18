import { Check, Copy, Layers } from "lucide-react";
import { useState } from "react";
import { getCipher } from "../ciphers";
import type { IntermediateStep, Mode } from "../types/cipher.types";
import { accentMap } from "../utils/accent";

interface Props {
  steps: IntermediateStep[];
  mode: Mode;
}

export function IntermediateOutputs({ steps, mode }: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copy = async (value: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900/70 backdrop-blur p-4">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-4 h-4 text-slate-300" />
        <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
          Intermediate Outputs
        </h3>
        <span className="text-[10px] text-slate-500">
          {mode === "encrypt" ? "forward pass" : "reverse pass"}
        </span>
      </div>
      {steps.length === 0 ? (
        <p className="text-xs text-slate-400">
          Run the pipeline to see per-node input/output here.
        </p>
      ) : (
        <ol className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
          {steps.map((s, i) => {
            const cipher = getCipher(s.nodeType);
            const a = accentMap[cipher.accent];
            return (
              <li
                key={s.nodeId + i}
                className={`rounded-xl border ${
                  s.error ? "border-rose-500/40" : "border-white/10"
                } bg-black/25 p-2.5`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded ${a.bg} ${a.text} font-mono text-[11px] font-bold flex items-center justify-center`}
                    >
                      {i + 1}
                    </span>
                    <span className={`text-xs font-semibold ${a.text}`}>
                      {cipher.shortName}
                    </span>
                    {!s.error && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {s.ms.toFixed(2)}ms
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => copy(s.output, i)}
                    disabled={!s.output}
                    className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-white disabled:opacity-40"
                  >
                    {copiedIdx === i ? (
                      <Check className="w-3 h-3 text-lime-300" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    copy
                  </button>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">
                  in
                </div>
                <div className="font-mono text-[11px] text-slate-200 break-all leading-relaxed mb-1">
                  {s.input || "—"}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">
                  out
                </div>
                <div
                  className={`font-mono text-[11px] break-all leading-relaxed ${
                    s.error ? "text-rose-300" : a.text
                  }`}
                >
                  {s.error ? `⚠ ${s.error}` : s.output || "—"}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
