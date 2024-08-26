import { cfSendEmailWithCaptcha, EmailMessage, WebSMTPRelayConfig } from '.';
import { PagesFunction, Response, EventContext } from '@cloudflare/workers-types';
interface Env {
    HCAPTCHA_SECRET: string;
    WEB_SMTP_RELAY_SCHEME: string;
    WEB_SMTP_RELAY_HOST: string;
    WEB_SMTP_RELAY_PORT: number;
    WEB_SMTP_RELAY_USERNAME: string;
    WEB_SMTP_RELAY_PASSWORD: string;
}
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { message, captcha } = await context.request.json() as { message: EmailMessage, captcha: string };
    const config: WebSMTPRelayConfig = {
        scheme: 'https',
        host: 'relay.example.com',
        port: 443,
        username: 'admin',
        password: 'admin123'
    };
    const result = await cfSendEmailWithCaptcha(message, captcha, context.env.HCAPTCHA_SECRET, config);

    return new Response(result, {
        headers: { 'Content-Type': 'application/json' },
    });
}