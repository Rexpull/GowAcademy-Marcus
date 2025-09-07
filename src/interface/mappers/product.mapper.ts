import { Product } from '../../core/domain/entities/Product';
import { ProductResponseDtoType } from '../dto/product.dto';

export class ProductMapper {
  static toResponseDto(product: Product): ProductResponseDtoType {
    return {
      id: product.id,
      nome: product.nome,
      taxaMesBase: product.taxaMesBase,
      minParcelas: product.minParcelas,
      maxParcelas: product.maxParcelas,
      cetInfo: product.cetInfo,
      createdAt: product.createdAt
    };
  }

  static toResponseDtoArray(products: Product[]): ProductResponseDtoType[] {
    return products.map(this.toResponseDto);
  }

  static formatTaxa(taxa: number): string {
    return `${(taxa * 100).toFixed(2)}% ao mês`;
  }

  static formatParcelas(min: number, max: number): string {
    if (min === max) {
      return `${min} parcelas`;
    }
    return `${min} a ${max} parcelas`;
  }

  static getProductDescription(product: Product): string {
    return `${product.nome} - ${this.formatTaxa(product.taxaMesBase)} - ${this.formatParcelas(product.minParcelas, product.maxParcelas)}`;
  }
}
