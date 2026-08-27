# Graph Report - Api_FInanças  (2026-08-13)

## Corpus Check
- 39 files · ~6,778 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 193 nodes · 280 edges · 44 communities (10 shown, 34 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `19864b45`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Package Dependencies
- Transaction Routes & Auth Middleware
- README Architecture Overview
- Transaction Service & Repository
- Auth Flow (Login)
- Prisma Client & DB Setup
- User Registration Flow
- JWT & Transaction Security Rationale
- Yarn Config
- Fastify JWT Type Declarations
- Password Hashing Rationale
- README Document
- Server Port Env Var
- CLAUDE.md
- dotenv
- DATABASE_URL
- Fastify
- @fastify/jwt (JWT auth)
- MSC (Model, Service, Controller) Architecture
- Node.js
- PostgreSQL
- Prisma ORM
- DELETE /delete/:id (Deletar transação por ID)
- POST /insert (Criar nova transação)
- POST /login (Login e geração JWT)
- GET /search (Listar transações do usuário)
- PATCH /update/:id (Atualizar transação por ID)
- Update/Delete filtram por id da transação e userId do token
- Senhas armazenadas com hash
- userId extraído do token JWT (nunca do body)
- src/controller
- src/lib
- src/middleware
- src/repositories
- src/routes
- src/server.ts
- src/service
- src/@types
- TypeScript
- yarn dev script
- Zod
- auth-controller.spec.ts

## God Nodes (most connected - your core abstractions)
1. `AppError` - 10 edges
2. `API Finanças` - 10 edges
3. `authenticate()` - 8 edges
4. `authenticateUser()` - 6 edges
5. `createTransactionService()` - 6 edges
6. `findTransactionService()` - 6 edges
7. `updateTransactionService()` - 6 edges
8. `deleteTransactionService()` - 6 edges
9. `createUserService()` - 6 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `transactionRoutes()` --indirect_call--> `createTransactionController()`  [INFERRED]
  src/routes/transaction-routes.ts → src/controller/transaction-controller.ts
- `findTransactionRoutes()` --indirect_call--> `findTransactionController()`  [INFERRED]
  src/routes/transaction-routes.ts → src/controller/transaction-controller.ts
- `updateTransactionRoutes()` --indirect_call--> `updateTransactionController()`  [INFERRED]
  src/routes/transaction-routes.ts → src/controller/transaction-controller.ts
- `deleteTransactionRoutes()` --indirect_call--> `deleteTransactionController()`  [INFERRED]
  src/routes/transaction-routes.ts → src/controller/transaction-controller.ts
- `loginController()` --calls--> `authenticateUser()`  [EXTRACTED]
  src/controller/auth-controller.ts → src/service/auth-service.ts

## Import Cycles
- None detected.

## Communities (44 total, 34 thin omitted)

### Community 0 - "Package Dependencies"
Cohesion: 0.07
Nodes (28): dependencies, bcryptjs, dotenv, fastify, @fastify/cookie, @fastify/formbody, @fastify/jwt, @fastify/swagger (+20 more)

### Community 1 - "Transaction Routes & Auth Middleware"
Cohesion: 0.21
Nodes (13): bearerSecurity, createTransactionSchema, deleteTransactionSchema, findTransactionSchema, transactionBody, transactionResponse, updateTransactionSchema, authenticate() (+5 more)

### Community 3 - "Transaction Service & Repository"
Cohesion: 0.10
Nodes (24): prisma, adapter, pool, prisma, createTransaction(), CreateTransactionData, deleteTransaction, findTransaction() (+16 more)

### Community 4 - "Auth Flow (Login)"
Cohesion: 0.27
Nodes (6): AppError, findUserByEmail(), authenticateUser(), newUser, prismaMock, findUserByEmailMock

### Community 5 - "Prisma Client & DB Setup"
Cohesion: 0.23
Nodes (14): createTransactionController(), deleteTransactionController(), findTransactionController(), updateTransactionController(), createTransactionService(), deleteTransactionService(), findTransactionService(), updateTransactionService() (+6 more)

### Community 6 - "User Registration Flow"
Cohesion: 0.20
Nodes (11): createUserController(), createUserSchema, createUser, userRoutes(), createUserBodySchema, createUserService(), CreatUserRequest, body (+3 more)

### Community 12 - "README Document"
Cohesion: 0.14
Nodes (13): API Finanças, Arquitetura, Autenticação, Autor, Instalação, Pré-requisitos, Rotas, Scripts (+5 more)

### Community 42 - "auth-controller.spec.ts"
Cohesion: 0.23
Nodes (8): loginBodySchema, loginController(), loginSchema, authRoutes(), authenticateUserMock, credentials, makeReply(), makeRequest()

## Knowledge Gaps
- **108 isolated node(s):** `name`, `version`, `main`, `license`, `dev` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Package Dependencies` to `Transaction Service & Repository`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **Why does `prisma` connect `Transaction Service & Repository` to `Package Dependencies`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `authenticate()` (e.g. with `deleteTransactionRoutes()` and `findTransactionRoutes()`) actually correct?**
  _`authenticate()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `main` to the rest of the system?**
  _112 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Transaction Service & Repository` be split into smaller, more focused modules?**
  _Cohesion score 0.10344827586206896 - nodes in this community are weakly interconnected._
- **Should `README Document` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._