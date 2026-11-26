import { useEffect, useState } from 'react';
import { Check, Clock, UserMinus, UserPlus, X } from 'lucide-react';
import { Card, Field, PageHeader, Tabs, btnPrimary, inputCls } from '@/components/ui';
import { FAMILY } from '@/data/mock';
import { humanize } from '@/utils/date';
import { api } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';

const RELATIONSHIPS = ['PARENT', 'CHILD', 'SPOUSE', 'SIBLING', 'GRANDPARENT', 'GRANDCHILD', 'UNCLE', 'AUNT', 'COUSIN', 'RELATIVE', 'OTHER'];
const demoState = {
  members: FAMILY.members,
  received: FAMILY.received,
  sent: FAMILY.sent,
};
const mapConnection = (item, direction, currentGlobalId) => {
  const isCurrentUserSender = item.userGlobalId === currentGlobalId;
  const counterpart = direction === 'received' || (direction === 'members' && !isCurrentUserSender)
    ? { name: item.userName, globalId: item.userGlobalId }
    : { name: item.relatedUserName, globalId: item.relatedUserGlobalId };
  return {
    id: item.connectionId,
    name: counterpart.name,
    globalId: counterpart.globalId,
    relationship: item.relationship,
    status: item.status,
  };
};

function PersonRow({ person, actions, status }) {
  return <li className="flex flex-wrap items-center justify-between gap-3 py-3">
    <div className="flex min-w-0 items-center gap-3">
      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-teal-50 text-sm font-semibold text-teal-800">
        {(person.name || 'U').split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase()}
      </div>
      <div className="min-w-0"><p className="truncate font-medium text-slate-900">{person.name}</p>
        <p className="text-xs text-slate-500">{humanize(person.relationship)} · Global ID {person.globalId}</p>
        {status && <p className="mt-0.5 text-[11px] text-slate-400">{humanize(status)}</p>}
      </div>
    </div>
    <div className="flex gap-2">{actions}</div>
  </li>;
}

const solid = 'inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50';
const outline = 'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50';

export default function Family() {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState(demoState);
  const [tab, setTab] = useState('members');
  const [request, setRequest] = useState({ relatedUserGlobalId: '', relationship: 'PARENT' });
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [source, setSource] = useState('demo');

  const load = async () => {
    if (!isAuthenticated) return;
    setBusy(true);
    setNotice('');
    try {
      const [members, received, sent] = await Promise.all([
        api.familyConnections(), api.familyReceived(), api.familySent(),
      ]);
      const globalId = user?.globalUserId || '';
      setData({
        members: (members || []).map((item) => mapConnection(item, 'members', globalId)),
        received: (received || []).map((item) => mapConnection(item, 'received', globalId)),
        sent: (sent || []).map((item) => mapConnection(item, 'sent', globalId)),
      });
      setSource('backend');
    } catch (error) {
      setNotice(`Family connection API unavailable: ${error.message}. Demo data is shown only as a fallback.`);
      setData(demoState);
      setSource('demo');
    } finally { setBusy(false); }
  };

  useEffect(() => {
    if (isAuthenticated) load();
    else { setData(demoState); setSource('demo'); setNotice(''); }
  }, [isAuthenticated, user?.globalUserId]);

  const update = (event) => setRequest((old) => ({ ...old, [event.target.name]: event.target.value }));
  const send = async (event) => {
    event.preventDefault();
    setNotice('');
    if (!isAuthenticated) {
      setNotice('Sign in to send a real family request. Guest mode is view-only demo data.');
      return;
    }
    if (request.relatedUserGlobalId === user?.globalUserId) {
      setNotice('You cannot send a family request to your own Global ID.');
      return;
    }
    setBusy(true);
    try {
      await api.familySend(request);
      setRequest({ relatedUserGlobalId: '', relationship: 'PARENT' });
      setTab('sent');
      await load();
    } catch (error) { setNotice(error.message); }
    finally { setBusy(false); }
  };

  const act = async (kind, person) => {
    if (source !== 'backend') {
      setNotice('This action is only available for signed-in backend accounts.');
      return;
    }
    setBusy(true);
    setNotice('');
    try {
      if (kind === 'accept') await api.familyAccept(person.id);
      if (kind === 'reject') await api.familyReject(person.id);
      if (kind === 'cancel') await api.familyCancel(person.id);
      if (kind === 'remove') await api.familyRemove(person.id);
      await load();
    } catch (error) { setNotice(error.message); }
    finally { setBusy(false); }
  };

  const tabs = [
    { value: 'members', label: 'Members', count: data.members.length },
    { value: 'received', label: 'Received', count: data.received.length },
    { value: 'sent', label: 'Sent', count: data.sent.length },
  ];
  const isLive = source === 'backend';

  return <div className="space-y-6">
    <PageHeader title="Family connections" subtitle="Connect with family members using their 16-digit MediContinuum Global ID."/>
    <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${isLive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{isLive ? 'Live family connections' : 'Sample family data'}</span>
      {user?.globalUserId && <span className="text-xs text-slate-500">Your Global ID: {user.globalUserId}</span>}
    </div>
    {notice && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{notice}</p>}
    <Card>
      <form onSubmit={send} className="grid gap-4 sm:grid-cols-[1fr_220px_auto] sm:items-end">
        <Field label="Family member Global ID"><input required inputMode="numeric" pattern="[0-9]{16}" maxLength={16} name="relatedUserGlobalId" value={request.relatedUserGlobalId} onChange={update} className={inputCls} placeholder="Enter 16 digit Global ID"/></Field>
        <Field label="Relationship"><select name="relationship" value={request.relationship} onChange={update} className={inputCls}>{RELATIONSHIPS.map((value) => <option key={value} value={value}>{humanize(value)}</option>)}</select></Field>
        <button type="submit" disabled={busy || !isAuthenticated} className={`${btnPrimary} justify-center disabled:opacity-50`}><UserPlus size={16}/> Send request</button>
      </form>
      {!isAuthenticated && <p className="mt-2 text-xs text-slate-500">Sign in to send and manage real connection requests. This form is disabled in presentation guest mode.</p>}
    </Card>
    <Card>
      <Tabs tabs={tabs} value={tab} onChange={setTab}/>
      <ul className="divide-y divide-slate-100">
        {data[tab].map((person) => <PersonRow key={person.id} person={person} status={tab === 'members' ? undefined : person.status}
          actions={tab === 'members'
            ? <button type="button" disabled={busy || !isLive} onClick={() => act('remove', person)} className={outline}><UserMinus size={14}/> Remove</button>
            : tab === 'received'
              ? <><button type="button" disabled={busy || !isLive} onClick={() => act('accept', person)} className={solid}><Check size={14}/> Accept</button><button type="button" disabled={busy || !isLive} onClick={() => act('reject', person)} className={outline}><X size={14}/> Reject</button></>
              : <button type="button" disabled={busy || !isLive} onClick={() => act('cancel', person)} className={outline}><Clock size={14}/> Cancel</button>}
        />)}
      </ul>
      {!data[tab].length && <p className="py-8 text-center text-sm text-slate-500">{tab === 'members' ? 'No accepted family members yet.' : tab === 'received' ? 'No pending requests received.' : 'No pending requests sent.'}</p>}
    </Card>
  </div>;
}
