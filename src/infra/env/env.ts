import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_CLINICAS_URL: z.string().url(),
  FRONTEND_URL: z.string().optional().default('http://localhost:5173'),
  PORT: z.coerce.number().optional().default(3333),
  JWT_SECRET_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  CLINICAS_DECRYPT_SECRET_KEYS: z.string(),
});

export type Env = z.infer<typeof envSchema>;
