import { Product } from '../entities/Product';
import { OfferEntity } from '../entities/Offer';

/**
 * Gera ofertas de crédito baseadas na renda, score e produto
 * @param renda Renda mensal do solicitante
 * @param score Score de crédito (0-1000)
 * @param produto Produto de empréstimo
 * @returns Array de ofertas
 */
export function gerarOfertas(renda: number, score: number, produto: Product): OfferEntity[] {
  if (renda <= 0) throw new Error('Renda deve ser positiva');
  if (score < 0 || score > 1000) throw new Error('Score deve estar entre 0 e 1000');
  if (!produto) throw new Error('Produto é obrigatório');

  const maxParcela = renda * 0.3; // 30% da renda
  const ofertas: OfferEntity[] = [];

  // Calcula multiplicador baseado no score
  const multiplicadorScore = calcularMultiplicadorScore(score);
  
  // Oferta 1: Valor conservador (15% da renda)
  const valorConservador = renda * 0.15 * multiplicadorScore;
  const parcelasConservador = calcularParcelasSugeridas(valorConservador, maxParcela, produto);
  
  if (parcelasConservador.length > 0) {
    ofertas.push(new OfferEntity(
      valorConservador,
      parcelasConservador,
      'Oferta conservadora com baixo risco'
    ));
  }

  // Oferta 2: Valor moderado (25% da renda)
  const valorModerado = renda * 0.25 * multiplicadorScore;
  const parcelasModerado = calcularParcelasSugeridas(valorModerado, maxParcela, produto);
  
  if (parcelasModerado.length > 0) {
    ofertas.push(new OfferEntity(
      valorModerado,
      parcelasModerado,
      'Oferta moderada com risco controlado'
    ));
  }

  // Oferta 3: Valor máximo (30% da renda)
  const valorMaximo = renda * 0.30 * multiplicadorScore;
  const parcelasMaximo = calcularParcelasSugeridas(valorMaximo, maxParcela, produto);
  
  if (parcelasMaximo.length > 0) {
    ofertas.push(new OfferEntity(
      valorMaximo,
      parcelasMaximo,
      'Oferta máxima disponível'
    ));
  }

  return ofertas;
}

/**
 * Calcula multiplicador baseado no score de crédito
 * @param score Score de crédito (0-1000)
 * @returns Multiplicador (0.5 a 1.5)
 */
function calcularMultiplicadorScore(score: number): number {
  if (score >= 800) return 1.5; // Excelente
  if (score >= 700) return 1.3; // Bom
  if (score >= 600) return 1.1; // Regular
  if (score >= 500) return 0.9; // Ruim
  return 0.5; // Muito ruim
}

/**
 * Calcula parcelas sugeridas baseadas no valor e limite de parcela
 * @param valor Valor do empréstimo
 * @param maxParcela Valor máximo da parcela
 * @param produto Produto de empréstimo
 * @returns Array de parcelas sugeridas
 */
function calcularParcelasSugeridas(
  valor: number, 
  maxParcela: number, 
  produto: Product
): number[] {
  const parcelasSugeridas: number[] = [];
  
  // Testa diferentes números de parcelas dentro do range do produto
  for (let parcelas = produto.minParcelas; parcelas <= produto.maxParcelas; parcelas += 6) {
    // Calcula parcela usando taxa base (aproximação)
    const parcelaEstimada = valor * (1 + produto.taxaMesBase * parcelas) / parcelas;
    
    if (parcelaEstimada <= maxParcela) {
      parcelasSugeridas.push(parcelas);
    }
  }
  
  // Se não encontrou nenhuma parcela válida, tenta com o mínimo
  if (parcelasSugeridas.length === 0 && produto.minParcelas <= produto.maxParcelas) {
    const parcelaMinima = valor * (1 + produto.taxaMesBase * produto.minParcelas) / produto.minParcelas;
    if (parcelaMinima <= maxParcela) {
      parcelasSugeridas.push(produto.minParcelas);
    }
  }
  
  return parcelasSugeridas;
}
