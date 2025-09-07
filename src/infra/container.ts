import { AddressService } from '../core/application/services/AddressService';
import { ApplicantService } from '../core/application/services/ApplicantService';
import { CreditService } from '../core/application/services/CreditService';
import { LoanService } from '../core/application/services/LoanService';

// Repositories
import { PrismaAddressRepository } from './repositories/AddressRepository';
import { PrismaApplicantRepository } from './repositories/ApplicantRepository';
import { PrismaProductRepository } from './repositories/ProductRepository';
import { PrismaContractRepository } from './repositories/ContractRepository';

// Gateways
import { BrasilApiCepGateway } from './gateways/brasilapi/CepGateway';
import { BrasilApiCdiGateway } from './gateways/brasilapi/CdiGateway';

// Interfaces
import { IAddressRepository } from '../core/domain/ports/IAddressRepository';
import { IApplicantRepository } from '../core/domain/ports/IApplicantRepository';
import { IProductRepository } from '../core/domain/ports/IProductRepository';
import { IContractRepository } from '../core/domain/ports/IContractRepository';
import { ICepGateway } from '../core/domain/ports/ICepGateway';
import { ICdiGateway } from '../core/domain/ports/ICdiGateway';

class Container {
  private static instance: Container;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.initializeServices();
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private initializeServices(): void {
    // Repositories
    this.services.set('addressRepository', new PrismaAddressRepository());
    this.services.set('applicantRepository', new PrismaApplicantRepository());
    this.services.set('productRepository', new PrismaProductRepository());
    this.services.set('contractRepository', new PrismaContractRepository());

    // Gateways
    this.services.set('cepGateway', new BrasilApiCepGateway());
    this.services.set('cdiGateway', new BrasilApiCdiGateway());

    // Services
    this.services.set('addressService', new AddressService(
      this.get<IAddressRepository>('addressRepository'),
      this.get<ICepGateway>('cepGateway')
    ));

    this.services.set('applicantService', new ApplicantService(
      this.get<IApplicantRepository>('applicantRepository'),
      this.get<AddressService>('addressService')
    ));

    this.services.set('creditService', new CreditService(
      this.get<IProductRepository>('productRepository'),
      this.get<IApplicantRepository>('applicantRepository')
    ));

    this.services.set('loanService', new LoanService(
      this.get<IProductRepository>('productRepository'),
      this.get<IApplicantRepository>('applicantRepository'),
      this.get<IContractRepository>('contractRepository'),
      this.get<IAddressRepository>('addressRepository'),
      this.get<ICdiGateway>('cdiGateway')
    ));
  }

  public get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Serviço não encontrado: ${serviceName}`);
    }
    return service as T;
  }

  // Getters para facilitar o acesso aos serviços
  public getAddressService(): AddressService {
    return this.get<AddressService>('addressService');
  }

  public getApplicantService(): ApplicantService {
    return this.get<ApplicantService>('applicantService');
  }

  public getCreditService(): CreditService {
    return this.get<CreditService>('creditService');
  }

  public getLoanService(): LoanService {
    return this.get<LoanService>('loanService');
  }

  public getAddressRepository(): IAddressRepository {
    return this.get<IAddressRepository>('addressRepository');
  }

  public getApplicantRepository(): IApplicantRepository {
    return this.get<IApplicantRepository>('applicantRepository');
  }

  public getProductRepository(): IProductRepository {
    return this.get<IProductRepository>('productRepository');
  }

  public getContractRepository(): IContractRepository {
    return this.get<IContractRepository>('contractRepository');
  }

  public getCepGateway(): ICepGateway {
    return this.get<ICepGateway>('cepGateway');
  }

  public getCdiGateway(): ICdiGateway {
    return this.get<ICdiGateway>('cdiGateway');
  }
}

export const container = Container.getInstance();
export default container;
