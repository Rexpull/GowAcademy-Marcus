import { Product } from '../entities/Product';

export interface IProductRepository {
  /**
   * Cria um novo produto
   * @param product Dados do produto
   * @returns Produto criado
   */
  create(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product>;

  /**
   * Busca produto por ID
   * @param id ID do produto
   * @returns Produto encontrado ou null
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Lista todos os produtos
   * @returns Array de produtos
   */
  findAll(): Promise<Product[]>;

  /**
   * Atualiza dados do produto
   * @param id ID do produto
   * @param data Dados para atualizar
   * @returns Produto atualizado
   */
  update(id: string, data: Partial<Product>): Promise<Product>;
}
