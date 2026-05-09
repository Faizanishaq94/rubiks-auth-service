import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import {
  RegisterBody,
  ConfirmSignUpBody,
  LoginBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  RefreshTokenBody,
} from '../validators/auth.validators';

export const AuthController = {
  async register(req: Request<{}, {}, RegisterBody>, res: Response, next: NextFunction) {
    console.log(`Register request - ${req.requestId}`);
    try {
      const { email, password, firstName, lastName } = req.body;
      await AuthService.register(email, password, firstName, lastName);
      sendSuccess(res, null, 201);
      console.log(`Register success - ${req.requestId}`);
    }
    catch (err) {
      console.log(err);
      next(err);
    }
  },

  async confirmSignUp(req: Request<{}, {}, ConfirmSignUpBody>, res: Response, next: NextFunction) {
    console.log(`ConfirmSignUp request - ${req.requestId}`);
    try {
      const { email, confirmationCode } = req.body;
      await AuthService.confirmSignUp(email, confirmationCode);
      sendSuccess(res, null);
      console.log(`ConfirmSignUp success - ${req.requestId}`);
    }
    catch (err) {
      next(err);
    }
  },

  async login(req: Request<{}, {}, LoginBody>, res: Response, next: NextFunction) {
    console.log(`Login request - ${req.requestId}`);
    try {
      const { email, password } = req.body;
      const tokens = await AuthService.login(email, password);
      sendSuccess(res, tokens);
      console.log(`Login success - ${req.requestId}`);
    }
    catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    console.log(`Logout request - ${req.requestId}`);
    try {
      const accessToken = req.headers.authorization?.split(' ')[1];
      if (!accessToken) {
        throw new AppError(401, 'Missing access token');
      }
      await AuthService.logout(accessToken);
      sendSuccess(res, null);
      console.log(`Logout success - ${req.requestId}`);
    }
    catch (err) {
      next(err);
    }
  },

  async forgotPassword(req: Request<{}, {}, ForgotPasswordBody>, res: Response, next: NextFunction) {
    console.log(`ForgotPassword request - ${req.requestId}`);
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      sendSuccess(res, null);
      console.log(`ForgotPassword success - ${req.requestId}`);
    }
    catch (err) {
      next(err);
    }
  },

  async resetPassword(req: Request<{}, {}, ResetPasswordBody>, res: Response, next: NextFunction) {
    console.log(`ResetPassword request - ${req.requestId}`);
    try {
      const { email, confirmationCode, newPassword } = req.body;
      await AuthService.resetPassword(email, confirmationCode, newPassword);
      sendSuccess(res, null);
      console.log(`ResetPassword success - ${req.requestId}`);
    }
    catch (err) {
      next(err);
    }
  },

  async refreshToken(req: Request<{}, {}, RefreshTokenBody>, res: Response, next: NextFunction) {
    console.log(`RefreshToken request - ${req.requestId}`);
    try {
      const { refreshToken, email } = req.body;
      const tokens = await AuthService.refreshToken(refreshToken, email);
      sendSuccess(res, tokens);
      console.log(`RefreshToken success - ${req.requestId}`);
    }
    catch (err) {
      next(err);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction) {
    console.log(`GetMe request - ${req.requestId}`);
    try {
      const accessToken = req.headers.authorization?.split(' ')[1];
      if (!accessToken) {
        throw new AppError(401, 'Missing access token');
      }
      const user = await AuthService.getMe(accessToken);
      sendSuccess(res, user);
      console.log(`GetMe success - ${req.requestId}`);
    }
    catch (err) {
      next(err);
    }
  },
};
