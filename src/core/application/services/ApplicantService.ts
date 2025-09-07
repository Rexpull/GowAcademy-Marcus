import { Applicant, ApplicantEntity } from '../../domain/entities/Applicant';
import { IApplicantRepository } from '../../domain/ports/IApplicantRepository';
import { AddressService } from './AddressService';
import { isValidCPF, cleanCPF } from '../../domain/rules/cpf';

export interface CreateApplicantData {
  nome: string;
  cpf: string;
  cep: string;
  renda: number;
}

export class ApplicantService {
  constructor(
    private readonly applicantRepository: IApplicantRepository,
    private readonly addressService: AddressService
  ) {}

  /**
   * Cadastra um novo solicitante
   * @param data Dados do solicitante
   * @returns Solicitante criado
   */
  async cadastrarSolicitante(data: CreateApplicantData): Promise<Applicant> {
    this.validateApplicantData(data);

    // Valida CPF
    if (!isValidCPF(data.cpf)) {
      throw new Error('CPF inválido');
    }

    // Verifica se CPF já existe
    const existingApplicant = await this.applicantRepository.findByCpf(cleanCPF(data.cpf));
    if (existingApplicant) {
      throw new Error('CPF já cadastrado');
    }

    // Resolve endereço pelo CEP
    const address = await this.addressService.resolveOrCreateByZip(data.cep);

    // Calcula score inicial (simplificado)
    const score = this.calculateInitialScore(data.renda);

    // Cria solicitante
    const applicant = await this.applicantRepository.create({
      nome: data.nome.trim(),
      cpf: cleanCPF(data.cpf),
      renda: data.renda,
      score,
      addressId: address.id
    });

    return applicant;
  }

  /**
   * Busca solicitante por ID
   * @param id ID do solicitante
   * @returns Solicitante encontrado
   */
  async findById(id: string): Promise<Applicant> {
    if (!id) throw new Error('ID é obrigatório');

    const applicant = await this.applicantRepository.findById(id);
    if (!applicant) {
      throw new Error('Solicitante não encontrado');
    }

    return applicant;
  }

  /**
   * Busca solicitante por CPF
   * @param cpf CPF do solicitante
   * @returns Solicitante encontrado
   */
  async findByCpf(cpf: string): Promise<Applicant> {
    if (!cpf) throw new Error('CPF é obrigatório');

    const cleanCpfValue = cleanCPF(cpf);
    const applicant = await this.applicantRepository.findByCpf(cleanCpfValue);
    if (!applicant) {
      throw new Error('Solicitante não encontrado');
    }

    return applicant;
  }

  /**
   * Lista todos os solicitantes
   * @returns Array de solicitantes
   */
  async findAll(): Promise<Applicant[]> {
    return await this.applicantRepository.findAll();
  }

  /**
   * Atualiza score do solicitante
   * @param id ID do solicitante
   * @param score Novo score
   * @returns Solicitante atualizado
   */
  async updateScore(id: string, score: number): Promise<Applicant> {
    if (!id) throw new Error('ID é obrigatório');
    if (score < 0 || score > 1000) {
      throw new Error('Score deve estar entre 0 e 1000');
    }

    return await this.applicantRepository.update(id, { score });
  }

  /**
   * Valida dados do solicitante
   * @param data Dados do solicitante
   */
  private validateApplicantData(data: CreateApplicantData): void {
    if (!data.nome || data.nome.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }
    if (!data.cpf) {
      throw new Error('CPF é obrigatório');
    }
    if (!data.cep) {
      throw new Error('CEP é obrigatório');
    }
    if (!data.renda || data.renda <= 0) {
      throw new Error('Renda deve ser positiva');
    }
  }

  /**
   * Calcula score inicial baseado na renda
   * @param renda Renda mensal
   * @returns Score inicial
   */
  private calculateInitialScore(renda: number): number {
    // Score base: 600
    // Ajuste baseado na renda
    if (renda >= 10000) return 750;
    if (renda >= 5000) return 700;
    if (renda >= 3000) return 650;
    if (renda >= 1500) return 600;
    return 550;
  }
}
