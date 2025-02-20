import { useRef } from 'react';

export const useStreamingFilter = () => {
  const quoteCount = useRef<number>(0);
  const isGraph = useRef<boolean>(false);

  const handleChunk = (chunk: string) => {
    if (chunk.includes('"')) {
      quoteCount.current += 1;
    }
    if (chunk === 'graph') {
      isGraph.current = true;
    }
  };

  const isValidChunk = (chunk: string) => {
    return quoteCount.current === 3 && !chunk.includes('"');
  };

  const reset = () => {
    quoteCount.current = 0;
    isGraph.current = false;
  };

  return { handleChunk, isValidChunk, reset, isGraph };
};
