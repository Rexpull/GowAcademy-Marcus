# GowAcademy Loans - Sistema de Empréstimos

Sistema completo de empréstimos desenvolvido com **Next.js 14**, **TypeScript**, **Prisma** e **PostgreSQL**, seguindo a **Arquitetura de Cebola (Onion Architecture)**.

## 🏗️ Arquitetura

### Diagrama da Arquitetura de Cebola

```
┌─────────────────────────────────────────────────────────────┐
│                        WEB LAYER                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Páginas       │  │   Rotas API     │  │  Componentes│ │
│  │   (Next.js)     │  │   (App Router)  │  │   (React)   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    INTERFACE LAYER                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │      DTOs       │  │     Mappers     │  │   Errors    │ │
│  │     (Zod)       │  │   (Transform)   │  │   (HTTP)    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Gateways      │  │  Repositories   │  │  Database   │ │
│  │ (BrasilAPI)     │  │   (Prisma)      │  │ (PostgreSQL)│ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ AddressService  │  │ApplicantService │  │ LoanService │ │
│  │ CreditService   │  │                 │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Entities      │  │   Value Objects │  │   Rules     │ │
│  │ (Product, etc)  │  │   (Address)     │  │ (Business)  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │    Ports        │  │   Interfaces    │  │   Types     │ │
│  │ (Repositories)  │  │   (Gateways)    │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Camadas da Arquitetura

#### 1. **DOMAIN LAYER** (Mais Interna)
- **Entidades**: Product, Address, Applicant, Contract, Offer
- **Value Objects**: Endereços normalizados
- **Regras de Negócio**: Validação de CPF, cálculo de parcelas (Tabela Price), geração de ofertas
- **Portas**: Interfaces para repositórios e gateways externos

#### 2. **APPLICATION LAYER**
- **Services**: AddressService, ApplicantService, CreditService, LoanService
- **Casos de Uso**: Cadastro de solicitantes, geração de ofertas, simulação e contratação

#### 3. **INFRASTRUCTURE LAYER**
- **Gateways**: Integração com BrasilAPI (CEP e CDI)
- **Repositories**: Implementações Prisma para persistência
- **Database**: PostgreSQL com Prisma ORM

#### 4. **INTERFACE LAYER**
- **DTOs**: Validação com Zod
- **Mappers**: Transformação entre camadas
- **Error Handling**: Tratamento de erros HTTP

#### 5. **WEB LAYER** (Mais Externa)
- **Páginas**: Landing, Cadastro, Ofertas, Simulação, Sucesso
- **API Routes**: Endpoints RESTful
- **UI**: Interface responsiva com Tailwind CSS

## 🚀 Tecnologias

- **Frontend/Backend**: Next.js 14 (App Router)
- **Linguagem**: TypeScript (strict mode)
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Validação**: Zod
- **Estilização**: Tailwind CSS
- **Containerização**: Docker & Docker Compose
- **Integrações**: BrasilAPI (CEP e CDI)

## 📋 Funcionalidades

### ✅ Implementadas

1. **Landing Page**: Lista produtos disponíveis
2. **Cadastro**: Validação de CPF, consulta de CEP via BrasilAPI
3. **Normalização de Endereços**: Tabela Address com reutilização
4. **Motor de Crédito**: Geração de 3 ofertas baseadas em renda/score
5. **Simulação**: Cálculo com Tabela Price + taxa CDI atual
6. **Contratação**: Persistência com snapshot de endereço
7. **Tela de Sucesso**: Exibição completa do contrato

### 🔄 Fluxo Completo

1. **Landing** → Lista 3 produtos (Basic, Plus, Pro)
2. **Cadastro** → Nome, CPF, CEP, renda
3. **Validação** → CPF + consulta CEP (BrasilAPI)
4. **Ofertas** → 3 opções baseadas em 30% da renda
5. **Simulação** → Valor + parcelas + taxa CDI
6. **Contratação** → Status "PENDENTE" + snapshot endereço
7. **Sucesso** → Resumo completo do contrato

## 🛠️ Configuração e Execução

### Pré-requisitos

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (via Docker)

### 1. Configuração Inicial

```bash
# Clone o repositório
git clone <repository-url>
cd GowAcademy

# Copie o arquivo de ambiente
cp env.example .env

# Edite as variáveis se necessário
nano .env
```

### 2. Execução com Docker

```bash
# Subir PostgreSQL
docker compose up -d postgres

# Instalar dependências
npm install

# Configurar banco de dados
npm run db:push
npm run db:seed

# Executar aplicação
npm run dev
```

### 3. Execução Local (sem Docker)

```bash
# Instalar dependências
npm install

# Configurar PostgreSQL local
# Editar DATABASE_URL no .env

# Configurar banco
npm run db:push
npm run db:seed

# Executar
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Rotas API
│   ├── cadastro/          # Página de cadastro
│   ├── ofertas/           # Página de ofertas
│   ├── simulacao/         # Página de simulação
│   ├── sucesso/           # Página de sucesso
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Landing page
├── core/                  # CORE (Domain + Application)
│   ├── domain/            # Entidades, regras, portas
│   └── application/       # Services (casos de uso)
├── infra/                 # INFRASTRUCTURE
│   ├── database/          # Prisma client
│   ├── gateways/          # Integrações externas
│   ├── repositories/      # Implementações Prisma
│   ├── container.ts       # Injeção de dependência
│   ├── env.ts            # Validação de ambiente
│   └── logger.ts         # Sistema de logs
├── interface/             # INTERFACE
│   ├── dto/              # DTOs com Zod
│   ├── mappers/          # Transformadores
│   └── http/             # Tratamento de erros
└── web/                  # WEB (UI + API)
    ├── components/       # Componentes React
    └── pages/           # Páginas (se necessário)
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Executa em modo desenvolvimento
npm run build            # Build para produção
npm run start            # Executa build de produção

# Banco de Dados
npm run db:push          # Aplica schema Prisma
npm run db:seed          # Popula banco com dados demo
npm run db:studio        # Interface visual do Prisma

# Qualidade
npm run lint             # ESLint
npm run type-check       # Verificação TypeScript
```

## 🌐 Integrações Externas

### BrasilAPI

#### CEP (Consulta de Endereços)
- **Endpoint**: `https://brasilapi.com.br/api/cep/v2/{cep}`
- **Uso**: Normalização de endereços
- **Fallback**: ViaCEP (se necessário)

#### CDI (Taxa de Juros)
- **Endpoint**: `https://brasilapi.com.br/api/taxas/v1/cdi`
- **Conversão**: Taxa anual → mensal
- **Fórmula**: `(1 + taxa_anual)^(1/12) - 1`

### Configuração de Endpoints

```env
# BrasilAPI
BRASILAPI_BASE_URL="https://brasilapi.com.br"
BRASILAPI_CEP_PATH="/api/cep/v2"
BRASILAPI_CDI_PATH="/api/taxas/v1/cdi"

# Timeout
REQUEST_TIMEOUT_MS=3000
```

## 📊 Modelos de Dados

### Address (Normalizado)
```sql
- id: String (CUID)
- cep: String (8 dígitos)
- state: String (UF)
- city: String
- neighborhood: String
- street: String
- service: String (origem: "brasilapi", "viacep")
- createdAt: DateTime
```

### Applicant
```sql
- id: String (CUID)
- nome: String
- cpf: String (único)
- renda: Float
- score: Int (0-1000, default: 600)
- addressId: String (FK)
- createdAt: DateTime
```

### Product
```sql
- id: String (CUID)
- nome: String
- taxaMesBase: Float
- minParcelas: Int
- maxParcelas: Int
- cetInfo: String
- createdAt: DateTime
```

### Contract (com Snapshot)
```sql
- id: String (CUID)
- applicantId: String (FK)
- productId: String (FK)
- valor: Float
- parcelas: Int
- taxaEfetivaMes: Float
- parcelaCalculada: Float
- status: String ("PENDENTE", "APROVADO", "REPROVADO")
- createdAt: DateTime
- addressCep: String (snapshot)
- addressState: String (snapshot)
- addressCity: String (snapshot)
- addressNeighborhood: String (snapshot)
- addressStreet: String (snapshot)
- addressService: String (snapshot)
```

## 🧮 Regras de Negócio

### Validação de CPF
- Algoritmo completo com dígitos verificadores
- Rejeição de CPFs com todos os dígitos iguais
- Formatação automática

### Cálculo de Parcelas (Tabela Price)
```typescript
// Fórmula: PMT = PV * [i * (1 + i)^n] / [(1 + i)^n - 1]
const parcela = valor * (taxaMes * Math.pow(1 + taxaMes, parcelas)) / 
                (Math.pow(1 + taxaMes, parcelas) - 1);
```

### Geração de Ofertas
- **Conservadora**: 15% da renda
- **Moderada**: 25% da renda  
- **Máxima**: 30% da renda
- **Multiplicador por Score**: 0.5x a 1.5x

### Conversão CDI
```typescript
// Taxa anual → mensal
const cdiMensal = Math.pow(1 + cdiAnual, 1/12) - 1;
// Taxa efetiva = taxa base + ajuste CDI
const taxaEfetiva = produto.taxaMesBase + cdiMensal;
```

## 🎯 Critérios de Aceitação

### ✅ Implementados

- [x] App sobe com Docker Compose
- [x] Landing lista 3 produtos do banco
- [x] Cadastro cria Applicant vinculando Address real
- [x] Ofertas exibem 3 valores coerentes
- [x] Simulação usa CDI atual + Tabela Price
- [x] Contratação persiste Contract com snapshot
- [x] Tela de sucesso exibe dados completos
- [x] README com diagrama da arquitetura

### 🔄 Fluxo de Teste

1. **Acesse**: `http://localhost:3000`
2. **Escolha**: Um produto na landing
3. **Preencha**: Cadastro com CPF/CEP válidos
4. **Visualize**: 3 ofertas geradas
5. **Simule**: Valor e parcelas desejados
6. **Contrate**: Empréstimo
7. **Confirme**: Dados na tela de sucesso

## 🚀 Deploy

### Docker Production

```bash
# Build da imagem
docker build -t gowacademy-loans .

# Executar com docker-compose
docker compose up -d
```

### Variáveis de Ambiente Produção

```env
DATABASE_URL="postgresql://user:pass@host:5432/loans"
BRASILAPI_BASE_URL="https://brasilapi.com.br"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais e demonstração da Arquitetura de Cebola.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para GowAcademy**
