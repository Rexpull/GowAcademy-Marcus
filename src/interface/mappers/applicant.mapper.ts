import { Applicant } from '../../core/domain/entities/Applicant';
import { ApplicantResponseDtoType } from '../dto/applicant.dto';

export class ApplicantMapper {
  static toResponseDto(applicant: Applicant): ApplicantResponseDtoType {
    return {
      id: applicant.id,
      nome: applicant.nome,
      cpf: applicant.cpf,
      renda: applicant.renda,
      score: applicant.score,
      addressId: applicant.addressId,
      createdAt: applicant.createdAt,
      address: applicant.address ? {
        id: applicant.address.id,
        cep: applicant.address.cep,
        state: applicant.address.state,
        city: applicant.address.city,
        neighborhood: applicant.address.neighborhood,
        street: applicant.address.street,
        service: applicant.address.service,
        createdAt: applicant.address.createdAt
      } : undefined
    };
  }

  static toResponseDtoArray(applicants: Applicant[]): ApplicantResponseDtoType[] {
    return applicants.map(this.toResponseDto);
  }

  static formatCpf(cpf: string): string {
    const cleanCpf = cpf.replace(/\D/g, '');
    return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-${cleanCpf.slice(9)}`;
  }

  static formatRenda(renda: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(renda);
  }
}
