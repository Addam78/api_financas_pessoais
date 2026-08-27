# Graph Report - Api_FInanças  (2026-07-19)

## Corpus Check
- 27 files · ~2,965 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 149 nodes · 178 edges · 42 communities (8 shown, 34 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aaebe660`
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

## God Nodes (most connected - your core abstractions)
1. `API Finanças` - 10 edges
2. `authenticate()` - 7 edges
3. `AppError` - 6 edges
4. `loginController()` - 4 edges
5. `createTransactionController()` - 4 edges
6. `findTransactionController()` - 4 edges
7. `updateTransactionController()` - 4 edges
8. `deleteTransactionController()` - 4 edges
9. `createUserController()` - 4 edges
10. `transactionRoutes()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `authRoutes()` --indirect_call--> `loginController()`  [INFERRED]
  src/routes/auth-routes.ts → src/controller/auth-controller.ts
- `createTransactionController()` --calls--> `createTransactionService()`  [EXTRACTED]
  src/controller/transaction-controller.ts → src/service/transaction-service.ts
- `transactionRoutes()` --indirect_call--> `createTransactionController()`  [INFERRED]
  src/routes/transaction-routes.ts → src/controller/transaction-controller.ts
- `findTransactionController()` --calls--> `findTransactionService()`  [EXTRACTED]
  src/controller/transaction-controller.ts → src/service/transaction-service.ts
- `findTransactionRoutes()` --indirect_call--> `findTransactionController()`  [INFERRED]
  src/routes/transaction-routes.ts → src/controller/transaction-controller.ts

## Import Cycles
- None detected.

## Communities (42 total, 34 thin omitted)

### Community 0 - "Package Dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, dotenv, fastify, @fastify/cookie, @fastify/formbody, @fastify/jwt, @fastify/swagger (+5 more)

### Community 1 - "Transaction Routes & Auth Middleware"
Cohesion: 0.20
Nodes (16): createTransactionController(), deleteTransactionController(), findTransactionController(), updateTransactionController(), bearerSecurity, createTransactionSchema, deleteTransactionSchema, findTransactionSchema (+8 more)

### Community 3 - "Transaction Service & Repository"
Cohesion: 0.16
Nodes (16): createTransaction(), CreateTransactionData, deleteTransaction, findTransaction(), updateTransaction(), UpdateTransactionData, createTransactionBodySchema, CreateTransactionRequest (+8 more)

### Community 4 - "Auth Flow (Login)"
Cohesion: 0.17
Nodes (11): loginBodySchema, loginController(), loginSchema, AppError, adapter, pool, prisma, findUserByEmail() (+3 more)

### Community 5 - "Prisma Client & DB Setup"
Cohesion: 0.15
Nodes (12): devDependencies, prisma, @types/bcryptjs, @types/node, @types/pg, typescript, license, main (+4 more)

### Community 6 - "User Registration Flow"
Cohesion: 0.29
Nodes (7): createUserController(), createUserSchema, createUser, userRoutes(), createUserBodySchema, createUserService(), CreatUserRequest

### Community 12 - "README Document"
Cohesion: 0.14
Nodes (13): API Finanças, Arquitetura, Autenticação, Autor, Instalação, Pré-requisitos, Rotas, Scripts (+5 more)

## Knowledge Gaps
- **81 isolated node(s):** `name`, `version`, `main`, `license`, `dev` (+76 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `prisma` connect `Prisma Client & DB Setup` to `Auth Flow (Login)`?**
  _High betweenness centrality (0.159) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies` to `Prisma Client & DB Setup`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `authenticate()` (e.g. with `deleteTransactionRoutes()` and `findTransactionRoutes()`) actually correct?**
  _`authenticate()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `main` to the rest of the system?**
  _85 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `README Document` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._