import { useState } from 'react';
import { MapPin, Pill, Stethoscope, Users, CalendarDays } from 'lucide-react';
import { Card, PageHeader, Stat, Tabs } from '@/components/ui';
import { DEMO_APPOINTMENTS, DEMO_DOCTORS, DEMO_PATIENTS, DEMO_PHARMACIES, DEMO_REGION } from '@/lib/demo';

export default function DemoNetwork() {
  const [tab, setTab] = useState('patients');
  const tabs = [
    { value: 'patients', label: 'Patients', count: DEMO_PATIENTS.length },
    { value: 'doctors', label: 'Doctors', count: DEMO_DOCTORS.length },
    { value: 'pharmacies', label: 'Pharmacies', count: DEMO_PHARMACIES.length },
    { value: 'appointments', label: 'Appointments', count: DEMO_APPOINTMENTS.length },
  ];
  return <div className="space-y-6">
    <PageHeader title={DEMO_REGION.label} subtitle={`${DEMO_REGION.city}, ${DEMO_REGION.district}, ${DEMO_REGION.state}, ${DEMO_REGION.country}`} />
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><strong>Demo only:</strong> {DEMO_REGION.disclaimer}</div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat icon={Users} label="Sample patients" value={DEMO_PATIENTS.length}/>
      <Stat icon={Stethoscope} label="Sample doctors" value={DEMO_DOCTORS.length}/>
      <Stat icon={Pill} label="Sample pharmacies" value={DEMO_PHARMACIES.length}/>
      <Stat icon={CalendarDays} label="Sample appointments" value={DEMO_APPOINTMENTS.length}/>
    </div>
    <Tabs tabs={tabs} value={tab} onChange={setTab}/>
    <div className="grid gap-4 md:grid-cols-2">
      {tab === 'patients' && DEMO_PATIENTS.map((p) => <Card key={p.id}>
        <div className="flex items-start justify-between gap-2"><div><p className="font-semibold text-slate-900">{p.name}</p><p className="text-sm text-slate-500">{p.area}, {p.city} · {p.age} years</p></div><span className="rounded-full bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700">{p.adherence}%</span></div>
        <p className="mt-2 text-xs text-slate-500">Synthetic Global ID: {p.globalId}</p><p className="mt-1 text-sm text-slate-600">{p.profile}</p>
      </Card>)}
      {tab === 'doctors' && DEMO_DOCTORS.map((d) => <Card key={d.id}><p className="font-semibold text-slate-900">{d.name}</p><p className="text-sm text-slate-500">{d.speciality} · {d.experience} years experience</p><p className="mt-2 text-sm text-slate-700">{d.city}, West Bengal · Sample consultation fee ₹{d.fee}</p></Card>)}
      {tab === 'pharmacies' && DEMO_PHARMACIES.map((p) => <Card key={p.id}><p className="font-semibold text-slate-900">{p.name}</p><p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin size={14}/>{p.area}, {p.city} · {p.pin}</p><p className="mt-2 text-xs text-teal-700">{p.status}</p></Card>)}
      {tab === 'appointments' && DEMO_APPOINTMENTS.map((a) => <Card key={a.id}><p className="font-semibold text-slate-900">{a.patient}</p><p className="text-sm text-slate-600">{a.doctor}</p><p className="mt-2 text-sm text-slate-500">{a.date} · {a.time}</p><p className="mt-1 text-xs font-semibold text-teal-700">{a.status} · sample</p></Card>)}
    </div>
  </div>;
}
