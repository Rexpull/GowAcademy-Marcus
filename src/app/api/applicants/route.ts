import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/infra/container';
import { CreateApplicantDto } from '@/interface/dto/applicant.dto';
import { ApplicantMapper } from '@/interface/mappers/applicant.mapper';
import { createErrorResponse, mapErrorToHttpStatus } from '@/interface/http/errors';
import { logger } from '@/infra/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, cpf, cep, renda } = CreateApplicantDto.parse(body);

    const applicantService = container.getApplicantService();
    const applicant = await applicantService.cadastrarSolicitante({
      nome,
      cpf,
      cep,
      renda
    });

    const response = ApplicantMapper.toResponseDto(applicant);
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    logger.error('Erro ao criar solicitante', error);
    
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

export async function GET() {
  try {
    const applicantService = container.getApplicantService();
    const applicants = await applicantService.findAll();

    const response = ApplicantMapper.toResponseDtoArray(applicants);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Erro ao listar solicitantes', error);
    
    return NextResponse.json(
      createErrorResponse(new Error('Erro interno do servidor')),
      { status: 500 }
    );
  }
}
