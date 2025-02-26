import APIService from './APIService';
class SessionAPI extends APIService {
  async getSession(sessionId: string, token: string) {
    return this.get(`/sessions/${sessionId}`, token);
  }

  async getSessionInfo(token: string) {
    return this.get('/sessions', token);
  }
}

const sessionAPI = new SessionAPI();

export default sessionAPI;
