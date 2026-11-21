import { CheckCircle2, AlertTriangle, Cpu, Clock } from 'lucide-react';
import { getScore, fmtDate } from '../utils/history.js';
import { FIELDS } from '../config/schema.js';

export default function ResultCard({ entry, showInput = true }) {
  const score = getScore(entry);
  const response = entry?.response && typeof entry.response === 'object' ? entry.response : {};
  // Any extra fields the backend might return in the future are shown, not dropped.
  const extras = Object.entries(response).filter(([k]) => k !== 'Mental_health_score');

  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white">
        <p className="flex items-center gap-2 text-sm font-medium text-indigo-100">
          {score !== null ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />} Predicted mental health score
        </p>
        <p className="mt-2 text-5xl font-bold tracking-tight">{score !== null ? score.toFixed(2) : '—'}</p>
        {score === null && <p className="mt-2 text-sm text-indigo-100">The response did not contain a numeric <code>Mental_health_score</code>.</p>}
      </div>
      <div className="space-y-5 p-6">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-start gap-2.5"><Cpu className="mt-0.5 h-4 w-4 text-slate-400" /><div><p className="text-xs text-slate-500">Model</p><p className="font-medium">model.pkl · POST /predict</p></div></div>
          <div className="flex items-start gap-2.5"><Clock className="mt-0.5 h-4 w-4 text-slate-400" /><div><p className="text-xs text-slate-500">Predicted at</p><p className="font-medium">{entry?.timestamp ? fmtDate(entry.timestamp) : '—'}</p></div></div>
        </div>
        <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800/60">
          The API returns a single regression value. Its meaning and scale depend on how the score was defined when the model was trained. No probabilities or confidence values are provided.
        </p>
        {extras.length > 0 && (
          <dl className="space-y-1.5 text-sm">
            {extras.map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-slate-500">{k}</dt><dd className="font-medium">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</dd></div>)}
          </dl>
        )}
        {showInput && entry?.input && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Submitted input</p>
            <dl className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {FIELDS.map((f) => (
                <div key={f.name} className="flex justify-between gap-4 py-1.5"><dt className="text-slate-500">{f.label}</dt><dd className="font-medium">{String(entry.input[f.name] ?? '—')}</dd></div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
