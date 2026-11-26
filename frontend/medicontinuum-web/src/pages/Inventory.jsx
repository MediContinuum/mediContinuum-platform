import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Boxes, PackageX, Plus, RefreshCw } from 'lucide-react';
import { Badge, Card, Field, PageHeader, Stat, Tabs, btnPrimary, inputCls } from '@/components/ui';
import { DOSAGE_UNITS, MEDICINES } from '@/data/mock';
import { patientActions, usePatient } from '@/store/patientStore';
import { formatDate } from '@/utils/date';
import { isExpiring, isLow } from '@/utils/inventory';
import { useAuth } from '@/auth/AuthContext';
import { api } from '@/api/client';

const defaultBatch = { medicine: MEDICINES[0].name, medicineId: '', batchNumber: '', expiryDate: '', quantity: 30, stockUnit: 'TABLET', lowStockThreshold: 5, notes: '' };
const formatLiveItem = (item) => ({
  id: item.inventoryItemId,
  medicine: item.medicineName,
  batchNumber: item.batches?.map((batch) => batch.batchNumber).filter(Boolean).join(', ') || '—',
  expiryDate: item.batches?.map((batch) => batch.expiryDate).filter(Boolean).sort()[0] || '',
  quantity: Number(item.availableQuantity || 0),
  stockUnit: item.stockUnit || 'UNIT',
  lowStockThreshold: Number(item.lowStockThreshold || 0),
  lowStock: Boolean(item.lowStock),
  raw: item,
});

export default function Inventory() {
  const demoState = usePatient();
  const { isAuthenticated } = useAuth();
  const [liveItems, setLiveItems] = useState(null);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [batch, setBatch] = useState(defaultBatch);

  const loadLive = async () => {
    setBusy(true);
    setLoadError('');
    try {
      const [inventory, medicines] = await Promise.all([api.inventory(), api.medicines({ status: 'ACTIVE' })]);
      setLiveItems((inventory || []).map(formatLiveItem));
      setMedicineOptions(medicines || []);
    } catch (error) {
      setLiveItems(null);
      setLoadError(`Live inventory is unavailable: ${error.message}. Showing synthetic browser demo stock instead.`);
    } finally { setBusy(false); }
  };

  useEffect(() => {
    if (isAuthenticated) loadLive();
    else { setLiveItems(null); setLoadError(''); setMedicineOptions([]); }
  }, [isAuthenticated]);

  const isLive = isAuthenticated && liveItems !== null;
  const items = isLive ? liveItems : demoState.inventory;
  const lowCount = items.filter((item) => isLive ? item.lowStock : isLow(item)).length;
  const expiringCount = items.filter((item) => isLive
    ? item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 30 * 86400000)
    : isExpiring(item)).length;
  const visible = items.filter((item) => filter === 'ALL' ||
    (filter === 'LOW' ? (isLive ? item.lowStock : isLow(item)) :
      (isLive ? item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 30 * 86400000) : isExpiring(item))));
  const tabs = [
    { value: 'ALL', label: 'All', count: items.length },
    { value: 'LOW', label: 'Low stock', count: lowCount },
    { value: 'EXPIRING', label: 'Expiring', count: expiringCount },
  ];

  useEffect(() => {
    if (isLive && medicineOptions.length && !batch.medicineId) {
      setBatch((old) => ({ ...old, medicineId: medicineOptions[0].id }));
    }
  }, [isLive, medicineOptions]);

  const update = (event) => setBatch((old) => ({ ...old, [event.target.name]: event.target.value }));
  const consume = async (item) => {
    if (!isLive) { patientActions.consumeBatch(item.id); return; }
    try {
      await api.consumeStock(item.id, { quantity: 1, stockUnit: item.stockUnit, notes: 'Consumed from MediContinuum inventory screen' });
      await loadLive();
    } catch (error) { setLoadError(error.message); }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLive) {
      try {
        await api.addStock({
          medicineId: batch.medicineId,
          batchNumber: batch.batchNumber,
          expiryDate: batch.expiryDate,
          quantity: Number(batch.quantity),
          stockUnit: batch.stockUnit,
          lowStockThreshold: Number(batch.lowStockThreshold),
          notes: batch.notes,
        });
        await loadLive();
        setShowForm(false);
      } catch (error) { setLoadError(error.message); }
      return;
    }
    patientActions.addBatch({ ...batch, quantity: Number(batch.quantity), lowStockThreshold: Number(batch.lowStockThreshold) });
    setBatch(defaultBatch);
    setShowForm(false);
  };

  return <div className="space-y-6">
    <PageHeader title="Medicine inventory" subtitle={isLive ? 'Live stock returned by your authenticated patient inventory API.' : 'Synthetic sample stock for the presentation demo.'}
      action={<div className="flex gap-2">
        {isAuthenticated && <button type="button" onClick={loadLive} disabled={busy} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"><RefreshCw size={15} className="mr-1 inline"/>Refresh</button>}
        <button type="button" onClick={() => setShowForm((value) => !value)} className={btnPrimary}><Plus size={16}/> Add stock</button>
      </div>}/>
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <Badge tone={isLive ? 'green' : 'amber'}>{isLive ? 'Live backend data' : 'Demo data'}</Badge>
      {busy && <span className="text-slate-500">Syncing…</span>}
    </div>
    {loadError && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{loadError}</p>}
    {!isLive && <p className="text-xs text-slate-500">Demo actions update this browser only. Login with a PATIENT account to use the live inventory endpoints.</p>}
    <div className="grid gap-4 sm:grid-cols-3">
      <Stat icon={Boxes} label="Medicine items" value={items.length}/>
      <Stat icon={PackageX} label="Low stock" value={lowCount} tone="red"/>
      <Stat icon={AlertTriangle} label="Expiring soon" value={expiringCount} tone="amber"/>
    </div>
    {showForm && <Card>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Medicine">
          {isLive ? <select required name="medicineId" value={batch.medicineId} onChange={update} className={inputCls}>
            {medicineOptions.map((medicine) => <option key={medicine.id} value={medicine.id}>{medicine.name} · {medicine.strength || medicine.dosageForm}</option>)}
          </select> : <select name="medicine" value={batch.medicine} onChange={update} className={inputCls}>{MEDICINES.map((medicine) => <option key={medicine.id}>{medicine.name}</option>)}</select>}
        </Field>
        <Field label="Batch number"><input required name="batchNumber" value={batch.batchNumber} onChange={update} className={inputCls}/></Field>
        <Field label="Expiry date"><input required min={new Date().toISOString().slice(0,10)} type="date" name="expiryDate" value={batch.expiryDate} onChange={update} className={inputCls}/></Field>
        <Field label="Quantity"><input required min="0.01" step="0.01" type="number" name="quantity" value={batch.quantity} onChange={update} className={inputCls}/></Field>
        <Field label="Stock unit"><select name="stockUnit" value={batch.stockUnit} onChange={update} className={inputCls}>{DOSAGE_UNITS.map((unit) => <option key={unit}>{unit}</option>)}</select></Field>
        <Field label="Low-stock threshold"><input min="0" step="0.01" type="number" name="lowStockThreshold" value={batch.lowStockThreshold} onChange={update} className={inputCls}/></Field>
        <Field label="Notes" className="sm:col-span-2 lg:col-span-3"><input name="notes" value={batch.notes} onChange={update} className={inputCls}/></Field>
        {isLive && medicineOptions.length === 0 && <p className="text-sm text-amber-700">Add an active medicine to the catalogue before recording stock.</p>}
        <button type="submit" disabled={busy || (isLive && !medicineOptions.length)} className={`${btnPrimary} disabled:opacity-50`}>Save stock</button>
      </form>
    </Card>}
    <Card className="overflow-x-auto">
      <Tabs tabs={tabs} value={filter} onChange={setFilter}/>
      <table className="mt-4 w-full min-w-[650px] text-left text-sm">
        <thead className="text-xs uppercase text-slate-400"><tr><th className="py-2">Medicine</th><th>Batch</th><th>Earliest expiry</th><th>Available</th><th>Status</th><th/></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {visible.map((item) => {
            const low = isLive ? item.lowStock : isLow(item);
            const expiring = isLive ? item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 30 * 86400000) : isExpiring(item);
            return <tr key={item.id}>
              <td className="py-3 font-medium text-slate-900">{item.medicine}</td>
              <td className="text-slate-500">{item.batchNumber || '—'}</td>
              <td className="text-slate-500">{item.expiryDate ? formatDate(item.expiryDate) : '—'}</td>
              <td><span className="font-semibold text-slate-700">{item.quantity}</span> <span className="text-xs text-slate-500">{(item.stockUnit || 'unit').toLowerCase()}</span></td>
              <td className="space-x-1">{low && <Badge tone="red">Low</Badge>}{expiring && <Badge tone="amber">Expiring</Badge>}{!low && !expiring && <Badge tone="green">Healthy</Badge>}</td>
              <td className="text-right"><button type="button" onClick={() => consume(item)} disabled={item.quantity <= 0 || busy} className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40">Consume 1</button></td>
            </tr>;
          })}
        </tbody>
      </table>
      {visible.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No inventory items in this filter.</p>}
    </Card>
  </div>;
}
