import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell, AuthLink } from '@/components/AuthShell';
import { Field, btnPrimary, inputCls } from '@/components/ui';
import { useAuth } from '@/auth/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (exception) {
      setError(exception.message || 'Unable to sign in. Check your credentials and backend connection.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your MediContinuum account." footer={<>New here? <AuthLink to="/signup">Create a patient account</AuthLink></>}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email"><input required autoComplete="username" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com"/></Field>
        <Field label="Password"><input required autoComplete="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="Your password"/></Field>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className={`${btnPrimary} w-full justify-center disabled:cursor-not-allowed disabled:opacity-60`}>{busy ? 'Signing in…' : 'Log in'}</button>
        <p className="text-xs text-slate-500">This signs in through the Spring Boot API. The dashboard remains available in demo mode without an account.</p>
      </form>
    </AuthShell>
  );
}
