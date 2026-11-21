import { useCallback, useState } from 'react';
import { loadHistory, removeEntry, clearHistory } from '../utils/history.js';

export default function useHistory() {
  const [entries, setEntries] = useState(loadHistory);
  const remove = useCallback((id) => setEntries(removeEntry(id)), []);
  const clear = useCallback(() => setEntries(clearHistory()), []);
  return { entries, remove, clear };
}
