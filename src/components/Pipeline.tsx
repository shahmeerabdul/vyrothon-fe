import { ChevronDown, ChevronUp, Inbox } from "lucide-react";
import type {
  CipherNode,
  IntermediateStep,
  Mode,
} from "../types/cipher.types";
import { CipherNodeCard } from "./CipherNodeCard";

interface Props {
  nodes: CipherNode[];
  mode: Mode;
  intermediatesInOrder: IntermediateStep[]; // aligned to visual order (top→bottom)
  onConfigChange: (id: string, key: string, value: string | number) => void;
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export function Pipeline({
  nodes,
  mode,
  intermediatesInOrder,
  onConfigChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props) {
  if (nodes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center grid-bg">
        <div className="mx-auto w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-slate-200 font-semibold">Pipeline is empty</h3>
        <p className="text-xs text-slate-400 mt-1">
          Add at least 3 cipher nodes from the library to build your cascade.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {nodes.map((n, i) => {
        const step = intermediatesInOrder[i];
        return (
          <div key={n.id}>
            <CipherNodeCard
              node={n}
              index={i}
              total={nodes.length}
              mode={mode}
              step={step}
              onConfigChange={onConfigChange}
              onRemove={onRemove}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
            />
            {i < nodes.length - 1 && (
              <div className="flex items-center justify-center py-1" aria-hidden>
                <div className="relative h-10 w-4">
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/25 via-white/10 to-white/25 overflow-hidden">
                    <div
                      className={`absolute -inset-x-[2px] h-3 blur-[2px] rounded-full ${
                        mode === "encrypt"
                          ? "bg-cyan-300/80 animate-flow-down"
                          : "bg-rose-300/80 animate-flow-up"
                      }`}
                    />
                  </div>
                  {mode === "encrypt" ? (
                    <ChevronDown className="absolute left-1/2 -translate-x-1/2 bottom-0 w-4 h-4 text-cyan-300" />
                  ) : (
                    <ChevronUp className="absolute left-1/2 -translate-x-1/2 top-0 w-4 h-4 text-rose-300" />
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
