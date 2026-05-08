import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  GlobalSignOutCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  UsernameExistsException,
  InvalidPasswordException,
  InvalidParameterException,
  CodeDeliveryFailureException,
  CodeMismatchException,
  ExpiredCodeException,
  AliasExistsException,
  UserNotFoundException,
  UserNotConfirmedException,
  PasswordResetRequiredException,
  NotAuthorizedException,
  TooManyFailedAttemptsException,
  TooManyRequestsException,
  LimitExceededException,
  ResourceNotFoundException,
  InternalErrorException,
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
  console.log(JSON.stringify(err));
  if (
    err instanceof UsernameExistsException ||
    err instanceof InvalidPasswordException ||
    err instanceof InvalidParameterException ||
    err instanceof CodeDeliveryFailureException ||
    err instanceof CodeMismatchException ||
    err instanceof ExpiredCodeException ||
    err instanceof AliasExistsException ||
    err instanceof UserNotFoundException ||
    err instanceof UserNotConfirmedException ||
    err instanceof PasswordResetRequiredException ||
    err instanceof NotAuthorizedException ||
    err instanceof TooManyFailedAttemptsException ||
    err instanceof TooManyRequestsException ||
    err instanceof LimitExceededException ||
    err instanceof ResourceNotFoundException ||
    err instanceof InternalErrorException
  ) {
    return new AppError(err.$metadata.httpStatusCode || 500, err.message);
  }
  else {
    return new AppError(500, "Auth error");
  }
}

async function signUp(email: string, password: string, firstName: string, lastName: string) {
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
  }
  catch (err) {
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
  }
  catch (err) {
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

    const tokens = {
      accessToken: result.AccessToken,
      idToken: result.IdToken,
      refreshToken: result.RefreshToken,
    };
    return tokens;
  }
  catch (err) {
    if (err instanceof AppError) throw err;
    throw handleCognitoError(err);
  }
}

async function globalSignOut(accessToken: string) {
  try {
    await cognitoClient.send(new GlobalSignOutCommand({
      AccessToken: accessToken,
    }));
  }
  catch (err) {
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
  }
  catch (err) {
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
  }
  catch (err) {
    throw handleCognitoError(err);
  }
}

async function getUser(accessToken: string) {
  try {
    const response = await cognitoClient.send(new GetUserCommand({
      AccessToken: accessToken,
    }));

    const email = response.UserAttributes?.find(a => a.Name === 'email')?.Value;

    const user = {
      cognitoId: response.Username,
      email,
    };
    return user;
  }
  catch (err) {
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
