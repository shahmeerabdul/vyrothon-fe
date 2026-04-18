import {
  Download,
  FlaskConical,
  Lock,
  Play,
  Unlock,
  Upload,
  Wand2,
  Zap,
} from "lucide-react";
import { useRef } from "react";
import type { Mode } from "../types/cipher.types";
import { PRESETS } from "../utils/presets";

interface Props {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  onExecute: () => void;
  canExecute: boolean;
  liveMode: boolean;
  onLiveModeChange: (v: boolean) => void;
  selectedPresetId: string;
  onLoadPreset: (id: string) => void;
  onExport: () => void;
  onImport: (json: string) => void;
  onRoundTripTest: () => void;
}

export function ToolBar({
  mode,
  onModeChange,
  onExecute,
  canExecute,
  liveMode,
  onLiveModeChange,
  selectedPresetId,
  onLoadPreset,
  onExport,
  onImport,
  onRoundTripTest,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    onImport(text);
    e.target.value = "";
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900/70 backdrop-blur p-3 flex flex-wrap items-center gap-x-2 gap-y-2">
      <div className="inline-flex rounded-xl border border-white/10 overflow-hidden">
        <button
          onClick={() => onModeChange("encrypt")}
          className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition ${
            mode === "encrypt"
              ? "bg-cyan-500/20 text-cyan-200"
              : "text-slate-400 hover:bg-white/5"
          }`}
        >
          <Lock className="w-4 h-4" />
          Encrypt
        </button>
        <button
          onClick={() => onModeChange("decrypt")}
          className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition ${
            mode === "decrypt"
              ? "bg-rose-500/20 text-rose-200"
              : "text-slate-400 hover:bg-white/5"
          }`}
        >
          <Unlock className="w-4 h-4" />
          Decrypt
        </button>
      </div>

      <button
        onClick={onExecute}
        disabled={!canExecute}
        title="Execute (Ctrl/Cmd + Enter)"
        className={`px-4 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed ${
          mode === "encrypt"
            ? "bg-cyan-500 hover:bg-cyan-400 text-ink-950 shadow-glow"
            : "bg-rose-500 hover:bg-rose-400 text-ink-950 shadow-glow-decrypt"
        }`}
      >
        <Play className="w-4 h-4" />
        Execute
      </button>

      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={liveMode}
          onChange={(e) => onLiveModeChange(e.target.checked)}
          className="accent-cyan-400"
        />
        <Zap className="w-3.5 h-3.5 text-amber-300" />
        Live mode
      </label>

      <div className="h-6 w-px bg-white/10" />

      <div className="flex items-center gap-1.5">
        <Wand2 className="w-4 h-4 text-slate-400" />
        <select
          value={selectedPresetId}
          onChange={(e) => {
            if (e.target.value) onLoadPreset(e.target.value);
          }}
          title={
            PRESETS.find((p) => p.id === selectedPresetId)?.description ??
            "Choose a preset pipeline"
          }
          className="bg-ink-950/80 border border-white/10 rounded-lg text-xs text-slate-200 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 w-[150px]"
        >
          <option value="">
            {selectedPresetId ? "Custom / modified" : "Load preset…"}
          </option>
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id} title={p.description}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onRoundTripTest}
        className="text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5"
        title="Verify encrypt→decrypt equals original"
      >
        <FlaskConical className="w-3.5 h-3.5 text-lime-300" />
        Round-trip test
      </button>

      <div className="h-6 w-px bg-white/10" />

      <button
        onClick={onExport}
        className="text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5"
      >
        <Download className="w-3.5 h-3.5" />
        Export
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        className="text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5"
      >
        <Upload className="w-3.5 h-3.5" />
        Import
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  );
}
