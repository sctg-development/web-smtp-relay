# Web-SMTP Relay

Web-SMTP Relay is a simple Go application that receives email details via an HTTP POST request and relays the email through an SMTP server. It includes basic authentication and configurable settings.

## Features

- Receive email details (subject, body, and destinations) via HTTP POST
- Basic authentication for secure access
- Configurable SMTP relay settings (default and per-user)
- Flexible configuration through YAML file, environment variables, and command-line flags
- Docker support with multi-architecture builds

## Table of Contents

- [Web-SMTP Relay](#web-smtp-relay)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Configuration](#configuration)
    - [config.yaml](#configyaml)
    - [Environment Variables](#environment-variables)
    - [Command-line Flags](#command-line-flags)
  - [Usage](#usage)
  - [Docker](#docker)
  - [Helm Chart](#helm-chart)
    - [Prerequisites](#prerequisites)
    - [Installing the Chart](#installing-the-chart)
    - [Customizing the Chart](#customizing-the-chart)
      - [Customizing values.yaml](#customizing-valuesyaml)
      - [Using command-line parameters](#using-command-line-parameters)
    - [Configuration Options](#configuration-options)
    - [Updating the Chart](#updating-the-chart)
    - [Uninstalling the Chart](#uninstalling-the-chart)
    - [Note on Secrets](#note-on-secrets)
  - [Tests](#tests)
  - [License](#license)
    - [Key points of the AGPLv3](#key-points-of-the-agplv3)
  - [Contributing](#contributing)
  - [Support](#support)

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
  admin: 
    password: $2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDuy0Bx8KzWq
  # can be generated with `htpasswd -nbB -C 12 user realpassword | awk -F: '{print $2}'`
  newuser: 
    password: $2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDuy0Bx8KzWq
    smtp:
      # per user smtp settings
      host: smtp.example.com
      port: 587
      username: your_username
      password: your_password

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
docker run -p 8080:8080 -v /path/to/your/config.yaml:/app/config.yaml sctg/web-smtp-relay:latest
```

## Helm Chart

This project includes a Helm chart for easy deployment to Kubernetes clusters. The chart creates a Deployment, Service, and ConfigMap for the Web-SMTP Relay application.

### Prerequisites

- Kubernetes cluster
- Helm 3.x installed

### Installing the Chart

1. If you don't want to install the chart you can use our public Helm repository:

```bash

helm repo add highcanfly <https://helm-repo.highcanfly.club/>
helm repo update highcanfly

```

Then install the chart:

```bash
helm upgrade --install --create-namespace --namespace web-smtp-relay web-smtp-relay highcanfly/web-smtp-relay --values values.yaml
```

2. Clone the repository or download the Helm chart files.

3. Navigate to the chart directory:

```bash
cd web-smtp-relay
```

4. Install the chart with the release name `my-web-smtp-relay`:

```bash
helm install my-web-smtp-relay .
   ```

### Customizing the Chart

You can customize the chart by modifying the `values.yaml` file or by passing values on the command line.

#### Customizing values.yaml

Edit the `values.yaml` file to change default values. For example:

```yaml
replicaCount: 2

image:
  repository: sctg/web-smtp-relay
  tag: "1.0.0"

config:
  users:
    admin: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDuy0Bx8KzWq"
    newuser: "$2a$10$newuserhashhere"
  smtp:
    host: smtp.mycompany.com
    port: 587
    username: myuser
    password: mypassword
  port: 8080
  
ingress:
  enabled: true
  host: web-smtp-relay.mycompany.com
  annotations: {}
  clusterIssuer: "cert-manager"
```

#### Using command-line parameters

You can override values when installing or upgrading the chart:

```bash
helm install my-web-smtp-relay . \
  --set replicaCount=3 \
  --set config.smtp.host=smtp.newhost.com \
  --set config.smtp.username=newuser \
  --set config.smtp.password=newpassword
```

### Configuration Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas for the deployment | `1` |
| `image.repository` | Docker image repository | `yourdockerhubusername/web-smtp-relay` |
| `image.tag` | Docker image tag | `"latest"` |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `service.type` | Kubernetes service type | `ClusterIP` |
| `service.port` | Kubernetes service port | `8080` |
| `config.users` | Map of username to bcrypt hashed passwords | See `values.yaml` |
| `config.smtp.host` | SMTP server hostname | `smtp.example.com` |
| `config.smtp.port` | SMTP server port | `587` |
| `config.smtp.username` | SMTP username | `your_username` |
| `config.smtp.password` | SMTP password | `your_password` |
| `config.port` | Application listening port | `8080` |
| `resources` | CPU/Memory resource requests/limits | See `values.yaml` |

### Updating the Chart

To update the chart with new values:

```bash
helm upgrade my-web-smtp-relay . --reuse-values --set config.smtp.host=smtp.newhost.com
```

### Uninstalling the Chart

To uninstall/delete the `my-web-smtp-relay` deployment:

```bash
helm uninstall my-web-smtp-relay
```

### Note on Secrets

For production use, it's recommended to use Kubernetes Secrets for sensitive information like SMTP credentials and user passwords. You can create a secret separately and reference it in the Helm chart. This example uses ConfigMap for simplicity, but for real-world scenarios, consider using Secrets for better security.

## Tests

To run tests, configure the config.yaml file, launch the server and use the following command:

```bash
DESTINATION="youremail@example.com" tests/external_tests.sh
```

or for a more realistic test:

```bash
SCHEME=https HOST=web-smtp-relay.example.com PORT=443 USER=myuser PASSWORD=user_password DESTINATION=myrealaddress@gmail.com tests/external_tests
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
