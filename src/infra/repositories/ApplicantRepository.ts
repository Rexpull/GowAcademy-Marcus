import { Applicant } from '../../core/domain/entities/Applicant';
import { IApplicantRepository } from '../../core/domain/ports/IApplicantRepository';
import { prisma } from '../database/prisma';
import { logger } from '../logger';

export class PrismaApplicantRepository implements IApplicantRepository {
  async create(applicant: Omit<Applicant, 'id' | 'createdAt'>): Promise<Applicant> {
    try {
      const created = await prisma.applicant.create({
        data: {
          nome: applicant.nome,
          cpf: applicant.cpf,
          renda: applicant.renda,
          score: applicant.score,
          addressId: applicant.addressId
        },
        include: {
          address: true
        }
      });

      logger.info(`Solicitante criado: ${created.id} - ${created.nome}`);
      return this.mapToDomain(created);
    } catch (error) {
      logger.error('Erro ao criar solicitante', error);
      throw new Error('Erro ao criar solicitante');
    }
  }

  async findById(id: string): Promise<Applicant | null> {
    try {
      const applicant = await prisma.applicant.findUnique({
        where: { id },
        include: {
          address: true
        }
      });

      return applicant ? this.mapToDomain(applicant) : null;
    } catch (error) {
      logger.error(`Erro ao buscar solicitante por ID: ${id}`, error);
      throw new Error('Erro ao buscar solicitante');
    }
  }

  async findByCpf(cpf: string): Promise<Applicant | null> {
    try {
      const applicant = await prisma.applicant.findUnique({
        where: { cpf },
        include: {
          address: true
        }
      });

      return applicant ? this.mapToDomain(applicant) : null;
    } catch (error) {
      logger.error(`Erro ao buscar solicitante por CPF: ${cpf}`, error);
      throw new Error('Erro ao buscar solicitante');
    }
  }

  async findAll(): Promise<Applicant[]> {
    try {
      const applicants = await prisma.applicant.findMany({
        include: {
          address: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return applicants.map(this.mapToDomain);
    } catch (error) {
      logger.error('Erro ao listar solicitantes', error);
      throw new Error('Erro ao listar solicitantes');
    }
  }

  async update(id: string, data: Partial<Applicant>): Promise<Applicant> {
    try {
      const updated = await prisma.applicant.update({
        where: { id },
        data: {
          ...(data.nome && { nome: data.nome }),
          ...(data.cpf && { cpf: data.cpf }),
          ...(data.renda !== undefined && { renda: data.renda }),
          ...(data.score !== undefined && { score: data.score }),
          ...(data.addressId && { addressId: data.addressId })
        },
        include: {
          address: true
        }
      });

      logger.info(`Solicitante atualizado: ${updated.id}`);
      return this.mapToDomain(updated);
    } catch (error) {
      logger.error(`Erro ao atualizar solicitante: ${id}`, error);
      throw new Error('Erro ao atualizar solicitante');
    }
  }

  private mapToDomain(prismaApplicant: any): Applicant {
    return {
      id: prismaApplicant.id,
      nome: prismaApplicant.nome,
      cpf: prismaApplicant.cpf,
      renda: prismaApplicant.renda,
      score: prismaApplicant.score,
      addressId: prismaApplicant.addressId,
      createdAt: prismaApplicant.createdAt,
      address: prismaApplicant.address ? {
        id: prismaApplicant.address.id,
        cep: prismaApplicant.address.cep,
        state: prismaApplicant.address.state,
        city: prismaApplicant.address.city,
        neighborhood: prismaApplicant.address.neighborhood,
        street: prismaApplicant.address.street,
        service: prismaApplicant.address.service,
        createdAt: prismaApplicant.address.createdAt
      } : undefined
    };
  }
}
