import { useEffect } from 'react';
import { useUserStore } from '../../_stores/UserStore';

export const useAuth = () => {
  const { fetchToken } = useUserStore();

  useEffect(() => {
    const loadToken = async () => {
      try {
        await fetchToken();
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    loadToken();
  }, [fetchToken]);
};
