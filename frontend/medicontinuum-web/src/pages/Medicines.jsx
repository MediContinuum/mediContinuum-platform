import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Badge, Card, Img, PageHeader, inputCls } from '@/components/ui';
import { MEDICINES } from '@/data/mock';
import { api } from '@/api/client';

export default function Medicines() {
  const [query, setQuery] = useState('');
  const [medicines, setMedicines] = useState(MEDICINES);
  const [source, setSource] = useState('demo');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let alive = true;
    api.medicines().then((result) => {
      if (!alive) return;
      setMedicines(result || []);
      setSource('backend');
      setNotice(result?.length ? '' : 'The backend medicine catalogue is empty. Add active catalogue entries to populate it.');
    }).catch((error) => {
      if (!alive) return;
      setMedicines(MEDICINES);
      setSource('demo');
      setNotice(`Backend catalogue unavailable (${error.message}); showing sample medicines.`);
    });
    return () => { alive = false; };
  }, []);

  const term = query.trim().toLowerCase();
  const visible = medicines.filter((medicine) =>
    `${medicine.name} ${medicine.genericName || medicine.generic || ''} ${medicine.category || ''} ${medicine.brandName || ''}`.toLowerCase().includes(term)
  );

  return <div className="space-y-6">
    <PageHeader title="Medicine catalogue" subtitle="Search medicine names and generic information returned by MediContinuum."/>
    <div className="flex flex-wrap items-center gap-2"><Badge tone={source === 'backend' ? 'green' : 'amber'}>{source === 'backend' ? 'Backend catalogue' : 'Demo catalogue'}</Badge>{notice && <span role="status" className="text-xs text-amber-800">{notice}</span>}</div>
    <div className="relative max-w-md"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by medicine, generic or brand" className={`${inputCls} pl-10`}/></div>
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {visible.map((medicine) => <Card key={medicine.id} className="overflow-hidden p-0">
        {medicine.image && <Img src={medicine.image} alt={medicine.name} className="h-36 w-full"/>}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2"><h2 className="font-semibold text-slate-900">{medicine.name}</h2><Badge tone={medicine.status === 'ACTIVE' ? 'green' : 'slate'}>{medicine.status}</Badge></div>
          <p className="text-sm text-slate-500">{medicine.genericName || medicine.generic || 'Generic name not provided'} · {medicine.strength || medicine.dosageForm || 'Strength not specified'}</p>
          {medicine.brandName && <p className="mt-1 text-xs text-slate-500">Brand: {medicine.brandName}</p>}
          {medicine.description && <p className="mt-3 text-sm text-slate-600">{medicine.description}</p>}
          {medicine.route && <p className="mt-2 text-xs text-slate-500">Route: {medicine.route}</p>}
          {medicine.prescriptionRequired && <p className="mt-2 text-xs font-semibold text-amber-700">Prescription required</p>}
        </div>
      </Card>)}
    </div>
    {visible.length === 0 && <p className="py-8 text-center text-slate-500">No medicine catalogue entries match this search.</p>}
  </div>;
}
