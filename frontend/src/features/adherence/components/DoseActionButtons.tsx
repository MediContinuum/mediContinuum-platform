import { Check, Clock3, X } from "lucide-react";

interface DoseActionButtonsProps {
  onTaken?: () => void;
  onSkipped?: () => void;
  onSnooze?: () => void;
  disabled?: boolean;
}

function DoseActionButtons({
  onTaken,
  onSkipped,
  onSnooze,
  disabled = false,
}: DoseActionButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onTaken && (
        <button
          type="button"
          onClick={onTaken}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          <Check className="size-4" />
          Taken
        </button>
      )}

      {onSnooze && (
        <button
          type="button"
          onClick={onSnooze}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
        >
          <Clock3 className="size-4" />
          Snooze
        </button>
      )}

      {onSkipped && (
        <button
          type="button"
          onClick={onSkipped}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted disabled:opacity-50"
        >
          <X className="size-4" />
          Skip
        </button>
      )}
    </div>
  );
}

export default DoseActionButtons;