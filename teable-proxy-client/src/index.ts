import axios from 'axios';

export interface TeableProxyOptions {
  apiKey: string;
  endpoint?: string;
}

export class TeableProxyClient {
  private apiKey: string;
  private endpoint: string;

  constructor(options: TeableProxyOptions) {
    this.apiKey = options.apiKey;
    this.endpoint = options.endpoint || 'https://app.teable.cn/api/query';
  }

  async query(sql: string): Promise<any> {
    const response = await axios.post(
      this.endpoint,
      { sql },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }
}