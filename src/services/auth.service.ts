import { authClient } from '../config/cognito';
import { UserRepository } from '../repositories/user.repository';
import { UserStatus } from '../generated/prisma/enums';
import { AppError } from '../utils/AppError';

export const AuthService = {

  async register(email: string, password: string, firstName: string, lastName: string) {
    const { cognitoId } = await authClient.signUp(email, password);
    try {
      await UserRepository.create({ cognitoId, email, firstName, lastName });
    }
    catch (dbErr) {
      await authClient.adminDeleteUser(email);
      throw new AppError(500, 'Registration failed, please try again');
    }
  },

  async confirmSignUp(email: string, code: string) {
    await authClient.confirmSignUp(email, code);
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    await UserRepository.updateStatus(user.userId, UserStatus.ACTIVE);
  },

  async login(email: string, password: string) {
    return authClient.initiateAuth(email, password);
  },

  async refreshToken(refreshToken: string, email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return authClient.refreshAuth(refreshToken, user.cognitoId);
  },

  async logout(accessToken: string) {
    await authClient.globalSignOut(accessToken);
  },

  async forgotPassword(email: string) {
    await authClient.forgotPassword(email);
  },

  async resetPassword(email: string, code: string, newPassword: string) {
    await authClient.confirmForgotPassword(email, code, newPassword);
  },

  async getMe(accessToken: string) {
    const { email } = await authClient.getUser(accessToken);
    if (!email) {
      throw new AppError(500, 'Could not retrieve email from token');
    }
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return {
      id: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  },

};
