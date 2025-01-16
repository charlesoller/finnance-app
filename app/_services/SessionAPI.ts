import { GenerationRequest } from '../_models/GenerationRequest';
import APIService from './APIService';

class SessionAPI extends APIService {
  static getBaseURL() {
    return `http://127.0.0.1:3000`;
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
