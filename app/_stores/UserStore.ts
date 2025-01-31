import { fetchAuthSession } from 'aws-amplify/auth';
import { create } from 'zustand';

interface UserStore {
  token: string;
  fetchToken: () => Promise<string>;
  getToken: () => string;
}

export const useUserStore = create<UserStore>((set: any, get: any) => ({
  token: '',

  fetchToken: async () => {
    const session = await fetchAuthSession();
    if (!session || !session.tokens || !session.tokens.idToken) {
      console.log('No authorization token found.');
      return '';
    }
    const authToken = session.tokens.idToken.toString();

    set(() => {
      return { token: authToken };
    });

    return authToken;
  },
  getToken: () => {
    return get().token;
  },
}));
