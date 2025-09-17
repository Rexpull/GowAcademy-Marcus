import { calcParcela } from '../core/domain/rules/price';

describe('calcParcela', () => {
  describe('Taxa zero: divisão exata', () => {
    it('deve calcular parcela corretamente quando taxa é zero', () => {
      const valor = 1000;
      const taxaMes = 0;
      const n = 10;
      
      const parcela = calcParcela(valor, taxaMes, n);
      
      expect(parcela).toBe(100);
    });

    it('deve calcular parcela com divisão exata para valores diferentes', () => {
      const valor = 1500;
      const taxaMes = 0;
      const n = 5;
      
      const parcela = calcParcela(valor, taxaMes, n);
      
      expect(parcela).toBe(300); 
    });

    it('deve arredondar corretamente quando divisão não é exata', () => {
      const valor = 1000;
      const taxaMes = 0;
      const n = 3;
      
      const parcela = calcParcela(valor, taxaMes, n);
      
      expect(parcela).toBeCloseTo(333.33, 2); 
    });
  });

  describe('Taxa positiva: cálculo Price', () => {
    it('deve calcular parcela usando fórmula da Tabela Price', () => {
      const valor = 1000;
      const taxaMes = 0.01; 
      const n = 12;
      
      const parcela = calcParcela(valor, taxaMes, n);
      
      expect(parcela).toBe(88.85);
    });

    it('deve calcular parcela com taxa maior', () => {
      const valor = 5000;
      const taxaMes = 0.02; 
      const n = 24;
      
      const parcela = calcParcela(valor, taxaMes, n);

      expect(parcela).toBeGreaterThan(0);
      expect(parcela).toBeLessThan(5000); 
      expect(Number.isFinite(parcela)).toBe(true);
    });

    it('deve arredondar resultado para 2 casas decimais', () => {
      const valor = 1000;
      const taxaMes = 0.015; 
      const n = 6;
      
      const parcela = calcParcela(valor, taxaMes, n);
      
      const decimalPlaces = (parcela.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });

  describe('Entradas inválidas - erros', () => {
    it('deve lançar erro quando valor <= 0', () => {
      expect(() => {
        calcParcela(0, 0.01, 12);
      }).toThrow('Valor deve ser positivo');

      expect(() => {
        calcParcela(-100, 0.01, 12);
      }).toThrow('Valor deve ser positivo');
    });

    it('deve lançar erro quando parcelas <= 0', () => {
      expect(() => {
        calcParcela(1000, 0.01, 0);
      }).toThrow('Número de parcelas deve ser positivo');

      expect(() => {
        calcParcela(1000, 0.01, -5);
      }).toThrow('Número de parcelas deve ser positivo');
    });

    it('deve lançar erro quando taxa < 0', () => {
      expect(() => {
        calcParcela(1000, -0.01, 12);
      }).toThrow('Taxa mensal deve ser positiva');
    });

    it('deve aceitar taxa zero (sem juros)', () => {
      const valor = 1000;
      const taxaMes = 0; 
      const n = 10;
      
      const parcela = calcParcela(valor, taxaMes, n);
      
      expect(parcela).toBe(100);
    });
  });

  describe('Cenários de borda', () => {
    it('deve funcionar com 1 parcela', () => {
      const valor = 1000;
      const taxaMes = 0.01;
      const n = 1;
      
      const parcela = calcParcela(valor, taxaMes, n);
      
      expect(parcela).toBe(1010); 
    });

    it('deve funcionar com taxa muito pequena', () => {
      const valor = 1000;
      const taxaMes = 0.0001; 
      const n = 12;
      
      const parcela = calcParcela(valor, taxaMes, n);
      
      expect(parcela).toBeGreaterThan(83.33); 
      expect(parcela).toBeLessThan(84); 
    });

    it('deve funcionar com muitas parcelas', () => {
      const valor = 10000;
      const taxaMes = 0.01;
      const n = 120; 
      
      const parcela = calcParcela(valor, taxaMes, n);
      
      expect(parcela).toBeGreaterThan(0);
      expect(parcela).toBeLessThan(10000);
      expect(Number.isFinite(parcela)).toBe(true);
    });
  });
});
