import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import {
  RegisterBody,
  ConfirmSignUpBody,
  LoginBody,
  ForgotPasswordBody,
  ResetPasswordBody,
} from '../validators/auth.validators';

export const AuthController = {
  async register(req: Request<{}, {}, RegisterBody>, res: Response, next: NextFunction) {
    const { email, password, firstName, lastName } = req.body;
    const response = await AuthService.register(email, password, firstName, lastName).catch(next);
    sendSuccess(res, response);
  },

  async confirmSignUp(req: Request<{}, {}, ConfirmSignUpBody>, res: Response, next: NextFunction) {
    const { email, confirmationCode } = req.body;
    const response = await AuthService.confirmSignUp(email, confirmationCode).catch(next);
    sendSuccess(res, response);
  },

  async login(req: Request<{}, {}, LoginBody>, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const response = await AuthService.login(email, password).catch(next);
    sendSuccess(res, response);
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    // TODO: get the AccessToken from the request (set by requireAuth middleware)
    // TODO: call AuthService.logout(accessToken)
    // TODO: return 200
  },

  async forgotPassword(req: Request<{}, {}, ForgotPasswordBody>, res: Response, next: NextFunction) {
    // TODO: destructure email from req.body
    // TODO: call AuthService.forgotPassword(email)
    // TODO: return 200 (Cognito will email a reset code)
  },

  async resetPassword(req: Request<{}, {}, ResetPasswordBody>, res: Response, next: NextFunction) {
    // TODO: destructure email, confirmationCode, newPassword from req.body
    // TODO: call AuthService.resetPassword(...)
    // TODO: return 200 on success
  },

  async getMe(req: Request, res: Response, next: NextFunction) {
    // TODO: get the authenticated user info attached by requireAuth middleware
    // TODO: return user details
  },
};
