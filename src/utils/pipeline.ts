import { getCipher } from "../ciphers";
import type {
  CipherNode,
  IntermediateStep,
  Mode,
  PipelineResult,
} from "../types/cipher.types";

export function runPipeline(
  input: string,
  nodes: CipherNode[],
  mode: Mode
): PipelineResult {
  const intermediates: IntermediateStep[] = [];
  const startTotal = performance.now();

  if (nodes.length < 3) {
    return {
      mode,
      finalOutput: "",
      intermediates: [],
      error: "Pipeline requires at least 3 nodes to execute.",
      totalMs: 0,
    };
  }

  const ordered =
    mode === "encrypt" ? [...nodes] : [...nodes].slice().reverse();

  let current = input;
  for (let i = 0; i < ordered.length; i++) {
    const node = ordered[i];
    const cipher = getCipher(node.type);
    const validity = cipher.validate(node.config);

    if (!validity.ok) {
      const step: IntermediateStep = {
        nodeId: node.id,
        nodeType: node.type,
        nodeLabel: cipher.shortName,
        stepIndex: i,
        input: current,
        output: "",
        ms: 0,
        error: validity.reason ?? "Invalid configuration",
      };
      intermediates.push(step);
      return {
        mode,
        finalOutput: "",
        intermediates,
        error: `Node ${i + 1} (${cipher.name}): ${validity.reason}`,
        totalMs: performance.now() - startTotal,
      };
    }

    const stepStart = performance.now();
    try {
      const output =
        mode === "encrypt"
          ? cipher.encrypt(current, node.config)
          : cipher.decrypt(current, node.config);
      const ms = performance.now() - stepStart;
      intermediates.push({
        nodeId: node.id,
        nodeType: node.type,
        nodeLabel: cipher.shortName,
        stepIndex: i,
        input: current,
        output,
        ms,
      });
      current = output;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      intermediates.push({
        nodeId: node.id,
        nodeType: node.type,
        nodeLabel: cipher.shortName,
        stepIndex: i,
        input: current,
        output: "",
        ms: performance.now() - stepStart,
        error: message,
      });
      return {
        mode,
        finalOutput: "",
        intermediates,
        error: `Node ${i + 1} (${cipher.name}) failed: ${message}`,
        totalMs: performance.now() - startTotal,
      };
    }
  }

  return {
    mode,
    finalOutput: current,
    intermediates,
    totalMs: performance.now() - startTotal,
  };
}

export function roundTrip(plaintext: string, nodes: CipherNode[]): {
  ok: boolean;
  encrypted: string;
  decrypted: string;
} {
  const enc = runPipeline(plaintext, nodes, "encrypt");
  if (enc.error) return { ok: false, encrypted: "", decrypted: "" };
  const dec = runPipeline(enc.finalOutput, nodes, "decrypt");
  return {
    ok: !dec.error && dec.finalOutput === plaintext,
    encrypted: enc.finalOutput,
    decrypted: dec.finalOutput,
  };
}
