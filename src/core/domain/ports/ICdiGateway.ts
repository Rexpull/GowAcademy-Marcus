export interface ICdiGateway {
  /**
   * Obtém o índice CDI atual
   * @returns Taxa CDI atual (em decimal, ex: 0.12 para 12% ao ano)
   */
  getCurrentCdiIndex(): Promise<number>;
}
