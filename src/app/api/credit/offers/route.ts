import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infra/container';
import { GenerateOffersDto } from '@/interface/dto/credit.dto';
import { createErrorResponse, mapErrorToHttpStatus } from '@/interface/http/errors';
import { logger } from '@/infra/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicantId, productId } = GenerateOffersDto.parse(body);

    const creditService = container.getCreditService();
    const offers = await creditService.gerarOfertasPara(applicantId, productId);

    const response = offers.map(offer => ({
      valor: offer.valor,
      parcelasSugeridas: offer.parcelasSugeridas,
      observacoes: offer.observacoes
    }));

    return NextResponse.json(response);

  } catch (error) {
    logger.error('Erro ao gerar ofertas', error);
    
    if (error instanceof Error) {
      const { statusCode } = mapErrorToHttpStatus(error);
      return NextResponse.json(
        createErrorResponse(error),
        { status: statusCode }
      );
    }

    return NextResponse.json(
      createErrorResponse(new Error('Erro interno do servidor')),
      { status: 500 }
    );
  }
}
