import { Product } from '../../domain/entities/Product';
import { Applicant } from '../../domain/entities/Applicant';
import { Contract, ContractEntity } from '../../domain/entities/Contract';
import { Address } from '../../domain/entities/Address';
import { IProductRepository } from '../../domain/ports/IProductRepository';
import { IApplicantRepository } from '../../domain/ports/IApplicantRepository';
import { IContractRepository } from '../../domain/ports/IContractRepository';
import { IAddressRepository } from '../../domain/ports/IAddressRepository';
import { ICdiGateway } from '../../domain/ports/ICdiGateway';
import { calcParcela, calcTotal } from '../../domain/rules/price';

export interface SimulacaoResult {
  parcela: number;
  total: number;
  taxaEfetivaMes: number;
  juros: number;
}

export interface ContratacaoResult {
  contractId: string;
  status: Contract['status'];
}

export class LoanService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly applicantRepository: IApplicantRepository,
    private readonly contractRepository: IContractRepository,
    private readonly addressRepository: IAddressRepository,
    private readonly cdiGateway: ICdiGateway
  ) {}

  /**
   * Simula um empréstimo
   * @param applicantId ID do solicitante
   * @param productId ID do produto
   * @param valor Valor do empréstimo
   * @param parcelas Número de parcelas
   * @returns Resultado da simulação
   */
  async simular(
    applicantId: string,
    productId: string,
    valor: number,
    parcelas: number
  ): Promise<SimulacaoResult> {
    this.validateSimulacaoParams(applicantId, productId, valor, parcelas);

    // Busca solicitante
    const applicant = await this.applicantRepository.findById(applicantId);
    if (!applicant) {
      throw new Error('Solicitante não encontrado');
    }

    // Busca produto
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Produto não encontrado');
    }

    // Valida se o número de parcelas é válido para o produto
    if (!product.minParcelas || !product.maxParcelas) {
      throw new Error('Produto com configuração de parcelas inválida');
    }

    if (parcelas < product.minParcelas || parcelas > product.maxParcelas) {
      throw new Error(`Número de parcelas deve estar entre ${product.minParcelas} e ${product.maxParcelas}`);
    }

    // Verifica se a parcela não excede 30% da renda
    const maxParcela = applicant.renda * 0.3;
    const parcelaEstimada = valor / parcelas; // Estimativa simples
    if (parcelaEstimada > maxParcela) {
      throw new Error('Parcela excede 30% da renda');
    }

    // Obtém taxa CDI atual
    const cdiIndex = await this.cdiGateway.getCurrentCdiIndex();
    
    // Converte CDI para taxa mensal (assumindo que CDI vem anual)
    const cdiMensal = this.convertCdiToMonthly(cdiIndex);
    
    // Calcula taxa efetiva mensal
    const taxaEfetivaMes = product.taxaMesBase + cdiMensal;

    // Calcula parcela usando Tabela Price
    const parcela = calcParcela(valor, taxaEfetivaMes, parcelas);
    const total = calcTotal(parcela, parcelas);
    const juros = total - valor;

    return {
      parcela: Math.round(parcela * 100) / 100,
      total: Math.round(total * 100) / 100,
      taxaEfetivaMes: Math.round(taxaEfetivaMes * 10000) / 10000, // 4 casas decimais
      juros: Math.round(juros * 100) / 100
    };
  }

  /**
   * Contrata um empréstimo
   * @param applicantId ID do solicitante
   * @param productId ID do produto
   * @param valor Valor do empréstimo
   * @param parcelas Número de parcelas
   * @returns Resultado da contratação
   */
  async contratar(
    applicantId: string,
    productId: string,
    valor: number,
    parcelas: number
  ): Promise<ContratacaoResult> {
    // Simula primeiro para validar
    const simulacao = await this.simular(applicantId, productId, valor, parcelas);

    // Busca solicitante e endereço
    const applicant = await this.applicantRepository.findById(applicantId);
    if (!applicant) {
      throw new Error('Solicitante não encontrado');
    }

    const address = await this.addressRepository.findById(applicant.addressId);
    if (!address) {
      throw new Error('Endereço do solicitante não encontrado');
    }

    // Cria contrato com snapshot do endereço
    const contract = await this.contractRepository.create({
      applicantId,
      productId,
      valor,
      parcelas,
      taxaEfetivaMes: simulacao.taxaEfetivaMes,
      parcelaCalculada: simulacao.parcela,
      status: 'PENDENTE',
      // Snapshot do endereço
      addressCep: address.cep,
      addressState: address.state,
      addressCity: address.city,
      addressNeighborhood: address.neighborhood,
      addressStreet: address.street,
      addressService: address.service
    });

    return {
      contractId: contract.id,
      status: contract.status
    };
  }

  /**
   * Busca contrato por ID
   * @param id ID do contrato
   * @returns Contrato encontrado
   */
  async findContractById(id: string): Promise<Contract> {
    if (!id) throw new Error('ID é obrigatório');

    const contract = await this.contractRepository.findById(id);
    if (!contract) {
      throw new Error('Contrato não encontrado');
    }

    return contract;
  }

  /**
   * Lista contratos por solicitante
   * @param applicantId ID do solicitante
   * @returns Array de contratos
   */
  async findContractsByApplicant(applicantId: string): Promise<Contract[]> {
    if (!applicantId) throw new Error('ID do solicitante é obrigatório');

    return await this.contractRepository.findByApplicantId(applicantId);
  }

  /**
   * Converte taxa CDI anual para mensal
   * @param cdiAnual Taxa CDI anual (em decimal)
   * @returns Taxa CDI mensal (em decimal)
   */
  private convertCdiToMonthly(cdiAnual: number): number {
    // Converte de anual para mensal usando a fórmula: (1 + taxa_anual)^(1/12) - 1
    return Math.pow(1 + cdiAnual, 1/12) - 1;
  }

  /**
   * Valida parâmetros da simulação
   * @param applicantId ID do solicitante
   * @param productId ID do produto
   * @param valor Valor do empréstimo
   * @param parcelas Número de parcelas
   */
  private validateSimulacaoParams(
    applicantId: string,
    productId: string,
    valor: number,
    parcelas: number
  ): void {
    if (!applicantId) throw new Error('ID do solicitante é obrigatório');
    if (!productId) throw new Error('ID do produto é obrigatório');
    if (valor <= 0) throw new Error('Valor deve ser positivo');
    if (parcelas <= 0) throw new Error('Número de parcelas deve ser positivo');
  }
}
