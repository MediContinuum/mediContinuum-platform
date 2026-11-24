import { useState, type FormEvent } from "react";
import { Clock3, X } from "lucide-react";

import type { MedicationDose } from "../types/adherence.types";

import { getDoseMedicineName } from "../types/adherence.types";

interface SnoozeDialogProps {
  open: boolean;
  dose?: MedicationDose | null;
  onClose: () => void;
  onConfirm: (minutes: number) => void;
}

const SNOOZE_OPTIONS = [
  { label: "5 minutes", value: 5 },
  { label: "10 minutes", value: 10 },
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
];

function SnoozeDialog({ open, dose, onClose, onConfirm }: SnoozeDialogProps) {
  const [minutes, setMinutes] = useState(10);

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onConfirm(minutes);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="snooze-dialog-title"
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#E5F3F4] text-[#087E8B]">
            <Clock3 className="size-5" />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        <h2
          id="snooze-dialog-title"
          className="mt-5 text-xl font-semibold text-foreground"
        >
          Snooze medication reminder
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Choose a temporary snooze duration for{" "}
          <span className="font-medium text-foreground">
            {dose ? getDoseMedicineName(dose) : "this medication"}.
          </span>
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <fieldset>
            <legend className="mb-3 text-sm font-medium text-foreground">
              Remind me after
            </legend>

            <div className="grid grid-cols-2 gap-3">
              {SNOOZE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMinutes(option.value)}
                  aria-pressed={minutes === option.value}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                    minutes === option.value
                      ? "border-[#087E8B] bg-[#E5F3F4] text-[#087E8B]"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
            Reminder rescheduling is not yet connected to a backend endpoint.
            This selection will not change your official medication schedule.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#12304A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1b4564]"
            >
              Confirm snooze
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default SnoozeDialog;
