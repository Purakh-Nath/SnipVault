import { useState, useCallback } from 'react';
import { explainCode, type AIExplanation } from '../services/ai';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface AIState {
  status: Status;
  data: AIExplanation | null;
  error: string | null;
}

export function useAI() {
  const [state, setState] = useState<AIState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const explain = useCallback(async (code: string, language: string) => {
    setState({ status: 'loading', data: null, error: null });
    try {
      const data = await explainCode(code, language);
      setState({ status: 'success', data, error: null });
    } catch (err) {
      let message = 'Something went wrong';
      if (err instanceof Error) {
        if (err.message === 'NO_API_KEY') {
          message = 'No API key found. Add one in Settings.';
        } else if (err.message.includes('401')) {
          message = 'Invalid API key. Check your key in Settings.';
        } else if (err.message.includes('429')) {
          message = 'Rate limit reached. Try again in a moment.';
        } else {
          message = err.message;
        }
      }
      setState({ status: 'error', data: null, error: message });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  return { ...state, explain, reset };
}