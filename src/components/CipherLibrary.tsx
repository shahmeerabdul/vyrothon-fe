import { Plus, Library } from "lucide-react";
import { CIPHER_LIST } from "../ciphers";
import type { CipherType } from "../types/cipher.types";
import { accentMap } from "../utils/accent";

interface Props {
  onAdd: (type: CipherType) => void;
}

export function CipherLibrary({ onAdd }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900/70 backdrop-blur p-4">
      <div className="flex items-center gap-2 mb-4">
        <Library className="w-4 h-4 text-slate-300" />
        <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">
          Cipher Library
        </h2>
      </div>
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Click any cipher to add a node to the end of the pipeline.
      </p>
      <div className="space-y-2">
        {CIPHER_LIST.map((c) => {
          const a = accentMap[c.accent];
          return (
            <button
              key={c.type}
              onClick={() => onAdd(c.type)}
              className={`group w-full text-left rounded-xl border ${a.border} ${a.bg} hover:bg-white/5 transition p-3 flex items-start gap-3`}
            >
              <span
                className={`mt-1 w-2 h-2 rounded-full ${a.dot} shrink-0 shadow-[0_0_10px_currentColor]`}
                style={{ color: "currentColor" }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-medium text-sm ${a.text}`}>
                    {c.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500">
                    {c.configurable ? "configurable" : "no config"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug mt-1">
                  {c.description}
                </p>
              </div>
              <Plus className="w-4 h-4 text-slate-400 group-hover:text-white transition shrink-0 mt-1" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
