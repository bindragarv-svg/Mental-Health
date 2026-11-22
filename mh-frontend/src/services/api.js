import axios from 'axios';

const BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:2200'|| "https://mental-healthcondition.onrender.com/").replace(/\/+$/, '');

const client = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// GET /  -> health/welcome message
export const checkHealth = () => client.get('/').then((r) => r.data);

// POST /predict ...
export const predict = (payload) => client.post('/predict', payload).then((r) => r.data);

// parseError(...) stays exactly as it was