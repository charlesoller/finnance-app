import APIService from './APIService';

class UserAPI extends APIService {
  async getOmittedAccounts(token: string, email: string) {
    return this.get(`/users/${email}/omitted-accounts`, token);
  }

  async omitAccount(token: string, email: string, accountId: string) {
    return this.put(`/users/${email}/omit/${accountId}`, token, {});
  }
}

const userAPI = new UserAPI();

export default userAPI;
