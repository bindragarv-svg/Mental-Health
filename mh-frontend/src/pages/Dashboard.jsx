import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Cpu,
  Gauge,
  ListChecks,
  Server,
  Sparkles,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import useHistory from "../hooks/useHistory.js";
import { checkHealth } from "../services/api.js";
import { getScore } from "../utils/history.js";
import { FIELDS } from "../config/schema.js";
import { Skeleton } from "../components/Loading.jsx";

const tip = {
  contentStyle: { borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 },
};

function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="card p-5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <Icon className="h-5 w-5 text-indigo-500" />
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { entries } = useHistory();
  const [health, setHealth] = useState({ state: "loading" });
  useEffect(() => {
    checkHealth()
      .then((d) => setHealth({ state: "ok", data: d }))
      .catch(() => setHealth({ state: "down" }));
  }, []);

  const scores = entries.map(getScore).filter((s) => s !== null);
  const avg = scores.length
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : null;
  const trend = [...entries]
    .reverse()
    .slice(-20)
    .map((e, i) => ({ n: i + 1, score: getScore(e) }));
  const buckets = {};
  scores.forEach((s) => {
    const k = Math.round(s);
    buckets[k] = (buckets[k] || 0) + 1;
  });
  const dist = Object.keys(buckets)
    .map(Number)
    .sort((a, b) => a - b)
    .map((k) => ({ score: String(k), count: buckets[k] }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Overview of your mental health score model and recent predictions.
          </p>
        </div>
        <Link to="/predict" className="btn-primary">
          <Sparkles className="h-4 w-4" /> New prediction
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {health.state === "loading" ? (
          [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <Stat
              icon={ListChecks}
              label="Predictions (this browser)"
              value={entries.length}
            />
            <Stat
              icon={Gauge}
              label="Average score"
              value={avg !== null ? avg.toFixed(2) : "—"}
            />
            <Stat
              icon={Activity}
              label="Latest score"
              value={
                scores.length
                  ? getScore(entries.find((e) => getScore(e) !== null)).toFixed(
                      2,
                    )
                  : "—"
              }
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <BarChart3 className="h-4 w-4 text-indigo-500" /> Recent scores
          </h2>
          {trend.length ? (
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                  <XAxis dataKey="n" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                  <Tooltip {...tip} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="grid h-64 place-items-center text-sm text-slate-500">
              Make a prediction to see your score trend.
            </p>
          )}
        </div>
        <div className="card p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <BarChart3 className="h-4 w-4 text-indigo-500" /> Score distribution
          </h2>
          {dist.length ? (
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={dist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                  <XAxis dataKey="score" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip {...tip} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="grid h-64 place-items-center text-sm text-slate-500">
              Scores (rounded) will be grouped here.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-3 font-semibold">Algorithms & performance</h2>
          <p className="text-sm text-slate-500">
            The backend serves a single model and does not expose its algorithm
            name, accuracy metrics, confusion matrix or feature importances. To
            avoid showing invented numbers, none are displayed. If you add such
            endpoints later, this card is the place to chart them.
          </p>
        </div>
      </div>
    </div>
  );
}
