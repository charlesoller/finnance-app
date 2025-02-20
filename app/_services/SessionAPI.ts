import APIService from './APIService';
import { Config } from './Config';

class SessionAPI extends APIService {
  static getBaseURL() {
    return Config.getBaseURL();
  }

  static getAgentURL() {
    return Config.getAgentURL();
  }

  async getSession(sessionId: string, token: string) {
    return this.get(`/sessions/${sessionId}`, token);
  }

  async getSessionInfo(token: string) {
    return this.get('/sessions', token);
  }
}

const sessionAPI = new SessionAPI();

export default sessionAPI;
