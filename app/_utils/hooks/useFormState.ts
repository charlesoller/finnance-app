import { useState } from 'react';

export const useFormState = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const startReq = () => {
    setLoading(true);
    setError('');
  };

  const endReq = (err?: any) => {
    setLoading(false);
    if (err) {
      setError(err.message || err);
    }
  };

  return { loading, error, startReq, endReq };
};
