import { z } from 'zod';

export const ValidateCepDto = z.object({
  zip: z.string().min(8, 'CEP deve ter 8 dígitos').max(9, 'CEP inválido')
});

export const CepResponseDto = z.object({
  cep: z.string(),
  state: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  street: z.string(),
  service: z.string()
});

export type ValidateCepDtoType = z.infer<typeof ValidateCepDto>;
export type CepResponseDtoType = z.infer<typeof CepResponseDto>;
