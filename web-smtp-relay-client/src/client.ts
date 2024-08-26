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
import { EmailMessage } from ".";

/**
 * Sends an email to the Cloudflare Page serverless function with a captcha.
 * 
 * @param message - The email message to send.
 * @param captcha - The captcha string.
 * @returns A promise that resolves to a boolean indicating whether the email was sent successfully.
 */
export async function sendEmailWithCaptcha(message: EmailMessage, captcha: string): Promise<boolean> {
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, captcha }),
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        const result = await response.json();
        return result.error === null;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}