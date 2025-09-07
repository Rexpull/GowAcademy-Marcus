import { ICdiGateway } from '../../../core/domain/ports/ICdiGateway';
import { env } from '../../env';
import { logger } from '../../logger';

export class BrasilApiCdiGateway implements ICdiGateway {
  private readonly baseUrl: string;
  private readonly cdiPath: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = env.BRASILAPI_BASE_URL;
    this.cdiPath = env.BRASILAPI_CDI_PATH;
    this.timeout = env.REQUEST_TIMEOUT_MS;
  }

  async getCurrentCdiIndex(): Promise<number> {
    try {
      const url = `${this.baseUrl}${this.cdiPath}`;
      logger.info('Consultando taxa CDI atual via BrasilAPI');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'GowAcademy-Loans/1.0'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      let cdiValue: number;

      if (Array.isArray(data)) {
        // Se retorna array, pega o último valor
        const lastItem = data[data.length - 1];
        cdiValue = this.extractCdiValue(lastItem);
      } else if (data.valor !== undefined) {
        cdiValue = this.extractCdiValue(data);
      } else {
        throw new Error('Formato de resposta da API não reconhecido');
      }

      if (cdiValue > 1) {
        cdiValue = cdiValue / 100;
      }

      logger.info(`Taxa CDI obtida: ${(cdiValue * 100).toFixed(2)}% ao ano`);
      return cdiValue;

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          logger.error('Timeout ao consultar taxa CDI');
          throw new Error('Timeout na consulta da taxa CDI');
        }
        logger.error('Erro ao consultar taxa CDI', error.message);
        throw new Error(`Erro ao consultar taxa CDI: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Extrai o valor da taxa CDI de um objeto de resposta
   * @param item Item da resposta da API
   * @returns Valor da taxa CDI
   */
  private extractCdiValue(item: any): number {
    const possibleFields = ['valor', 'taxa', 'rate', 'cdi', 'value'];
    
    for (const field of possibleFields) {
      if (item[field] !== undefined && typeof item[field] === 'number') {
        return item[field];
      }
    }

    const values = Object.values(item).filter(v => typeof v === 'number');
    if (values.length > 0) {
      return values[0] as number;
    }

    throw new Error('Não foi possível extrair o valor da taxa CDI da resposta');
  }
}
