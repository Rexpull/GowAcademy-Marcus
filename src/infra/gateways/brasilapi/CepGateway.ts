import { ICepGateway, AddressLike } from '../../../core/domain/ports/ICepGateway';
import { env } from '../../env';
import { logger } from '../../logger';

export class BrasilApiCepGateway implements ICepGateway {
  private readonly baseUrl: string;
  private readonly cepPath: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = env.BRASILAPI_BASE_URL;
    this.cepPath = env.BRASILAPI_CEP_PATH;
    this.timeout = env.REQUEST_TIMEOUT_MS;
  }

  async getAddressByZip(zip: string): Promise<AddressLike | null> {
    try {
      const cleanZip = zip.replace(/\D/g, '');
      if (cleanZip.length !== 8) {
        throw new Error('CEP deve ter 8 dígitos');
      }

      const url = `${this.baseUrl}${this.cepPath}/${cleanZip}`;
      logger.info(`Consultando CEP: ${cleanZip} via BrasilAPI`);

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
        if (response.status === 404) {
          logger.warn(`CEP não encontrado: ${cleanZip}`);
          return null;
        }
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Valida se os dados necessários estão presentes
      if (!data.cep || !data.state || !data.city || !data.neighborhood || !data.street) {
        logger.warn(`Dados incompletos para CEP: ${cleanZip}`, data);
        return null;
      }

      const address: AddressLike = {
        cep: data.cep.replace(/\D/g, ''),
        state: data.state.toUpperCase(),
        city: data.city,
        neighborhood: data.neighborhood,
        street: data.street,
        service: 'brasilapi'
      };

      logger.info(`CEP encontrado: ${cleanZip} - ${address.city}/${address.state}`);
      return address;

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          logger.error(`Timeout ao consultar CEP: ${zip}`);
          throw new Error('Timeout na consulta do CEP');
        }
        logger.error(`Erro ao consultar CEP: ${zip}`, error.message);
        throw new Error(`Erro ao consultar CEP: ${error.message}`);
      }
      throw error;
    }
  }
}
