import { Address, AddressEntity } from '../../domain/entities/Address';
import { IAddressRepository } from '../../domain/ports/IAddressRepository';
import { ICepGateway, AddressLike } from '../../domain/ports/ICepGateway';

export interface CreateAddressData {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

export class AddressService {
  constructor(
    private readonly addressRepository: IAddressRepository,
    private readonly cepGateway: ICepGateway
  ) {}

  /**
   * Resolve ou cria um endereço baseado no CEP
   * @param cep CEP a ser consultado
   * @returns Endereço existente ou criado
   */
  async resolveOrCreateByZip(cep: string): Promise<Address> {
    if (!cep) throw new Error('CEP é obrigatório');

    // Limpa o CEP
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    // Consulta o gateway externo
    const addressData = await this.cepGateway.getAddressByZip(cleanCep);
    if (!addressData) {
      throw new Error('CEP não encontrado');
    }

    // Verifica se já existe um endereço com essas características
    const existingAddress = await this.addressRepository.findByUniqueFields(
      addressData.cep,
      addressData.state,
      addressData.city,
      addressData.neighborhood,
      addressData.street,
      addressData.service
    );

    if (existingAddress) {
      return existingAddress;
    }

    // Cria novo endereço
    const newAddress = await this.addressRepository.create({
      cep: addressData.cep,
      state: addressData.state,
      city: addressData.city,
      neighborhood: addressData.neighborhood,
      street: addressData.street,
      service: addressData.service
    });

    return newAddress;
  }

  /**
   * Busca endereço por ID
   * @param id ID do endereço
   * @returns Endereço encontrado
   */
  async findById(id: string): Promise<Address> {
    if (!id) throw new Error('ID é obrigatório');

    const address = await this.addressRepository.findById(id);
    if (!address) {
      throw new Error('Endereço não encontrado');
    }

    return address;
  }

  /**
   * Lista todos os endereços
   * @returns Array de endereços
   */
  async findAll(): Promise<Address[]> {
    return await this.addressRepository.findAll();
  }

  /**
   * Valida dados de endereço
   * @param data Dados do endereço
   * @returns Dados validados
   */
  private validateAddressData(data: CreateAddressData): CreateAddressData {
    if (!data.cep) throw new Error('CEP é obrigatório');
    if (!data.state) throw new Error('Estado é obrigatório');
    if (!data.city) throw new Error('Cidade é obrigatória');
    if (!data.neighborhood) throw new Error('Bairro é obrigatório');
    if (!data.street) throw new Error('Rua é obrigatória');
    if (!data.service) throw new Error('Serviço é obrigatório');

    return data;
  }
}
