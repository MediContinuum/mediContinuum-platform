import { useEffect, useState } from 'react';
import { AlertTriangle, Bell, Boxes, ClipboardCheck, Users, RefreshCw } from 'lucide-react';
import { Badge, Card, PageHeader, Tabs, btnGhost } from '@/components/ui';
import { NOTIFICATIONS } from '@/data/mock';
import { api } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';

const icons = {
  DOSE: Bell, MISSED_DOSE: Bell, STOCK: Boxes, LOW_STOCK: Boxes,
  EXPIRY: AlertTriangle, EXPIRY_WARNING: AlertTriangle,
  PRESCRIPTION_CREATED: ClipboardCheck, FAMILY: Users, GENERAL: Bell,
};
const formatTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};
const mapLive = (item) => ({
  id: item.id, type: item.type, title: item.title,
  body: item.message, time: formatTime(item.createdAt), read: item.read,
});

export default function Notifications() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState(NOTIFICATIONS);
  const [source, setSource] = useState('demo');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const load = async () => {
    if (!isAuthenticated) return;
    setBusy(true);
    setNotice('');
    try {
      const page = await api.notifications({ page: 0, size: 50 });
      setItems((page?.notifications || []).map(mapLive));
      setSource('backend');
    } catch (error) {
      setItems(NOTIFICATIONS);
      setSource('demo');
      setNotice(`Notifications API unavailable: ${error.message}. Showing sample notifications.`);
    } finally { setBusy(false); }
  };

  useEffect(() => {
    if (isAuthenticated) load();
    else { setItems(NOTIFICATIONS); setSource('demo'); setNotice(''); }
  }, [isAuthenticated]);

  const unread = items.filter((item) => !item.read).length;
  const visible = filter === 'UNREAD' ? items.filter((item) => !item.read) : items;
  const markRead = async (id) => {
    if (source === 'backend') {
      try {
        const updated = await api.markNotificationRead(id);
        setItems((old) => old.map((item) => item.id === id ? mapLive(updated) : item));
      } catch (error) { setNotice(error.message); }
    } else {
      setItems((old) => old.map((item) => item.id === id ? { ...item, read: true } : item));
    }
  };
  const markAll = async () => {
    if (source === 'backend') {
      try {
        await api.markAllNotificationsRead();
        setItems((old) => old.map((item) => ({ ...item, read: true })));
      } catch (error) { setNotice(error.message); }
    } else {
      setItems((old) => old.map((item) => ({ ...item, read: true })));
    }
  };

  return <div className="space-y-6">
    <PageHeader title="Notifications" subtitle={`${unread} unread`} action={<div className="flex gap-2">
      {isAuthenticated && <button type="button" onClick={load} disabled={busy} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"><RefreshCw size={15} className="mr-1 inline"/>Refresh</button>}
      <button type="button" onClick={markAll} disabled={busy || !unread} className={btnGhost}>Mark all as read</button>
    </div>}/>
    <div className="flex items-center gap-2"><Badge tone={source === 'backend' ? 'green' : 'amber'}>{source === 'backend' ? 'Live notifications' : 'Sample notifications'}</Badge></div>
    {notice && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{notice}</p>}
    <Tabs tabs={[{ value: 'ALL', label: 'All', count: items.length }, { value: 'UNREAD', label: 'Unread', count: unread }]} value={filter} onChange={setFilter}/>
    <ul className="space-y-3">
      {visible.map((item) => {
        const Icon = icons[item.type] || Bell;
        return <li key={item.id}><Card className={`flex items-start gap-4 ${item.read ? '' : 'border-teal-200 bg-teal-50/40'}`}>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600"><Icon size={18}/></span>
          <div className="min-w-0 flex-1"><p className="font-semibold text-slate-900">{item.title}</p><p className="text-sm text-slate-500">{item.body}</p><p className="mt-1 text-xs text-slate-400">{item.time}</p></div>
          {!item.read && <button type="button" onClick={() => markRead(item.id)} className="shrink-0 text-xs font-semibold text-teal-700 hover:underline">Mark read</button>}
        </Card></li>;
      })}
    </ul>
    {visible.length === 0 && <p className="text-center text-slate-500">You are all caught up.</p>}
  </div>;
}
