import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infra/container';
import { LoanMapper } from '@/interface/mappers/loan.mapper';
import { createErrorResponse, mapErrorToHttpStatus } from '@/interface/http/errors';
import { logger } from '@/infra/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        createErrorResponse(new Error('ID do contrato é obrigatório')),
        { status: 400 }
      );
    }

    const loanService = container.getLoanService();
    const contract = await loanService.findContractById(id);

    const response = LoanMapper.toContractDetailResponseDto(contract);
    return NextResponse.json(response);

  } catch (error) {
    logger.error(`Erro ao buscar contrato: ${params.id}`, error);
    
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
