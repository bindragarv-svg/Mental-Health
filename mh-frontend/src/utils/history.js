// The backend has no history endpoint, so real predictions made from this
// browser are saved in localStorage. Nothing is generated or invented.
const KEY = 'mh-prediction-history';

export const loadHistory = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};
const save = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage full/blocked */ } return list; };
export const addEntry = (entry) => save([entry, ...loadHistory()].slice(0, 300));
export const removeEntry = (id) => save(loadHistory().filter((e) => e.id !== id));
export const clearHistory = () => save([]);

export const getScore = (e) => {
  const n = Number(e?.response?.Mental_health_score);
  return Number.isFinite(n) ? n : null;
};
export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
export const fmtDate = (iso) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
