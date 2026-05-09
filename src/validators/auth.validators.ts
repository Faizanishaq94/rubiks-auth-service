import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(8),
});

export const ConfirmSignUpSchema = z.object({
  email: z.email(),
  confirmationCode: z.string(),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const ForgotPasswordSchema = z.object({
  email: z.email(),
});

export const ResetPasswordSchema = z.object({
  email: z.email(),
  confirmationCode: z.string(),
  newPassword: z.string().min(8),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
  email: z.email(),
});

// Inferred TypeScript types — use these in your controllers instead of defining types manually
export type RegisterBody = z.infer<typeof RegisterSchema>;
export type ConfirmSignUpBody = z.infer<typeof ConfirmSignUpSchema>;
export type LoginBody = z.infer<typeof LoginSchema>;
export type ForgotPasswordBody = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordBody = z.infer<typeof ResetPasswordSchema>;
export type RefreshTokenBody = z.infer<typeof RefreshTokenSchema>;
