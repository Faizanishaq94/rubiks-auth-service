import dotenv from 'dotenv';
dotenv.config();

const required = [
  'CORS_ORIGINS',                                         
  'AWS_REGION',
  'COGNITO_USER_POOL_ID',                                                                                                                                                                                                            
  'COGNITO_CLIENT_ID',
  'COGNITO_CLIENT_SECRET',
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable ${key}`);
  }
}

export const env = {
  PORT: process.env.PORT || 3001,
  DATABASE_URL: process.env.DATABASE_URL!,
  CORS_ORIGINS: process.env.CORS_ORIGINS!,
  AWS_REGION: process.env.AWS_REGION!,
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID!,
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID!,
  COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET!,
};
