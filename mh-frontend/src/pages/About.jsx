const rows = [
  [
    "GET",
    "/",
    "Welcome message — used as a health check for the status indicator.",
  ],
  [
    "POST",
    "/predict",
    "Takes the 12 fields of the Mental schema and returns { Mental_health_score: float }.",
  ],
];

export default function About() {
  return (
    <div className="space-y-6">
      <div className="card p-5 text-sm text-slate-600 dark:text-slate-400">
        <h2 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
          Notes
        </h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Prediction history is stored only in this browser (localStorage)
            because the backend does not persist predictions.
          </li>
          <li>
            Predictions are model estimates and are not a clinical or diagnostic
            assessment.
          </li>
        </ul>
      </div>
    </div>
  );
}
