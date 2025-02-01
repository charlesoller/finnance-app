class APIService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
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
      console.log('Token: ', token);
      const response = await fetch(`${this.getBaseUrl()}${url}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: token,
        },
      });
      return await this.handleResponse(response);
    } catch (err) {
      return Promise.reject((err as Error)?.message ?? 'Unknown Error');
    }
  }

  async get<T = any>(
    url: string,
    token: string,
    params: Record<string, any> = {},
  ): Promise<T> {
    try {
      console.log(`GET to - ${this.getBaseUrl()}${url}`);
      console.log('Token: ', token);
      const response = await fetch(
        `${this.getBaseUrl()}${url}?` + new URLSearchParams(params).toString(),
        {
          headers: {
            Authorization: token,
          },
        },
      );
      return await this.handleResponse(response);
    } catch (err) {
      return Promise.reject((err as Error)?.message ?? 'Unknown Error');
    }
  }

  async patch<T = any>(
    url: string,
    token: string,
    data: Record<string, any>,
  ): Promise<T> {
    try {
      console.log(`PATCH to - ${this.getBaseUrl()}${url}`);
      const response = await fetch(`${this.getBaseUrl()}${url}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: token,
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
          Authorization: token,
        },
      });
      return await this.handleResponse(response);
    } catch (err) {
      return Promise.reject((err as Error)?.message ?? 'Unknown Error');
    }
  }
}

export default APIService;
