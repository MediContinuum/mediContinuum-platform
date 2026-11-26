import { useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { Badge, Card, PageHeader, btnPrimary, btnGhost } from '@/components/ui';
import { usePatient } from '@/store/patientStore';
import { buildSnapshot } from '@/lib/snapshot';
import { generateSummary } from '@/lib/summary';
import { downloadReport } from '@/lib/report';
import { hasGemini, polishSummary } from '@/lib/gemini';

export default function Summary() {
  const state = usePatient();
  const snap = buildSnapshot(state);
  const summary = generateSummary(snap);
  const [ai, setAi] = useState('');
  const [busy, setBusy] = useState(false);

  const polish = async () => {
    setBusy(true);
    try { setAi(await polishSummary(snap, summary.text)); }
    catch (error) { setAi(error.message); }
    finally { setBusy(false); }
  };

  return <div className="space-y-6">
    <PageHeader title="Demo health summary" subtitle={summary.headline}
      action={<button type="button" className={btnPrimary} onClick={() => downloadReport(snap, summary)}><Download size={16}/> Download sample PDF</button>}/>
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><strong>Sample-only summary.</strong> This report is calculated from synthetic browser-side schedule, medicine and prescription data. It is not a live clinical record or a medical assessment.</div>
    <div className="grid gap-4 md:grid-cols-2">
      {summary.insights.map((insight) => <Card key={insight.title}><Badge tone={insight.tone}>{insight.title}</Badge><p className="mt-2 text-sm text-slate-600">{insight.text}</p></Card>)}
    </div>
    <Card><h2 className="font-semibold text-slate-900">Suggested demo next steps</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">{summary.actions.map((action) => <li key={action}>{action}</li>)}</ul></Card>
    {hasGemini() && <Card>
      <p className="mb-3 text-xs text-slate-500">Gemini will only polish the clearly-labelled sample report below. The underlying facts and calculations remain unchanged.</p>
      <button type="button" className={btnGhost} disabled={busy} onClick={polish}><Sparkles size={16}/> {busy ? 'Writing…' : 'Rewrite sample summary with Gemini'}</button>
      {ai && <p className="mt-3 whitespace-pre-line text-sm text-slate-700">{ai}</p>}
    </Card>}
    <p className="text-xs text-slate-400">For presentation only. Not medical advice.</p>
  </div>;
}
