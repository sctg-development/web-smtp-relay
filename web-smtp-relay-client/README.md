# @sctg/web-smtp-relay-client

A simple client for the web-smtp-relay server.

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

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPLv3).
