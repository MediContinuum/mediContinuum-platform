import { useEffect, useState } from 'react';
import { Activity, BarChart3 } from 'lucide-react';
import { Badge, Card } from '@/components/ui';
import { api } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';

function formatMetric(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
  return Number.isInteger(value) ? value.toLocaleString('en-IN') : value.toLocaleString('en-IN', { maximumFractionDigits: 1 });
}

export default function DashboardBackendMetrics() {
  const { isAuthenticated } = useAuth();
  const [metrics, setMetrics] = useState([]);
  const [status, setStatus] = useState('demo');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let alive = true;
    if (!isAuthenticated) {
      setMetrics([]);
      setStatus('demo');
      setMessage('');
      return () => { alive = false; };
    }
    setStatus('loading');
    api.dashboardAnalytics().then((response) => {
      if (!alive) return;
      setMetrics(Array.isArray(response?.metrics) ? response.metrics : []);
      setStatus('live');
      setMessage('');
    }).catch((error) => {
      if (!alive) return;
      setStatus('unavailable');
      setMetrics([]);
      setMessage(error.message || 'Analytics endpoint is unavailable.');
    });
    return () => { alive = false; };
  }, [isAuthenticated]);

  if (!isAuthenticated) return <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
    <BarChart3 size={18} className="mt-0.5 shrink-0"/>
    <div><strong>Presentation demo data</strong><p className="mt-0.5 text-xs">The dashboard schedule, adherence and stock values are synthetic browser data. Sign in to load role-scoped analytics from the backend.</p></div>
  </div>;

  return <Card>
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2"><Activity size={18} className="text-teal-700"/><h2 className="font-semibold text-slate-900">Backend analytics</h2></div>
      <Badge tone={status === 'live' ? 'green' : status === 'unavailable' ? 'amber' : 'slate'}>{status === 'live' ? 'Live API' : status === 'loading' ? 'Loading' : status === 'unavailable' ? 'Unavailable' : 'Demo'}</Badge>
    </div>
    {message && <p role="status" className="mb-3 text-xs text-amber-800">{message}</p>}
    <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">Only the metrics above are live. The daily dose list, month/week charts, and stock counters further down the page are still synthetic browser demo data; patient dose schedule and update endpoints are not implemented yet.</p>
    {metrics.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.slice(0, 8).map((metric, index) => <div key={`${metric.label}-${index}`} className="rounded-xl bg-slate-50 p-3">
        <p className="text-xs text-slate-500">{metric.label}</p>
        <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">{formatMetric(metric.value)}</p>
        {metric.subtitle && <p className="mt-1 text-xs text-slate-500">{metric.subtitle}</p>}
      </div>)}
    </div> : <p className="text-sm text-slate-500">{status === 'loading' ? 'Loading your analytics…' : status === 'unavailable' ? 'Live analytics could not be loaded. Existing dashboard sample widgets remain visible.' : 'No analytics data is available yet.'}</p>}
  </Card>;
}
