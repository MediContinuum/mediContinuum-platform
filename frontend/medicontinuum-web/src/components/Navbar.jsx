import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import { btnPrimary } from '@/components/ui';
import { useAuth } from '@/auth/AuthContext';
import BackendStatus from '@/components/BackendStatus';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/medicines', label: 'Medicines' },
  { to: '/prescriptions', label: 'Prescriptions' },
  { to: '/vendors', label: 'Pharmacies' },
  { to: '/demo-network', label: 'Kalyani Demo' },
];
const linkCls = ({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 ${isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:text-slate-900'}`;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const name = user?.fullName?.split(' ')[0] || 'Account';
  const closeMobile = () => setOpen(false);

  const handleLogout = () => {
    logout().catch(() => {
      // AuthContext clears the local session even if the server logout request fails.
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-lg font-bold text-slate-900">
          <img src="/medicontinuum-logo.png" alt="" className="size-9 rounded-xl object-cover" />
          MediContinuum
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary navigation">
          {links.map((link) => <NavLink key={link.to} to={link.to} end={link.end} className={linkCls}>{link.label}</NavLink>)}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <BackendStatus />
          <Link to="/notifications" aria-label="Notifications" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><Bell size={20}/></Link>
          {isAuthenticated ? <>
            <span className="max-w-28 truncate text-sm font-medium text-slate-700" title={user.email}>{name}</span>
            <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Log out</button>
          </> : <>
            <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">Log in</Link>
            <Link to="/signup" className={btnPrimary}>Sign up</Link>
          </>}
        </div>

        <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="rounded-lg p-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 xl:hidden">
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {open && <div className="space-y-1 border-t border-slate-200 bg-white px-4 py-3 shadow-lg xl:hidden">
        <div className="pb-2"><BackendStatus /></div>
        <nav aria-label="Mobile navigation" className="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {links.map((link) => <NavLink key={link.to} to={link.to} end={link.end} onClick={closeMobile} className={({isActive}) => `block ${linkCls({isActive})}`}>{link.label}</NavLink>)}
        </nav>
        <div className="flex gap-2 pt-2">
          {isAuthenticated ? <>
            <Link to="/notifications" onClick={closeMobile} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold">Notifications</Link>
            <button type="button" onClick={() => { closeMobile(); handleLogout(); }} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold">Log out · {name}</button>
          </> : <>
            <Link to="/login" onClick={closeMobile} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold">Log in</Link>
            <Link to="/signup" onClick={closeMobile} className={`${btnPrimary} flex-1`}>Sign up</Link>
          </>}
        </div>
      </div>}
    </header>
  );
}
