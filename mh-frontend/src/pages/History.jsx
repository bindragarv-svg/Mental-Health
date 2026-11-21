import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Trash2, X, History as HistoryIcon } from "lucide-react";
import useHistory from "../hooks/useHistory.js";
import ResultCard from "../components/ResultCard.jsx";
import { getScore, fmtDate } from "../utils/history.js";

export default function History() {
  const { entries, remove, clear } = useHistory();
  const [q, setQ] = useState("");
  const [stress, setStress] = useState("");
  const [platform, setPlatform] = useState("");
  const [selected, setSelected] = useState(null);

  const platforms = useMemo(
    () => [
      ...new Set(
        entries.map((e) => e.input?.Most_Used_Platform).filter(Boolean),
      ),
    ],
    [entries],
  );
  const filtered = entries.filter((e) => {
    const i = e.input || {};
    const hay =
      `${i.Country} ${i.Most_Used_Platform} ${i.Academic_Level} ${i.Purpose_Of_Use} ${getScore(e) ?? ""}`.toLowerCase();
    return (
      (!q || hay.includes(q.toLowerCase())) &&
      (!stress || i.Stress_Level === stress) &&
      (!platform || i.Most_Used_Platform === platform)
    );
  });

  const onClear = () => {
    if (window.confirm("Delete all saved predictions from this browser?")) {
      clear();
      toast.success("History cleared");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Prediction history</h1>
        </div>
        {entries.length > 0 && (
          <button className="btn-ghost text-rose-600" onClick={onClear}>
            <Trash2 className="h-4 w-4" /> Clear all
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="card grid place-items-center p-12 text-center">
          <HistoryIcon className="mb-3 h-10 w-10 text-slate-300" />
          <p className="font-semibold">No predictions yet</p>
          <p className="text-sm text-slate-500">
            Run a prediction and it will show up here.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                className="input pl-9"
                placeholder="Search country, platform, score…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              className="input sm:w-40"
              value={stress}
              onChange={(e) => setStress(e.target.value)}
            >
              <option value="">All stress levels</option>
              {["Low", "Medium", "High", "Very High"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              className="input sm:w-44"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="">All platforms</option>
              {platforms.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                <tr>
                  {["Date", "Score", "Country", "Platform", "Stress", ""].map(
                    (h) => (
                      <th key={h} className="px-4 py-3 font-semibold">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => setSelected(e)}
                    className="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      {fmtDate(e.timestamp)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-indigo-600 dark:text-indigo-400">
                      {getScore(e)?.toFixed(2) ?? "—"}
                    </td>
                    <td className="px-4 py-3">{e.input?.Country}</td>
                    <td className="px-4 py-3">{e.input?.Most_Used_Platform}</td>
                    <td className="px-4 py-3">{e.input?.Stress_Level}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Delete"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          remove(e.id);
                          toast.success("Entry removed");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="p-10 text-center text-sm text-slate-500">
                No predictions match your filters.
              </p>
            )}
          </div>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                className="absolute right-3 top-3 z-10 rounded-lg bg-white/20 p-1.5 text-white hover:bg-white/30"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <ResultCard entry={selected} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
