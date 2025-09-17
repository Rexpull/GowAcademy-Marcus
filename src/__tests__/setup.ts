// Configuração global para os testes
// Este arquivo é executado antes de cada teste

// Configurações globais do Jest podem ser adicionadas aqui

// Adiciona um teste vazio para evitar erro do Jest
describe('Setup', () => {
  it('should load setup file', () => {
    expect(true).toBe(true);
  });
});
