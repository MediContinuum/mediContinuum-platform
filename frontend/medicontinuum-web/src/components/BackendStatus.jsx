import { useEffect, useState } from 'react';
import { Activity, CloudOff } from 'lucide-react';
import { api } from '@/api/client';

export default function BackendStatus() {
  const [status, setStatus] = useState('checking');
  useEffect(() => {
    let alive = true;
    api.health().then((result) => {
      if (alive) setStatus(result?.status === 'UP' && result?.database === 'UP' ? 'online' : 'degraded');
    }).catch(() => { if (alive) setStatus('offline'); });
    return () => { alive = false; };
  }, []);
  const color = status === 'online' ? 'bg-emerald-50 text-emerald-700' : status === 'degraded' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-600';
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${color}`}>
    {status === 'offline' ? <CloudOff size={12}/> : <Activity size={12}/>}
    {status === 'online' ? 'Backend connected' : status === 'degraded' ? 'Backend degraded' : status === 'offline' ? 'Demo mode · API offline' : 'Checking API…'}
  </span>;
}
