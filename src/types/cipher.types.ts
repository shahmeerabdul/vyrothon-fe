export type CipherType =
  | "caesar"
  | "xor"
  | "vigenere"
  | "railfence"
  | "base64";

export type ConfigFieldType = "number" | "text";

export interface ConfigField {
  name: string;
  type: ConfigFieldType;
  label: string;
  placeholder?: string;
  min?: number;
  max?: number;
  default: string | number;
  description?: string;
}

export type CipherConfig = Record<string, string | number>;

export interface Cipher {
  type: CipherType;
  name: string;
  shortName: string;
  description: string;
  accent: "cyan" | "violet" | "lime" | "amber" | "rose";
  configurable: boolean;
  configFields: ConfigField[];
  defaultConfig: CipherConfig;
  validate: (config: CipherConfig) => { ok: boolean; reason?: string };
  encrypt: (input: string, config: CipherConfig) => string;
  decrypt: (input: string, config: CipherConfig) => string;
}

export interface CipherNode {
  id: string;
  type: CipherType;
  config: CipherConfig;
}

export interface IntermediateStep {
  nodeId: string;
  nodeType: CipherType;
  nodeLabel: string;
  stepIndex: number;
  input: string;
  output: string;
  ms: number;
  error?: string;
}

export interface PipelineResult {
  mode: "encrypt" | "decrypt";
  finalOutput: string;
  intermediates: IntermediateStep[];
  error?: string;
  totalMs: number;
}

export type Mode = "encrypt" | "decrypt";
