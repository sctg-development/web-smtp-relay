import { cfSendEmailWithCaptcha, EmailMessage, WebSMTPRelayConfig } from '.';
import { PagesFunction, Response } from '@cloudflare/workers-types';
interface Env {
    HCAPTCHA_SECRET: string;
    WEB_SMTP_RELAY_SCHEME: "http" | "https";
    WEB_SMTP_RELAY_HOST: string;
    WEB_SMTP_RELAY_PORT: number;
    WEB_SMTP_RELAY_USERNAME: string;
    WEB_SMTP_RELAY_PASSWORD: string;
}
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { message, captcha } = await context.request.json() as { message: EmailMessage, captcha: string };
    const config: WebSMTPRelayConfig = {
        scheme: context.env.WEB_SMTP_RELAY_SCHEME,
        host: context.env.WEB_SMTP_RELAY_HOST,
        port: context.env.WEB_SMTP_RELAY_PORT,
        username: context.env.WEB_SMTP_RELAY_USERNAME,
        password: context.env.WEB_SMTP_RELAY_PASSWORD,
    };
    const result = await cfSendEmailWithCaptcha(message, captcha, context.env.HCAPTCHA_SECRET, config);

    return new Response(result, {
        headers: { 'Content-Type': 'application/json' },
    });
}