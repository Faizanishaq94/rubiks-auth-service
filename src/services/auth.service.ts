import { authClient } from '../config/cognito';
import { env } from '../config/env';
import dbClient from '../db/prisma'
import { UserStatus } from '../generated/prisma/enums'
import { AppError } from '../utils/AppError';

// TODO: Cognito requires an HMAC secret hash for each request when a client secret is set.
//       Implement a helper that computes it: HMAC-SHA256(username + clientId, clientSecret) → base64

export const AuthService = {

  async register(email: string, password: string, firstName: string, lastName: string) {

    const response = await authClient.signUp(email, password, firstName, lastName);
    const newUser = await dbClient.user.create({
      data: {
        cognitoId: response.cognitoId,
        email,
        firstName,
        lastName
      },
    });

  },

  async confirmSignUp(email: string, code: string) {

    const response = await authClient.confirmSignUp(email, code);
    await dbClient.user.update({
      where: {
        email
      },
      data: {
        status: UserStatus.ACTIVE
      }
    })

  },

  async login(email: string, password: string) {
    const response = await authClient.initiateAuth(email, password);
  },

  async logout(accessToken: string) {
    const response = await authClient.globalSignOut(accessToken);
  },

  async forgotPassword(email: string) {
    const response = await authClient.forgotPassword(email);
  },

  async resetPassword(email: string, code: string, newPassword: string) {
    const response = await authClient.confirmForgotPassword(email, code, newPassword);
  },

  async getUser(email: string) {
    const user = await dbClient.user.findFirst({
      where: {
        email
      }
    });

    if (!user) {
      throw new AppError(400, 'User does not exist');
    }

    return {
      ...user
    };
  },
  
};
