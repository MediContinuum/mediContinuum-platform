import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock, RefreshCw, Video } from 'lucide-react';
import { Badge, Card, PageHeader, Tabs, btnGhost } from '@/components/ui';
import { DEMO_APPOINTMENTS } from '@/lib/demo';
import { api } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';

const dateLabel = (value) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};
const timeLabel = (value) => value ? new Date(`1970-01-01T${value}`).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : '—';
const demoRecords = DEMO_APPOINTMENTS.map((item) => ({
  id: item.id, appointmentDate: item.date, startTime: item.time,
  endTime: item.time, patientName: item.patient, doctorName: item.doctor,
  status: item.status, reason: 'Sample follow-up visit', type: 'IN_PERSON',
  organisationName: 'Kalyani Demo Network',
}));

export default function Appointments() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState(demoRecords);
  const [source, setSource] = useState('demo');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const load = async () => {
    if (!isAuthenticated) return;
    setBusy(true);
    setNotice('');
    try {
      const result = await api.appointments();
      setItems(result || []);
      setSource('backend');
    } catch (error) {
      setItems([]);
      setSource('backend-error');
      setNotice(`Appointments API unavailable: ${error.message}. No sample records are substituted for a signed-in account.`);
    } finally { setBusy(false); }
  };

  useEffect(() => {
    if (isAuthenticated) load();
    else { setItems(demoRecords); setSource('demo'); setNotice(''); }
  }, [isAuthenticated]);

  const visible = useMemo(() => items.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'UPCOMING') return new Date(`${item.appointmentDate}T${item.startTime || '00:00'}`) >= new Date() && !['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(item.status);
    return ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(item.status);
  }), [items, filter]);

  const tabs = [
    { value: 'ALL', label: 'All', count: items.length },
    { value: 'UPCOMING', label: 'Upcoming', count: items.filter((item) => !['CANCELLED','COMPLETED','NO_SHOW'].includes(item.status)).length },
    { value: 'PAST', label: 'Completed / closed', count: items.filter((item) => ['COMPLETED','CANCELLED','NO_SHOW'].includes(item.status)).length },
  ];

  return <div className="space-y-6">
    <PageHeader title="Appointments" subtitle={source === 'demo' ? 'Sample appointments around Kalyani, Nadia.' : 'Appointments linked to your authenticated account.'}
      action={isAuthenticated ? <button type="button" onClick={load} disabled={busy} className={btnGhost}><RefreshCw size={15} className="mr-1 inline"/>Refresh</button> : null}/>
    <Badge tone={source === 'backend' ? 'green' : source === 'demo' ? 'amber' : 'slate'}>{source === 'backend' ? 'Live appointment records' : source === 'demo' ? 'Synthetic sample appointments' : 'Backend unavailable'}</Badge>
    {notice && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{notice}</p>}
    {source === 'demo' && <p className="text-xs text-slate-500">Fictional patient and clinician names for a class presentation. These are not real bookings.</p>}
    {source === 'backend' && <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">Appointment creation is not enabled in this patient screen: the backend booking request requires a patient UUID, but the current /api/auth/me response only returns a user UUID. Existing authenticated appointments can be viewed here.</div>}
    <Tabs tabs={tabs} value={filter} onChange={setFilter}/>
    <div className="grid gap-4 lg:grid-cols-2">
      {visible.map((item) => <Card key={item.id}>
        <div className="flex items-start justify-between gap-3">
          <div><p className="font-semibold text-slate-900">{item.doctorName || 'Doctor not listed'}</p><p className="text-sm text-slate-500">{item.patientName || 'Patient appointment'}</p></div>
          <Badge tone={item.status === 'CONFIRMED' ? 'green' : item.status === 'SCHEDULED' ? 'sky' : item.status === 'CANCELLED' ? 'red' : 'slate'}>{item.status}</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5"><CalendarDays size={15}/>{dateLabel(item.appointmentDate)}</span>
          <span className="inline-flex items-center gap-1.5"><Clock size={15}/>{timeLabel(item.startTime)} – {timeLabel(item.endTime)}</span>
          <span className="inline-flex items-center gap-1.5"><Video size={15}/>{item.type || 'IN_PERSON'}</span>
        </div>
        {item.reason && <p className="mt-3 text-sm text-slate-500">{item.reason}</p>}
        {item.organisationName && <p className="mt-1 text-xs text-slate-400">{item.organisationName}</p>}
      </Card>)}
    </div>
    {!visible.length && <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center"><CalendarDays className="mx-auto text-slate-400" size={28}/><p className="mt-3 font-medium text-slate-800">No appointments to show</p><p className="mt-1 text-sm text-slate-500">{source === 'backend' ? 'Your account currently has no appointments in this view.' : 'Sample appointment cards appear here for the Kalyani demo.'}</p></div>}
  </div>;
}
