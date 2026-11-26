import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { Card, PageHeader, ProgressRing, Tabs } from '@/components/ui';
import { DoseRow } from '@/components/DoseRow';
import { useDoses } from '@/hooks/useDoses';
import { WEEK } from '@/data/mock';
import { useAuth } from '@/auth/AuthContext';
import { api } from '@/api/client';

export default function Adherence() {
  const { doses, mark, percent } = useDoses();
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState('ALL');
  const [live, setLive] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    if (!isAuthenticated) { setLive(null); setError(''); return () => { active = false; }; }
    api.adherenceAnalytics('30d').then((result) => {
      if (active) { setLive(result); setError(''); }
    }).catch((exception) => {
      if (active) { setLive(null); setError(exception.message || 'Live adherence analytics unavailable.'); }
    });
    return () => { active = false; };
  }, [isAuthenticated]);

  const count = (status) => doses.filter((dose) => dose.status === status).length;
  const visible = filter === 'ALL' ? doses : doses.filter((dose) => dose.status === filter);
  const displayPercent = live ? live.adherenceRate : percent;
  const tabs = [
    { value: 'ALL', label: 'All', count: doses.length },
    { value: 'PENDING', label: 'Pending', count: count('PENDING') },
    { value: 'TAKEN', label: 'Taken', count: count('TAKEN') },
    { value: 'SKIPPED', label: 'Skipped', count: count('SKIPPED') },
  ];

  return <div className="space-y-6">
    <PageHeader title="Medication adherence" subtitle="Backend aggregate statistics and the sample daily dose tracker."/>
    {isAuthenticated
      ? <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Your 30-day adherence percentage below comes from the backend analytics API. The individual dose rows and 7-day mini-chart are still browser demo data because the current /api/adherence controller has no patient schedule endpoints.</div>
      : <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Presentation demo: the schedule, check-ins and 7-day chart below use synthetic browser data and are not persisted to the backend.</div>}
    {error && <p role="status" className="text-sm text-amber-800">{error}</p>}
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="flex flex-col items-center text-center">
        <ProgressRing percent={displayPercent}/>
        <p className="mt-3 font-semibold text-slate-900">{live ? 'Live 30-day adherence' : 'Sample adherence today'}</p>
        {live
          ? <p className="text-sm text-slate-500">{live.takenDoses} taken · {live.missedDoses} missed · {live.scheduledDoses} scheduled</p>
          : <p className="text-sm text-slate-500">{count('TAKEN')} taken · {count('SKIPPED')} skipped</p>}
        {live && <span className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-700"><Activity size={13}/>Backend analytics</span>}
      </Card>
      <Card className="lg:col-span-2">
        <h2 className="font-semibold text-slate-900">Sample 7-day trend</h2>
        <ul className="mt-3 space-y-2">
          {WEEK.map(({ day, percent: value }) => <li key={day} className="flex items-center gap-3 text-sm">
            <span className="w-9 text-slate-500">{day}</span><progress value={value} max="100" className="h-2 flex-1 accent-teal-500"/><span className="w-10 text-right font-medium">{value}%</span>
          </li>)}
        </ul>
      </Card>
    </div>
    <Card>
      <h2 className="mb-3 font-semibold text-slate-900">Sample daily schedule</h2>
      <Tabs tabs={tabs} value={filter} onChange={setFilter}/>
      <ul className="mt-3 divide-y divide-slate-100">{visible.map((dose) => <DoseRow key={dose.id} dose={dose} onMark={mark}/>)}</ul>
    </Card>
  </div>;
}
