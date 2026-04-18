import { useCallback, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { ExternalLink, Lock, Unlock } from "lucide-react";
import { BrandMark } from "./components/BrandMark";
import { CipherLibrary } from "./components/CipherLibrary";
import { InputPanel } from "./components/InputPanel";
import { IntermediateOutputs } from "./components/IntermediateOutputs";
import { OutputPanel } from "./components/OutputPanel";
import { Pipeline } from "./components/Pipeline";
import { RoundTripBanner } from "./components/RoundTripBanner";
import { ToolBar } from "./components/ToolBar";
import { CIPHERS, getCipher } from "./ciphers";
import type {
  CipherConfig,
  CipherNode,
  CipherType,
  Mode,
  PipelineResult,
} from "./types/cipher.types";
import { roundTrip, runPipeline } from "./utils/pipeline";
import { PRESETS } from "./utils/presets";

const INITIAL_INPUT = "Hello, CipherStack!";

function makeDefaultNodes(): CipherNode[] {
  return PRESETS[0].buildNodes();
}

export default function App() {
  const [mode, setMode] = useState<Mode>("encrypt");
  // Keep separate inputs and results for each mode so switching doesn't
  // leak plaintext into the decrypt view or vice-versa.
  const [inputs, setInputs] = useState<Record<Mode, string>>({
    encrypt: INITIAL_INPUT,
    decrypt: "",
  });
  const [results, setResults] = useState<Record<Mode, PipelineResult | null>>({
    encrypt: null,
    decrypt: null,
  });
  const [nodes, setNodes] = useState<CipherNode[]>(() => makeDefaultNodes());
  const [liveMode, setLiveMode] = useState<boolean>(true);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    PRESETS[0].id
  );
  const [roundTripResult, setRoundTripResult] = useState<{
    ok: boolean;
    encrypted: string;
    decrypted: string;
  } | null>(null);

  const input = inputs[mode];
  const result = results[mode];

  const setInput = (value: string) =>
    setInputs((prev) => ({ ...prev, [mode]: value }));

  const execute = useCallback(() => {
    const res = runPipeline(inputs[mode], nodes, mode);
    setResults((prev) => ({ ...prev, [mode]: res }));
  }, [inputs, nodes, mode]);

  useEffect(() => {
    if (!liveMode) return;
    const res = runPipeline(inputs[mode], nodes, mode);
    setResults((prev) => ({ ...prev, [mode]: res }));
  }, [inputs, nodes, mode, liveMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        execute();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [execute]);

  // Any mutation to the pipeline should mark it as "custom" (no preset).
  const markCustom = () => setSelectedPresetId("");

  const addNode = (type: CipherType) => {
    const cipher = CIPHERS[type];
    const fresh: CipherNode = {
      id: nanoid(8),
      type,
      config: { ...cipher.defaultConfig },
    };
    setNodes((prev) => [...prev, fresh]);
    markCustom();
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    markCustom();
  };

  const moveNode = (id: string, dir: -1 | 1) => {
    setNodes((prev) => {
      const idx = prev.findIndex((n) => n.id === id);
      if (idx < 0) return prev;
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
    markCustom();
  };

  const updateConfig = (id: string, key: string, value: string | number) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, config: { ...n.config, [key]: value } } : n
      )
    );
    markCustom();
  };

  const loadPreset = (presetId: string) => {
    const p = PRESETS.find((x) => x.id === presetId);
    if (!p) return;
    setNodes(p.buildNodes());
    setInputs({ encrypt: p.sampleInput, decrypt: "" });
    setResults({ encrypt: null, decrypt: null });
    setMode("encrypt");
    setRoundTripResult(null);
    setSelectedPresetId(p.id);
  };

  const exportPipeline = () => {
    const payload = {
      version: 1,
      app: "CipherStack",
      exportedAt: new Date().toISOString(),
      mode,
      input,
      nodes: nodes.map((n) => ({
        type: n.type,
        config: n.config,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cipherstack-pipeline.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importPipeline = (text: string) => {
    try {
      const parsed = JSON.parse(text) as {
        mode?: Mode;
        input?: string;
        nodes: Array<{ type: CipherType; config: CipherConfig }>;
      };
      if (!Array.isArray(parsed.nodes)) throw new Error("Missing nodes array");
      const imported: CipherNode[] = parsed.nodes.map((n) => {
        const cipher = CIPHERS[n.type];
        if (!cipher) throw new Error(`Unknown cipher type: ${n.type}`);
        return {
          id: nanoid(8),
          type: n.type,
          config: { ...cipher.defaultConfig, ...n.config },
        };
      });
      setNodes(imported);
      const importedMode: Mode =
        parsed.mode === "encrypt" || parsed.mode === "decrypt"
          ? parsed.mode
          : "encrypt";
      setInputs({
        encrypt: importedMode === "encrypt" ? parsed.input ?? "" : "",
        decrypt: importedMode === "decrypt" ? parsed.input ?? "" : "",
      });
      setResults({ encrypt: null, decrypt: null });
      setMode(importedMode);
      setSelectedPresetId("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Import failed: ${msg}`);
    }
  };

  const runRoundTripTest = () => {
    if (nodes.length < 3) {
      setRoundTripResult({
        ok: false,
        encrypted: "",
        decrypted: "Pipeline needs at least 3 nodes.",
      });
      return;
    }
    const plaintext =
      mode === "decrypt"
        ? "Hello, CipherStack! 123 !@#"
        : inputs.encrypt || "Hello!";
    const rt = roundTrip(plaintext, nodes);
    setRoundTripResult(rt);
  };

  const sendToInput = () => {
    if (!result?.finalOutput) return;
    const otherMode: Mode = mode === "encrypt" ? "decrypt" : "encrypt";
    setInputs((prev) => ({ ...prev, [otherMode]: result.finalOutput }));
    setMode(otherMode);
  };

  // Map intermediates so they align with visual (top→bottom) node order.
  const intermediatesInOrder = useMemo(() => {
    if (!result) return [];
    if (mode === "encrypt") return result.intermediates;
    return [...result.intermediates].reverse();
  }, [result, mode]);

  const allValid = nodes.every((n) => getCipher(n.type).validate(n.config).ok);
  const canExecute = nodes.length >= 3 && allValid;

  return (
    <div className="min-h-screen text-slate-200">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-ink-950/70 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <a
            href="/"
            className="flex items-center gap-2.5 group select-none"
            aria-label="CipherStack home"
          >
            <BrandMark className="w-9 h-9 drop-shadow-[0_4px_16px_rgba(34,211,238,0.25)] transition-transform group-hover:-rotate-3" />
            <div className="leading-none">
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-400">
                  cipher
                </span>
                <span className="text-[10px] text-slate-600">/</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-300">
                  stack
                </span>
              </div>
              <h1 className="mt-1 font-semibold text-[17px] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-violet-200">
                CipherStack
                <span className="ml-1.5 align-middle inline-block text-[9px] font-mono font-medium tracking-widest px-1.5 py-0.5 rounded border border-cyan-400/30 text-cyan-300/90 bg-cyan-400/10">
                  v1
                </span>
              </h1>
            </div>
          </a>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded-md border ${
                mode === "encrypt"
                  ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-200"
                  : "border-rose-400/40 bg-rose-500/10 text-rose-200"
              }`}
            >
              {mode === "encrypt" ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <Unlock className="w-3.5 h-3.5" />
              )}
              {mode.toUpperCase()} mode
            </span>
            <span className="px-2 py-1 rounded-md border border-white/10 text-slate-300">
              {nodes.length} nodes
            </span>
            <a
              href="https://github.com/shahmeerabdul/vyrothon-fe"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md border border-white/10 text-slate-300 hover:bg-white/5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Source
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-5 py-5 grid gap-5 grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_340px]">
        <aside className="lg:sticky lg:top-[68px] self-start">
          <CipherLibrary onAdd={addNode} />
          <div className="mt-4 rounded-2xl border border-white/10 bg-ink-900/70 backdrop-blur p-4 text-[11px] text-slate-400 leading-relaxed">
            <div className="text-slate-200 font-semibold text-xs mb-1">
              How it works
            </div>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Add 3+ cipher nodes from the library.</li>
              <li>Configure each (shift, key, keyword, rails).</li>
              <li>
                <span className="text-cyan-300">Encrypt</span> runs top→bottom;{" "}
                <span className="text-rose-300">Decrypt</span> runs bottom→top
                using each cipher's inverse.
              </li>
              <li>Round-trip button verifies exact recovery.</li>
            </ol>
            <div className="mt-2 text-slate-500">
              Shortcuts: <kbd className="px-1 py-0.5 rounded bg-white/10">Ctrl</kbd>
              /<kbd className="px-1 py-0.5 rounded bg-white/10">⌘</kbd> +{" "}
              <kbd className="px-1 py-0.5 rounded bg-white/10">Enter</kbd> to execute.
            </div>
          </div>
        </aside>

        <section className="space-y-4 min-w-0">
          <ToolBar
            mode={mode}
            onModeChange={setMode}
            onExecute={execute}
            canExecute={canExecute}
            liveMode={liveMode}
            onLiveModeChange={setLiveMode}
            selectedPresetId={selectedPresetId}
            onLoadPreset={loadPreset}
            onExport={exportPipeline}
            onImport={importPipeline}
            onRoundTripTest={runRoundTripTest}
          />

          <RoundTripBanner
            result={roundTripResult}
            onDismiss={() => setRoundTripResult(null)}
          />

          <InputPanel value={input} onChange={setInput} mode={mode} />

          {nodes.length > 0 && nodes.length < 3 && (
            <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 text-amber-200 text-xs px-3 py-2">
              Add at least {3 - nodes.length} more node
              {3 - nodes.length > 1 ? "s" : ""} — pipelines require a minimum of
              3 stages to execute.
            </div>
          )}

          <Pipeline
            nodes={nodes}
            mode={mode}
            intermediatesInOrder={intermediatesInOrder}
            onConfigChange={updateConfig}
            onRemove={removeNode}
            onMoveUp={(id) => moveNode(id, -1)}
            onMoveDown={(id) => moveNode(id, 1)}
          />

          <OutputPanel result={result} mode={mode} onSendToInput={sendToInput} />
        </section>

        <aside className="lg:sticky lg:top-[68px] self-start space-y-4">
          <IntermediateOutputs
            steps={intermediatesInOrder}
            mode={mode}
          />
        </aside>
      </main>

      <footer className="max-w-[1400px] mx-auto px-5 py-6 text-center text-[11px] text-slate-500">
        CipherStack · built for Vyrothon · no external cipher libraries ·
        round-trip verified
      </footer>
    </div>
  );
}
