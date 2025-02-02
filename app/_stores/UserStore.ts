import { fetchAuthSession } from 'aws-amplify/auth';
import { create } from 'zustand';

interface UserData {
  username: string;
  userId: string;
  signInDetails: any;
}
interface UserStore extends UserData {
  token: string;
  fetchToken: () => Promise<string>;
  getToken: () => string;
  setUserData: (data: UserData) => void;
}

export const useUserStore = create<UserStore>((set: any, get: any) => ({
  token: '',
  username: '',
  userId: '',
  signInDetails: {},

  setUserData: (data: UserData) =>
    set({
      username: data.username,
      userId: data.userId,
      signInDetails: data.signInDetails,
    }),

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
