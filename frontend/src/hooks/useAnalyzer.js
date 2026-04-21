import { useState, useCallback } from 'react';
import { analyzeDocument } from '../utils/api';

export function useAnalyzer() {
  const [state, setState] = useState({
    status: 'idle',   // idle | uploading | analyzing | done | error
    result: null,
    error: null,
    progress: 0,
    history: []
  });

  const analyze = useCallback(async (file) => {
    setState(s => ({ ...s, status: 'uploading', progress: 20, error: null, result: null }));

    // Simulate upload progress
    const t1 = setTimeout(() => setState(s => ({ ...s, progress: 50, status: 'analyzing' })), 600);
    const t2 = setTimeout(() => setState(s => ({ ...s, progress: 80 })), 1800);

    try {
      const result = await analyzeDocument(file);
      clearTimeout(t1); clearTimeout(t2);
      setState(s => ({
        status: 'done',
        result,
        error: null,
        progress: 100,
        history: [{ file: file.name, result, ts: new Date() }, ...s.history].slice(0, 5)
      }));
    } catch (err) {
      clearTimeout(t1); clearTimeout(t2);
      setState(s => ({ ...s, status: 'error', error: String(err), progress: 0 }));
    }
  }, []);

  const reset = useCallback(() => {
    setState(s => ({ ...s, status: 'idle', result: null, error: null, progress: 0 }));
  }, []);

  return { ...state, analyze, reset };
}
