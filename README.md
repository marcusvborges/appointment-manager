# Medical Appointment Manager

Sistema fullstack para gerenciamento de consultas médicas, desenvolvido como monorepo com foco em organização, boas práticas e separação clara de responsabilidades.

O projeto foi construído com base em conceitos de clean architecture, validação de regras de negócio no backend seguindo o modelo ER fornecido no desafio, e uma SPA no frontend focada no domínio principal do sistema.

Projeto desenvolvido como desafio técnico.

## Funcionalidades

### Backend

### Autenticação
- Registro de usuário
- Login com geração de JWT
- Proteção de rotas autenticadas
- Endpoint `/auth/me`

### Gestão de Consultas (Core do sistema)
- Criação, edição, visualização e exclusão de consultas

#### Regras de negócio implementadas:
- A consulta deve possuir ao menos 1 procedimento
- Não permite procedimentos duplicados
- Não permite datas passadas
- Não permite conflito de horário (médico e paciente)
- Se `isPrivate = false`, exige `patientPlanId`
- Validação de vínculo entre paciente e plano

### Frontend

- Login/Cadastro de usuário
- Listagem de consultas
- Criação, edição, visualização e exclusão
- Integração com API via Axios
- Interceptor com JWT
- Consumo de:
  - pacientes
  - médicos
  - procedimentos
  - vínculos paciente-plano

## Architecture Overview

Backend estruturado como monolito modular com NestJS:

- controllers
- services
- DTOs
- entities

Frontend em Vue 3 + Quasar (SPA).

## Tech Stack

### Backend
- Node.js 22 LTS
- NestJS
- pnpm
- TypeORM
- PostgreSQL
- JWT + Passport
- Swagger (OpenAPI)
- Docker & Docker Compose
- Zod (validação de env)
- Jest (testes unitários)

### Frontend
- Vue 3
- Quasar
- Axios
- Vue Router

## Execução Local

1. **Clone o projeto**
```bash
git clone https://github.com/marcusvborges/appointment-manager.git
cd appointment-manager
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure variáveis de ambiente**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. **Suba o banco de dados**
```bash
docker compose up -d postgres
```

5. **Execute as migrations**
```bash
cd backend
pnpm run migration:run
```

6. **Execute a seed**
```bash
pnpm run seed:all
```

7. **Inicie o backend**
```bash
pnpm run start:dev
```

8. **Inicie o frontend**
```bash
cd ../frontend
pnpm dev
```

## Executando com Docker

1. **Configure variáveis de ambiente**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
2. **Suba os containers**
```bash
docker compose up --build -d
```
3. **Execute as migrations**
```bash
docker compose exec api pnpm run migration:run
```
4. **Execute a seed**
```bash
docker compose exec api pnpm run seed:all
```
5. **Subir frontend (fora do docker)**
```bash
cd frontend
pnpm install
pnpm dev
```

A API estará disponível em http://localhost:3000/api 
Frontend: http://localhost:9000

## Documentação da API

Swagger disponível em:
http://localhost:3000/docs

## Variáveis de Ambiente

### Backend (.env)

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=appointment_manager

JWT_SECRET=jwt_secret
```

### Backend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## Scripts Disponíveis

**Backend**
```bash
pnpm run start:dev
pnpm run start:prod
pnpm run build

pnpm run migration:generate
pnpm run migration:run
pnpm run migration:revert

pnpm run seed

pnpm run test
pnpm run lint
```

**Frontend**
```bash
pnpm dev
pnpm build
pnpm lint
```

## Seeds

O projeto possui seeds para popular dados essenciais:

- especialidades
- médicos
- pacientes
- planos
- procedimentos
- vínculos entre entidades

Comando:
pnpm run seed:all

## Endpoints

Os principais endpoints podem ser explorados via Swagger.

## CI

Pipeline básico configurado com GitHub Actions.

Em cada push:

- Execução de lint
- Execução de teste unitários no domínio principal (Appointment)
- Build de aplicação

Objetico: grantir qualidade e consistencia do código.

## Melhorias Futuras

- Dashboard com indicadores
- Filtros avançados na listagem de consultas
- Paginação e busca
- CRUD completo das entidades no frontend
- Melhorias de UX/UI
- Testes e2e
- Controle de permissões por perfil
- Melhor tratamento de erros

## Licença
Este projeto está licenciado sob a Licença MIT.