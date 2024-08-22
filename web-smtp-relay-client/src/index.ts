export interface WebSMTPRelayConfig {
  scheme: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface EmailMessage {
  subject: string;
  body: string;
  destinations: string[];
}

export class WebSMTPRelayClient {
  private config: WebSMTPRelayConfig;

  constructor(config: WebSMTPRelayConfig) {
    this.config = config;
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    const url = `${this.config.scheme}://${this.config.host}:${this.config.port}/send`;
    const auth = Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}