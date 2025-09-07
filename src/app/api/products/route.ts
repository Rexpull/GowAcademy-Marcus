import { NextResponse } from 'next/server';
import { container } from '@/infra/container';
import { ProductMapper } from '@/interface/mappers/product.mapper';
import { createErrorResponse } from '@/interface/http/errors';
import { logger } from '@/infra/logger';

export async function GET() {
  try {
    const productRepository = container.getProductRepository();
    const products = await productRepository.findAll();

    const response = ProductMapper.toResponseDtoArray(products);
    return NextResponse.json(response);

  } catch (error) {
    logger.error('Erro ao listar produtos', error);
    
    return NextResponse.json(
      createErrorResponse(new Error('Erro interno do servidor')),
      { status: 500 }
    );
  }
}
