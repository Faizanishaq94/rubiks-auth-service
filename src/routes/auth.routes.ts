import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import {
  RegisterSchema,
  ConfirmSignUpSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  RefreshTokenSchema,
} from '../validators/auth.validators';

const router = Router();

router.post('/register', validate(RegisterSchema), AuthController.register);
router.post('/confirm', validate(ConfirmSignUpSchema), AuthController.confirmSignUp);
router.post('/login', validate(LoginSchema), AuthController.login);
router.post('/refresh', validate(RefreshTokenSchema), AuthController.refreshToken);
router.post('/forgot-password', validate(ForgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', validate(ResetPasswordSchema), AuthController.resetPassword);
router.post('/logout', AuthController.logout);
router.get('/me', AuthController.getMe);

export default router;
