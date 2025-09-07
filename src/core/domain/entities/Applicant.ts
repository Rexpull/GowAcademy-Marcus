import { Address } from './Address';

export interface Applicant {
  id: string;
  nome: string;
  cpf: string;
  renda: number;
  score: number;
  addressId: string;
  createdAt: Date;
  address?: Address;
}

export class ApplicantEntity implements Applicant {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly cpf: string,
    public readonly renda: number,
    public readonly score: number,
    public readonly addressId: string,
    public readonly createdAt: Date,
    public readonly address?: Address
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) throw new Error('Applicant ID é obrigatório');
    if (!this.nome) throw new Error('Nome é obrigatório');
    if (!this.cpf || !this.isValidCpf(this.cpf)) {
      throw new Error('CPF inválido');
    }
    if (this.renda <= 0) throw new Error('Renda deve ser positiva');
    if (this.score < 0 || this.score > 1000) {
      throw new Error('Score deve estar entre 0 e 1000');
    }
    if (!this.addressId) throw new Error('Address ID é obrigatório');
  }

  private isValidCpf(cpf: string): boolean {
    const cleanCpf = cpf.replace(/\D/g, '');
    
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(10))) return false;

    return true;
  }

  public getFormattedCpf(): string {
    const cleanCpf = this.cpf.replace(/\D/g, '');
    return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-${cleanCpf.slice(9)}`;
  }

  public getMaxMonthlyPayment(): number {
    return this.renda * 0.3; // 30% da renda
  }
}
