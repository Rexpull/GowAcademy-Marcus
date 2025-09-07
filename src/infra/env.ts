import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),

  // BrasilAPI Configuration
  BRASILAPI_BASE_URL: z.string().url('BRASILAPI_BASE_URL deve ser uma URL válida'),
  BRASILAPI_CEP_PATH: z.string().min(1, 'BRASILAPI_CEP_PATH é obrigatório'),
  BRASILAPI_CDI_PATH: z.string().min(1, 'BRASILAPI_CDI_PATH é obrigatório'),

  // Request Configuration
  REQUEST_TIMEOUT_MS: z.string().transform(Number).pipe(z.number().positive()),

  // Next.js
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET é obrigatório'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL deve ser uma URL válida'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Erro de configuração de ambiente:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
}

export const env = validateEnv();
