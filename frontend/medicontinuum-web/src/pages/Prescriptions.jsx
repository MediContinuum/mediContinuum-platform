import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Badge, Card, Field, PageHeader, Tabs, btnPrimary, inputCls } from '@/components/ui';
import { DOSAGE_UNITS, FREQUENCIES, MEDICINES, PRESCRIPTIONS, avatar } from '@/data/mock';
import { formatDate, humanize } from '@/utils/date';

const emptyItem = {
  medicine: MEDICINES[0].name, dosageAmount: 1, dosageUnit: 'TABLET',
  frequency: 'TWICE_DAILY', startDate: '', endDate: '', instructions: '',
};

export default function Prescriptions() {
  const [list, setList] = useState(PRESCRIPTIONS);
  const [filter, setFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [item, setItem] = useState(emptyItem);

  const update = (event) => setItem((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  const visible = filter === 'ALL' ? list : list.filter((prescription) => prescription.status === filter);
  const tabs = ['ALL', 'ACTIVE', 'COMPLETED'].map((value) => ({ value, label: humanize(value) }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setList((prev) => [
      { id: crypto.randomUUID(), doctor: 'Demo entry', avatar: avatar('Demo'), date: item.startDate, status: 'ACTIVE', notes: 'Local sample entry — not sent to a doctor or backend.', items: [item] },
      ...prev,
    ]);
    setItem(emptyItem);
    setShowForm(false);
  };

  return <div className="space-y-6">
    <PageHeader title="Prescription examples" subtitle="Sample prescription cards for the presentation UI."
      action={<button type="button" onClick={() => setShowForm((value) => !value)} className={btnPrimary}><Plus size={16}/> Add sample prescription</button>}/>
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><strong>Demo only.</strong> The backend currently restricts prescription endpoints to DOCTOR/PLATFORM_ADMIN and does not expose a patient self-service prescription list. Entries created here stay in browser memory and are not prescriptions issued by a clinician.</div>
    {showForm && <Card>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Medicine"><select name="medicine" value={item.medicine} onChange={update} className={inputCls}>{MEDICINES.map((medicine) => <option key={medicine.id}>{medicine.name}</option>)}</select></Field>
        <Field label="Dosage amount"><input required min="1" type="number" name="dosageAmount" value={item.dosageAmount} onChange={update} className={inputCls}/></Field>
        <Field label="Unit"><select name="dosageUnit" value={item.dosageUnit} onChange={update} className={inputCls}>{DOSAGE_UNITS.map((unit) => <option key={unit}>{unit}</option>)}</select></Field>
        <Field label="Frequency"><select name="frequency" value={item.frequency} onChange={update} className={inputCls}>{FREQUENCIES.map((frequency) => <option key={frequency} value={frequency}>{humanize(frequency)}</option>)}</select></Field>
        <Field label="Start date"><input required type="date" name="startDate" value={item.startDate} onChange={update} className={inputCls}/></Field>
        <Field label="End date"><input required type="date" name="endDate" value={item.endDate} onChange={update} className={inputCls}/></Field>
        <Field label="Instructions" className="sm:col-span-2 lg:col-span-3"><input name="instructions" value={item.instructions} onChange={update} className={inputCls} placeholder="Sample only — not medical advice"/></Field>
        <button type="submit" className={btnPrimary}>Save sample card</button>
      </form>
    </Card>}
    <Tabs tabs={tabs} value={filter} onChange={setFilter}/>
    <div className="grid gap-5 lg:grid-cols-2">
      {visible.map((prescription) => <Card key={prescription.id}>
        <div className="flex items-center justify-between"><div className="flex items-center gap-3"><img src={prescription.avatar} alt="" width="44" height="44" className="size-11 rounded-full"/><div><p className="font-semibold text-slate-900">{prescription.doctor}</p><p className="text-xs text-slate-500">{prescription.date ? formatDate(prescription.date) : '—'}</p></div></div><Badge tone={prescription.status === 'ACTIVE' ? 'green' : 'slate'}>{prescription.status}</Badge></div>
        <p className="mt-3 text-sm text-slate-500">{prescription.notes}</p>
        <ul className="mt-3 space-y-2">{prescription.items.map((item, index) => <li key={`${prescription.id}-${index}`} className="rounded-xl bg-slate-50 p-3 text-sm">
          <p className="font-medium text-slate-900">{item.medicine} · {item.dosageAmount} {item.dosageUnit.toLowerCase()}</p>
          <p className="text-slate-500">{humanize(item.frequency)} · {item.instructions || 'No instructions'}</p>
        </li>)}</ul>
      </Card>)}
    </div>
  </div>;
}
