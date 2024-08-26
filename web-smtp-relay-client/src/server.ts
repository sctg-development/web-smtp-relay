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
import { EmailMessage, WebSMTPRelayConfig } from '.';

const HCAPTCHA_VERIFY_URL = 'https://api.hcaptcha.com/siteverify';
type HCaptchaVerifyError = string | string[]

export type HCaptchaVerifyResponse = {
    /** Is the passcode valid, and does it meet security criteria you specified, e.g. sitekey? */
    success: boolean
    /** Timestamp of the challenge (ISO format yyyy-MM-dd'T'HH:mm:ssZZ) */
    challenge_ts: string
    /** The hostname of the site where the challenge was solved */
    hostname: string
    /** Optional: whether the response will be credited */
    credit?: boolean
    /** Optional: any error codes */
    'error-codes'?: HCaptchaVerifyError
    /** ENTERPRISE feature: a score denoting malicious activity */
    score?: number
    /** ENTERPRISE feature: reason(s) for score */
    score_reason?: string[]
}

/**
 * Sends an email with captcha verification using the web-smtp-relay client.
 * this function is intended to be used in a Cloudflare Pages serverless function.
 * the web-smtp-relay client is a simple client wrote in Go for sending emails through a web SMTP relay.
 * see https://github.com/sctg-development/web-smtp-relay
 * 
 * @param message - The email message to send.
 * @param captcha - The captcha response string.
 * @param config - The configuration for the web-smtp-relay client.
 * @param hCaptchaSecret - The secret key for hCaptcha verification.
 * @returns A promise that resolves to a string indicating the result of the email sending operation.
 */
export async function cfSendEmailWithCaptcha(message: EmailMessage, captcha: string, hCaptchaSecret:string, config:WebSMTPRelayConfig): Promise<string> {
    try {
        // Verify hCaptcha
        const hCaptchaResponse = await fetch(HCAPTCHA_VERIFY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `response=${captcha}&secret=${hCaptchaSecret}`,
        });

        const hCaptchaResult = await hCaptchaResponse.json() as HCaptchaVerifyResponse;

        if (!hCaptchaResult.success) {
            return JSON.stringify({ error: 'Invalid captcha' });
        }

        // Send email via web-smtp-relay
        const relayHost = `${config.scheme}://${config.host}:${config.port}`;
        const relayUsername = config.username;
        const relayPassword = config.password;

        const auth = Buffer.from(`${relayUsername}:${relayPassword}`).toString('base64');

        const relayResponse = await fetch(`${relayHost}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify(message),
        });

        if (!relayResponse.ok) {
            throw new Error('Failed to send email through relay');
        }

        return JSON.stringify({ error: null });
    } catch (error) {
        console.error('Error in sendEmailWithCaptcha:', error);
        return JSON.stringify({ error: 'Failed to send email' });
    }
}