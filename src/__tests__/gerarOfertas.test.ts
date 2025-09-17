import { gerarOfertas } from '../core/domain/rules/offers';
import { ProductEntity } from '../core/domain/entities/Product';

describe('gerarOfertas', () => {
  const mockProduct = new ProductEntity(
    '1',
    'Empréstimo Pessoal',
    0.02, 
    12,   
    60,   
    'CET de 15% a.a.',
    new Date()
  );

  describe('Happy Path - Retorna 3 ofertas (15/25/30% × multiplicador)', () => {
    it('deve retornar 3 ofertas para score alto (800+)', () => {
      const renda = 5000;
      const score = 850;
      
      const ofertas = gerarOfertas(renda, score, mockProduct);
      
      expect(ofertas).toHaveLength(3);
      
      const multiplicador = 1.5;
      
      expect(ofertas[0].valor).toBe(5000 * 0.15 * multiplicador);
      expect(ofertas[0].observacoes).toBe('Oferta conservadora com baixo risco');
      
      expect(ofertas[1].valor).toBe(5000 * 0.25 * multiplicador);
      expect(ofertas[1].observacoes).toBe('Oferta moderada com risco controlado');
      
      expect(ofertas[2].valor).toBe(5000 * 0.30 * multiplicador);
      expect(ofertas[2].observacoes).toBe('Oferta máxima disponível');
    });

    it('deve retornar 3 ofertas para score médio (600-699)', () => {
      const renda = 3000;
      const score = 650;
      
      const ofertas = gerarOfertas(renda, score, mockProduct);
      
      expect(ofertas).toHaveLength(3);
      
      const multiplicador = 1.1;
      
      expect(ofertas[0].valor).toBe(3000 * 0.15 * multiplicador);
      expect(ofertas[1].valor).toBe(3000 * 0.25 * multiplicador);
      expect(ofertas[2].valor).toBe(3000 * 0.30 * multiplicador);
    });
  });

  describe('Multiplicador do score altera valores', () => {
    it('deve aplicar multiplicador 1.5 para score excelente (800+)', () => {
      const renda = 1000;
      const score = 900;
      
      const ofertas = gerarOfertas(renda, score, mockProduct);
      
      expect(ofertas[0].valor).toBe(1000 * 0.15 * 1.5); 
      expect(ofertas[1].valor).toBe(1000 * 0.25 * 1.5); 
      expect(ofertas[2].valor).toBe(1000 * 0.30 * 1.5);
    });

    it('deve aplicar multiplicador 0.5 para score muito ruim (<500)', () => {
      const renda = 1000;
      const score = 300;
      
      const ofertas = gerarOfertas(renda, score, mockProduct);
      
      expect(ofertas[0].valor).toBe(1000 * 0.15 * 0.5); 
      expect(ofertas[1].valor).toBe(1000 * 0.25 * 0.5); 
      expect(ofertas[2].valor).toBe(1000 * 0.30 * 0.5); 
    });

    it('deve aplicar multiplicador 1.3 para score bom (700-799)', () => {
      const renda = 1000;
      const score = 750;
      
      const ofertas = gerarOfertas(renda, score, mockProduct);
      
      expect(ofertas[0].valor).toBe(1000 * 0.15 * 1.3); 
      expect(ofertas[1].valor).toBe(1000 * 0.25 * 1.3); 
      expect(ofertas[2].valor).toBe(1000 * 0.30 * 1.3); 
    });
  });

  describe('Validações de entrada', () => {
    it('deve lançar erro quando renda <= 0', () => {
      expect(() => {
        gerarOfertas(0, 600, mockProduct);
      }).toThrow('Renda deve ser positiva');

      expect(() => {
        gerarOfertas(-100, 600, mockProduct);
      }).toThrow('Renda deve ser positiva');
    });

    it('deve lançar erro quando score fora de 0-1000', () => {
      expect(() => {
        gerarOfertas(1000, -1, mockProduct);
      }).toThrow('Score deve estar entre 0 e 1000');

      expect(() => {
        gerarOfertas(1000, 1001, mockProduct);
      }).toThrow('Score deve estar entre 0 e 1000');
    });

    it('deve lançar erro quando produto ausente', () => {
      expect(() => {
        gerarOfertas(1000, 600, null as any);
      }).toThrow('Produto é obrigatório');

      expect(() => {
        gerarOfertas(1000, 600, undefined as any);
      }).toThrow('Produto é obrigatório');
    });
  });

  describe('Cenários especiais', () => {
    it('deve retornar ofertas mesmo com taxa alta (comportamento atual)', () => {
      const produtoCaro = new ProductEntity(
        '2',
        'Produto Caro',
        0.5, 
        12,
        60,
        'CET muito alto',
        new Date()
      );

      const renda = 1000;
      const score = 600;
      
      const ofertas = gerarOfertas(renda, score, produtoCaro);
      
      expect(ofertas).toHaveLength(3);
      expect(ofertas[0].valor).toBe(1000 * 0.15 * 1.1); 
    });

    it('deve funcionar com score exato nos limites', () => {
      const renda = 1000;
      
      const ofertasScore0 = gerarOfertas(renda, 0, mockProduct);
      expect(ofertasScore0).toHaveLength(3);
      expect(ofertasScore0[0].valor).toBe(1000 * 0.15 * 0.5); 
      
      const ofertasScore1000 = gerarOfertas(renda, 1000, mockProduct);
      expect(ofertasScore1000).toHaveLength(3);
      expect(ofertasScore1000[0].valor).toBe(1000 * 0.15 * 1.5); 
    });
  });
});
