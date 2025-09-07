import { z } from 'zod';

export const ProductResponseDto = z.object({
  id: z.string(),
  nome: z.string(),
  taxaMesBase: z.number(),
  minParcelas: z.number(),
  maxParcelas: z.number(),
  cetInfo: z.string(),
  createdAt: z.date()
});

export const CreateProductDto = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  taxaMesBase: z.number().positive('Taxa mensal base deve ser positiva').max(1, 'Taxa muito alta'),
  minParcelas: z.number().int().positive('Mínimo de parcelas deve ser positivo').max(120, 'Máximo 120 parcelas'),
  maxParcelas: z.number().int().positive('Máximo de parcelas deve ser positivo').max(120, 'Máximo 120 parcelas'),
  cetInfo: z.string().min(1, 'Informação CET é obrigatória').max(500, 'Informação CET muito longa')
});

export type ProductResponseDtoType = z.infer<typeof ProductResponseDto>;
export type CreateProductDtoType = z.infer<typeof CreateProductDto>;
