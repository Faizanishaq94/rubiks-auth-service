# rubiks-auth-service

Authentication microservice for the Rubik's Cube Solver app. Handles user registration, login, and session management via AWS Cognito, backed by a PostgreSQL database via Prisma.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Auth Provider:** AWS Cognito (`@aws-sdk/client-cognito-identity-provider`)
- **Database:** PostgreSQL via Prisma (pg adapter)
- **Validation:** Zod

## Project Structure

```
src/
├── index.ts                    # Entry point — starts the HTTP server
├── app.ts                      # Express app setup, middleware, and route registration
├── config/
│   ├── env.ts                  # Environment variable loading and validation
│   └── cognito.ts              # Cognito SDK client and all Cognito operations
├── routes/
│   ├── auth.routes.ts          # Auth route definitions
│   └── health.routes.ts        # Health check route
├── controllers/
│   └── auth.controller.ts      # Request/response handling
├── services/
│   └── auth.service.ts         # Business logic, orchestrates Cognito + DB
├── repositories/
│   └── user.repository.ts      # All database access for the User model
├── middleware/
│   ├── error.middleware.ts     # Global error handler
│   ├── requestId.middleware.ts # Attaches a UUID request ID to every request
│   └── validate.middleware.ts  # Zod schema validation for request bodies
├── validators/
│   └── auth.validators.ts      # Zod schemas and inferred types for all routes
├── db/
│   └── prisma.ts               # Prisma client initialisation with pg + SSL config
├── utils/
│   ├── AppError.ts             # Typed application error class
│   └── response.ts             # sendSuccess helper
└── types/
    └── express.d.ts            # Express Request type augmentation (requestId)
```

## API Endpoints

| Method | Path                    | Auth Required | Description                         |
|--------|-------------------------|---------------|-------------------------------------|
| GET    | /health                 | No            | Health check                        |
| POST   | /auth/register          | No            | Create a new user account           |
| POST   | /auth/confirm           | No            | Confirm account with emailed code   |
| POST   | /auth/login             | No            | Sign in and receive tokens          |
| POST   | /auth/refresh           | No            | Get a new access token              |
| POST   | /auth/logout            | Yes           | Invalidate all tokens (GlobalSignOut) |
| POST   | /auth/forgot-password   | No            | Trigger a password reset email      |
| POST   | /auth/reset-password    | No            | Set a new password using reset code |
| GET    | /auth/me                | Yes           | Get current authenticated user info |

## Request Bodies

**POST /auth/register**
```json
{ "email": "string", "password": "string", "firstName": "string", "lastName": "string" }
```

**POST /auth/confirm**
```json
{ "email": "string", "confirmationCode": "string" }
```

**POST /auth/login**
```json
{ "email": "string", "password": "string" }
```

**POST /auth/refresh**
```json
{ "refreshToken": "string", "email": "string" }
```

**POST /auth/forgot-password**
```json
{ "email": "string" }
```

**POST /auth/reset-password**
```json
{ "email": "string", "confirmationCode": "string", "newPassword": "string" }
```

**POST /auth/logout** and **GET /auth/me** require `Authorization: Bearer <accessToken>` header.

## Environment Variables

| Variable                  | Description                                          |
|---------------------------|------------------------------------------------------|
| `PORT`                    | Port the service listens on (default: 3001)          |
| `DATABASE_URL`            | PostgreSQL connection string                         |
| `CORS_ORIGINS`            | Comma-separated list of allowed origins              |
| `AWS_REGION`              | AWS region of your Cognito pool                      |
| `COGNITO_USER_POOL_ID`    | Cognito User Pool ID                                 |
| `COGNITO_CLIENT_ID`       | Cognito App Client ID                                |
| `COGNITO_CLIENT_SECRET`   | Cognito App Client Secret                            |
| `AWS_ACCESS_KEY_ID`       | AWS IAM access key (needed for admin Cognito ops)    |
| `AWS_SECRET_ACCESS_KEY`   | AWS IAM secret key                                   |

> `CORS_ORIGINS` accepts multiple origins: `http://localhost:3000,http://localhost:8081`

## Getting Started

```bash
npm install
npm run dev       # development with hot reload (nodemon + ts-node)
npm run build     # compile TypeScript to dist/
npm start         # run compiled output
```

## Debugging in VS Code

Open the auth service folder in VS Code and press **F5** (or Run → Start Debugging). The included `.vscode/launch.json` starts the server with the debugger attached. Set breakpoints directly in your TypeScript files.

## Architecture Notes

- **Token flow:** Cognito issues three tokens on login — access token (~1 hour), ID token, and refresh token (30 days). Only the access and ID tokens are returned to the client on refresh; the refresh token does not rotate.
- **Secret hash:** All Cognito API calls require an HMAC-SHA256 secret hash. For refresh token auth, the hash uses the user's Cognito sub (UUID), not their email.
- **DB + Cognito consistency:** On registration, if the DB insert fails after Cognito signup succeeds, `adminDeleteUser` is called to roll back the Cognito user.
- **SSL:** The pg pool uses `ssl: { rejectUnauthorized: false }` for dev. Production should use the RDS CA bundle.
