import { Address } from '../entities/Address';

export interface IAddressRepository {
  /**
   * Cria um novo endereço
   * @param address Dados do endereço
   * @returns Endereço criado
   */
  create(address: Omit<Address, 'id' | 'createdAt'>): Promise<Address>;

  /**
   * Busca endereço por ID
   * @param id ID do endereço
   * @returns Endereço encontrado ou null
   */
  findById(id: string): Promise<Address | null>;

  /**
   * Busca endereço por CEP, estado, cidade, bairro, rua e serviço
   * @param cep CEP
   * @param state Estado
   * @param city Cidade
   * @param neighborhood Bairro
   * @param street Rua
   * @param service Serviço de origem
   * @returns Endereço encontrado ou null
   */
  findByUniqueFields(
    cep: string,
    state: string,
    city: string,
    neighborhood: string,
    street: string,
    service: string
  ): Promise<Address | null>;

  /**
   * Lista todos os endereços
   * @returns Array de endereços
   */
  findAll(): Promise<Address[]>;
}
