import { z } from 'zod';

export const CreateApplicantDto = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(14, 'CPF inválido'),
  cep: z.string().min(8, 'CEP deve ter 8 dígitos').max(9, 'CEP inválido'),
  renda: z.number().positive('Renda deve ser positiva').max(1000000, 'Renda muito alta')
});

export const ApplicantResponseDto = z.object({
  id: z.string(),
  nome: z.string(),
  cpf: z.string(),
  renda: z.number(),
  score: z.number(),
  addressId: z.string(),
  createdAt: z.date(),
  address: z.object({
    id: z.string(),
    cep: z.string(),
    state: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    street: z.string(),
    service: z.string(),
    createdAt: z.date()
  }).optional()
});

export type CreateApplicantDtoType = z.infer<typeof CreateApplicantDto>;
export type ApplicantResponseDtoType = z.infer<typeof ApplicantResponseDto>;
