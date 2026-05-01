# rubiks-auth-service

Authentication microservice for the Rubik's Cube Solver app. Handles user registration, login, and session management via AWS Cognito.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Auth Provider:** AWS Cognito (via `@aws-sdk/client-cognito-identity-provider`)

## Project Structure

```
src/
├── index.ts              # Entry point — starts the HTTP server
├── app.ts                # Express app setup, middleware, and route registration
├── config/
│   ├── env.ts            # Environment variable loading and validation
│   └── cognito.ts        # Shared AWS Cognito SDK client
├── routes/
│   └── auth.routes.ts    # Route definitions
├── controllers/
│   └── auth.controller.ts  # Request/response handling
├── services/
│   └── auth.service.ts   # Cognito SDK calls and business logic
└── middleware/
    ├── auth.middleware.ts    # JWT verification for protected routes
    └── error.middleware.ts  # Global error handler
```

## API Endpoints

| Method | Path                  | Auth Required | Description                          |
|--------|-----------------------|---------------|--------------------------------------|
| POST   | /auth/register        | No            | Create a new user account            |
| POST   | /auth/confirm         | No            | Confirm account with emailed code    |
| POST   | /auth/login           | No            | Sign in and receive tokens           |
| POST   | /auth/logout          | Yes           | Invalidate all tokens                |
| POST   | /auth/forgot-password | No            | Trigger a password reset email       |
| POST   | /auth/reset-password  | No            | Set a new password using reset code  |
| GET    | /auth/me              | Yes           | Get current authenticated user info  |

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

| Variable                | Description                        |
|-------------------------|------------------------------------|
| `PORT`                  | Port the service listens on        |
| `AWS_REGION`            | AWS region of your Cognito pool    |
| `COGNITO_USER_POOL_ID`  | Cognito User Pool ID               |
| `COGNITO_CLIENT_ID`     | Cognito App Client ID              |
| `COGNITO_CLIENT_SECRET` | Cognito App Client Secret          |

## Getting Started

```bash
npm install
npm run dev     # development with hot reload
npm run build   # compile TypeScript to dist/
npm start       # run compiled output
```
