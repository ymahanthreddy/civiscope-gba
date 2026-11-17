import { z } from 'zod';

export const strongPasswordSchema = z.string().superRefine((password, context) => {
  const meetsRequirements = password.length >= 12
    && /[a-z]/.test(password)
    && /[A-Z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password);

  if (!meetsRequirements) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Use at least 12 characters, including uppercase and lowercase letters, a number, and a symbol.',
    });
  }
});