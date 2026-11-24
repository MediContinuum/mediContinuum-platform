import { useRef, useState } from "react";
import { Mic, MicOff, Send, Volume2 } from "lucide-react";
import { toast } from "sonner";

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: SpeechRecognitionResult;
  };
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface SpeechWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

interface VoiceMedicationUpdateProps {
  loading?: boolean;
  onSubmit: (transcript: string) => Promise<unknown>;
}

function VoiceMedicationUpdate({
  loading = false,
  onSubmit,
}: VoiceMedicationUpdateProps) {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  function startRecording() {
    const speechWindow = window as SpeechWindow;

    const SpeechRecognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        const value = result[0]?.transcript ?? "";

        if (result.isFinal) {
          finalText += `${value} `;
        } else {
          interimText += value;
        }
      }

      setTranscript((previous) => {
        const base = previous.trimEnd();

        return [base, finalText.trim(), interimText.trim()]
          .filter(Boolean)
          .join(" ");
      });
    };

    recognition.onerror = () => {
      setIsRecording(false);
      toast.error("Voice recognition encountered an error.");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
      toast.error("Unable to start voice recognition.");
    }
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }

  async function handleSubmit() {
    const value = transcript.trim();

    if (!value || loading) return;

    await onSubmit(value);
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-[#E5F3F4] text-[#087E8B]">
          <Volume2 className="size-5" />
        </div>

        <div>
          <h2 className="font-semibold text-foreground">
            Voice medication update
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Speak naturally and review your transcription.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center rounded-xl bg-muted/40 px-5 py-8 text-center">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
          className={`flex size-16 items-center justify-center rounded-full text-white shadow-lg transition ${
            isRecording
              ? "animate-pulse bg-rose-600 hover:bg-rose-700"
              : "bg-[#087E8B] hover:bg-[#066d78]"
          }`}
        >
          {isRecording ? (
            <MicOff className="size-7" />
          ) : (
            <Mic className="size-7" />
          )}
        </button>

        <p className="mt-4 font-medium text-foreground">
          {isRecording ? "Listening..." : "Start voice recording"}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Browser microphone permission is required.
        </p>
      </div>

      <div className="mt-5">
        <label
          htmlFor="voice-transcript"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Review transcription
        </label>

        <textarea
          id="voice-transcript"
          rows={5}
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          placeholder="Your recognised speech will appear here. You can edit it before submitting."
          className="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-[#087E8B] focus:ring-2 focus:ring-[#087E8B]/15"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!transcript.trim() || loading || isRecording}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#12304A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1b4564] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="size-4" />
        {loading ? "Processing..." : "Analyse transcription"}
      </button>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Voice recognition converts speech into text in the browser. The
        transcript is not an authorised medication update until verified and
        confirmed through the appropriate clinical workflow.
      </p>
    </section>
  );
}

export default VoiceMedicationUpdate;
