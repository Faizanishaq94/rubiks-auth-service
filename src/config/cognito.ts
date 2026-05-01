import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { env } from './env';

// Single shared client — import this wherever you need to call Cognito
export const cognitoClient = new CognitoIdentityProviderClient({
  region: env.AWS_REGION,
});
