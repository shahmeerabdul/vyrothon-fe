import { Check, Copy, Download, ShieldAlert, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Mode, PipelineResult } from "../types/cipher.types";

interface Props {
  result: PipelineResult | null;
  mode: Mode;
  onSendToInput: () => void;
}

export function OutputPanel({ result, mode, onSendToInput }: Props) {
  const [copied, setCopied] = useState(false);

  const label = mode === "encrypt" ? "Encrypted Output" : "Decrypted Output";
  const themeRing =
    mode === "encrypt" ? "focus:ring-cyan-400/40" : "focus:ring-rose-400/40";

  const copy = async () => {
    if (!result?.finalOutput) return;
    try {
      await navigator.clipboard.writeText(result.finalOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };

  const download = () => {
    if (!result?.finalOutput) return;
    const blob = new Blob([result.finalOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "encrypt" ? "ciphertext.txt" : "plaintext.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`rounded-2xl border ${
        result?.error ? "border-rose-500/40" : "border-white/10"
      } bg-ink-900/70 backdrop-blur p-4`}
    >
      <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-200">{label}</h3>
          {result && !result.error && (
            <span className="text-[11px] font-mono text-slate-400">
              · {result.totalMs.toFixed(2)}ms · {result.finalOutput.length} chars
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSendToInput}
            disabled={!result?.finalOutput}
            className="text-[11px] flex items-center gap-1 px-2 py-1 rounded-md border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
            title={
              mode === "encrypt"
                ? "Send output to input (for decrypt)"
                : "Send output to input"
            }
          >
            <Sparkles className="w-3.5 h-3.5" />
            Use as input
          </button>
          <button
            onClick={copy}
            disabled={!result?.finalOutput}
            className="text-[11px] flex items-center gap-1 px-2 py-1 rounded-md border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-lime-300" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={download}
            disabled={!result?.finalOutput}
            className="text-[11px] flex items-center gap-1 px-2 py-1 rounded-md border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            .txt
          </button>
        </div>
      </div>

      {result?.error ? (
        <div className="flex items-start gap-2 text-rose-300 text-sm bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{result.error}</span>
        </div>
      ) : (
        <textarea
          readOnly
          value={result?.finalOutput ?? ""}
          rows={4}
          placeholder="Press Execute to run the pipeline…"
          className={`w-full resize-y rounded-xl bg-ink-950/80 border border-white/10 p-3 font-mono text-sm text-slate-100 focus:outline-none focus:ring-2 ${themeRing}`}
        />
      )}
    </div>
  );
}
