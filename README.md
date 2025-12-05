# Sistema de Consultoria (v1.0.0-final)

Plataforma web que conecta clientes e consultores, com projetos, chat em tempo real, roadmaps em PDF e histórico de status.

## Visão Geral
- Backend: Spring Boot 2.7.18 (Java 8), PostgreSQL, JWT, WebSocket, Maven, iText7.
- Frontend: React 19 + Vite, Tailwind, React Router, Axios.
- Dados persistidos no PostgreSQL.

## Estrutura
```
backend/   # Server TCP + APIs Spring Boot
frontend/  # App React/Vite
backend/db/schema_postgres.sql  # Script de criação do banco
```

## Pré-requisitos
- Java 8+ e Maven 3.6+
- Node.js 18+ e npm
- PostgreSQL em execução (porta 5432)

## Configurar Banco
1. Baixar o PostgreSQL + pgAdmin 4:
   
   https://www.postgresql.org/download/

2. Criar DB:
   ```bash
   createdb consultoria
   ```
3. Aplicar schema:
   ```bash
   psql -U <usuario> -d consultoria -f backend/db/schema_postgres.sql
   ```
4. Ajustar `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/consultoria
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   ```

## Subir Backend
```bash
cd backend; mvn spring-boot:run
```
Server: http://localhost:8080/

## Subir Frontend
```bash
cd frontend; npm install; npm run dev
```
Frontend: http://localhost:5173 (se ocupado, Vite usa a próxima porta, ex.: 5174)

## Fluxo de Uso
1. Acessar frontend (`/` ou `/login`).
2. Criar conta (Cliente ou Consultor) e fazer login.
3. Cliente: criar projeto/solicitação e abrir chat do projeto.
4. Consultor: abrir chat, conversar e criar/enviar roadmap.
5. Roadmap: modal no chat gera PDF ou envia link para o cliente (link aparece no chat).

## Endpoints Principais (resumo)
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Projetos: `GET/POST/PUT/DELETE /api/projects`, `GET /api/projects/{id}`
- Chat: `GET/POST /api/chat/messages/{projectId}`
- Roadmaps: `POST /api/roadmap/create`, `POST /api/roadmap/send?roadmapId=...&userId=...`, `GET /api/roadmap/download/{roadmapId}`

## Notas de Dados
- Roadmaps são persistidos no banco (PDF em `BYTEA`); pasta `data/` não é usada pelo código.
- Schema completo: `backend/db/schema_postgres.sql`.

## Solução de Problemas
- Porta 8080 em uso: finalize o processo (Windows exemplo: `Get-NetTCPConnection -LocalPort 8080 | Select -First 1 | %{ Stop-Process -Id $_.OwningProcess -Force }`).
- Porta 5173 em uso: Vite escolhe próxima porta e mostra no terminal.
- Erro ao enviar roadmap: siga o fluxo criar (`POST /roadmap/create`) e depois enviar (`POST /roadmap/send?roadmapId=...`).
- Reinstalar dependências: `npm install` no frontend; `mvn clean package` no backend.

## Créditos
Grupo 05 - SI-PI4-2025-T1

Gabriel dos Santos  24013743
Felipe Lona  24007375
João Pedro da Silveira  24010951
Italo de Souza  24007472
Octávio Nascimento 24015129
