import { GenerationRequest } from '../_models/GenerationRequest';
import APIService from './APIService';
import { Config } from './Config';

class SessionAPI extends APIService {
  static getBaseURL() {
    return Config.getBaseURL();
  }

  async getSession(sessionId: string) {
    return this.get(`/sessions/${sessionId}`);
  }

  async getSessionInfo() {
    return this.get('/sessions');
  }

  async createChatForSessionId(sessionId: string, request: GenerationRequest) {
    return this.post(`/sessions/${sessionId}`, request);
  }
}

const sessionAPI = new SessionAPI(SessionAPI.getBaseURL());

export default sessionAPI;
