import { useState } from 'react';

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
export const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
export const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50';

export function Img({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return <div role="img" aria-label={alt} className={`bg-gradient-to-br from-teal-100 to-sky-100 ${className}`} />;
  }
  return (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />
  );
}

export function Card({ children, className = '' }) {
  const noPadding = /(?:^|\\s)p-0(?:\\s|$)/.test(className);
  return <div className={`rounded-2xl border border-slate-200 bg-white ${noPadding ? '' : 'p-5'} shadow-sm ${className}`}>{children}</div>;
}

const badgeTones = {
  slate: 'bg-slate-100 text-slate-600',
  teal: 'bg-teal-50 text-teal-700',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  sky: 'bg-sky-50 text-sky-700',
};

export function Badge({ tone = 'slate', children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeTones[tone] || badgeTones.slate}`}>
      {children}
    </span>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const statTones = {
  teal: 'bg-teal-50 text-teal-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  sky: 'bg-sky-50 text-sky-600',
};

export function Stat({ icon: Icon, label, value, tone = 'teal' }) {
  return (
    <Card className="flex min-w-0 items-center gap-4">
      <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${statTones[tone] || statTones.teal}`}>
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-bold tabular-nums text-slate-900">{value ?? '—'}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </Card>
  );
}

export function Field({ label, children, className = '' }) {
  return (
    <label className={`block text-sm font-medium text-slate-700 ${className}`}>
      {label}
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

export function Tabs({ tabs, value, onChange, label = 'Page sections' }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={value === tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 ${
            value === tab.value ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && <span className="ml-1.5 text-xs text-slate-400">{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function ProgressRing({ percent }) {
  const safePercent = Math.min(100, Math.max(0, Number.isFinite(Number(percent)) ? Number(percent) : 0));
  const circumference = 2 * Math.PI * 50;
  return (
    <div role="img" aria-label={`Adherence ${Math.round(safePercent)} percent`} className="relative grid size-32 place-items-center">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r="50" fill="none" strokeWidth="10" className="stroke-slate-100" />
        <circle
          cx="60" cy="60" r="50" fill="none" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * safePercent) / 100}
          className="stroke-teal-500 transition-all duration-500"
        />
      </svg>
      <span className="absolute text-2xl font-bold tabular-nums text-slate-900">{Math.round(safePercent)}%</span>
    </div>
  );
}
