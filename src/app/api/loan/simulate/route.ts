import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infra/container';
import { SimulateLoanDto } from '@/interface/dto/loan.dto';
import { createErrorResponse, mapErrorToHttpStatus } from '@/interface/http/errors';
import { logger } from '@/infra/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicantId, productId, valor, parcelas } = SimulateLoanDto.parse(body);

    const loanService = container.getLoanService();
    const simulation = await loanService.simular(applicantId, productId, valor, parcelas);

    return NextResponse.json(simulation);

  } catch (error) {
    logger.error('Erro ao simular empréstimo', error);
    
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
