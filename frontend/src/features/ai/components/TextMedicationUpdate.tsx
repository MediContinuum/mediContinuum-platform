import { useState, type FormEvent } from "react";
import { ClipboardEdit, LoaderCircle, Send } from "lucide-react";

interface TextMedicationUpdateProps {
  loading?: boolean;
  onSubmit: (text: string) => Promise<unknown>;
}

function TextMedicationUpdate({
  loading = false,
  onSubmit,
}: TextMedicationUpdateProps) {
  const [text, setText] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = text.trim();

    if (!value || loading) return;

    await onSubmit(value);
    setText("");
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-[#E5F3F4] text-[#087E8B]">
          <ClipboardEdit className="size-5" />
        </div>

        <div>
          <h2 className="font-semibold text-foreground">
            Text medication update
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Describe a medication-related update in natural language.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5">
        <label
          htmlFor="medication-update"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Your message
        </label>

        <textarea
          id="medication-update"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Example: I took my scheduled morning tablet at 8 AM..."
          rows={5}
          maxLength={3000}
          required
          className="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm text-foreground outline-none transition focus:border-[#087E8B] focus:ring-2 focus:ring-[#087E8B]/15"
        />

        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Maximum 3,000 characters</span>
          <span>{text.length}/3000</span>
        </div>

        <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          This feature analyses text only. It does not record a dose as taken,
          change a prescription or update a medical record automatically.
        </div>

        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#12304A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1b4564] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Analyse message
            </>
          )}
        </button>
      </form>
    </section>
  );
}

export default TextMedicationUpdate;
