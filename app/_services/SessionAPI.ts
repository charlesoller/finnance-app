import APIService from './APIService';

class SessionAPI extends APIService {
  static getBaseURL() {
    return `http://127.0.0.1:3000`;
  }

  async getSession(sessionId: string) {
    return this.get(`/sessions/${sessionId}`)
  }

  async getSessionIds() {
    return this.get('/sessions');
  }
}

const sessionAPI = new SessionAPI(SessionAPI.getBaseURL())

export default sessionAPI;