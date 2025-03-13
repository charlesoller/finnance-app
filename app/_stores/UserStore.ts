import { fetchAuthSession } from 'aws-amplify/auth';
import { create } from 'zustand';
import stripeAPI from '../_services/StripeAPI';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface UserData {
  username: string;
  userId: string;
  signInDetails: any;
  email: string;
}

interface CustomerData {
  customerId: string;
}

interface UserStore extends UserData, CustomerData {
  token: string;
  fetchToken: () => Promise<string>;
  fetchCustomerInfo: (email: string, token: string) => Promise<any>;
  setUserData: (data: UserData) => void;
  clearUser: () => void;
  getUser: () => UserData;
}

export const useUserStore = create<UserStore>((set: any, get: any) => ({
  token: '',
  username: '',
  userId: '',
  customerId: '',
  email: '',
  signInDetails: {},

  setUserData: (data: UserData) => {
    set({
      username: data.username,
      userId: data.userId,
      signInDetails: data.signInDetails,
      email: data.email,
    });
  },

  clearUser: () => {
    set({
      token: '',
      username: '',
      userId: '',
      email: '',
      signInDetails: {},
    });
  },

  getUser: () => {
    return {
      username: get().username,
      userId: get().userId,
      customerId: get().customerId,
      signInDetails: get().signInDetails,
      email: get().email,
    };
  },

  fetchToken: async () => {
    const session = await fetchAuthSession();
    if (!session || !session.tokens || !session.tokens.idToken) {
      console.log('No authorization token found.');
      return '';
    }

    const token = session.tokens.idToken.toString();
    const decoded = jwt.decode(token, { complete: true }) as JwtPayload;
    if (!!decoded?.payload?.email) {
      set({ email: decoded.payload.email });
    }

    set(() => {
      return { token };
    });

    return token;
  },

  fetchCustomerInfo: async (email: string, token: string) => {
    const customerInfo = await stripeAPI.getCustomerInfo(email, token);

    set(() => {
      return { customerId: customerInfo.customer_id };
    });

    return customerInfo;
  },
}));
