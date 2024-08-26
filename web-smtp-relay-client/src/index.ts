/**
 * Copyright (C) 2024 Ronan LE MEILLAT
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Represents the configuration for a Web SMTP Relay.
 */
export interface WebSMTPRelayConfig {
  /** the url scheme */
  scheme: "http" | "https";
  /** the host of the relay */
  host: string;
  /** the port of the relay */
  port: number;
  /** the username for the relay */
  username: string;
  /** the password for the relay */
  password: string;
}

/** Represents an email message */
export interface EmailMessage {
  /** Subject of the message */
  subject: string;
  /** Body of the message */
  body: string;
  /** Destination(s) (array of string) of the message */
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
export {sendEmailWithCaptcha} from './client.js';
export {cfSendEmailWithCaptcha} from './server';
export type {HCaptchaVerifyResponse} from './server';