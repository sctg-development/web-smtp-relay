# Web-SMTP Relay

Web-SMTP Relay is a simple Go application that receives email details via an HTTP POST request and relays the email through an SMTP server. It includes basic authentication and configurable settings.

## Features

- Receive email details (subject, body, and destinations) via HTTP POST
- Basic authentication for secure access
- Configurable SMTP relay settings
- Flexible configuration through YAML file, environment variables, and command-line flags
- Docker support with multi-architecture builds

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sctg-development/web-smtp-relay.git
   cd web-smtp-relay
   ```

2. Build the application:

   ```bash
   go build -o web-smtp
   ```

## Configuration

The application can be configured using a YAML file, environment variables, and command-line flags.

### config.yaml

```yaml
users:
  admin: $2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDuy0Bx8KzWq

smtp:
  host: smtp.example.com
  port: 587
  username: your_username
  password: your_password

port: 8080
```

### Environment Variables

- `WEB_SMTP_CONFIG_FILE`: Path to the configuration file
- `WEB_SMTP_PORT`: Port to listen on

### Command-line Flags

- `-c`: Path to the configuration file
- `-p`: Port to listen on

## Usage

1. Start the server:

   ```bash
   ./web-smtp
   ```

2. Send a POST request to `http://localhost:8080/send` with the following JSON body:

   ```json
   {
     "subject": "Test Subject",
     "body": "This is a test email",
     "destinations": ["recipient@example.com"]
   }
   ```

   Include Basic Authentication headers with your request.

## Docker

The project includes a Dockerfile and GitHub Actions workflow for building and pushing a multi-architecture Docker image.

To run the application using Docker:

```bash
docker run -p 8080:8080 -v /path/to/your/config.yaml:/app/config.yaml yourdockerhubusername/web-smtp-relay:latest
```

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPLv3).

### Key points of the AGPLv3

1. Source Code: You must make the complete source code available when you distribute the software.
2. Modifications: If you modify the software, you must release your modifications under the AGPLv3 as well.
3. Network Use: If you run a modified version of the software on a server and allow users to interact with it over a network, you must make the source code of your modified version available.
4. No Additional Restrictions: You cannot impose any further restrictions on the recipients' exercise of the rights granted by the license.

For the full license text, see the [LICENSE](LICENSE.md) file in the project repository or visit [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

If you encounter any problems or have any questions, please open an issue in the GitHub repository.
