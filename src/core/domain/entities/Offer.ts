export interface Offer {
  valor: number;
  parcelasSugeridas: number[];
  observacoes?: string;
}

export class OfferEntity implements Offer {
  constructor(
    public readonly valor: number,
    public readonly parcelasSugeridas: number[],
    public readonly observacoes?: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.valor <= 0) throw new Error('Valor da oferta deve ser positivo');
    if (!this.parcelasSugeridas || this.parcelasSugeridas.length === 0) {
      throw new Error('Deve haver pelo menos uma sugestão de parcelas');
    }
    if (this.parcelasSugeridas.some(p => p <= 0)) {
      throw new Error('Todas as parcelas sugeridas devem ser positivas');
    }
  }

  public getFormattedValue(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.valor);
  }

  public getParcelasText(): string {
    if (this.parcelasSugeridas.length === 1) {
      return `${this.parcelasSugeridas[0]} parcelas`;
    }
    
    const sorted = [...this.parcelasSugeridas].sort((a, b) => a - b);
    return `${sorted[0]} a ${sorted[sorted.length - 1]} parcelas`;
  }
}
