import { Applicant } from '../entities/Applicant';

export interface IApplicantRepository {
  /**
   * Cria um novo solicitante
   * @param applicant Dados do solicitante
   * @returns Solicitante criado
   */
  create(applicant: Omit<Applicant, 'id' | 'createdAt'>): Promise<Applicant>;

  /**
   * Busca solicitante por ID
   * @param id ID do solicitante
   * @returns Solicitante encontrado ou null
   */
  findById(id: string): Promise<Applicant | null>;

  /**
   * Busca solicitante por CPF
   * @param cpf CPF do solicitante
   * @returns Solicitante encontrado ou null
   */
  findByCpf(cpf: string): Promise<Applicant | null>;

  /**
   * Lista todos os solicitantes
   * @returns Array de solicitantes
   */
  findAll(): Promise<Applicant[]>;

  /**
   * Atualiza dados do solicitante
   * @param id ID do solicitante
   * @param data Dados para atualizar
   * @returns Solicitante atualizado
   */
  update(id: string, data: Partial<Applicant>): Promise<Applicant>;
}
