import { Config } from './Config';
import { fetchEventSource } from '@microsoft/fetch-event-source';
class APIService {
  private baseUrl: string;
  private agentUrl: string;

  constructor() {
    this.baseUrl = Config.getBaseURL();
    this.agentUrl = Config.getAgentURL();
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  private async handleResponse(response: Response): Promise<any> {
    const body = await response.json();
    if (body.statusCode >= 500) {
      throw new Error(body.message);
    }
    return body;
  }

  async post<T = any>(
    url: string,
    token: string,
    data: Record<string, any>,
  ): Promise<T> {
    try {
      console.log(`POST to - ${this.getBaseUrl()}${url}`);
      const response = await fetch(`${this.getBaseUrl()}${url}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: `Bearer ${token}`,
        },
      });
      return await this.handleResponse(response);
    } catch (err) {
      return Promise.reject((err as Error)?.message ?? 'Unknown Error');
    }
  }

  async postWithStreaming(
    url: string,
    token: string,
    body: any,
    onMessage: (chunk: string) => void,
  ) {
    console.log(`POST (STREAMING) to - ${this.agentUrl}${url}`);
    const response = await fetchEventSource(`${this.agentUrl}${url}`, {
      method: 'POST',
      headers: {
        Accept: 'text/event-stream',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(body),
      // @ts-expect-error onopen doesn't need to be async
      onopen(res) {
        if (res.ok && res.status === 200) {
          console.log('Connection made ', res);
        } else if (
          res.status >= 400 &&
          res.status < 500 &&
          res.status !== 429
        ) {
          console.log('Client-side error ', res);
        }
      },
      onmessage(event) {
        try {
          if (event.data === '[DONE]') {
            return;
          }
          const { content } = JSON.parse(event.data);
          onMessage(content);
        } catch (e) {
          console.error(`Something went wrong parsing data. Error: ${e}`);
        }
      },
      onclose() {
        console.log('Connection closed by the server');
      },
      onerror(err) {
        console.log('There was an error from server', err);
        throw new Error('Stopping attempts in fetchEventSource');
      },
    });

    return response;
  }

  async get<T = any>(
    url: string,
    token: string,
    params: Record<string, any> = {},
  ): Promise<T> {
    try {
      console.log(`GET to - ${this.getBaseUrl()}${url}`);
      const response = await fetch(
        `${this.getBaseUrl()}${url}?` + new URLSearchParams(params).toString(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return await this.handleResponse(response);
    } catch (err) {
      return Promise.reject((err as Error)?.message ?? 'Unknown Error');
    }
  }

  async put<T = any>(
    url: string,
    token: string,
    data: Record<string, any>,
  ): Promise<T> {
    try {
      console.log(`PUT to - ${this.getBaseUrl()}${url}`);
      const response = await fetch(`${this.getBaseUrl()}${url}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: `Bearer ${token}`,
        },
      });
      return await this.handleResponse(response);
    } catch (err) {
      return Promise.reject((err as Error)?.message ?? 'Unknown Error');
    }
  }

  async delete<T = any>(url: string, token: string): Promise<T> {
    try {
      console.log(`DELETE to - ${this.getBaseUrl()}${url}`);
      const response = await fetch(`${this.getBaseUrl()}${url}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await this.handleResponse(response);
    } catch (err) {
      return Promise.reject((err as Error)?.message ?? 'Unknown Error');
    }
  }
}

export default APIService;
