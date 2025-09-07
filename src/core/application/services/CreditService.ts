import { OfferEntity } from '../../domain/entities/Offer';
import { Product } from '../../domain/entities/Product';
import { Applicant } from '../../domain/entities/Applicant';
import { IProductRepository } from '../../domain/ports/IProductRepository';
import { IApplicantRepository } from '../../domain/ports/IApplicantRepository';
import { gerarOfertas } from '../../domain/rules/offers';

export class CreditService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly applicantRepository: IApplicantRepository
  ) {}

  /**
   * Gera ofertas de crédito para um solicitante e produto
   * @param applicantId ID do solicitante
   * @param productId ID do produto
   * @returns Array de ofertas
   */
  async gerarOfertasPara(applicantId: string, productId: string): Promise<OfferEntity[]> {
    if (!applicantId) throw new Error('ID do solicitante é obrigatório');
    if (!productId) throw new Error('ID do produto é obrigatório');

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

    // Gera ofertas usando as regras de negócio
    const ofertas = gerarOfertas(applicant.renda, applicant.score, product);

    if (ofertas.length === 0) {
      throw new Error('Nenhuma oferta disponível para este solicitante e produto');
    }

    return ofertas;
  }

  /**
   * Valida se um solicitante pode contratar um valor específico
   * @param applicantId ID do solicitante
   * @param valor Valor desejado
   * @param parcelas Número de parcelas
   * @returns true se pode contratar, false caso contrário
   */
  async podeContratar(applicantId: string, valor: number, parcelas: number): Promise<boolean> {
    if (!applicantId) throw new Error('ID do solicitante é obrigatório');
    if (valor <= 0) throw new Error('Valor deve ser positivo');
    if (parcelas <= 0) throw new Error('Número de parcelas deve ser positivo');

    const applicant = await this.applicantRepository.findById(applicantId);
    if (!applicant) {
      throw new Error('Solicitante não encontrado');
    }

    const maxParcela = applicant.renda * 0.3; // 30% da renda
    const parcelaEstimada = valor / parcelas; // Estimativa simples

    return parcelaEstimada <= maxParcela;
  }

  /**
   * Calcula limite de crédito para um solicitante
   * @param applicantId ID do solicitante
   * @returns Limite de crédito
   */
  async calcularLimiteCredito(applicantId: string): Promise<number> {
    if (!applicantId) throw new Error('ID do solicitante é obrigatório');

    const applicant = await this.applicantRepository.findById(applicantId);
    if (!applicant) {
      throw new Error('Solicitante não encontrado');
    }

    // Limite baseado na renda e score
    const multiplicadorScore = this.calcularMultiplicadorScore(applicant.score);
    const limiteBase = applicant.renda * 12; // 12 meses de renda
    const limiteFinal = limiteBase * multiplicadorScore;

    return Math.round(limiteFinal * 100) / 100;
  }

  /**
   * Calcula multiplicador baseado no score
   * @param score Score de crédito
   * @returns Multiplicador
   */
  private calcularMultiplicadorScore(score: number): number {
    if (score >= 800) return 1.5; // Excelente
    if (score >= 700) return 1.3; // Bom
    if (score >= 600) return 1.1; // Regular
    if (score >= 500) return 0.9; // Ruim
    return 0.5; // Muito ruim
  }
}
