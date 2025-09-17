/**
 * Calcula a parcela usando a Tabela Price (Sistema de Amortização Francês)
 * @param valor Valor principal do empréstimo
 * @param taxaMes Taxa de juros mensal (em decimal, ex: 0.015 para 1.5%)
 * @param n Número de parcelas
 * @returns Valor da parcela
 */
export function calcParcela(valor: number, taxaMes: number, n: number): number {
  if (valor <= 0) throw new Error('Valor deve ser positivo');
  if (taxaMes < 0) throw new Error('Taxa mensal deve ser positiva');
  if (n <= 0) throw new Error('Número de parcelas deve ser positivo');

  // Se a taxa for zero, parcela = valor / n
  if (taxaMes === 0) {
    return valor / n;
  }

  // Fórmula da Tabela Price: PMT = PV * [i * (1 + i)^n] / [(1 + i)^n - 1]
  const fator = Math.pow(1 + taxaMes, n);
  const parcela = valor * (taxaMes * fator) / (fator - 1);
  
  // Arredonda para 2 casas decimais
  return Math.round(parcela * 100) / 100;
}

/**
 * Calcula o valor total a ser pago
 * @param parcela Valor da parcela
 * @param n Número de parcelas
 * @returns Valor total
 */
export function calcTotal(parcela: number, n: number): number {
  if (parcela <= 0) throw new Error('Parcela deve ser positiva');
  if (n <= 0) throw new Error('Número de parcelas deve ser positivo');
  
  return Math.round(parcela * n * 100) / 100;
}

/**
 * Calcula o valor dos juros totais
 * @param valorPrincipal Valor principal do empréstimo
 * @param valorTotal Valor total a ser pago
 * @returns Valor dos juros
 */
export function calcJuros(valorPrincipal: number, valorTotal: number): number {
  if (valorPrincipal <= 0) throw new Error('Valor principal deve ser positivo');
  if (valorTotal <= 0) throw new Error('Valor total deve ser positivo');
  
  return Math.round((valorTotal - valorPrincipal) * 100) / 100;
}

/**
 * Calcula o CET (Custo Efetivo Total) de um empréstimo
 * @param principal Valor principal do empréstimo
 * @param n Número de parcelas
 * @param parcela Valor da parcela
 * @returns CET em percentual (ex: 15.5 para 15.5%)
 */
export function calcularCET(principal: number, n: number, parcela: number): number {
  if (principal <= 0) throw new Error('Principal deve ser positivo');
  if (n <= 0) throw new Error('Número de parcelas deve ser positivo');
  if (parcela <= 0) throw new Error('Parcela deve ser positiva');

  const total = parcela * n;
  const cet = ((total - principal) / principal) * 100;
  
  // Arredonda para 2 casas decimais
  return Math.round(cet * 100) / 100;
}