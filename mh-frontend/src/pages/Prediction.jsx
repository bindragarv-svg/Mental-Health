import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { AlertCircle, Sparkles } from 'lucide-react';
import PredictionForm from '../components/PredictionForm.jsx';
import ResultCard from '../components/ResultCard.jsx';
import { ResultSkeleton } from '../components/Loading.jsx';
import { predict, parseError } from '../services/api.js';
import { addEntry, newId } from '../utils/history.js';

export default function Prediction() {
  const [loading, setLoading] = useState(false);
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState(null);
  const [serverErrors, setServerErrors] = useState({});
  const busy = useRef(false);

  async function handleSubmit(payload) {
    if (busy.current) return;
    busy.current = true;
    setLoading(true); setError(null); setServerErrors({}); setEntry(null);
    try {
      const response = await predict(payload);
      const e = { id: newId(), timestamp: new Date().toISOString(), input: payload, response };
      addEntry(e);
      setEntry(e);
      toast.success('Prediction complete');
    } catch (err) {
      const parsed = parseError(err);
      setError(parsed); setServerErrors(parsed.fieldErrors);
      toast.error(parsed.message.length > 90 ? parsed.message.slice(0, 87) + '…' : parsed.message);
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New prediction</h1>
        <p className="text-sm text-slate-500">Fill in all fields to estimate a mental health score.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PredictionForm onSubmit={handleSubmit} onReset={() => { setEntry(null); setError(null); setServerErrors({}); }} loading={loading} serverErrors={serverErrors} />
        </div>
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24">
            {loading ? <ResultSkeleton /> : error ? (
              <div className="card border-rose-200 p-6 dark:border-rose-500/30">
                <p className="flex items-center gap-2 font-semibold text-rose-600"><AlertCircle className="h-5 w-5" /> Request failed{error.status ? ` (${error.status})` : ''}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{error.message}</p>
              </div>
            ) : entry ? <ResultCard entry={entry} /> : (
              <div className="card grid place-items-center p-10 text-center">
                <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10"><Sparkles className="h-6 w-6" /></span>
                <p className="font-semibold">No result yet</p>
                <p className="mt-1 text-sm text-slate-500">Your prediction will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
