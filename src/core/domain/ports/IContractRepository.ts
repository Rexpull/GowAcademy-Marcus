import { Contract } from '../entities/Contract';

export interface IContractRepository {
  /**
   * Cria um novo contrato
   * @param contract Dados do contrato
   * @returns Contrato criado
   */
  create(contract: Omit<Contract, 'id' | 'createdAt'>): Promise<Contract>;

  /**
   * Busca contrato por ID
   * @param id ID do contrato
   * @returns Contrato encontrado ou null
   */
  findById(id: string): Promise<Contract | null>;

  /**
   * Lista contratos por solicitante
   * @param applicantId ID do solicitante
   * @returns Array de contratos
   */
  findByApplicantId(applicantId: string): Promise<Contract[]>;

  /**
   * Lista todos os contratos
   * @returns Array de contratos
   */
  findAll(): Promise<Contract[]>;

  /**
   * Atualiza status do contrato
   * @param id ID do contrato
   * @param status Novo status
   * @returns Contrato atualizado
   */
  updateStatus(id: string, status: Contract['status']): Promise<Contract>;
}
