import { Address } from '../../core/domain/entities/Address';
import { IAddressRepository } from '../../core/domain/ports/IAddressRepository';
import { prisma } from '../database/prisma';
import { logger } from '../logger';

export class PrismaAddressRepository implements IAddressRepository {
  async create(address: Omit<Address, 'id' | 'createdAt'>): Promise<Address> {
    try {
      const created = await prisma.address.create({
        data: {
          cep: address.cep,
          state: address.state,
          city: address.city,
          neighborhood: address.neighborhood,
          street: address.street,
          service: address.service
        }
      });

      logger.info(`Endereço criado: ${created.id} - ${created.city}/${created.state}`);
      return this.mapToDomain(created);
    } catch (error) {
      logger.error('Erro ao criar endereço', error);
      throw new Error('Erro ao criar endereço');
    }
  }

  async findById(id: string): Promise<Address | null> {
    try {
      const address = await prisma.address.findUnique({
        where: { id }
      });

      return address ? this.mapToDomain(address) : null;
    } catch (error) {
      logger.error(`Erro ao buscar endereço por ID: ${id}`, error);
      throw new Error('Erro ao buscar endereço');
    }
  }

  async findByUniqueFields(
    cep: string,
    state: string,
    city: string,
    neighborhood: string,
    street: string,
    service: string
  ): Promise<Address | null> {
    try {
      const address = await prisma.address.findUnique({
        where: {
          cep_state_city_neighborhood_street_service: {
            cep,
            state,
            city,
            neighborhood,
            street,
            service
          }
        }
      });

      return address ? this.mapToDomain(address) : null;
    } catch (error) {
      logger.error('Erro ao buscar endereço por campos únicos', error);
      throw new Error('Erro ao buscar endereço');
    }
  }

  async findAll(): Promise<Address[]> {
    try {
      const addresses = await prisma.address.findMany({
        orderBy: { createdAt: 'desc' }
      });

      return addresses.map(this.mapToDomain);
    } catch (error) {
      logger.error('Erro ao listar endereços', error);
      throw new Error('Erro ao listar endereços');
    }
  }

  private mapToDomain(prismaAddress: any): Address {
    return {
      id: prismaAddress.id,
      cep: prismaAddress.cep,
      state: prismaAddress.state,
      city: prismaAddress.city,
      neighborhood: prismaAddress.neighborhood,
      street: prismaAddress.street,
      service: prismaAddress.service,
      createdAt: prismaAddress.createdAt
    };
  }
}
