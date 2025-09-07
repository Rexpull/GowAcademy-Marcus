import { Contract } from '../../core/domain/entities/Contract';
import { IContractRepository } from '../../core/domain/ports/IContractRepository';
import { prisma } from '../database/prisma';
import { logger } from '../logger';

export class PrismaContractRepository implements IContractRepository {
  async create(contract: Omit<Contract, 'id' | 'createdAt'>): Promise<Contract> {
    try {
      const created = await prisma.contract.create({
        data: {
          applicantId: contract.applicantId,
          productId: contract.productId,
          valor: contract.valor,
          parcelas: contract.parcelas,
          taxaEfetivaMes: contract.taxaEfetivaMes,
          parcelaCalculada: contract.parcelaCalculada,
          status: contract.status,
          addressCep: contract.addressCep,
          addressState: contract.addressState,
          addressCity: contract.addressCity,
          addressNeighborhood: contract.addressNeighborhood,
          addressStreet: contract.addressStreet,
          addressService: contract.addressService
        },
        include: {
          applicant: {
            include: {
              address: true
            }
          },
          product: true
        }
      });

      logger.info(`Contrato criado: ${created.id} - Status: ${created.status}`);
      return this.mapToDomain(created);
    } catch (error) {
      logger.error('Erro ao criar contrato', error);
      throw new Error('Erro ao criar contrato');
    }
  }

  async findById(id: string): Promise<Contract | null> {
    try {
      const contract = await prisma.contract.findUnique({
        where: { id },
        include: {
          applicant: {
            include: {
              address: true
            }
          },
          product: true
        }
      });

      return contract ? this.mapToDomain(contract) : null;
    } catch (error) {
      logger.error(`Erro ao buscar contrato por ID: ${id}`, error);
      throw new Error('Erro ao buscar contrato');
    }
  }

  async findByApplicantId(applicantId: string): Promise<Contract[]> {
    try {
      const contracts = await prisma.contract.findMany({
        where: { applicantId },
        include: {
          applicant: {
            include: {
              address: true
            }
          },
          product: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return contracts.map(this.mapToDomain);
    } catch (error) {
      logger.error(`Erro ao buscar contratos por solicitante: ${applicantId}`, error);
      throw new Error('Erro ao buscar contratos');
    }
  }

  async findAll(): Promise<Contract[]> {
    try {
      const contracts = await prisma.contract.findMany({
        include: {
          applicant: {
            include: {
              address: true
            }
          },
          product: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return contracts.map(this.mapToDomain);
    } catch (error) {
      logger.error('Erro ao listar contratos', error);
      throw new Error('Erro ao listar contratos');
    }
  }

  async updateStatus(id: string, status: Contract['status']): Promise<Contract> {
    try {
      const updated = await prisma.contract.update({
        where: { id },
        data: { status },
        include: {
          applicant: {
            include: {
              address: true
            }
          },
          product: true
        }
      });

      logger.info(`Status do contrato atualizado: ${updated.id} - ${updated.status}`);
      return this.mapToDomain(updated);
    } catch (error) {
      logger.error(`Erro ao atualizar status do contrato: ${id}`, error);
      throw new Error('Erro ao atualizar status do contrato');
    }
  }

  private mapToDomain(prismaContract: any): Contract {
    return {
      id: prismaContract.id,
      applicantId: prismaContract.applicantId,
      productId: prismaContract.productId,
      valor: prismaContract.valor,
      parcelas: prismaContract.parcelas,
      taxaEfetivaMes: prismaContract.taxaEfetivaMes,
      parcelaCalculada: prismaContract.parcelaCalculada,
      status: prismaContract.status,
      createdAt: prismaContract.createdAt,
      addressCep: prismaContract.addressCep,
      addressState: prismaContract.addressState,
      addressCity: prismaContract.addressCity,
      addressNeighborhood: prismaContract.addressNeighborhood,
      addressStreet: prismaContract.addressStreet,
      addressService: prismaContract.addressService,
      applicant: prismaContract.applicant ? {
        id: prismaContract.applicant.id,
        nome: prismaContract.applicant.nome,
        cpf: prismaContract.applicant.cpf,
        renda: prismaContract.applicant.renda,
        score: prismaContract.applicant.score,
        addressId: prismaContract.applicant.addressId,
        createdAt: prismaContract.applicant.createdAt,
        address: prismaContract.applicant.address ? {
          id: prismaContract.applicant.address.id,
          cep: prismaContract.applicant.address.cep,
          state: prismaContract.applicant.address.state,
          city: prismaContract.applicant.address.city,
          neighborhood: prismaContract.applicant.address.neighborhood,
          street: prismaContract.applicant.address.street,
          service: prismaContract.applicant.address.service,
          createdAt: prismaContract.applicant.address.createdAt
        } : undefined
      } : undefined,
      product: prismaContract.product ? {
        id: prismaContract.product.id,
        nome: prismaContract.product.nome,
        taxaMesBase: prismaContract.product.taxaMesBase,
        minParcelas: prismaContract.product.minParcelas,
        maxParcelas: prismaContract.product.maxParcelas,
        cetInfo: prismaContract.product.cetInfo,
        createdAt: prismaContract.product.createdAt
      } : undefined
    };
  }
}
