#!/bin/bash

# Script para build do Docker com variáveis de ambiente

echo "🚀 Building Docker image with environment variables..."

docker compose build app \
  --build-arg DATABASE_URL="postgresql://postgres:postgres@postgres:5432/loans?schema=public" \
  --build-arg BRASILAPI_BASE_URL="https://brasilapi.com.br" \
  --build-arg BRASILAPI_CEP_PATH="/api/cep/v2" \
  --build-arg BRASILAPI_CDI_PATH="/api/taxas/v1/cdi" \
  --build-arg REQUEST_TIMEOUT_MS="3000" \
  --build-arg NEXTAUTH_SECRET="your-secret-key-here" \
  --build-arg NEXTAUTH_URL="http://localhost:3005"

if [ $? -eq 0 ]; then
    echo "✅ Docker build completed successfully!"
    echo "📝 To run the application:"
    echo "   docker compose up -d postgres"
    echo "   docker compose up app"
    echo ""
    echo "🌐 Application will be available at: http://localhost:3005"
else
    echo "❌ Docker build failed!"
    exit 1
fi
