import { Applicant } from './Applicant';
import { Product } from './Product';

export type ContractStatus = 'PENDENTE' | 'APROVADO' | 'REPROVADO';

export interface Contract {
  id: string;
  applicantId: string;
  productId: string;
  valor: number;
  parcelas: number;
  taxaEfetivaMes: number;
  parcelaCalculada: number;
  status: ContractStatus;
  createdAt: Date;
  
  // Snapshot de endereço no momento da contratação
  addressCep: string;
  addressState: string;
  addressCity: string;
  addressNeighborhood: string;
  addressStreet: string;
  addressService: string;
  
  applicant?: Applicant;
  product?: Product;
}

export class ContractEntity implements Contract {
  constructor(
    public readonly id: string,
    public readonly applicantId: string,
    public readonly productId: string,
    public readonly valor: number,
    public readonly parcelas: number,
    public readonly taxaEfetivaMes: number,
    public readonly parcelaCalculada: number,
    public readonly status: ContractStatus,
    public readonly createdAt: Date,
    public readonly addressCep: string,
    public readonly addressState: string,
    public readonly addressCity: string,
    public readonly addressNeighborhood: string,
    public readonly addressStreet: string,
    public readonly addressService: string,
    public readonly applicant?: Applicant,
    public readonly product?: Product
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) throw new Error('Contract ID é obrigatório');
    if (!this.applicantId) throw new Error('Applicant ID é obrigatório');
    if (!this.productId) throw new Error('Product ID é obrigatório');
    if (this.valor <= 0) throw new Error('Valor deve ser positivo');
    if (this.parcelas <= 0) throw new Error('Número de parcelas deve ser positivo');
    if (this.taxaEfetivaMes < 0) throw new Error('Taxa efetiva mensal deve ser positiva');
    if (this.parcelaCalculada <= 0) throw new Error('Parcela calculada deve ser positiva');
    if (!this.isValidStatus(this.status)) {
      throw new Error('Status inválido');
    }
    if (!this.addressCep) throw new Error('CEP do endereço é obrigatório');
    if (!this.addressState) throw new Error('Estado do endereço é obrigatório');
    if (!this.addressCity) throw new Error('Cidade do endereço é obrigatória');
    if (!this.addressNeighborhood) throw new Error('Bairro do endereço é obrigatório');
    if (!this.addressStreet) throw new Error('Rua do endereço é obrigatória');
    if (!this.addressService) throw new Error('Serviço do endereço é obrigatório');
  }

  private isValidStatus(status: string): status is ContractStatus {
    return ['PENDENTE', 'APROVADO', 'REPROVADO'].includes(status);
  }

  public getTotalValue(): number {
    return this.parcelaCalculada * this.parcelas;
  }

  public getFormattedAddress(): string {
    return `${this.addressStreet}, ${this.addressNeighborhood}, ${this.addressCity} - ${this.addressState}`;
  }

  public getFormattedCep(): string {
    const cleanCep = this.addressCep.replace(/\D/g, '');
    return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
  }
}
