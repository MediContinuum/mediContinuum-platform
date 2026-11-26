import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, RefreshCw, Send, ShieldCheck, Sparkles, X } from 'lucide-react';
import { usePatient } from '@/store/patientStore';
import { buildSnapshot } from '@/lib/snapshot';
import { askGemini } from '@/lib/gemini';
import { useAuth } from '@/auth/AuthContext';
import { api } from '@/api/client';

const EMERGENCY = /overdose|poisoning|cannot breathe|can't breathe|chest pain|unconscious|severe bleeding|suicid/i;

function localDemoAnswer(question, state, snapshot) {
  const q = question.toLowerCase().trim();
  if (EMERGENCY.test(q)) {
    return '🚨 This may be a medical emergency. Call 112 in India or go to the nearest emergency department now. Do not wait for an AI response.';
  }
  if (/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/.test(q) && q.split(/\s+/).length <= 5) {
    return 'Hello! I’m the MediContinuum Assistant. Ask me about medicines, medication continuity, inventory or how to use this demo.';
  }
  if (/\b(thanks|thank you)\b/.test(q)) return 'You’re welcome. Stay well!';
  if (/\b(low stock|refill|running out)\b/.test(q)) {
    return snapshot.low?.length
      ? 'Your sample low-stock items are:\n' + snapshot.low.map((item) => `• ${item.medicine}: ${item.quantity} units`).join('\n')
      : 'There are no low-stock medicines in the current sample inventory.';
  }
  if (/\b(due|pending|reminders?|schedule)\b|doses?.*today|today.*doses?/.test(q)) {
    const pending = state.doses.filter((dose) => dose.status === 'PENDING');
    return pending.length
      ? 'Your sample pending doses are:\n' + pending.map((dose) => `• ${dose.time} — ${dose.medicine}`).join('\n')
      : 'All doses in today’s sample schedule are marked complete.';
  }
  const medicine = state.inventory.find((item) =>
    q.includes(item.medicine.toLowerCase())
  );
  if (medicine && /\b(left|stock|available|quantity|how many)\b/.test(q)) {
    const quantity = state.inventory
      .filter((item) => item.medicine === medicine.medicine)
      .reduce((total, item) => total + Number(item.quantity || 0), 0);
    return `${medicine.medicine}: ${quantity} sample ${String(medicine.stockUnit || 'units').toLowerCase()} available in the browser demo.`;
  }
  return null;
}

async function buildLiveContext() {
  // No mocked patient identity, mock prescription, or browser-side dose data is sent to an authenticated chat.
  const [inventoryResult, adherenceResult] = await Promise.allSettled([
    api.inventory(),
    api.adherenceAnalytics('30d'),
  ]);
  const inventory = inventoryResult.status === 'fulfilled' ? inventoryResult.value || [] : [];
  const adherence = adherenceResult.status === 'fulfilled' ? adherenceResult.value : null;

  const supply = inventory.map((item) => ({
    medicine: item.medicineName,
    quantity: Number(item.availableQuantity || 0),
    stockUnit: item.stockUnit,
    lowStock: Boolean(item.lowStock),
    lowStockThreshold: Number(item.lowStockThreshold || 0),
    batches: (item.batches || []).map((batch) => ({
      batchNumber: batch.batchNumber,
      expiryDate: batch.expiryDate,
      quantityRemaining: batch.quantityRemaining,
    })),
  }));

  return {
    percent: adherence?.adherenceRate ?? null,
    doses: [],
    supply,
    low: supply.filter((item) => item.lowStock),
    expiring: supply.flatMap((item) => item.batches
      .filter((batch) => batch.expiryDate)
      .map((batch) => ({
        medicine: item.medicine,
        batchNumber: batch.batchNumber,
        daysLeft: Math.ceil((new Date(batch.expiryDate) - new Date()) / 86400000),
      }))
    ).filter((item) => item.daysLeft <= 30),
    activePrescriptions: [],
    dataNotes: [
      inventoryResult.status === 'fulfilled'
        ? 'Inventory is live backend data.'
        : 'Live inventory was not available for this request.',
      adherence
        ? 'Adherence is a 30-day aggregate from backend analytics. Individual dose schedules are not exposed by the current patient API.'
        : 'Live adherence analytics were not available for this request.',
      'No user name, email or Global ID is sent to Gemini.',
    ],
  };
}

function displayError(error) {
  if (error?.status === 401) return 'Your session has expired. Log in again and retry.';
  if (error?.status === 403) return 'Your account does not have access to this assistant.';
  if (error?.status === 429) return 'The AI request limit has been reached. Wait a little and retry.';
  if (error?.status === 503) return error.message || 'Gemini is not configured on the backend yet.';
  if (error?.status === 502 || error?.status === 504) return error.message || 'Gemini could not complete the request. Please retry.';
  return error?.message || 'The assistant could not reach the AI service. Check the backend and try again.';
}

export default function ChatWidget() {
  const state = usePatient();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I’m MediContinuum Assistant. Ask me about medicines, medication continuity, inventory or the MediContinuum platform.' },
  ]);
  const [aiStatus, setAiStatus] = useState({ loading: true, configured: false, model: '', message: 'Checking Gemini service…' });
  const [aiError, setAiError] = useState('');
  const [lastFailedQuestion, setLastFailedQuestion] = useState('');
  const endRef = useRef(null);
  const busyRef = useRef(false);
  const conversationVersionRef = useRef(0);

  const checkStatus = useCallback(async () => {
    setAiStatus((current) => ({ ...current, loading: true }));
    try {
      const result = await api.geminiStatus();
      setAiStatus({
        loading: false,
        configured: Boolean(result?.configured),
        model: result?.model || '',
        message: result?.message || 'Gemini is ready.',
      });
    } catch (error) {
      setAiStatus({
        loading: false,
        configured: false,
        model: error?.body?.model || '',
        message: error?.body?.message || error.message || 'Could not check Gemini status.',
      });
    }
  }, []);

  useEffect(() => { checkStatus(); }, [checkStatus]);
  useEffect(() => {
    conversationVersionRef.current += 1;
    setMessages([{
      role: 'bot',
      text: isAuthenticated
        ? 'Welcome back. I can help with MediContinuum features and the live information currently available from your backend account.'
        : 'Hi! I’m MediContinuum Assistant. Ask me about medicines, medication continuity, inventory or the Kalyani presentation demo.',
    }]);
    setAiError('');
    setLastFailedQuestion('');
  }, [isAuthenticated]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, loading, open, aiError]);

  const send = useCallback(async (raw) => {
    const question = String(raw || '').trim();
    if (!question || busyRef.current) return;
    busyRef.current = true;
    const conversationVersion = conversationVersionRef.current;

    const previousHistory = messages.slice(-8).filter((message) => message.text);
    setMessages((old) => [...old, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);
    setAiError('');
    setLastFailedQuestion('');

    try {
      if (EMERGENCY.test(question)) {
        setMessages((old) => [...old, {
          role: 'bot',
          text: '🚨 This may be a medical emergency. Call 112 in India or go to the nearest emergency department now. Do not wait for an AI response.',
        }]);
        return;
      }

      if (!aiStatus.configured) {
        throw Object.assign(new Error(aiStatus.message || 'Gemini API key is not configured on the backend.'), { status: 503 });
      }

      const isDemo = !isAuthenticated;
      const snapshot = isDemo
        ? { ...buildSnapshot(state), syntheticDemoData: true }
        : await buildLiveContext();

      // Guest presentation chats use only the synthetic demo context. Signed-in chats use
      // the authenticated endpoint and only data returned by the patient backend APIs.
      const answer = await askGemini({
        prompt: question,
        snapshot,
        history: previousHistory,
        demo: isDemo,
      });

      if (conversationVersion === conversationVersionRef.current) {
        setMessages((old) => [...old, { role: 'bot', text: answer }]);
      }
    } catch (error) {
      if (conversationVersion === conversationVersionRef.current) {
        const friendly = displayError(error);
        setAiError(friendly);
        setLastFailedQuestion(question);
        setMessages((old) => [...old, {
          role: 'bot',
          text: `I couldn’t get a Gemini response. ${friendly}`,
        }]);
      }
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }, [aiStatus, isAuthenticated, loading, messages, state]);

  const retry = () => {
    if (!lastFailedQuestion || loading) return;
    send(lastFailedQuestion);
  };

  return <>
    <button
      type="button"
      onClick={() => setOpen((value) => !value)}
      aria-label="MediContinuum AI assistant"
      aria-expanded={open}
      className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-teal-700 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200"
    >
      {open ? <X size={22}/> : <Sparkles size={22}/>}
    </button>

    {open && <section
      className="fixed bottom-24 right-4 z-50 flex h-[min(40rem,calc(100dvh-8rem))] w-[min(25rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:right-5"
      aria-label="MediContinuum AI assistant"
    >
      <header className="flex items-center justify-between gap-3 bg-teal-800 px-4 py-3 text-white">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15"><Bot size={21}/></span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">MediContinuum Assistant</p>
            <p className="truncate text-[11px] text-teal-100">
              {aiStatus.loading ? 'Checking AI service…' : aiStatus.configured ? `Gemini ready · ${aiStatus.model}` : 'Gemini not configured'}
            </p>
          </div>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant" className="rounded-lg p-2 hover:bg-white/10"><X size={18}/></button>
      </header>

      <div className="border-b border-slate-100 bg-slate-50 px-4 py-2">
        <div className="flex items-center gap-2 text-[11px] text-slate-600">
          <ShieldCheck size={14} className="shrink-0 text-teal-700"/>
          <span>{isAuthenticated ? 'Signed-in chat uses backend inventory and aggregate adherence only.' : 'Presentation mode uses synthetic Kalyani demo data only.'}</span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4 text-sm" aria-live="polite" aria-busy={loading}>
        {messages.map((message, index) => <div key={index} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
          <div className={`max-w-[90%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 leading-relaxed ${message.role === 'user' ? 'rounded-br-md bg-teal-700 text-white' : 'rounded-bl-md bg-slate-100 text-slate-800'}`}>
            {message.text}
          </div>
        </div>)}

        {loading && <div className="flex justify-start">
          <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-2"><span className="size-2 animate-pulse rounded-full bg-teal-600"/>{'Gemini is generating a response…'}</span>
          </div>
        </div>}

        {!aiStatus.loading && !aiStatus.configured && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <strong>AI configuration required</strong>
          <p className="mt-1">{aiStatus.message}</p>
          <button type="button" onClick={checkStatus} className="mt-2 inline-flex items-center gap-1 font-semibold underline"><RefreshCw size={12}/> Check again</button>
        </div>}

        {aiError && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800" role="alert">
          <p className="font-semibold">Gemini request failed</p>
          <p className="mt-1">{aiError}</p>
          <button type="button" onClick={retry} disabled={loading || !lastFailedQuestion} className="mt-2 inline-flex items-center gap-1.5 font-semibold underline disabled:opacity-50"><RefreshCw size={12}/> Retry request</button>
        </div>}

        <div ref={endRef}/>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); send(input); }} className="flex items-end gap-2 border-t border-slate-200 bg-white p-3">
        <textarea
          rows={1}
          maxLength={1600}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              send(input);
            }
          }}
          placeholder={aiStatus.configured ? 'Ask in English or Hinglish…' : 'Gemini needs backend configuration'}
          disabled={loading || !aiStatus.configured}
          className="max-h-28 min-h-10 min-w-0 flex-1 resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={loading || !input.trim() || !aiStatus.configured}
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-700 text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? <RefreshCw size={17} className="animate-spin"/> : <Send size={17}/>}
        </button>
      </form>
      <p className="px-3 pb-2 text-center text-[10px] text-slate-400">AI-generated information only. Not a diagnosis or a substitute for your doctor.</p>
    </section>}
  </>;
}
