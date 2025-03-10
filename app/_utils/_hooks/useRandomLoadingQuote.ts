import { useEffect, useState } from 'react';
import { getRandomLoadingQuote } from '../../_components/ValueTrackerChart/ValueTracker.utils';

export const useRandomLoadingQuote = () => {
  const [loadingQuote, setLoadingQuote] = useState('Loading...');

  useEffect(() => {
    setLoadingQuote(getRandomLoadingQuote());
  }, []);

  return loadingQuote;
};
