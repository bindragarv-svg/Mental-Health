import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:2200',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// GET /  -> health/welcome message
export const checkHealth = () => client.get('/').then((r) => r.data);

// POST /predict  body: Mental schema  -> { Mental_health_score: number }
export const predict = (payload) => client.post('/predict', payload).then((r) => r.data);

// Normalises every kind of failure into { message, status, fieldErrors }.
export function parseError(err) {
  if (err.response) {
    const { status, data } = err.response;
    if (status === 422 && Array.isArray(data?.detail)) {
      const fieldErrors = {};
      data.detail.forEach((d) => {
        const key = d.loc?.[d.loc.length - 1];
        if (key !== undefined) fieldErrors[key] = d.msg;
      });
      return { status, fieldErrors, message: 'The server rejected some input values. Please review the highlighted fields.' };
    }
    if (status >= 500) {
      return { status, fieldErrors: {}, message: 'The server hit an internal error (500). Check the FastAPI console for the traceback — a common cause is a value the model has never seen.' };
    }
    const detail = typeof data?.detail === 'string' ? data.detail : null;
    return { status, fieldErrors: {}, message: detail || `Request failed with status ${status}.` };
  }
  if (err.code === 'ECONNABORTED') return { status: 0, fieldErrors: {}, message: 'The request timed out. Is the backend busy?' };
  return { status: 0, fieldErrors: {}, message: 'Cannot reach the backend. Make sure FastAPI is running and VITE_API_URL is correct.' };
}
