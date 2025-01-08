import { GenerationRequest } from '../_models/GenerationRequest';
import APIService from './APIService';

class CompletionAPI extends APIService {
  static getBaseURL() {
    return `http://127.0.0.1:3000`;
  }

  async createCompletion(request: GenerationRequest) {
    console.log("REQUEST: ", request)
    return this.post('/completions', request);
  }

  async getCompletions() {
    return this.get('/completions')
  }
}

const completionAPI = new CompletionAPI(CompletionAPI.getBaseURL())

export default completionAPI;