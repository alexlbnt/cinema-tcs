# 🎬 cinema-tcs — Sistema Integrado de Gestão e Bilheteria de Cinema

> **Projeto Acadêmico** — Sistema completo de cinema composto por API Backend RESTful, Painel Web de Gestão e Totem/Cliente, e Aplicativo Mobile para compra de ingressos.

**Autor:** Alexandre Lopes ([@alexlbnt](https://github.com/alexlbnt))  
**E-mail:** alexbarreiraneto@hotmail.com  

---

## 🎯 Sobre o Projeto

O **Cinema App** é uma solução completa desenvolvida para cobrir ponta a ponta o ciclo de operação de uma rede de cinemas:
- **Gestão de Salas, Filmes e Sessões:** Administração de filmes em cartaz, horários, salas com diferentes capacidades e precificação de ingressos.
- **Venda de Ingressos & Bomboniere:** Seleção visual de assentos com diferenciação de tipo (Inteira / Meia), combos de lanches (snacks) e checkout.
- **Autenticação Segura & Perfis:** Controle de acesso baseado em JWT, com senhas criptografadas por Bcrypt.
- **Multiplataforma:** Backend unificado que atende tanto o Frontend Web (React + Vite) quanto o Aplicativo Mobile (React Native + Expo).
- **Armazenamento Offline no Mobile:** Armazenamento local de ingressos comprados via `AsyncStorage` permitindo visualização de comprovantes e QR Code mesmo sem internet.

---

## 🏗️ Arquitetura do Repositório

```text
cinema-app/
├── cinema-nestjs-swagger-main/      # 🚀 Backend: NestJS 11 + Prisma ORM + SQLite + JWT + Swagger
│   ├── prisma/                      # Schema, migrações e seed do banco SQLite
│   ├── src/                         # Módulos: auth, filme, sala, sessao, ingresso, pedido, snack
│   └── frontend/                    # 💻 Frontend Web: React 19 + Vite + React Router
│       └── src/                     # Páginas: ClientePage (totem/catálogo) e AdminPage (painel admin)
└── CinemaApp/                       # 📱 Mobile App: React Native + Expo SDK 51 + Expo Router + Zustand
    ├── app/                         # Rotas (auth, tabs, checkout)
    └── src/                         # Store (Zustand), API (Axios) e Utilitários
```

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologias |
|---|---|
| **Backend** | NestJS 11, TypeScript, Prisma ORM, SQLite, JWT (Passport), Swagger / OpenAPI, Class-Validator |
| **Frontend Web** | React 19, Vite, React Router DOM 7, CSS Moderno |
| **Mobile App** | React Native, Expo SDK 51, Expo Router, Zustand, AsyncStorage, Axios, Vector Icons |

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- Node.js (versão 18 ou superior instalada)
- npm instalado

---

### 2. Backend (NestJS + Prisma)

1. Acesse o diretório do backend:
   ```bash
   cd cinema-nestjs-swagger-main
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie o arquivo de variáveis de ambiente `.env` (ou copie do `.env.example`):
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="cinema-secret-key-super-segura-2026"
   PORT=3000
   ```
4. Gere o cliente do Prisma e execute as migrações:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```
5. Popule o banco com os dados iniciais de teste:
   ```bash
   npm run seed
   ```
6. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```
- 📍 **API URL:** `http://localhost:3000`
- 📚 **Swagger Interativo:** `http://localhost:3000/api`

---

### 3. Frontend Web (React + Vite)

1. Em um novo terminal, acerte o diretório:
   ```bash
   cd cinema-nestjs-swagger-main/frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor Vite:
   ```bash
   npm run dev
   ```
- 🌐 **Interface do Cliente:** `http://localhost:5173/`
- ⚙️ **Painel Administrativo:** `http://localhost:5173/admin`

---

### 4. Aplicativo Mobile (Expo / React Native)

1. Em outro terminal, acesse o diretório do app mobile:
   ```bash
   cd CinemaApp
   ```
2. Instale as dependências:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Configure o endereço do backend em `src/api/index.ts`:
   - Para **emulador Android**: `http://10.0.2.2:3000`
   - Para **dispositivo físico via Expo Go**: utilize o IP local da sua máquina (ex: `http://192.168.1.X:3000`)
4. Inicie o Expo:
   ```bash
   npx expo start
   ```
- Escaneie o QR Code exibido no terminal utilizando o app **Expo Go** (Android/iOS).

---

## 🔐 Credenciais de Teste

O seed inicial cria automaticamente um usuário administrativo:
- **E-mail:** `admin@cinema.com`
- **Senha:** `senha123`

---

## 📦 Como Subir para o seu GitHub

Para associar este projeto ao seu repositório no GitHub:

1. Crie um novo repositório vazio no seu GitHub (ex: `cinema-app`).
2. No terminal da pasta raiz do projeto (`cinema-app-main`), execute:
   ```bash
   # Adicione o link do seu repositório remoto
   git remote add origin https://github.com/alexlbnt/cinema-tcs.git

   # Envie os commits para a branch principal
   git branch -M main
   git push -u origin main
   ```

---

## 📄 Licença
Distribuído sob licença acadêmica para avaliação e portfólio.
