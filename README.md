# 🎬 cinema-tcs — Sistema Integrado de Gestão e Bilheteria de Cinema

> **Projeto Acadêmico** — Aplicação Web completa para gerenciamento e venda de ingressos de cinema, composta por API Backend RESTful e Interface Web (Totem/Cliente e Painel Administrativo).

**Autor:** Alexandre Lopes ([@alexlbnt](https://github.com/alexlbnt))  
**E-mail:** alexbarreiraneto@hotmail.com  

---

## 🎯 Sobre o Projeto

O **cinema-tcs** é uma solução web desenvolvida para atender as operações de um cinema:
- **Catálogo e Compra Online (Área do Cliente):** Visualização de filmes em cartaz, escolha de sessões, mapa interativo de assentos, diferenciação de ingressos (Inteira / Meia), seleção de produtos de bomboniere (snacks) e finalização de pedidos com comprovante imediato.
- **Painel Administrativo (`/admin`):** Módulo com autenticação JWT segura para cadastro, edição e remoção de filmes, salas de exibição, sessões e snacks.
- **Backend Robusto:** Arquitetura modular com NestJS, banco relacional SQLite gerenciado via Prisma ORM e documentação interativa via Swagger / OpenAPI.

---

## 🏗️ Arquitetura do Repositório

```text
cinema-tcs/
└── cinema-nestjs-swagger-main/      # 🚀 Backend: NestJS 11 + Prisma ORM + SQLite + JWT + Swagger
    ├── prisma/                      # Schema, migrações e seed do banco SQLite
    │   ├── dev.db                   # Banco de dados local SQLite
    │   ├── schema.prisma            # Definição das entidades relacionais
    │   └── seed.ts                  # Carga inicial com salas, filmes, sessões e snacks
    ├── src/                         # Módulos: auth, filme, sala, sessao, ingresso, pedido, snack
    └── frontend/                    # 💻 Frontend Web: React 19 + Vite + React Router DOM
        ├── public/                  # Favicons e assets estáticos
        └── src/                     # Páginas: ClientePage (compra) e AdminPage (gestão)
```

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologias |
|---|---|
| **Backend** | NestJS 11, TypeScript, Prisma ORM 6, SQLite, Passport JWT, Swagger / OpenAPI, Class-Validator |
| **Frontend Web** | React 19, Vite 8, React Router DOM 7, CSS Moderno Responsivo |

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- Node.js (versão 18 ou superior)
- npm

---

### 2. Backend (NestJS + Prisma)

1. No terminal, acesse o diretório do backend:
   ```bash
   cd cinema-nestjs-swagger-main
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie o arquivo de variáveis de ambiente `.env` (ou utilize o `.env.example`):
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="cinema-secret-key-super-segura-2026"
   PORT=3000
   ```
4. Gere o cliente do Prisma e aplique as migrações:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```
5. Popule o banco com dados de teste (se necessário):
   ```bash
   npm run seed
   ```
6. Inicie o servidor da API:
   ```bash
   npm run start:dev
   ```
- 📍 **API URL:** `http://localhost:3000`
- 📚 **Documentação Swagger:** `http://localhost:3000/api`

---

### 3. Frontend Web (React + Vite)

1. Em uma nova janela de terminal, navegue até o diretório do frontend:
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

## 🔐 Credenciais de Acesso (Administrador)

Para acessar o painel de gestão (`http://localhost:5173/admin`):
- **E-mail:** `admin@cinema.com`
- **Senha:** `senha123`

---

## 📄 Licença
Projeto acadêmico desenvolvido para fins de estudo e avaliação.
