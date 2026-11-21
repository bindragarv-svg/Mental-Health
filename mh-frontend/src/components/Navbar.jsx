import { useEffect, useState } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { checkHealth } from '../services/api.js';

export default function Navbar({ onMenu, theme, onToggleTheme }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let alive = true;
    const run = () => checkHealth().then(() => alive && setStatus('online')).catch(() => alive && setStatus('offline'));
    run();
    const t = setInterval(run, 30000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  const dot = { online: 'bg-emerald-500', offline: 'bg-rose-500', checking: 'bg-amber-400 animate-pulse' }[status];
  const label = { online: 'API online', offline: 'API offline', checking: 'Checking API…' }[status];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:px-6 lg:px-8">
      <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
      <div className="hidden text-sm text-slate-500 lg:block">Mental Health Score Prediction</div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium dark:border-slate-700">
          <span className={`h-2 w-2 rounded-full ${dot}`} /> {label}
        </span>
        <button onClick={onToggleTheme} className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>
      </div>
    </header>
  );
}
