# Backend — Sistema de Controle de Ativos de Informática

Kotlin 2.4 + Spring Boot 4.1 (Java 21, Gradle Kotlin DSL) + MySQL 8.4 + Spring Cloud Gateway.

```
Frontend (Next.js) ──/api/*──▶ Gateway :8080 ──▶ Backend :8081 ──▶ MySQL :3306
   (proxy via rewrites)        (Spring Cloud)     (Spring Boot)
```

## Pré-requisitos (macOS)
```bash
brew install --cask docker        # Docker Desktop (abra o app uma vez para iniciar o daemon)
brew install openjdk@21           # só necessário para rodar/testar fora do Docker
```

## Subir tudo com Docker
Na raiz do repositório:
```bash
cp .env.example .env              # opcional
docker compose up --build
```
- Gateway: http://localhost:8080/api/ativos
- Backend direto: http://localhost:8081/api/ativos
- MySQL no Mac: `localhost:3307` (usuário/senha em `.env`, padrão `ativos`/`ativos`)

## Rodar sem Docker para o app (apenas MySQL no Docker)
```bash
docker compose up -d mysql
./gradlew :backend:bootRun
./gradlew :gateway:bootRun        # em outro terminal
```

## Testes e build
```bash
./gradlew :backend:test
./gradlew build
```

## Frontend usando o backend
```bash
cd frontend
npm run dev:backend               # Next.js encaminha /api/* para o Gateway (http://localhost:8080)
```

## Estrutura (um módulo por pasta)
```
backend/src/main/kotlin/br/pucpr/ativos/
├── ativo/         Ativo · AtivoDto · AtivoController · AtivoService · AtivoRepository
├── colaborador/   (mesmos 5 arquivos)
├── usuario/       (mesmos 5 arquivos)
├── manutencao/    (mesmos 5 arquivos)
├── alocacao/      (mesmos 5 arquivos)
├── movimentacao/  (mesmos 5 arquivos)
├── dashboard/     DashboardDto · DashboardService · DashboardController (agrega via portas *Consulta)
└── shared/        exceções, ApiError, ApiExceptionHandler, SituacaoPessoa
```
Esquema e dados iniciais: `src/main/resources/db/migration/` (Flyway, `V1__schema.sql`, `V2__dados_iniciais.sql`).

## Endpoints (mesmo contrato do mock anterior)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/ativos?busca=&status=` | Pesquisa ativos |
| POST | `/api/ativos` | Cria ativo (201; 409 se patrimônio já existe) |
| PUT | `/api/ativos/{numeroPatrimonio}` | Atualização parcial |
| DELETE | `/api/ativos/{numeroPatrimonio}` | Exclui (409 se houver histórico) |
| GET | `/api/colaboradores` · `/api/alocacoes` · `/api/manutencoes` · `/api/usuarios` | Listagens |
| GET | `/api/movimentacoes` | Últimas movimentações |
| GET | `/api/dashboard` | Indicadores consolidados |
