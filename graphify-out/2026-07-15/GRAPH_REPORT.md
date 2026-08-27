# Graph Report - .  (2026-07-09)

## Corpus Check
- Corpus is ~2,622 words - fits in a single context window. You may not need a graph.

## Summary
- 132 nodes · 189 edges · 14 communities (9 shown, 5 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.8)
- Token cost: 37,680 input · 3,000 output

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

## God Nodes (most connected - your core abstractions)
1. `API Finanças` - 9 edges
2. `MSC (Model, Service, Controller) Architecture` - 9 edges
3. `@fastify/jwt (JWT auth)` - 8 edges
4. `authenticate()` - 7 edges
5. `loginController()` - 4 edges
6. `createTransactionController()` - 4 edges
7. `findTransactionController()` - 4 edges
8. `updateTransactionController()` - 4 edges
9. `deleteTransactionController()` - 4 edges
10. `createUserController()` - 4 edges

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
- 3-file cycle: `src/controller/auth-controller.ts -> src/server.ts -> src/routes/auth-routes.ts -> src/controller/auth-controller.ts`

## Hyperedges (group relationships)
- **Transaction routes all protected by JWT and userId ownership scoping** — readme_route_insert, readme_route_search, readme_route_update, readme_route_delete, readme_security_userid_from_jwt, readme_security_ownership_filter [EXTRACTED 0.90]
- **MSC layered architecture directories forming request flow** — readme_src_controller, readme_src_service, readme_src_repositories, readme_src_routes, readme_msc_architecture [EXTRACTED 0.90]
- **Core technology stack of API Finanças** — readme_nodejs, readme_typescript, readme_fastify, readme_prisma_orm, readme_postgresql, readme_zod, readme_fastify_jwt [EXTRACTED 0.90]

## Communities (14 total, 5 thin omitted)

### Community 0 - "Package Dependencies"
Cohesion: 0.10
Nodes (19): dependencies, bcryptjs, dotenv, fastify, @fastify/cookie, @fastify/formbody, @fastify/jwt, @fastify/swagger (+11 more)

### Community 1 - "Transaction Routes & Auth Middleware"
Cohesion: 0.20
Nodes (16): createTransactionController(), deleteTransactionController(), findTransactionController(), updateTransactionController(), bearerSecurity, createTransactionSchema, deleteTransactionSchema, findTransactionSchema (+8 more)

### Community 2 - "README Architecture Overview"
Cohesion: 0.11
Nodes (19): Addam Cosmo (Autor), API Finanças, dotenv, DATABASE_URL, Fastify, MSC (Model, Service, Controller) Architecture, Node.js, PostgreSQL (+11 more)

### Community 3 - "Transaction Service & Repository"
Cohesion: 0.16
Nodes (16): createTransaction(), CreateTransactionData, deleteTransaction, findTransaction(), updateTransaction(), UpdateTransactionData, CreateTransactionRequest, createTransactionService() (+8 more)

### Community 4 - "Auth Flow (Login)"
Cohesion: 0.30
Nodes (7): loginBodySchema, loginController(), loginSchema, findUserByEmail(), authRoutes(), app, authenticateUser()

### Community 5 - "Prisma Client & DB Setup"
Cohesion: 0.20
Nodes (9): devDependencies, prisma, @types/bcryptjs, @types/node, @types/pg, typescript, adapter, pool (+1 more)

### Community 6 - "User Registration Flow"
Cohesion: 0.29
Nodes (7): createUserController(), createUserSchema, createUser, userRoutes(), createUserBodySchema, createUserService(), CreatUserRequest

### Community 7 - "JWT & Transaction Security Rationale"
Cohesion: 0.24
Nodes (10): JWT_SECRET, @fastify/jwt (JWT auth), DELETE /delete/:id (Deletar transação por ID), POST /insert (Criar nova transação), POST /login (Login e geração JWT), GET /search (Listar transações do usuário), PATCH /update/:id (Atualizar transação por ID), Update/Delete filtram por id da transação e userId do token (+2 more)

## Knowledge Gaps
- **61 isolated node(s):** `name`, `version`, `main`, `license`, `dev` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Prisma Client & DB Setup` to `Package Dependencies`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `authenticate()` (e.g. with `deleteTransactionRoutes()` and `findTransactionRoutes()`) actually correct?**
  _`authenticate()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `main` to the rest of the system?**
  _62 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `README Architecture Overview` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._