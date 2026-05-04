import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  GlobalSignOutCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import crypto from 'crypto';
import { env } from './env';
import { AppError } from '../utils/AppError';

const cognitoClient = new CognitoIdentityProviderClient({
  region: env.AWS_REGION,
});

function computeSecretHash(username: string): string {
  return crypto
    .createHmac('sha256', env.COGNITO_CLIENT_SECRET)
    .update(username + env.COGNITO_CLIENT_ID)
    .digest('base64');
}

function handleCognitoError(err: unknown): AppError {
  if (err instanceof Error) {
    switch (err.name) {
      case 'UsernameExistsException':
        return new AppError(409, 'An account with this email already exists');
      case 'UserNotFoundException':
        return new AppError(404, 'No account found with this email');
      case 'NotAuthorizedException':
        return new AppError(401, 'Incorrect email or password');
      case 'UserNotConfirmedException':
        return new AppError(403, 'Please verify your email before signing in');
      case 'CodeMismatchException':
        return new AppError(400, 'Invalid verification code');
      case 'ExpiredCodeException':
        return new AppError(400, 'Verification code has expired');
      case 'InvalidPasswordException':
        return new AppError(400, 'Password does not meet requirements');
      case 'LimitExceededException':
      case 'TooManyRequestsException':
        return new AppError(429, 'Too many attempts. Please try again later');
      case 'InvalidParameterException':
        return new AppError(400, 'Invalid request parameters');
    }
  }
  return new AppError(500, 'An unexpected error occurred');
}

async function signUp(email: string, password: string) {
  try {
    const response = await cognitoClient.send(new SignUpCommand({
      ClientId: env.COGNITO_CLIENT_ID,
      SecretHash: computeSecretHash(email),
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
      ],
    }));

    if (!response.UserSub) {
      throw new AppError(500, 'User was not created');
    }

    return { cognitoId: response.UserSub };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw handleCognitoError(err);
  }
}

async function confirmSignUp(email: string, confirmationCode: string) {
  try {
    await cognitoClient.send(new ConfirmSignUpCommand({
      ClientId: env.COGNITO_CLIENT_ID,
      SecretHash: computeSecretHash(email),
      Username: email,
      ConfirmationCode: confirmationCode,
    }));
  } catch (err) {
    throw handleCognitoError(err);
  }
}

async function initiateAuth(email: string, password: string) {
  try {
    const response = await cognitoClient.send(new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: computeSecretHash(email),
      },
    }));

    const result = response.AuthenticationResult;
    if (!result?.AccessToken || !result?.IdToken || !result?.RefreshToken) {
      throw new AppError(500, 'Authentication succeeded but tokens were not returned');
    }

    return {
      accessToken: result.AccessToken,
      idToken: result.IdToken,
      refreshToken: result.RefreshToken,
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw handleCognitoError(err);
  }
}

async function globalSignOut(accessToken: string) {
  try {
    await cognitoClient.send(new GlobalSignOutCommand({
      AccessToken: accessToken,
    }));
  } catch (err) {
    throw handleCognitoError(err);
  }
}

async function forgotPassword(email: string) {
  try {
    await cognitoClient.send(new ForgotPasswordCommand({
      ClientId: env.COGNITO_CLIENT_ID,
      SecretHash: computeSecretHash(email),
      Username: email,
    }));
  } catch (err) {
    throw handleCognitoError(err);
  }
}

async function confirmForgotPassword(email: string, code: string, newPassword: string) {
  try {
    await cognitoClient.send(new ConfirmForgotPasswordCommand({
      ClientId: env.COGNITO_CLIENT_ID,
      SecretHash: computeSecretHash(email),
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    }));
  } catch (err) {
    throw handleCognitoError(err);
  }
}

async function getUser(accessToken: string) {
  try {
    const response = await cognitoClient.send(new GetUserCommand({
      AccessToken: accessToken,
    }));

    const email = response.UserAttributes?.find(a => a.Name === 'email')?.Value;

    return {
      cognitoId: response.Username,
      email,
    };
  } catch (err) {
    throw handleCognitoError(err);
  }
}

export const authClient = {
  signUp,
  confirmSignUp,
  initiateAuth,
  globalSignOut,
  forgotPassword,
  confirmForgotPassword,
  getUser,
};
