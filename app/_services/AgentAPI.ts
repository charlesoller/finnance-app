import { GenerationRequest } from '../_models/GenerationRequest';
import APIService from './APIService';
import { Config } from './Config';

class AgentAPI extends APIService {
  static getBaseURL() {
    return Config.getBaseURL();
  }

  async createChat(
    token: string,
    request: GenerationRequest,
    onMessage: (chunk: string) => void,
  ) {
    return this.postWithStreaming(`/agent/execute`, token, request, onMessage);
  }
}

const agentAPI = new AgentAPI();

export default agentAPI;
