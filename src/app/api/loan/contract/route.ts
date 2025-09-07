import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infra/container';
import { ContractLoanDto } from '@/interface/dto/loan.dto';
import { LoanMapper } from '@/interface/mappers/loan.mapper';
import { createErrorResponse, mapErrorToHttpStatus } from '@/interface/http/errors';
import { logger } from '@/infra/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicantId, productId, valor, parcelas } = ContractLoanDto.parse(body);

    const loanService = container.getLoanService();
    const result = await loanService.contratar(applicantId, productId, valor, parcelas);

    const response = LoanMapper.toContractResponseDto({
      id: result.contractId,
      status: result.status,
      applicantId,
      productId,
      valor,
      parcelas,
      taxaEfetivaMes: 0, // Será preenchido pelo service
      parcelaCalculada: 0, // Será preenchido pelo service
      createdAt: new Date(),
      addressCep: '',
      addressState: '',
      addressCity: '',
      addressNeighborhood: '',
      addressStreet: '',
      addressService: ''
    });

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    logger.error('Erro ao contratar empréstimo', error);
    
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
