import { useState } from 'react';
import { Card, Field, PageHeader, btnPrimary, inputCls } from '@/components/ui';
import { BLOOD_GROUPS, GENDERS, PROFILE, USER } from '@/data/mock';
import { humanize } from '@/utils/date';
import { useAuth } from '@/auth/AuthContext';

const fields = [
  { name: 'dateOfBirth', label: 'Date of birth', type: 'date' },
  { name: 'gender', label: 'Gender', options: GENDERS },
  { name: 'bloodGroup', label: 'Blood group', options: BLOOD_GROUPS },
  { name: 'postalCode', label: 'Postal code' },
  { name: 'addressLine', label: 'Address', wide: true },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'country', label: 'Country' },
  { name: 'emergencyContactName', label: 'Emergency contact' },
  { name: 'emergencyContactPhone', label: 'Emergency phone', type: 'tel' },
];

function readDraft() {
  try { return { ...PROFILE, ...JSON.parse(localStorage.getItem('mc.profile.demo-draft') || '{}') }; }
  catch { return PROFILE; }
}

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState(readDraft);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const update = (event) => {
    setSaved(false);
    setSaveError('');
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      localStorage.setItem('mc.profile.demo-draft', JSON.stringify(form));
      setSaved(true);
      setSaveError('');
    } catch {
      setSaved(false);
      setSaveError('This browser could not save the local demo draft.');
    }
  };

  const displayName = user?.fullName || USER.name;
  const email = user?.email || USER.email;
  const globalId = user?.globalUserId || USER.globalUserId;
  const phone = user?.phoneNumber || USER.phone;

  return <div className="space-y-6">
    <PageHeader title="Account & demo profile" subtitle="Your authenticated account identity and a local-only health-profile form."/>
    <Card className="flex items-center gap-4">
      <img src={USER.avatar} alt="" width="72" height="72" className="size-18 rounded-full"/>
      <div className="min-w-0"><p className="text-lg font-semibold text-slate-900">{displayName}</p><p className="text-sm text-slate-500">{email}</p><p className="text-xs text-slate-400">Global ID {globalId}</p>{phone && <p className="mt-1 text-xs text-slate-500">{phone}</p>}</div>
    </Card>
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><strong>{isAuthenticated ? 'Health details are not synced.' : 'Presentation data only.'}</strong> The current backend exposes account identity but does not yet provide a patient self-service health-profile update endpoint. The form below saves a draft in this browser only.</div>
    <Card>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ name, label, type = 'text', options, wide }) => <Field key={name} label={label} className={wide ? 'sm:col-span-2' : ''}>
          {options
            ? <select name={name} value={form[name] || ''} onChange={update} className={inputCls}><option value="">Select {label.toLowerCase()}</option>{options.map((option) => <option key={option} value={option}>{humanize(option)}</option>)}</select>
            : <input name={name} type={type} value={form[name] || ''} onChange={update} className={inputCls}/>}
        </Field>)}
        <div className="flex items-center gap-3 sm:col-span-2">
          <button type="submit" className={btnPrimary}>Save local draft</button>
          {saved && <span role="status" className="text-sm text-emerald-600">Saved in this browser</span>}
          {saveError && <span role="alert" className="text-sm text-red-600">{saveError}</span>}
        </div>
      </form>
    </Card>
  </div>;
}
