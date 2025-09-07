#!/bin/bash

# Script para executar a aplicação completa no Docker

echo "🚀 Iniciando aplicação GowAcademy Loans no Docker..."

# Build da imagem
echo "📦 Fazendo build da imagem Docker..."
./build-docker.sh

if [ $? -ne 0 ]; then
    echo "❌ Build falhou!"
    exit 1
fi

# Iniciar PostgreSQL
echo "🐘 Iniciando PostgreSQL..."
docker compose up -d postgres

# Aguardar PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
sleep 10

# Iniciar aplicação
echo "🚀 Iniciando aplicação..."
docker compose up -d app

# Aguardar aplicação estar pronta
echo "⏳ Aguardando aplicação estar pronta..."
sleep 10

# Executar migrações
echo "🗄️ Executando migrações do banco..."
docker compose exec app npx prisma db push

# Executar seed
echo "🌱 Populando banco com dados iniciais..."
docker compose exec app npm run db:seed

echo ""
echo "✅ Aplicação iniciada com sucesso!"
echo "🌐 Acesse: http://localhost:3005"
echo ""
echo "📝 Para parar a aplicação:"
echo "   docker compose down"
echo ""
echo "📝 Para ver logs:"
echo "   docker compose logs -f app"
