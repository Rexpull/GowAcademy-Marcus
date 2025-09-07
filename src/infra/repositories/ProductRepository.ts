import { Product } from '../../core/domain/entities/Product';
import { IProductRepository } from '../../core/domain/ports/IProductRepository';
import { prisma } from '../database/prisma';
import { logger } from '../logger';

export class PrismaProductRepository implements IProductRepository {
  async create(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    try {
      const created = await prisma.product.create({
        data: {
          nome: product.nome,
          taxaMesBase: product.taxaMesBase,
          minParcelas: product.minParcelas,
          maxParcelas: product.maxParcelas,
          cetInfo: product.cetInfo
        }
      });

      logger.info(`Produto criado: ${created.id} - ${created.nome}`);
      return this.mapToDomain(created);
    } catch (error) {
      logger.error('Erro ao criar produto', error);
      throw new Error('Erro ao criar produto');
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { id }
      });

      return product ? this.mapToDomain(product) : null;
    } catch (error) {
      logger.error(`Erro ao buscar produto por ID: ${id}`, error);
      throw new Error('Erro ao buscar produto');
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'asc' }
      });

      return products.map(this.mapToDomain);
    } catch (error) {
      logger.error('Erro ao listar produtos', error);
      throw new Error('Erro ao listar produtos');
    }
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    try {
      const updated = await prisma.product.update({
        where: { id },
        data: {
          ...(data.nome && { nome: data.nome }),
          ...(data.taxaMesBase !== undefined && { taxaMesBase: data.taxaMesBase }),
          ...(data.minParcelas !== undefined && { minParcelas: data.minParcelas }),
          ...(data.maxParcelas !== undefined && { maxParcelas: data.maxParcelas }),
          ...(data.cetInfo && { cetInfo: data.cetInfo })
        }
      });

      logger.info(`Produto atualizado: ${updated.id}`);
      return this.mapToDomain(updated);
    } catch (error) {
      logger.error(`Erro ao atualizar produto: ${id}`, error);
      throw new Error('Erro ao atualizar produto');
    }
  }

  private mapToDomain(prismaProduct: any): Product {
    return {
      id: prismaProduct.id,
      nome: prismaProduct.nome,
      taxaMesBase: prismaProduct.taxaMesBase,
      minParcelas: prismaProduct.minParcelas,
      maxParcelas: prismaProduct.maxParcelas,
      cetInfo: prismaProduct.cetInfo,
      createdAt: prismaProduct.createdAt
    };
  }
}
