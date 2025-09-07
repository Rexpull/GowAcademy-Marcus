export interface Product {
  id: string;
  nome: string;
  taxaMesBase: number;
  minParcelas: number;
  maxParcelas: number;
  cetInfo: string;
  createdAt: Date;
}

export class ProductEntity implements Product {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly taxaMesBase: number,
    public readonly minParcelas: number,
    public readonly maxParcelas: number,
    public readonly cetInfo: string,
    public readonly createdAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) throw new Error('Product ID é obrigatório');
    if (!this.nome) throw new Error('Nome do produto é obrigatório');
    if (this.taxaMesBase < 0) throw new Error('Taxa mensal base deve ser positiva');
    if (this.minParcelas < 1) throw new Error('Mínimo de parcelas deve ser maior que 0');
    if (this.maxParcelas < this.minParcelas) {
      throw new Error('Máximo de parcelas deve ser maior ou igual ao mínimo');
    }
  }

  public isValidParcelas(parcelas: number): boolean {
    return parcelas >= this.minParcelas && parcelas <= this.maxParcelas;
  }
}
