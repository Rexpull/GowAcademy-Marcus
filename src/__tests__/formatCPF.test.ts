import { formatCPF } from '../core/domain/rules/cpf';

describe('formatCPF', () => {
  describe('Formata 11 dígitos 52998224725 → 529.982.247-25', () => {
    it('deve formatar CPF com 11 dígitos corretamente', () => {
      const cpf = '52998224725';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('529.982.247-25');
    });

    it('deve formatar CPF com 11 dígitos e caracteres especiais', () => {
      const cpf = '529.982.247-25';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('529.982.247-25');
    });

    it('deve formatar CPF com espaços e caracteres especiais', () => {
      const cpf = '529 982 247 25';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('529.982.247-25');
    });

    it('deve formatar CPF com hífens e pontos misturados', () => {
      const cpf = '529.982-247.25';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('529.982.247-25');
    });
  });

  describe('Entrada já formatada mantém formato (idempotência)', () => {
    it('deve manter formato quando CPF já está formatado corretamente', () => {
      const cpf = '529.982.247-25';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('529.982.247-25');
    });

    it('deve manter formato após múltiplas chamadas', () => {
      const cpf = '529.982.247-25';
      const resultado1 = formatCPF(cpf);
      const resultado2 = formatCPF(resultado1);
      const resultado3 = formatCPF(resultado2);
      
      expect(resultado1).toBe('529.982.247-25');
      expect(resultado2).toBe('529.982.247-25');
      expect(resultado3).toBe('529.982.247-25');
    });

    it('deve manter formato com diferentes CPFs já formatados', () => {
      const cpfs = [
        '123.456.789-01',
        '987.654.321-00',
        '111.222.333-44'
      ];
      
      cpfs.forEach(cpf => {
        const resultado = formatCPF(cpf);
        expect(resultado).toBe(cpf);
      });
    });
  });

  describe('Entrada ≠ 11 dígitos retorna como veio', () => {
    it('deve retornar string vazia quando entrada é vazia', () => {
      const cpf = '';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('');
    });

    it('deve retornar como veio quando tem menos de 11 dígitos', () => {
      const cpf = '123456789';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('123456789');
    });

    it('deve retornar como veio quando tem mais de 11 dígitos', () => {
      const cpf = '123456789012';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('123456789012');
    });

    it('deve retornar como veio quando tem exatamente 10 dígitos', () => {
      const cpf = '1234567890';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('1234567890');
    });

    it('deve retornar como veio quando tem exatamente 12 dígitos', () => {
      const cpf = '123456789012';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('123456789012');
    });
  });

  describe('Cenários especiais', () => {
    it('deve lidar com entrada null/undefined', () => {
      expect(formatCPF(null as any)).toBe('');
      expect(formatCPF(undefined as any)).toBe('');
    });

    it('deve lidar com entrada que não é string', () => {
      expect(formatCPF(12345678901 as any)).toBe('123.456.789-01');
      expect(formatCPF(true as any)).toBe('true');
    });

    it('deve remover todos os caracteres não numéricos antes de verificar tamanho', () => {
      const cpf = 'abc529def982ghi247jkl25mno';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('529.982.247-25');
    });

    it('deve lidar com CPF com zeros à esquerda', () => {
      const cpf = '01234567890';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('012.345.678-90');
    });

    it('deve lidar com CPF que contém apenas caracteres especiais', () => {
      const cpf = '...---...--';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('...---...--');
    });
  });

  describe('Casos de borda', () => {
    it('deve funcionar com exatamente 11 caracteres não numéricos', () => {
      const cpf = 'abcdefghijk';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('abcdefghijk');
    });

    it('deve funcionar com mistura de dígitos e caracteres especiais totalizando 11 dígitos', () => {
      const cpf = 'a5b2c9d9e8f2g4h7i2j5k';
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe('a5b2c9d9e8f2g4h7i2j5k');
    });

    it('deve funcionar com string muito longa', () => {
      const cpf = '52998224725' + '0'.repeat(100);
      const resultado = formatCPF(cpf);
      
      expect(resultado).toBe(cpf);
    });
  });
});
