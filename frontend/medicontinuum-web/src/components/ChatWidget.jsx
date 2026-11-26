import { useEffect, useRef, useState } from 'react';
import { Bot, ImagePlus, Send, Sparkles, X } from 'lucide-react';
import { MEDICINES } from '@/data/mock';
import { patientActions, stockOf, usePatient } from '@/store/patientStore';
import { buildSnapshot } from '@/lib/snapshot';
import { askGemini } from '@/lib/gemini';
import { useAuth } from '@/auth/AuthContext';

const REFUSAL = 'I can help with your medication schedule, medicine stock, prescriptions, appointments and general healthcare information. Please ask a healthcare-related question.';
const MEDICAL_WORDS = /medic|tablet|pill|capsule|syrup|dose|dosage|drug|prescri|pharmac|doctor|hospital|clinic|patient|health|disease|symptom|fever|cough|pain|infection|diabet|blood pressure|heart|cholesterol|asthma|allerg|vitamin|antibiotic|vaccine|side effect|stock|refill|adherence|reminder|schedule|inventory|expir|treatment|diagnos|kidney|liver|nausea|insulin|weight|exercise/i;
const EMERGENCY = /overdose|poisoning|cannot breathe|can't breathe|chest pain|unconscious|severe bleeding|suicid/i;
const TOOK = /\b(took|taken|had|swallowed)\b/i;

function findMedicines(question) {
  const lower = question.toLowerCase();
  return MEDICINES.filter((medicine) =>
    lower.includes(medicine.name.toLowerCase()) ||
    (medicine.generic && lower.includes(medicine.generic.split(' ')[0].toLowerCase()))
  );
}

function localAnswer(question, state, snapshot, medicines) {
  const q = question.toLowerCase().trim();
  if (EMERGENCY.test(q)) return '🚨 This may be a medical emergency. Call 112 in India or go to the nearest emergency department now. Do not wait for an AI response.';
  if (TOOK.test(q) && medicines.length) {
    return medicines.map((medicine) => {
      const result = patientActions.recordIntake({ medicine: medicine.name, source: 'chat' });
      return `Logged ${medicine.name} in the local demo tracker. Approximate sample stock remaining: ${result?.left ?? 0}.`;
    }).join('\n');
  }
  if (/\b(left|stock|available|quantity|how many)\b/.test(q) && medicines.length) {
    return medicines.map((medicine) => `${medicine.name}: ${stockOf(state.inventory, medicine.name)} sample units in demo stock.`).join('\n');
  }
  if (/\b(low stock|refill|running out)\b/.test(q)) {
    return snapshot.low?.length
      ? 'Sample low-stock items:\n' + snapshot.low.map((item) => `${item.medicine}: ${item.quantity} units`).join('\n')
      : 'No low-stock medicines are shown in this sample dataset.';
  }
  if (/\b(due|pending|reminders?|schedule)\b|doses?.*today|today.*doses?/.test(q)) {
    const pending = state.doses.filter((dose) => dose.status === 'PENDING');
    return pending.length
      ? 'Pending sample doses:\n' + pending.map((dose) => `${dose.time} — ${dose.medicine}`).join('\n')
      : 'All sample doses are marked complete today.';
  }
  if (/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/.test(q) && q.split(/\s+/).length <= 5) {
    return 'Hello! I am the MediContinuum Assistant. I can help you explore the sample medication dashboard.';
  }
  if (/\b(thanks|thank you)\b/.test(q)) return 'You are welcome. Stay well!';
  return null;
}

function offlineAnswer(question) {
  const q = question.toLowerCase();
  if (/\bdoctor|physician\b/.test(q)) return 'A doctor is a qualified healthcare professional who evaluates patients and recommends care. Ask a licensed clinician about your personal treatment.';
  if (/\bhospital\b/.test(q)) return 'A hospital provides medical assessment, treatment and emergency care. For an emergency in India, call 112.';
  if (/\bpharmacy|pharmacist|chemist\b/.test(q)) return 'A pharmacy dispenses medicines. A pharmacist can help explain medicine labels and safe-use instructions.';
  if (/\bmedicine|medication|tablet|drug\b/.test(q)) return 'Use medicines only according to a prescription or advice from a qualified healthcare professional. Do not change a dose based on an AI response.';
  return 'The AI service is unavailable right now. You can still explore the dashboard, sample stock and dose schedule, or try again after the backend Gemini service is configured.';
}

export default function ChatWidget() {
  const state = usePatient();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I’m MediContinuum Assistant. Ask me about medication schedules, sample stock or healthcare information.' },
  ]);
  const [aiError, setAiError] = useState('');
  const fileRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading, open]);
  const addMessage = (message) => setMessages((old) => [...old, message]);

  const send = async (raw) => {
    const question = raw.trim();
    if (!question || loading) return;
    const history = messages.slice(-8).filter((message) => message.text);
    addMessage({ role: 'user', text: question });
    setInput('');
    setLoading(true);
    setAiError('');
    try {
      const snapshot = buildSnapshot(state);
      const medicines = findMedicines(question);
      let answer = localAnswer(question, state, snapshot, medicines);

      if (!answer && !MEDICAL_WORDS.test(question) && !history.some((message) => MEDICAL_WORDS.test(message.text || ''))) {
        answer = REFUSAL;
      }

      if (!answer && isAuthenticated) {
        try {
          answer = await askGemini({ prompt: question, snapshot, history });
        } catch (error) {
          setAiError(error.message || 'Gemini service is unavailable.');
          answer = offlineAnswer(question);
        }
      } else if (!answer) {
        answer = isAuthenticated
          ? offlineAnswer(question)
          : 'Sign in to use the Gemini-powered assistant. The demo dashboard and its sample-data answers remain available without an account.';
      }
      addMessage({ role: 'bot', text: answer });
    } catch (error) {
      addMessage({ role: 'bot', text: 'Something went wrong while preparing the answer. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const attachPhoto = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addMessage({ role: 'bot', text: 'Please choose an image file.' });
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    addMessage({ role: 'user', text: `Attached image: ${file.name}`, imageUrl });
    addMessage({ role: 'bot', text: 'Prescription OCR is not connected in this frontend yet. Do not rely on an AI guess for medicine identification; read the prescription with your pharmacist or clinician.' });
  };

  return <>
    <button type="button" onClick={() => setOpen((value) => !value)} aria-label="MediContinuum assistant"
      className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-teal-600 text-white shadow-lg hover:bg-teal-700">
      {open ? <X/> : <Sparkles/>}
    </button>
    {open && <section className="fixed bottom-24 right-5 z-50 flex h-[30rem] w-[23rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" aria-label="MediContinuum AI assistant">
      <header className="flex items-center justify-between bg-teal-700 px-4 py-3 text-white">
        <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-white/15"><Bot size={18}/></span><div><p className="text-sm font-semibold">MediContinuum Assistant</p><p className="text-[11px] text-teal-100">{isAuthenticated ? 'Gemini via secure backend' : 'Demo assistant · sign in for Gemini'}</p></div></div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant"><X size={18}/></button>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto p-3 text-sm">
        {messages.map((message, index) => <div key={index} className={message.role === 'user' ? 'text-right' : ''}>
          <div className={`inline-block max-w-[88%] whitespace-pre-line rounded-2xl px-3 py-2 text-left ${message.role === 'user' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
            {message.imageUrl && <img src={message.imageUrl} alt="User attached" className="mb-2 max-h-36 rounded-lg"/>}
            {message.text}
          </div>
        </div>)}
        {loading && <p className="text-xs text-slate-500">Assistant is thinking…</p>}
        {aiError && <p role="status" className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">Gemini issue: {aiError}</p>}
        <div ref={endRef}/>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); send(input); }} className="flex items-center gap-1 border-t border-slate-200 p-2">
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(event) => { attachPhoto(event.target.files?.[0]); event.target.value = ''; }}/>
        <button type="button" onClick={() => fileRef.current?.click()} aria-label="Attach image" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><ImagePlus size={18}/></button>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a healthcare question…" disabled={loading}
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500"/>
        <button type="submit" aria-label="Send message" disabled={loading || !input.trim()} className="rounded-lg bg-teal-600 p-2 text-white disabled:opacity-50"><Send size={18}/></button>
      </form>
    </section>}
  </>;
}
