import { ArrowDown, ArrowUp, Trash2, AlertTriangle } from "lucide-react";
import { getCipher } from "../ciphers";
import type {
  CipherNode,
  IntermediateStep,
  Mode,
} from "../types/cipher.types";
import { accentMap } from "../utils/accent";

interface Props {
  node: CipherNode;
  index: number;
  total: number;
  mode: Mode;
  step?: IntermediateStep;
  onConfigChange: (id: string, key: string, value: string | number) => void;
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

function preview(value: string, limit = 160): string {
  if (!value) return "—";
  if (value.length <= limit) return value;
  return value.slice(0, limit) + "…";
}

export function CipherNodeCard({
  node,
  index,
  total,
  mode,
  step,
  onConfigChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props) {
  const cipher = getCipher(node.type);
  const a = accentMap[cipher.accent];
  const validity = cipher.validate(node.config);
  const hasError = !validity.ok || !!step?.error;

  return (
    <div
      className={`relative rounded-2xl border ${
        hasError ? "border-rose-500/50" : "border-white/10"
      } bg-ink-800/70 backdrop-blur p-4 ${hasError ? "" : a.glow} animate-pop`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-lg ${a.bg} ${a.text} font-mono text-sm font-bold shrink-0`}
          >
            {index + 1}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-semibold ${a.text}`}>{cipher.name}</h3>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded border ${a.chip} uppercase tracking-wider`}
              >
                {cipher.shortName}
              </span>
              {step && !step.error && (
                <span className="text-[10px] text-slate-400 font-mono">
                  {step.ms.toFixed(2)}ms
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              {cipher.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onMoveUp(node.id)}
            disabled={index === 0}
            title="Move up"
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMoveDown(node.id)}
            disabled={index === total - 1}
            title="Move down"
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(node.id)}
            title="Remove"
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-300 hover:bg-rose-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {cipher.configFields.length > 0 && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {cipher.configFields.map((field) => {
            const value = node.config[field.name];
            return (
              <label key={field.name} className="block">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">
                    {field.label}
                  </span>
                  {field.description && (
                    <span className="text-[10px] text-slate-500">
                      {field.description}
                    </span>
                  )}
                </div>
                <input
                  type={field.type === "number" ? "number" : "text"}
                  value={value as string | number}
                  min={field.min}
                  max={field.max}
                  placeholder={field.placeholder}
                  onChange={(e) => {
                    const v =
                      field.type === "number"
                        ? e.target.value === ""
                          ? 0
                          : Number(e.target.value)
                        : e.target.value;
                    onConfigChange(node.id, field.name, v);
                  }}
                  className={`mt-1 w-full rounded-lg bg-ink-950/80 border border-white/10 px-3 py-1.5 font-mono text-sm text-slate-100 focus:outline-none focus:ring-2 ${a.ring}`}
                />
              </label>
            );
          })}
        </div>
      )}

      {!validity.ok && (
        <div className="mt-3 flex items-center gap-2 text-rose-300 text-xs bg-rose-500/10 border border-rose-500/30 rounded-md px-2 py-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{validity.reason}</span>
        </div>
      )}

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="rounded-lg bg-black/30 border border-white/5 p-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
            {mode === "encrypt" ? "Input" : "Input (ciphertext)"}
          </div>
          <div className="font-mono text-xs text-slate-200 break-all min-h-[1.25rem] leading-relaxed">
            {step ? preview(step.input) : "—"}
          </div>
        </div>
        <div
          className={`rounded-lg bg-black/30 border ${
            step?.error ? "border-rose-500/40" : a.border
          } p-2`}
        >
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
            {mode === "encrypt" ? "Output" : "Output (closer to plaintext)"}
          </div>
          <div
            className={`font-mono text-xs break-all min-h-[1.25rem] leading-relaxed ${
              step?.error ? "text-rose-300" : a.text
            }`}
          >
            {step?.error
              ? `⚠ ${step.error}`
              : step
              ? preview(step.output)
              : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
