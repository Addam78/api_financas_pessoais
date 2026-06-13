# API Finanças

API REST para gerenciamento de transações financeiras pessoais com autenticação JWT.

---

## Tecnologias

- **Node.js** com **TypeScript**
- **Fastify** — framework HTTP
- **Prisma ORM** — acesso ao banco de dados
- **PostgreSQL** — banco de dados
- **Zod** — validação de dados
- **JWT (@fastify/jwt)** — autenticação
- **dotenv** — variáveis de ambiente

---

## Arquitetura

O projeto segue a arquitetura **MSC (Model, Service, Controller)**:

```
src/
├── controller/        # Recebe requisições, valida entrada, chama o service
├── service/           # Regras de negócio
├── repositories/      # Acesso ao banco de dados via Prisma
├── routes/            # Definição das rotas
├── middleware/        # Autenticação JWT
├── lib/               # Instância do Prisma
├── @types/            # Extensões de tipos
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
git clone https://github.com/addam78/Api_FInancas.git
cd Api_FInancas

# Instale as dependências
yarn add 

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com sua DATABASE_URL e JWT_SECRET

# Execute as migrations
npx prisma migrate dev

# Inicie o servidor
yarn run dev
```

---

## Variáveis de Ambiente

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/api_financas"
JWT_SECRET="sua_chave_secreta"
```

---

## Rotas

### Usuários

| Método | Endpoint  | Descrição              | Auth |
|--------|-----------|------------------------|------|
| POST   | /create   | Cadastrar novo usuário | Não  |

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
| POST   | /login   | Login e geração JWT  | Não  |

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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Transações

Todas as rotas abaixo exigem o token JWT no header:

```
Authorization: Bearer seu_token_aqui
```

| Método | Endpoint       | Descrição                        | Auth |
|--------|----------------|----------------------------------|------|
| POST   | /insert        | Criar nova transação             | Sim  |
| GET    | /search        | Listar transações do usuário     | Sim  |
| PATCH  | /update/:id    | Atualizar transação por ID       | Sim  |
| DELETE | /delete/:id    | Deletar transação por ID         | Sim  |

**POST /insert — Body:**
```json
{
  "type": "INCOME",
  "description": "Salário",
  "value": 3000
}
```

**PATCH /update/:id — Body:**
```json
{
  "type": "EXPENSE",
  "description": "Mercado",
  "value": 150
}
```

---

## Segurança

- O `userId` é extraído do token JWT — nunca do body da requisição
- Operações de update e delete filtram por `id` da transação **e** `userId` do token, garantindo que o usuário só acessa os próprios dados
- Senhas armazenadas com hash

---

## Scripts

```bash
npm run dev       # Inicia em modo desenvolvimento com hot reload
npx prisma studio # Interface visual do banco de dados
npx prisma migrate dev # Executa migrations
```

---

## Autor

Desenvolvido por **Addam Cosmo**  
GitHub: [@addam78](https://github.com/addam78)