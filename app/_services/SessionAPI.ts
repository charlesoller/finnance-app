import { GenerationRequest } from '../_models/GenerationRequest';
import APIService from './APIService';
import { Config } from './Config';

class SessionAPI extends APIService {
  static getBaseURL() {
    return Config.getBaseURL();
  }

  async getSession(sessionId: string, token: string) {
    return this.get(`/sessions/${sessionId}`, token);
  }

  async getSessionInfo(token: string) {
    return this.get('/sessions', token);
  }

  async createChatForSessionId(
    sessionId: string,
    token: string,
    request: GenerationRequest,
  ) {
    return this.post(`/sessions/${sessionId}`, token, request);
  }
}

const sessionAPI = new SessionAPI(SessionAPI.getBaseURL());

export default sessionAPI;
