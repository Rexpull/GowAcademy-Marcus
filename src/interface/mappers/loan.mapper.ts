import { Contract } from '../../core/domain/entities/Contract';
import { ContractDetailResponseDtoType, ContractResponseDtoType } from '../dto/loan.dto';

export class LoanMapper {
  static toContractResponseDto(contract: Contract): ContractResponseDtoType {
    return {
      contractId: contract.id,
      status: contract.status
    };
  }

  static toContractDetailResponseDto(contract: Contract): ContractDetailResponseDtoType {
    return {
      id: contract.id,
      applicantId: contract.applicantId,
      productId: contract.productId,
      valor: contract.valor,
      parcelas: contract.parcelas,
      taxaEfetivaMes: contract.taxaEfetivaMes,
      parcelaCalculada: contract.parcelaCalculada,
      status: contract.status,
      createdAt: contract.createdAt,
      addressCep: contract.addressCep,
      addressState: contract.addressState,
      addressCity: contract.addressCity,
      addressNeighborhood: contract.addressNeighborhood,
      addressStreet: contract.addressStreet,
      addressService: contract.addressService,
      applicant: contract.applicant ? {
        id: contract.applicant.id,
        nome: contract.applicant.nome,
        cpf: contract.applicant.cpf,
        renda: contract.applicant.renda,
        score: contract.applicant.score
      } : undefined,
      product: contract.product ? {
        id: contract.product.id,
        nome: contract.product.nome,
        taxaMesBase: contract.product.taxaMesBase,
        minParcelas: contract.product.minParcelas,
        maxParcelas: contract.product.maxParcelas,
        cetInfo: contract.product.cetInfo
      } : undefined
    };
  }

  static toContractDetailResponseDtoArray(contracts: Contract[]): ContractDetailResponseDtoType[] {
    return contracts.map(this.toContractDetailResponseDto);
  }

  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  static formatPercentage(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
  }

  static formatDate(date: Date | string | null | undefined): string {
    if (!date) {
      return 'Data não disponível';
    }
    
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return 'Data inválida';
    }
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  }

  static formatCep(cep: string): string {
    const cleanCep = cep.replace(/\D/g, '');
    return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
  }
}
