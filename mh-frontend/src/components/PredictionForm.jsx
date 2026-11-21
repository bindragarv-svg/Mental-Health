import { useMemo, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { FIELDS, GROUPS, emptyValues, validate, toPayload, rangeHint } from '../config/schema.js';
import { Spinner } from './Loading.jsx';

export default function PredictionForm({ onSubmit, onReset, loading, serverErrors = {} }) {
  const [values, setValues] = useState(emptyValues);
  const [touched, setTouched] = useState({});
  const errors = useMemo(() => validate(values), [values]);
  const errorFor = (n) => (touched[n] && errors[n]) || serverErrors[n];

  const set = (n, v) => setValues((s) => ({ ...s, [n]: v }));
  const blur = (n) => setTouched((t) => ({ ...t, [n]: true }));

  const submit = (e) => {
    e.preventDefault();
    if (loading) return; // prevent duplicate submissions
    setTouched(Object.fromEntries(FIELDS.map((f) => [f.name, true])));
    if (Object.keys(errors).length) return;
    onSubmit(toPayload(values));
  };
  const reset = () => { setValues(emptyValues()); setTouched({}); onReset?.(); };

  return (
    <form onSubmit={submit} noValidate className="card space-y-7 p-5 sm:p-6">
      {GROUPS.map((g) => (
        <fieldset key={g} disabled={loading}>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{g}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.filter((f) => f.group === g).map((f) => {
              const err = errorFor(f.name);
              const cls = `input ${err ? 'input-error' : ''}`;
              return (
                <div key={f.name}>
                  <label htmlFor={f.name} className="mb-1.5 flex items-center justify-between text-sm font-medium">
                    <span>{f.label} <span className="text-rose-500" title="Required">*</span></span>
                    {rangeHint(f) && <span className="text-xs font-normal text-slate-400">{rangeHint(f)}</span>}
                  </label>
                  {f.type === 'select' ? (
                    <select id={f.name} className={cls} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} onBlur={() => blur(f.name)}>
                      <option value="">Select…</option>
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input id={f.name} className={cls} type={f.type} value={values[f.name]}
                      min={f.min} max={f.max} step={f.step} inputMode={f.type === 'number' ? 'decimal' : undefined}
                      placeholder={f.placeholder || (f.type === 'number' ? 'Enter a value' : '')}
                      list={f.suggestions ? `${f.name}-list` : undefined}
                      onChange={(e) => set(f.name, e.target.value)} onBlur={() => blur(f.name)} />
                  )}
                  {f.suggestions && <datalist id={`${f.name}-list`}>{f.suggestions.map((s) => <option key={s} value={s} />)}</datalist>}
                  {err && <p className="mt-1 text-xs text-rose-500">{err}</p>}
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
        <button type="button" className="btn-ghost" onClick={reset} disabled={loading}><RotateCcw className="h-4 w-4" /> Reset</button>
        <button type="submit" className="btn-primary sm:min-w-[160px]" disabled={loading}>
          {loading ? <><Spinner /> Predicting…</> : <><Sparkles className="h-4 w-4" /> Predict</>}
        </button>
      </div>
    </form>
  );
}
