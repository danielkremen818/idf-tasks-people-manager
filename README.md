
# Task-Force: Military Personnel and Task Management System

Task-Force is a comprehensive system designed for military personnel management and task assignment. It provides an intuitive interface for tracking personnel, assigning tasks, managing departments, and handling exemptions.

## Features

- **User Management**: Create and manage users with different roles (Admin, Supervisor, User)
- **Personnel Management**: Track all personnel, their departments, and exemptions
- **Task Assignment**: Assign tasks to personnel based on availability and skills
- **Department Organization**: Organize personnel into departments with custom colors
- **Exemption Tracking**: Track personnel exemptions and ensure task assignments respect these limitations
- **Responsive Design**: Works on desktop and mobile devices
- **Customizable Themes**: Choose between different themes (Military, Desert, Navy)

## Deployment Options

### Option 1: Docker Compose Deployment

The easiest way to deploy the application is using Docker Compose, which will set up the frontend, database, and related services.

#### Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

#### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-force.git
   cd task-force
   ```

2. Start the application:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:8080
   - PostgreSQL: localhost:5432
   - pgAdmin (database management): http://localhost:5050

4. Stop the application:
   ```bash
   docker-compose down
   ```

### Option 2: OpenShift Deployment

For enterprise deployment, OpenShift is recommended.

#### Prerequisites

- Access to an OpenShift cluster
- OpenShift CLI (`oc`) installed and configured
- Git (to clone the repository)

#### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-force.git
   cd task-force
   ```

2. Log in to your OpenShift cluster:
   ```bash
   oc login --token=<your-token> --server=<your-server>
   ```

3. Create a new project:
   ```bash
   oc new-project task-force
   ```

4. Create the necessary secrets:
   ```bash
   oc create secret generic db-credentials \
     --from-literal=POSTGRES_USER=admin \
     --from-literal=POSTGRES_PASSWORD=password \
     --from-literal=POSTGRES_DB=taskmanager
   ```

5. Apply the OpenShift deployment configuration:
   ```bash
   oc apply -f openshift-deployment.yaml
   ```

6. Verify the deployment:
   ```bash
   oc get pods
   oc get services
   oc get routes
   ```

7. Access the application using the route created by OpenShift:
   ```bash
   oc get route task-force -o jsonpath='{.spec.host}'
   ```

## Default Admin Credentials

For initial login, use the following admin credentials:

- **Email**: commander@taskforce.com
- **Password**: commander123

⚠️ **Important Security Notice**: Change these default credentials immediately after first login for production environments.

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (if running locally without Docker)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-force.git
   cd task-force
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application at http://localhost:3000

## Project Structure

```
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose configuration
├── docker-entrypoint.sh       # Docker entrypoint script
├── init-db.sql                # Database initialization script
├── nginx.conf                 # Nginx configuration
├── openshift-deployment.yaml  # OpenShift deployment configuration
├── public/                    # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── ui/                # UI components (buttons, cards, etc.)
│   │   └── ...
│   ├── context/               # React context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and types
│   ├── pages/                 # Page components
│   └── ...
└── ...
```

## License

This project is proprietary and confidential. Unauthorized copying, transfer, or use is strictly prohibited.

## Support

For support, please contact the system administrator.
