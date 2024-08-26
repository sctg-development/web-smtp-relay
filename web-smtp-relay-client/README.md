# @sctg/web-smtp-relay-client

A simple client for the web-smtp-relay server.

## Table of Contents

- [@sctg/web-smtp-relay-client](#sctgweb-smtp-relay-client)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Cloudflare Pages client and serverless functions](#cloudflare-pages-client-and-serverless-functions)
    - [Client-side (Single Page Application)](#client-side-single-page-application)
    - [Server-side (Cloudflare Pages Serverless Function)](#server-side-cloudflare-pages-serverless-function)
  - [License](#license)

## Installation

```bash
npm install @sctg/web-smtp-relay-client
```

## Usage

```typescript
import { WebSMTPRelayClient, WebSMTPRelayConfig, EmailMessage } from '@sctg/web-smtp-relay-client';

const config: WebSMTPRelayConfig = {
  scheme: 'https',
  host: 'localhost',
  port: 8080,
  username: 'admin',
  password: 'admin123'
};

const client = new WebSMTPRelayClient(config);

const message: EmailMessage = {
  subject: 'Test Subject',
  body: 'This is a test email',
  destinations: ['recipient@example.com']
};

client.sendEmail(message)
  .then(() => console.log('Email sent successfully'))
  .catch((error) => console.error('Error sending email:', error));
```

## Cloudflare Pages client and serverless functions

### Client-side (Single Page Application)

```typescript
import { sendEmailWithCaptcha, EmailMessage } from '@sctg/web-smtp-relay-client';

const message: EmailMessage = {
  subject: 'Test Subject',
  body: 'This is a test email',
  destinations: ['recipient@example.com']
};

const captchaToken = 'hCaptcha-token-from-client';

sendEmailWithCaptcha(message, captchaToken)
  .then((success) => {
    if (success) {
      console.log('Email sent successfully');
    } else {
      console.error('Failed to send email');
    }
  })
  .catch((error) => console.error('Error:', error));
```

### Server-side (Cloudflare Pages Serverless Function)

```typescript
import { cfSendEmailWithCaptcha, EmailMessage, WebSMTPRelayConfig } from '@sctg/web-smtp-relay-client';
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
```

Make sure to set the following environment variables for the server-side function:

- `HCAPTCHA_SECRET`: Your hCaptcha secret key
- `WEB_SMTP_RELAY_HOST`: The URL of your web-smtp-relay service
- `WEB_SMTP_RELAY_USERNAME`: Username for web-smtp-relay authentication
- `WEB_SMTP_RELAY_PASSWORD`: Password for web-smtp-relay authentication

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPLv3).
