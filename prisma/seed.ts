import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.contract.deleteMany();
  await prisma.applicant.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();

  console.log('🧹 Dados existentes removidos');

  // Criar produtos
  const products = await Promise.all([
    prisma.product.create({
      data: {
        nome: 'Empréstimo Basic',
        taxaMesBase: 0.015, // 1.5% ao mês
        minParcelas: 6,
        maxParcelas: 24,
        cetInfo: 'Taxa de juros de 1.5% ao mês. Ideal para necessidades básicas de crédito.'
      }
    }),
    prisma.product.create({
      data: {
        nome: 'Empréstimo Plus',
        taxaMesBase: 0.019, // 1.9% ao mês
        minParcelas: 6,
        maxParcelas: 36,
        cetInfo: 'Taxa de juros de 1.9% ao mês. Produto intermediário com maior flexibilidade.'
      }
    }),
    prisma.product.create({
      data: {
        nome: 'Empréstimo Pro',
        taxaMesBase: 0.024, // 2.4% ao mês
        minParcelas: 12,
        maxParcelas: 48,
        cetInfo: 'Taxa de juros de 2.4% ao mês. Produto premium com prazos estendidos.'
      }
    })
  ]);

  console.log('✅ Produtos criados:', products.map(p => p.nome));

  // Criar endereço demo
  const address = await prisma.address.create({
    data: {
      cep: '89010025',
      state: 'SC',
      city: 'Blumenau',
      neighborhood: 'Centro',
      street: 'Rua Doutor Luiz de Freitas Melro',
      service: 'brasilapi'
    }
  });

  console.log('✅ Endereço demo criado:', address.city, '/', address.state);

  // Criar solicitante demo
  const applicant = await prisma.applicant.create({
    data: {
      nome: 'João Silva Demo',
      cpf: '12345678901',
      renda: 5000.00,
      score: 700,
      addressId: address.id
    }
  });

  console.log('✅ Solicitante demo criado:', applicant.nome);

  // Criar contrato demo
  const contract = await prisma.contract.create({
    data: {
      applicantId: applicant.id,
      productId: products[1].id, // Empréstimo Plus
      valor: 10000.00,
      parcelas: 12,
      taxaEfetivaMes: 0.025, // 2.5% ao mês (taxa base + CDI)
      parcelaCalculada: 950.00,
      status: 'PENDENTE',
      // Snapshot do endereço
      addressCep: address.cep,
      addressState: address.state,
      addressCity: address.city,
      addressNeighborhood: address.neighborhood,
      addressStreet: address.street,
      addressService: address.service
    }
  });

  console.log('✅ Contrato demo criado:', contract.id);

  console.log('🎉 Seed concluído com sucesso!');
  console.log('\n📊 Resumo:');
  console.log(`- ${products.length} produtos criados`);
  console.log(`- 1 endereço criado`);
  console.log(`- 1 solicitante criado`);
  console.log(`- 1 contrato criado`);
  console.log('\n🔗 Dados de acesso:');
  console.log(`- Solicitante: ${applicant.nome} (CPF: ${applicant.cpf})`);
  console.log(`- Endereço: ${address.street}, ${address.neighborhood}, ${address.city} - ${address.state}`);
  console.log(`- Contrato: ${contract.id} (Status: ${contract.status})`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
