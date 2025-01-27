import { fetchAuthSession } from 'aws-amplify/auth';
import { create } from 'zustand';

interface UserStore {
  token: string;
  fetchToken: () => Promise<string>;
  getToken: () => string;
}

export const useUserStore = create<UserStore>((set, get) => ({
  token: '',

  fetchToken: async () => {
    const session = await fetchAuthSession();
    if (!session || !session.tokens || !session.tokens.idToken) {
      throw new Error('No authorization token found.');
    }

    const authToken = session.tokens.idToken.toString();

    set(() => {
      return { token: authToken };
    });
    console.log(authToken);
    return authToken;
  },
  getToken: () => {
    return get().token;
  },
}));
