import { z } from 'zod';

export const SimulateLoanDto = z.object({
  applicantId: z.string().min(1, 'ID do solicitante é obrigatório'),
  productId: z.string().min(1, 'ID do produto é obrigatório'),
  valor: z.number().positive('Valor deve ser positivo').max(1000000, 'Valor muito alto'),
  parcelas: z.number().int().positive('Número de parcelas deve ser positivo').max(120, 'Máximo 120 parcelas')
});

export const ContractLoanDto = z.object({
  applicantId: z.string().min(1, 'ID do solicitante é obrigatório'),
  productId: z.string().min(1, 'ID do produto é obrigatório'),
  valor: z.number().positive('Valor deve ser positivo').max(1000000, 'Valor muito alto'),
  parcelas: z.number().int().positive('Número de parcelas deve ser positivo').max(120, 'Máximo 120 parcelas')
});

export const SimulationResponseDto = z.object({
  parcela: z.number(),
  total: z.number(),
  taxaEfetivaMes: z.number(),
  juros: z.number()
});

export const ContractResponseDto = z.object({
  contractId: z.string(),
  status: z.enum(['PENDENTE', 'APROVADO', 'REPROVADO'])
});

export const ContractDetailResponseDto = z.object({
  id: z.string(),
  applicantId: z.string(),
  productId: z.string(),
  valor: z.number(),
  parcelas: z.number(),
  taxaEfetivaMes: z.number(),
  parcelaCalculada: z.number(),
  status: z.enum(['PENDENTE', 'APROVADO', 'REPROVADO']),
  createdAt: z.union([z.date(), z.string()]),
  addressCep: z.string(),
  addressState: z.string(),
  addressCity: z.string(),
  addressNeighborhood: z.string(),
  addressStreet: z.string(),
  addressService: z.string(),
  applicant: z.object({
    id: z.string(),
    nome: z.string(),
    cpf: z.string(),
    renda: z.number(),
    score: z.number()
  }).optional(),
  product: z.object({
    id: z.string(),
    nome: z.string(),
    taxaMesBase: z.number(),
    minParcelas: z.number(),
    maxParcelas: z.number(),
    cetInfo: z.string()
  }).optional()
});

export type SimulateLoanDtoType = z.infer<typeof SimulateLoanDto>;
export type ContractLoanDtoType = z.infer<typeof ContractLoanDto>;
export type SimulationResponseDtoType = z.infer<typeof SimulationResponseDto>;
export type ContractResponseDtoType = z.infer<typeof ContractResponseDto>;
export type ContractDetailResponseDtoType = z.infer<typeof ContractDetailResponseDto>;
