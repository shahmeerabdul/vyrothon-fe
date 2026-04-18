import type { Cipher } from "../types/cipher.types";

export type AccentKey = Cipher["accent"];

export const accentMap: Record<
  AccentKey,
  {
    ring: string;
    bg: string;
    text: string;
    chip: string;
    border: string;
    glow: string;
    dot: string;
  }
> = {
  cyan: {
    ring: "ring-cyan-400/40",
    bg: "bg-cyan-500/10",
    text: "text-cyan-300",
    chip: "bg-cyan-400/15 text-cyan-200 border-cyan-400/30",
    border: "border-cyan-400/30",
    glow: "shadow-[0_0_0_1px_rgba(34,211,238,0.35),0_8px_40px_-8px_rgba(34,211,238,0.35)]",
    dot: "bg-cyan-400",
  },
  violet: {
    ring: "ring-violet-400/40",
    bg: "bg-violet-500/10",
    text: "text-violet-300",
    chip: "bg-violet-400/15 text-violet-200 border-violet-400/30",
    border: "border-violet-400/30",
    glow: "shadow-[0_0_0_1px_rgba(167,139,250,0.35),0_8px_40px_-8px_rgba(167,139,250,0.35)]",
    dot: "bg-violet-400",
  },
  lime: {
    ring: "ring-lime-400/40",
    bg: "bg-lime-500/10",
    text: "text-lime-300",
    chip: "bg-lime-400/15 text-lime-200 border-lime-400/30",
    border: "border-lime-400/30",
    glow: "shadow-[0_0_0_1px_rgba(163,230,53,0.35),0_8px_40px_-8px_rgba(163,230,53,0.35)]",
    dot: "bg-lime-400",
  },
  amber: {
    ring: "ring-amber-400/40",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    chip: "bg-amber-400/15 text-amber-200 border-amber-400/30",
    border: "border-amber-400/30",
    glow: "shadow-[0_0_0_1px_rgba(251,191,36,0.35),0_8px_40px_-8px_rgba(251,191,36,0.35)]",
    dot: "bg-amber-400",
  },
  rose: {
    ring: "ring-rose-400/40",
    bg: "bg-rose-500/10",
    text: "text-rose-300",
    chip: "bg-rose-400/15 text-rose-200 border-rose-400/30",
    border: "border-rose-400/30",
    glow: "shadow-[0_0_0_1px_rgba(251,113,133,0.35),0_8px_40px_-8px_rgba(251,113,133,0.35)]",
    dot: "bg-rose-400",
  },
};
