import { useEffect, useState } from 'react';
import { MapPin, Phone, RefreshCw, Store } from 'lucide-react';
import { Badge, Card, PageHeader, btnGhost } from '@/components/ui';
import { VENDORS } from '@/data/mock';
import { api } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';

const formatVendor = (vendor) => ({
  id: vendor.id,
  name: vendor.name,
  area: vendor.address,
  city: vendor.city,
  state: vendor.state,
  country: vendor.country,
  phone: vendor.phoneNumber,
  status: vendor.status,
});

export default function Vendors() {
  const { isAuthenticated } = useAuth();
  const [vendors, setVendors] = useState(VENDORS);
  const [source, setSource] = useState('demo');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!isAuthenticated) return;
    setBusy(true);
    setNotice('');
    try {
      const result = await api.vendors();
      setVendors((result || []).map(formatVendor));
      setSource('backend');
      if (!result?.length) setNotice('No vendor records are associated with your account yet. Create a vendor from an organisation account.');
    } catch (error) {
      setVendors(VENDORS);
      setSource('demo');
      setNotice(`Vendor API unavailable: ${error.message}. Showing Kalyani sample pharmacies instead.`);
    } finally { setBusy(false); }
  };

  useEffect(() => {
    if (isAuthenticated) load();
    else { setVendors(VENDORS); setSource('demo'); setNotice(''); }
  }, [isAuthenticated]);

  const isLive = source === 'backend';
  return <div className="space-y-6">
    <PageHeader title="Pharmacy & vendor network" subtitle={isLive ? 'Vendor directory returned by the authenticated backend.' : 'Synthetic sample pharmacy listings for the Kalyani demo.'}
      action={isAuthenticated ? <button type="button" onClick={load} disabled={busy} className={btnGhost}><RefreshCw size={15} className="mr-1 inline"/>Refresh</button> : null}/>
    <Badge tone={isLive ? 'green' : 'amber'}>{isLive ? 'Live vendor directory' : 'Sample directory'}</Badge>
    {notice && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{notice}</p>}
    {!isAuthenticated && <p className="text-xs text-slate-500">These names are fictional presentation data, not verified local pharmacies.</p>}
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {vendors.map((vendor) => <Card key={vendor.id} className="p-0">
        <div className="flex h-28 items-center justify-center bg-gradient-to-br from-teal-50 to-sky-50 text-teal-700"><Store size={36}/></div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-2"><h2 className="font-semibold text-slate-900">{vendor.name}</h2><Badge tone={vendor.status === 'ACTIVE' || vendor.open ? 'green' : 'slate'}>{vendor.status || (vendor.open ? 'Sample open' : 'Sample closed')}</Badge></div>
          <p className="mt-2 flex items-start gap-1 text-sm text-slate-500"><MapPin size={14} className="mt-0.5 shrink-0"/><span>{[vendor.area, vendor.city, vendor.state, vendor.country].filter(Boolean).join(', ') || 'Address not provided'}</span></p>
          {vendor.phone && <a href={`tel:${vendor.phone}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-teal-700"><Phone size={15}/>{vendor.phone}</a>}
          {vendor.rating && <p className="mt-2 text-xs text-slate-500">Sample rating: {vendor.rating}</p>}
        </div>
      </Card>)}
    </div>
    {vendors.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No vendor records found.</p>}
  </div>;
}
