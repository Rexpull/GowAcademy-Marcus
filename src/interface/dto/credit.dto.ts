import { z } from 'zod';

export const GenerateOffersDto = z.object({
  applicantId: z.string().min(1, 'ID do solicitante é obrigatório'),
  productId: z.string().min(1, 'ID do produto é obrigatório')
});

export const OfferResponseDto = z.object({
  valor: z.number(),
  parcelasSugeridas: z.array(z.number()),
  observacoes: z.string().optional()
});

export type GenerateOffersDtoType = z.infer<typeof GenerateOffersDto>;
export type OfferResponseDtoType = z.infer<typeof OfferResponseDto>;
