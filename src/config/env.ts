import dotenv from 'dotenv';
dotenv.config();

const required = [
  'DATABASE_URL',
  'CORS_ORIGINS',
  'AWS_REGION',
  'COGNITO_USER_POOL_ID',
  'COGNITO_CLIENT_ID',
  'COGNITO_CLIENT_SECRET',
  'AWS_ACCESS_KEY_ID',                                                                                                                                                                                      
  'AWS_SECRET_ACCESS_KEY'
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable ${key}`);
  }
}

export const env = {
  PORT: process.env.PORT || 3001,
  DATABASE_URL: process.env.DATABASE_URL!,
  CORS_ORIGINS: process.env.CORS_ORIGINS!.split(',').map(o => o.trim()),
  AWS_REGION: process.env.AWS_REGION!,
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID!,
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID!,
  COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET!,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,                                                                                                                                                                                   
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!
};
