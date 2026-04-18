import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  result: { ok: boolean; encrypted: string; decrypted: string } | null;
  onDismiss: () => void;
}

export function RoundTripBanner({ result, onDismiss }: Props) {
  if (!result) return null;
  return (
    <div
      className={`rounded-2xl border p-3 flex items-start gap-3 ${
        result.ok
          ? "border-lime-400/40 bg-lime-500/10 text-lime-200"
          : "border-rose-500/40 bg-rose-500/10 text-rose-200"
      }`}
    >
      {result.ok ? (
        <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
      )}
      <div className="text-xs flex-1 min-w-0">
        <div className="font-semibold text-sm mb-0.5">
          {result.ok
            ? "Round-trip verified"
            : "Round-trip failed"}
        </div>
        <div className="font-mono break-all opacity-80">
          encrypted:&nbsp;{result.encrypted.slice(0, 120)}
          {result.encrypted.length > 120 ? "…" : ""}
        </div>
        <div className="font-mono break-all opacity-80">
          decrypted:&nbsp;{result.decrypted}
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="text-[11px] opacity-70 hover:opacity-100"
      >
        dismiss
      </button>
    </div>
  );
}
