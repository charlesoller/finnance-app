import { useEffect } from 'react';
import { useUserStore } from '../../_stores/UserStore';

export const useCustomerInfo = () => {
  const { customerId, fetchCustomerInfo, email, token } = useUserStore();
  useEffect(() => {
    if (!!email && !!token && !customerId) {
      fetchCustomerInfo(email, token);
    }
  }, [customerId, fetchCustomerInfo, email, token]);
};
