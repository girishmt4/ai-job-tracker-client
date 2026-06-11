import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

interface StreamingState {
  output: string;
  isStreaming: boolean;
  error: string | null;
}

export function useStreamingAI() {
  const [state, setState] = useState<StreamingState>({
    output: '',
    isStreaming: false,
    error: null,
  });

  const stream = useCallback(async (endpoint: string, body: object) => {
    setState({ output: '', isStreaming: true, error: null });

    const token = useAuthStore.getState().accessToken;
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n').filter((line) => line.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data) as { content?: string; error?: string };
            if (parsed.error) {
              setState((prev) => ({ ...prev, error: parsed.error ?? null, isStreaming: false }));
              return;
            }
            if (parsed.content) {
              setState((prev) => ({ ...prev, output: prev.output + parsed.content }));
            }
          } catch {
            // skip malformed chunk
          }
        }
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to generate response',
        isStreaming: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isStreaming: false }));
  }, []);

  const reset = useCallback(() => {
    setState({ output: '', isStreaming: false, error: null });
  }, []);

  return { ...state, stream, reset };
}
