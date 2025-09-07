export interface Address {
  id: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
  createdAt: Date;
}

export class AddressEntity implements Address {
  constructor(
    public readonly id: string,
    public readonly cep: string,
    public readonly state: string,
    public readonly city: string,
    public readonly neighborhood: string,
    public readonly street: string,
    public readonly service: string,
    public readonly createdAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) throw new Error('Address ID é obrigatório');
    if (!this.cep || !this.isValidCep(this.cep)) {
      throw new Error('CEP deve ter 8 dígitos');
    }
    if (!this.state || this.state.length !== 2) {
      throw new Error('Estado deve ter 2 caracteres (UF)');
    }
    if (!this.city) throw new Error('Cidade é obrigatória');
    if (!this.neighborhood) throw new Error('Bairro é obrigatório');
    if (!this.street) throw new Error('Rua é obrigatória');
    if (!this.service) throw new Error('Serviço de origem é obrigatório');
  }

  private isValidCep(cep: string): boolean {
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.length === 8;
  }

  public getFormattedCep(): string {
    const cleanCep = this.cep.replace(/\D/g, '');
    return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
  }

  public getFullAddress(): string {
    return `${this.street}, ${this.neighborhood}, ${this.city} - ${this.state}`;
  }
}
