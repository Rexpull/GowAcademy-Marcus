import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infra/container';
import { ValidateCepDto, CepResponseDto } from '@/interface/dto/cep.dto';
import { createErrorResponse, mapErrorToHttpStatus } from '@/interface/http/errors';
import { logger } from '@/infra/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zip } = ValidateCepDto.parse(body);

    const cepGateway = container.getCepGateway();
    const addressData = await cepGateway.getAddressByZip(zip);

    if (!addressData) {
      return NextResponse.json(
        createErrorResponse(new Error('CEP não encontrado')),
        { status: 404 }
      );
    }

    const response = CepResponseDto.parse(addressData);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Erro ao validar CEP', error);
    
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
