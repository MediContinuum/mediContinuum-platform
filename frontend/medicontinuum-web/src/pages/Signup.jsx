import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell, AuthLink } from '@/components/AuthShell';
import { Field, btnPrimary, inputCls } from '@/components/ui';
import { useAuth } from '@/auth/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (event) => setForm((old) => ({ ...old, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (new TextEncoder().encode(form.password).length < 10) { setError('Password must contain at least 10 UTF-8 bytes.'); return; }
    setBusy(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (exception) {
      setError(exception.message || 'Unable to create your account. Check the backend connection.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Create your patient account" subtitle="Join MediContinuum to manage medication continuity." footer={<>Already registered? <AuthLink to="/login">Log in</AuthLink></>}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name"><input required maxLength={120} name="fullName" autoComplete="name" value={form.fullName} onChange={update} className={inputCls} placeholder="Aarav Sharma"/></Field>
        <Field label="Email"><input required maxLength={150} type="email" name="email" autoComplete="email" value={form.email} onChange={update} className={inputCls} placeholder="you@example.com"/></Field>
        <Field label="Phone number"><input name="phone" maxLength={20} autoComplete="tel" value={form.phone} onChange={update} className={inputCls} placeholder="+91 98765 43210"/></Field>
        <Field label="Password"><input required minLength={10} name="password" type="password" autoComplete="new-password" value={form.password} onChange={update} className={inputCls} placeholder="At least 10 characters"/></Field>
        <Field label="Confirm password"><input required name="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={update} className={inputCls} placeholder="Enter password again"/></Field>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className={`${btnPrimary} w-full justify-center disabled:cursor-not-allowed disabled:opacity-60`}>{busy ? 'Creating account…' : 'Create account'}</button>
        <p className="text-xs text-slate-500">New registrations are created with the PATIENT role by the backend. Detailed health-profile editing is not yet exposed by the current patient API.</p>
      </form>
    </AuthShell>
  );
}
