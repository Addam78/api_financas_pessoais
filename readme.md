# API Finanças

[![CI](https://github.com/Addam78/api_financas_pessoais/actions/workflows/ci.yml/badge.svg)](https://github.com/Addam78/api_financas_pessoais/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

API REST de portfólio para simular o fluxo de controle financeiro pessoal, com cadastro de usuários, login, CRUD de receitas e despesas e logout com revogação de token.

Desenvolvida com Node.js, TypeScript, Fastify, Prisma ORM e PostgreSQL, aplicando validação de entrada com Zod, arquitetura em camadas, autenticação JWT com revogação por `jti` e isolamento de dados por usuário.

- **Demo (documentação interativa):** https://api-financas-pdlx.onrender.com/docs
- **Código:** https://github.com/Addam78/api_financas_pessoais

---

## Funcionalidades

- Cadastro de usuário, com senha armazenada como hash
- Login com emissão de token JWT (expira em 7 dias)
- Logout que revoga o token atual: ele deixa de ser aceito mesmo antes de expirar
- CRUD de transações (receitas e despesas), restrito ao dono dos dados
- Tratamento centralizado de erros, com respostas `400`, `401`, `404` e `409`
- Rota `GET /health` para checagem de disponibilidade
- Documentação OpenAPI interativa em `/docs`

---

## Tecnologias

- **Node.js** com **TypeScript**
- **Fastify**: framework HTTP
- **Prisma ORM**: acesso ao banco de dados
- **PostgreSQL**: banco de dados
- **Zod**: validação de dados e das variáveis de ambiente
- **JWT (@fastify/jwt)**: autenticação
- **Scalar / OpenAPI**: documentação da API
- **Vitest**: testes unitários e end-to-end
- **GitHub Actions**: integração contínua
- **Render** e **Prisma Postgres**: hospedagem da demo

---

## Decisões técnicas

- **Arquitetura em camadas:** rotas, controllers (entrada e saída HTTP), services (regras de negócio) e repositories (acesso ao banco), cada uma com uma responsabilidade.
- **Isolamento por usuário:** o `userId` vem sempre do token, nunca do body, e update/delete filtram por `id` e `userId`.
- **Logout com revogação real:** o JWT é stateless, então cada token carrega um `jti` único. No logout, o `jti` vai para a tabela `RevokedToken` e o middleware rejeita tokens revogados.
- **Validação na borda:** Zod valida o corpo das requisições e as variáveis de ambiente na inicialização; se `DATABASE_URL` ou `JWT_SECRET` faltarem, a aplicação não sobe.
- **Testes em duas camadas:** unitários nos services (repositórios mockados) e end-to-end contra um PostgreSQL real, cada arquivo em um schema isolado.
- **Integração contínua:** a cada push, o GitHub Actions roda checagem de tipos, testes unitários e e2e.

---

## Arquitetura

```
src/
├── controller/        # Recebe requisições, valida entrada, chama o service
├── service/           # Regras de negócio
├── repositories/      # Acesso ao banco de dados via Prisma
├── routes/            # Definição das rotas
├── middleware/        # Autenticação JWT e checagem de token revogado
├── errors/            # Erro de aplicação (AppError)
├── docs/              # Schemas OpenAPI das rotas
├── lib/               # Instância do Prisma
├── @types/            # Extensões de tipos
├── env.ts             # Validação das variáveis de ambiente
├── app.ts             # Montagem da aplicação Fastify
└── server.ts          # Entrada da aplicação
```

---

## Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente ou em nuvem

---

## Instalação

```bash
# Clone o repositório
git clone https://github.com/Addam78/api_financas_pessoais.git
cd api_financas_pessoais

# Instale as dependências
yarn install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações (veja seção abaixo)

# Execute as migrations
yarn prisma migrate dev

# Inicie o servidor
yarn dev
```

A API sobe em `http://localhost:3333`, e a documentação interativa (Scalar) fica disponível em `http://localhost:3333/docs`, gerada automaticamente a partir das rotas — não precisa manter nada disso manualmente em sincronia.

---

## Variáveis de Ambiente

Copie o `.env.example` para `.env` e preencha com seus dados:

```env
NODE_ENV=development
PORT=3333
DATABASE_URL="postgresql://usuario:senha@localhost:5432/api_financas"
JWT_SECRET="troque_por_uma_chave_longa_e_aleatoria"
```

- **DATABASE_URL**: string de conexão do seu PostgreSQL local ou em nuvem
- **JWT_SECRET**: qualquer string longa e aleatória (ex: `minha_api_financas_2026_xK9mPqL`)
- **PORT**: porta do servidor (padrão: `3333`)
- **NODE_ENV**: `development`, `test` ou `production` (padrão: `development`)

---

## Rotas

### Usuários

| Método | Endpoint  | Descrição              | Auth |
|--------|-----------|------------------------|------|
| POST   | /users    | Cadastrar novo usuário | Não  |

**Body:**
```json
{
  "name": "Lucas",
  "email": "lucas@email.com",
  "password": "senha123"
}
```

---

### Autenticação

| Método | Endpoint | Descrição            | Auth |
|--------|----------|----------------------|------|
| POST   | /auth/login | Login e geração JWT  | Não  |

**Body:**
```json
{
  "email": "lucas@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "message": "login realizado",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

| Método | Endpoint      | Descrição                                   | Auth |
|--------|---------------|---------------------------------------------|------|
| POST   | /auth/logout  | Encerra a sessão e revoga o token atual     | Sim  |

Depois do logout, o token usado deixa de ser aceito (`401`). Um novo login gera um token novo.

---

### Sistema

| Método | Endpoint | Descrição                                     | Auth |
|--------|----------|-----------------------------------------------|------|
| GET    | /health  | Verifica se a API está no ar                  | Não  |
| GET    | /        | Redireciona para a documentação (`/docs`)     | Não  |

---

### Transações

Todas as rotas abaixo exigem o token JWT no header:

```
Authorization: Bearer seu_token_aqui
```

| Método | Endpoint       | Descrição                        | Auth |
|--------|----------------|----------------------------------|------|
| POST   | /transactions      | Criar nova transação             | Sim  |
| GET    | /transactions      | Listar transações do usuário     | Sim  |
| PATCH  | /transactions/:id  | Atualizar transação por ID       | Sim  |
| DELETE | /transactions/:id  | Deletar transação por ID         | Sim  |

**POST /transactions — Body:**
```json
{
  "type": "INCOME",
  "description": "Salário",
  "value": 3000
}
```

**PATCH /transactions/:id — Body:**
```json
{
  "type": "EXPENSE",
  "description": "Mercado",
  "value": 150
}
```

---

## Testes

O projeto tem duas suítes de testes com Vitest: testes unitários da camada de service (repositórios mockados) e testes end-to-end (aplicação real, contra um PostgreSQL de verdade, cada arquivo rodando em um schema isolado). Ambas rodam automaticamente a cada push via GitHub Actions ([workflow](.github/workflows/ci.yml)).

```bash
yarn test          # testes unitários
yarn test:e2e       # testes end-to-end (exige DATABASE_URL configurada)
yarn test:coverage  # testes unitários com relatório de cobertura
yarn typecheck      # checagem de tipos do TypeScript
```

---

## Segurança

- O `userId` é extraído do token JWT, nunca do body da requisição
- Operações de update e delete filtram por `id` da transação **e** `userId` do token, garantindo que o usuário só acessa os próprios dados
- Senhas armazenadas com hash
- Tokens expiram em 7 dias e podem ser revogados antes disso pelo logout

---

## Scripts

```bash
yarn dev                  # Inicia em modo desenvolvimento com hot reload
yarn build                # Gera o Prisma Client e compila para dist/
yarn start                # Aplica migrations e inicia o servidor compilado (dist/server.js)
yarn typecheck             # Checa os tipos do TypeScript sem gerar arquivos
yarn prisma studio        # Interface visual do banco de dados
yarn prisma migrate dev   # Executa migrations
```

---

## Licença

Este projeto está sob a licença [MIT](LICENSE).

---

## Deploy

- **API online (demo):** `https://api-financas-pdlx.onrender.com`
- **Documentação (OpenAPI):** `https://api-financas-pdlx.onrender.com/docs`
- **Health check:** `https://api-financas-pdlx.onrender.com/health`

A demo roda no [Render](https://render.com) (Web Service, plano gratuito) e o banco é um PostgreSQL no [Prisma Postgres](https://www.prisma.io/postgres), acessado por conexão TCP direta.

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | Sim | Connection string `postgres://...` (TCP direto) |
| `JWT_SECRET` | Sim | Chave longa e aleatória para assinar os tokens |
| `PORT` | Não | Porta do servidor (o Render define sozinho; padrão `3333`) |
| `NODE_ENV` | Não | `development`, `test` ou `production` |

Se `DATABASE_URL` ou `JWT_SECRET` faltarem, a aplicação não sobe e informa qual variável está ausente.

### Rodando localmente

```bash
yarn install
cp .env.example .env      # preencha DATABASE_URL e JWT_SECRET
yarn prisma migrate dev
yarn dev
```

### Publicando

1. No [console do Prisma](https://console.prisma.io), crie um banco Prisma Postgres e copie a connection string TCP direta (`postgres://...`).
2. No Render, crie um **Blueprint** apontando para este repositório; ele lê o [`render.yaml`](render.yaml).
3. Preencha `DATABASE_URL` e `JWT_SECRET` no painel do Render.
4. Cada deploy roda `yarn build` e, ao iniciar, `prisma migrate deploy` aplica as migrations automaticamente.

> No plano free do Render o serviço hiberna após inatividade, então a primeira requisição pode levar cerca de 1 minuto.

---

## Autor

Desenvolvido por **Addam Cosmo**  
GitHub: [@Addam78](https://github.com/Addam78)