import { calcularCET } from '../core/domain/rules/price';

describe('calcularCET', () => {
  describe('CET básico = (total - principal) / principal', () => {
    it('deve calcular CET corretamente para empréstimo simples', () => {
      const principal = 1000;
      const n = 12;
      const parcela = 100; 
      
      const cet = calcularCET(principal, n, parcela);
      
      expect(cet).toBe(20);
    });

    it('deve calcular CET com juros altos', () => {
      const principal = 1000;
      const n = 6;
      const parcela = 200; 
      
      const cet = calcularCET(principal, n, parcela);
      
      expect(cet).toBe(20);
    });

    it('deve calcular CET com juros baixos', () => {
      const principal = 1000;
      const n = 10;
      const parcela = 105; 
      
      const cet = calcularCET(principal, n, parcela);
      
      expect(cet).toBe(5);
    });

    it('deve calcular CET com valores decimais', () => {
      const principal = 1500;
      const n = 8;
      const parcela = 200; 
      
      const cet = calcularCET(principal, n, parcela);
      
      expect(cet).toBe(6.67);
    });
  });

  describe('Arredondamento', () => {
    it('deve arredondar CET para 2 casas decimais', () => {
      const principal = 1000;
      const n = 3;
      const parcela = 350; 
      
      const cet = calcularCET(principal, n, parcela);
      const decimalPlaces = (cet.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    it('deve arredondar corretamente valores com muitas casas decimais', () => {
      const principal = 1000;
      const n = 7;
      const parcela = 150; 
      
      const cet = calcularCET(principal, n, parcela);
      
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
      const parcela = 100; 
      
      const cet = calcularCET(principal, n, parcela);
      
      expect(cet).toBe(0);
    });

    it('deve calcular CET negativo quando parcela * n < principal (desconto)', () => {
      const principal = 1000;
      const n = 10;
      const parcela = 90; 
      
      const cet = calcularCET(principal, n, parcela);
      
      expect(cet).toBe(-10);
    });

    it('deve funcionar com valores muito grandes', () => {
      const principal = 1000000;
      const n = 60;
      const parcela = 25000; 
      
      const cet = calcularCET(principal, n, parcela);
      
      expect(cet).toBe(50);
    });

    it('deve funcionar com 1 parcela', () => {
      const principal = 1000;
      const n = 1;
      const parcela = 1100; 
      
      const cet = calcularCET(principal, n, parcela);
      
      expect(cet).toBe(10);
    });
  });
});
