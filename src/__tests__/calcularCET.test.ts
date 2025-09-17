import { calcularCET } from '../core/domain/rules/price';

describe('calcularCET', () => {
  describe('CET básico = (total - principal) / principal', () => {
    it('deve calcular CET corretamente para empréstimo simples', () => {
      const principal = 1000;
      const n = 12;
      const parcela = 100; // Total = 1200
      
      const cet = calcularCET(principal, n, parcela);
      
      // CET = ((1200 - 1000) / 1000) * 100 = 20%
      expect(cet).toBe(20);
    });

    it('deve calcular CET com juros altos', () => {
      const principal = 1000;
      const n = 6;
      const parcela = 200; // Total = 1200
      
      const cet = calcularCET(principal, n, parcela);
      
      // CET = ((1200 - 1000) / 1000) * 100 = 20%
      expect(cet).toBe(20);
    });

    it('deve calcular CET com juros baixos', () => {
      const principal = 1000;
      const n = 10;
      const parcela = 105; // Total = 1050
      
      const cet = calcularCET(principal, n, parcela);
      
      // CET = ((1050 - 1000) / 1000) * 100 = 5%
      expect(cet).toBe(5);
    });

    it('deve calcular CET com valores decimais', () => {
      const principal = 1500;
      const n = 8;
      const parcela = 200; // Total = 1600
      
      const cet = calcularCET(principal, n, parcela);
      
      // CET = ((1600 - 1500) / 1500) * 100 = 6.67%
      expect(cet).toBe(6.67);
    });
  });

  describe('Arredondamento', () => {
    it('deve arredondar CET para 2 casas decimais', () => {
      const principal = 1000;
      const n = 3;
      const parcela = 350; // Total = 1050
      
      const cet = calcularCET(principal, n, parcela);
      
      // CET = ((1050 - 1000) / 1000) * 100 = 5%
      // Verifica se tem no máximo 2 casas decimais
      const decimalPlaces = (cet.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    it('deve arredondar corretamente valores com muitas casas decimais', () => {
      const principal = 1000;
      const n = 7;
      const parcela = 150; // Total = 1050
      
      const cet = calcularCET(principal, n, parcela);
      
      // CET = ((1050 - 1000) / 1000) * 100 = 5%
      expect(cet).toBe(5);
    });
  });

  describe('Entradas inválidas - erros', () => {
    it('deve lançar erro quando principal <= 0', () => {
      expect(() => {
        calcularCET(0, 12, 100);
      }).toThrow('Principal deve ser positivo');

      expect(() => {
        calcularCET(-100, 12, 100);
      }).toThrow('Principal deve ser positivo');
    });

    it('deve lançar erro quando n <= 0', () => {
      expect(() => {
        calcularCET(1000, 0, 100);
      }).toThrow('Número de parcelas deve ser positivo');

      expect(() => {
        calcularCET(1000, -5, 100);
      }).toThrow('Número de parcelas deve ser positivo');
    });

    it('deve lançar erro quando parcela <= 0', () => {
      expect(() => {
        calcularCET(1000, 12, 0);
      }).toThrow('Parcela deve ser positiva');

      expect(() => {
        calcularCET(1000, 12, -50);
      }).toThrow('Parcela deve ser positiva');
    });
  });

  describe('Cenários especiais', () => {
    it('deve retornar 0% quando parcela * n = principal (sem juros)', () => {
      const principal = 1000;
      const n = 10;
      const parcela = 100; // Total = 1000
      
      const cet = calcularCET(principal, n, parcela);
      
      // CET = ((1000 - 1000) / 1000) * 100 = 0%
      expect(cet).toBe(0);
    });

    it('deve calcular CET negativo quando parcela * n < principal (desconto)', () => {
      const principal = 1000;
      const n = 10;
      const parcela = 90; // Total = 900
      
      const cet = calcularCET(principal, n, parcela);
      
      // CET = ((900 - 1000) / 1000) * 100 = -10%
      expect(cet).toBe(-10);
    });

    it('deve funcionar com valores muito grandes', () => {
      const principal = 1000000;
      const n = 60;
      const parcela = 25000; // Total = 1500000
      
      const cet = calcularCET(principal, n, parcela);
      
      // CET = ((1500000 - 1000000) / 1000000) * 100 = 50%
      expect(cet).toBe(50);
    });

    it('deve funcionar com 1 parcela', () => {
      const principal = 1000;
      const n = 1;
      const parcela = 1100; // Total = 1100
      
      const cet = calcularCET(principal, n, parcela);
      
      // CET = ((1100 - 1000) / 1000) * 100 = 10%
      expect(cet).toBe(10);
    });
  });
});
