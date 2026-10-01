#!/bin/bash
# setup.sh — Configura o CinemaApp para desenvolvimento
set -e

echo "🎬 Configurando CinemaApp..."

# ─── App Mobile ────────────────────────────────────────────────────────────────
echo ""
echo "📱 Instalando dependências do app mobile..."
cd CinemaApp
npm install

echo ""
echo "✅ App mobile configurado!"
echo "   Edite src/api/index.ts com o IP do seu backend"
echo "   Depois rode: npx expo start"

# ─── Backend ───────────────────────────────────────────────────────────────────
echo ""
echo "⚙️  Configurando backend NestJS..."
cd ../cinema-nestjs-swagger-main 2>/dev/null || {
  echo "⚠️  Pasta cinema-nestjs-swagger-main não encontrada."
  echo "   Extraia o zip do backend e rode novamente."
  exit 1
}

npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs
npm install -D @types/passport-jwt @types/bcryptjs

echo ""
echo "📦 Copiando módulo de Auth..."
cp -r ../CinemaApp/backend-additions/src/auth src/

echo "📦 Atualizando DTOs e services..."
cp ../CinemaApp/backend-additions/src/ingresso/create-ingresso.dto.ts src/ingresso/dto/create-ingresso.dto.ts
cp ../CinemaApp/backend-additions/src/pedido/create-pedido.dto.ts src/pedido/dto/create-pedido.dto.ts
cp ../CinemaApp/backend-additions/src/pedido/pedido.service.ts src/pedido/pedido.service.ts

echo ""
echo "🗄️  Rodando migration do Prisma..."
echo "   (Lembre de adicionar model Usuario e campo assento no schema.prisma primeiro)"
# npx prisma migrate dev --name add-usuario-assento
# npx prisma generate

echo ""
echo "✅ Backend configurado!"
echo "   Adicione JWT_SECRET no arquivo .env"
echo "   Depois rode: npm run start:dev"
echo ""
echo "🚀 Tudo pronto! Veja o README.md para instruções completas."
