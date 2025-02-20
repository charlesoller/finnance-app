export class Config {
  static getBaseURL() {
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:3000';
  }

  static getAgentURL() {
    return process.env.AGENT_URL || 'http://127.0.0.1:3002';
  }

  static getEnv() {
    return process.env.NEXT_PUBLIC_ENV || 'production';
  }
}
