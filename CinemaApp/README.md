# 🎬 CinemaApp — React Native + Expo

Aplicativo mobile completo para compra de ingressos de cinema, construído com **React Native / Expo** consumindo o backend **NestJS + Swagger** existente.

---

## 📱 Funcionalidades

| Feature | Descrição |
|---|---|
| 🔐 **Autenticação** | Login, Cadastro e Recuperação de Senha com JWT |
| 🎬 **Filmes** | Listagem com busca, gênero e classificação etária |
| 🗓️ **Sessões** | Listagem com disponibilidade em tempo real |
| 🪑 **Assentos** | Mapa interativo com seleção de Inteira / Meia |
| 🍿 **Combos** | Seleção de lanches e snacks |
| 💳 **Pagamento** | Revisão do pedido + escolha da forma de pagamento |
| 🎟️ **Comprovante** | QR Code do ingresso + compartilhamento |
| 💾 **Armazenamento Local** | Ingressos salvos no dispositivo via AsyncStorage (DB Sync) |
| 🔄 **Sync** | Sincronização bidirecional com o servidor |

---

## 🏗️ Arquitetura

```
CinemaApp/
├── app/                        # Expo Router (file-based routing)
│   ├── _layout.tsx             # Root layout + Auth Guard
│   ├── (auth)/                 # Rotas públicas
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                 # Rotas autenticadas (bottom tabs)
│   │   ├── filmes.tsx          # Lista de filmes
│   │   ├── sessoes.tsx         # Lista de sessões
│   │   ├── ingressos.tsx       # Meus ingressos (local DB)
│   │   └── perfil.tsx          # Perfil do usuário
│   └── checkout/               # Fluxo de compra
│       ├── sessao-picker.tsx   # 1. Escolher sessão
│       ├── assentos.tsx        # 2. Escolher assentos
│       ├── snacks.tsx          # 3. Combos de lanches
│       ├── pagamento.tsx       # 4. Pagamento
│       └── comprovante.tsx     # 5. Comprovante / QR Code
│
├── src/
│   ├── api/index.ts            # Axios + interceptors JWT
│   ├── store/
│   │   ├── authStore.ts        # Zustand + SecureStore (JWT)
│   │   ├── checkoutStore.ts    # Estado do carrinho
│   │   └── ticketsStore.ts     # AsyncStorage (DB local)
│   └── utils/
│       ├── theme.ts            # Design tokens (cores, espaçamentos)
│       └── format.ts           # Formatadores de data/moeda
│
└── backend-additions/          # Arquivos para adicionar ao NestJS
    ├── src/auth/               # Módulo de autenticação JWT
    ├── src/ingresso/           # DTO atualizado (+ campo assento)
    └── src/pedido/             # Service e DTO atualizados
```

---

## 🚀 Setup do App Mobile

### 1. Instalar dependências

```bash
cd CinemaApp
npm install
```

### 2. Configurar IP do backend

Edite `src/api/index.ts` e troque o IP:

```ts
// Para emulador Android: 10.0.2.2
// Para dispositivo físico: IP da sua máquina na rede local
export const BASE_URL = 'http://192.168.1.100:3000';
```

Para descobrir seu IP:
- **macOS/Linux**: `ifconfig | grep inet`
- **Windows**: `ipconfig`

### 3. Rodar o app

```bash
# Expo Go (mais simples)
npx expo start

# Android
npx expo start --android

# iOS
npx expo start --ios
```

---

## ⚙️ Setup do Backend (NestJS)

### 1. Instalar novas dependências

```bash
cd cinema-nestjs-swagger-main
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs
npm install -D @types/passport-jwt @types/bcryptjs
```

### 2. Adicionar model Usuario ao Prisma

Adicione ao final de `prisma/schema.prisma`:

```prisma
model Usuario {
  id        Int      @id @default(autoincrement())
  nome      String
  email     String   @unique
  senha     String
  criadoEm DateTime @default(now())
}
```

Adicionar campo `assento` ao model `Ingresso`:

```prisma
model Ingresso {
  // ... campos existentes ...
  assento   String   @default("") // ← NOVO
}
```

Rodar migration:

```bash
npx prisma migrate dev --name add-usuario-assento
npx prisma generate
```

### 3. Copiar arquivos do backend-additions

```bash
# Copiar módulo de Auth
cp -r backend-additions/src/auth cinema-nestjs-swagger-main/src/

# Substituir DTOs e services atualizados
cp backend-additions/src/ingresso/create-ingresso.dto.ts \
   cinema-nestjs-swagger-main/src/ingresso/dto/create-ingresso.dto.ts

cp backend-additions/src/pedido/create-pedido.dto.ts \
   cinema-nestjs-swagger-main/src/pedido/dto/create-pedido.dto.ts

cp backend-additions/src/pedido/pedido.service.ts \
   cinema-nestjs-swagger-main/src/pedido/pedido.service.ts
```

### 4. Atualizar app.module.ts e main.ts

Adicione `AuthModule` no `AppModule` e habilite CORS no `main.ts`:

```ts
// main.ts — adicionar antes de app.listen()
app.enableCors({ origin: '*' });
await app.listen(3000, '0.0.0.0'); // aceitar conexões externas
```

### 5. Variável de ambiente JWT

Crie/edite `.env`:

```
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="sua-chave-super-secreta-aqui"
```

### 6. Rodar o backend

```bash
npm run start:dev
# API em:     http://localhost:3000
# Swagger em: http://localhost:3000/api
```

---

## 🔐 Fluxo de Autenticação JWT

```
App Mobile              NestJS Backend
    │                        │
    │── POST /auth/register ─►│
    │◄─ { access_token, user }│
    │                        │
    │── POST /auth/login ────►│
    │◄─ { access_token, user }│
    │                        │
    │  [token salvo em        │
    │   SecureStore]          │
    │                        │
    │── GET /filme ──────────►│
    │   Authorization: Bearer │
    │◄─ [...filmes]           │
```

---

## 💾 Armazenamento Local (DB Sync)

Os ingressos são salvos localmente no dispositivo via **AsyncStorage** para funcionar offline:

```
Compra bem-sucedida
       │
       ▼
API cria Ingresso + Pedido
       │
       ▼
ticketsStore.addTicket() → AsyncStorage (@cinema:tickets)
       │
       ▼
Disponível offline na aba "Ingressos"
```

**Sincronização com servidor:**
```ts
// Chame após login para sincronizar histórico
const { data } = await pedidosApi.getAll();
await syncWithServer(data);
```

---

## 📦 Dependências Principais

| Pacote | Uso |
|---|---|
| `expo-router` | Navegação file-based |
| `expo-secure-store` | Armazenamento seguro do JWT |
| `@react-native-async-storage/async-storage` | DB local dos ingressos |
| `zustand` | State management global |
| `axios` | HTTP client com interceptors |
| `expo-linear-gradient` | Gradientes da UI |
| `react-native-toast-message` | Notificações |
| `date-fns` | Formatação de datas em pt-BR |

---

## 🎨 Design System

O app usa um tema escuro cinematográfico definido em `src/utils/theme.ts`:

- **Background**: `#0A0A0F` (preto profundo)
- **Primary**: `#E50914` (vermelho cinema)
- **Accent**: `#FFD700` (dourado para preços)
- **Cards**: `#12121A` com bordas `#2A2A3E`

---

## 🗺️ Fluxo de Compra

```
Filmes → [Selecionar Filme]
   └─► Sessão Picker → [Selecionar Sessão]
          └─► Assentos → [Selecionar Assentos + Tipo]
                 └─► Snacks → [Adicionar Combos]
                        └─► Pagamento → [Confirmar]
                               └─► Comprovante (QR Code)
                                      └─► Salvo em "Meus Ingressos"
```
