# 🏗️ Arquitetura do NextWork

Guia completo sobre a separação Frontend, Backend e Database.

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIO (Browser)                     │
└────────────────────┬────────────────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │   FRONTEND (React)   │
          │   http://localhost:5173   │
          │   Pasta: src/        │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │   SUPABASE CLIENT    │
          │   lib/supabase.ts    │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │  BACKEND (Supabase)  │
          │  API + Auth + Storage │
          │  Na Nuvem            │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │  DATABASE (PostgreSQL) │
          │  Supabase Database   │
          │  Na Nuvem            │
          └─────────────────────┘
```

## 🎨 FRONTEND

### Localização
- **Pasta principal**: `src/`
- **Tudo que roda no navegador do usuário**

### Estrutura Detalhada

```
src/
├── 📱 INTERFACE (Componentes UI)
│   └── components/
│       ├── Button.tsx           → Botões reutilizáveis
│       ├── Card.tsx             → Cards
│       ├── Input.tsx            → Campos de formulário
│       ├── Navbar.tsx           → Menu de navegação
│       ├── PhotoUpload.tsx      → Upload de fotos
│       └── StarRating.tsx       → Avaliações com estrelas
│
├── 📄 PÁGINAS (Views)
│   └── pages/
│       ├── Index.tsx            → Homepage
│       ├── Auth.tsx             → Login/Cadastro
│       ├── DashboardEmpresa.tsx → Dashboard comerciante
│       ├── DashboardConsultor.tsx → Dashboard consultor
│       ├── BuscarConsultoria.tsx → Buscar consultores
│       ├── Chat.tsx             → Chat em tempo real
│       ├── PerfilCliente.tsx    → Perfil comerciante
│       ├── PerfilConsultor.tsx  → Perfil consultor
│       ├── CriarNegocio.tsx     → Cadastro de negócio
│       ├── Diagnostico.tsx      → Diagnóstico digital
│       └── Roadmap.tsx          → Roadmap de melhorias
│
├── 🔌 CONEXÕES (Integração)
│   ├── services/
│   │   └── database.ts          → CRUD operations
│   └── lib/
│       └── supabase.ts          → Cliente Supabase
│
├── 🔐 ESTADO GLOBAL (Contextos)
│   └── contexts/
│       └── AuthContext.tsx      → Autenticação
│
├── 🎨 ESTILOS
│   ├── index.css                → Estilos globais + Tailwind
│   └── Inline TailwindCSS       → Classes nos componentes
│
└── 🚦 ROTAS
    └── App.tsx                  → Definição de rotas
```

### Responsabilidades do Frontend

✅ **Interface visual** - O que o usuário vê
✅ **Interação** - Botões, formulários, navegação
✅ **Validação** - Validação de campos antes de enviar
✅ **Estados locais** - Loading, modals, formulários
✅ **Roteamento** - Navegação entre páginas
✅ **Chamadas à API** - Através do Supabase Client

### Tecnologias Frontend

```json
{
  "React 18": "UI Library",
  "TypeScript": "Tipagem estática",
  "Vite": "Build tool + Dev server",
  "TailwindCSS": "Framework CSS",
  "React Router DOM": "Roteamento",
  "React Hook Form": "Formulários",
  "Zod": "Validação de schemas",
  "Lucide React": "Ícones"
}
```

## ⚙️ BACKEND

### Localização
- **Supabase (Na nuvem)**
- **Nenhum código backend local!**

### O que o Supabase faz por você

```
Supabase = Backend Completo
│
├── 🔐 Autenticação
│   ├── Cadastro de usuários
│   ├── Login/Logout
│   ├── Sessões
│   ├── Tokens JWT
│   └── Password reset
│
├── 🗄️ Database (PostgreSQL)
│   ├── Tabelas
│   ├── Relacionamentos
│   ├── Queries SQL
│   └── Row Level Security (RLS)
│
├── 📡 API REST Auto-gerada
│   ├── GET /usuario
│   ├── POST /negocio
│   ├── PUT /consultoria
│   └── DELETE /...
│
├── 💾 Storage (Arquivos)
│   ├── Buckets
│   ├── Upload de arquivos
│   ├── URLs públicas
│   └── Políticas de acesso
│
├── ⚡ Realtime (WebSockets)
│   ├── Chat em tempo real
│   ├── Notificações
│   └── Sincronização
│
└── 🔒 Segurança
    ├── RLS (Row Level Security)
    ├── Políticas de acesso
    └── Autenticação de requests
```

### Como o Frontend se Conecta ao Backend

**Arquivo**: `src/lib/supabase.ts`

```typescript
// Cliente Supabase - Ponte Frontend ↔ Backend
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

**Arquivo**: `src/services/database.ts`

```typescript
// Exemplo de serviço que usa o backend
export const negocioService = {
  // CREATE - Chama POST na API Supabase
  async create(data) {
    return supabase.from('negocio').insert(data)
  },

  // READ - Chama GET na API Supabase
  async getAll() {
    return supabase.from('negocio').select('*')
  },

  // UPDATE - Chama PATCH na API Supabase
  async update(id, data) {
    return supabase.from('negocio').update(data).eq('id', id)
  },

  // DELETE - Chama DELETE na API Supabase
  async delete(id) {
    return supabase.from('negocio').delete().eq('id', id)
  }
}
```

### Responsabilidades do Backend

✅ **API REST** - Endpoints auto-gerados
✅ **Autenticação** - Login, sessões, tokens
✅ **Validação** - Validação de dados
✅ **Segurança** - RLS, políticas de acesso
✅ **Storage** - Armazenamento de arquivos
✅ **Realtime** - WebSockets para chat

## 💾 DATABASE

### Localização
- **PostgreSQL no Supabase (Na nuvem)**
- **Schema definido em**: `database-schema.sql`
- **Migrations em**: `supabase/migrations/`

### Estrutura do Banco

```sql
-- TABELA: usuario
-- Armazena dados de comerciantes e consultores
CREATE TABLE usuario (
  id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  tipo_usuario tipo_usuario_enum NOT NULL,
  telefone VARCHAR(20),
  foto_perfil_url TEXT,
  bio TEXT,
  linkedin_url TEXT,
  -- ... mais campos
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABELA: negocio
-- Negócios cadastrados pelos comerciantes
CREATE TABLE negocio (
  id_negocio UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario UUID REFERENCES usuario(id_usuario),
  nome_negocio VARCHAR(255) NOT NULL,
  tipo_negocio tipo_negocio_enum NOT NULL,
  -- ... mais campos
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABELA: consultoria
-- Solicitações de consultoria
CREATE TABLE consultoria (
  id_consultoria UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario_comerciante UUID REFERENCES usuario(id_usuario),
  id_usuario_consultor UUID REFERENCES usuario(id_usuario),
  descricao TEXT,
  status VARCHAR(50) DEFAULT 'Pendente',
  link_reuniao TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABELA: mensagem_chat
-- Mensagens do chat em tempo real
CREATE TABLE mensagem_chat (
  id_mensagem UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_consultoria UUID REFERENCES consultoria(id_consultoria),
  id_remetente UUID REFERENCES usuario(id_usuario),
  mensagem TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ... mais 10+ tabelas
```

### Tabelas por Funcionalidade

| Módulo | Tabelas |
|--------|---------|
| **Usuários** | `usuario` |
| **Negócios** | `negocio` |
| **Diagnóstico** | `diagnostico`, `roadmap` |
| **Consultoria** | `consultoria`, `mensagem_chat` |
| **Consultor** | `experiencia_consultor`, `projeto_consultor`, `avaliacao_consultor` |
| **Conteúdo** | `conteudo_educativo`, `acompanhamento_conteudo` |

### Segurança (RLS - Row Level Security)

```sql
-- Exemplo: Usuários só veem seus próprios dados
CREATE POLICY "Users can read own data"
ON usuario FOR SELECT
TO authenticated
USING (auth.uid() = id_usuario);

-- Comerciantes só veem suas consultorias
CREATE POLICY "Comerciantes can read own consultorias"
ON consultoria FOR SELECT
TO authenticated
USING (
  auth.uid() = id_usuario_comerciante OR
  auth.uid() = id_usuario_consultor
);
```

### Storage (Arquivos)

```
profile-photos/          ← Bucket público
├── {userId}/           ← Pasta por usuário
│   └── profile-timestamp.jpg
```

**Políticas de Storage:**
- ✅ Qualquer um pode VER fotos (público)
- ✅ Usuários só podem FAZER UPLOAD na própria pasta
- ✅ Usuários só podem DELETAR suas próprias fotos

### Responsabilidades do Database

✅ **Armazenamento** - Dados persistentes
✅ **Relacionamentos** - Foreign keys
✅ **Validação** - Constraints, tipos
✅ **Segurança** - RLS policies
✅ **Performance** - Indexes
✅ **Integridade** - Transações

## 🔄 Fluxo de Dados Completo

### Exemplo: Criar um Negócio

```
1. FRONTEND (src/pages/CriarNegocio.tsx)
   Usuário preenche formulário
   ↓

2. FRONTEND (src/services/database.ts)
   negocioService.create(dados)
   ↓

3. CLIENTE SUPABASE (src/lib/supabase.ts)
   supabase.from('negocio').insert(dados)
   ↓

4. BACKEND (Supabase API - Na nuvem)
   POST /rest/v1/negocio
   Valida autenticação
   Valida dados
   ↓

5. DATABASE (PostgreSQL - Na nuvem)
   INSERT INTO negocio VALUES (...)
   Verifica RLS policies
   Salva dados
   ↓

6. BACKEND (Supabase)
   Retorna resposta { data, error }
   ↓

7. FRONTEND
   Atualiza UI
   Redireciona usuário
   Mostra mensagem de sucesso
```

### Exemplo: Chat em Tempo Real

```
1. FRONTEND - Usuário A (src/pages/Chat.tsx)
   Digite mensagem + Enter
   ↓

2. CLIENTE SUPABASE
   supabase.from('mensagem_chat').insert()
   ↓

3. BACKEND + DATABASE
   INSERT na tabela
   Notifica subscribers via WebSocket
   ↓

4. FRONTEND - Usuário B
   Recebe notificação em tempo real
   Atualiza lista de mensagens
   Mostra nova mensagem INSTANTANEAMENTE
   (Sem precisar dar refresh!)
```

## 📁 Organização de Arquivos

### ✅ O que é FRONTEND

```
src/
├── components/     ← Componentes visuais
├── pages/          ← Páginas
├── contexts/       ← Estado global
├── services/       ← Chamadas à API
├── lib/            ← Config Supabase
├── App.tsx         ← Rotas
└── index.css       ← Estilos
```

### ✅ O que é BACKEND

```
Supabase (Na nuvem)
├── Authentication  ← Auto-gerenciado
├── API REST        ← Auto-gerada
├── Storage         ← Buckets configurados
└── Realtime        ← WebSockets ativos
```

### ✅ O que é DATABASE

```
Supabase Database (Na nuvem)
├── database-schema.sql        ← Schema completo
├── supabase/migrations/       ← Migrations
│   ├── 001_create_schema.sql
│   ├── 002_add_policies.sql
│   └── ...
```

## 🛠️ Ferramentas de Desenvolvimento

### Frontend (Local)
```bash
npm run dev        # Roda em localhost:5173
npm run build      # Build para produção
npm run typecheck  # Verifica tipos
```

### Backend (Supabase Dashboard)
- **URL**: https://supabase.com/dashboard
- **SQL Editor**: Escrever queries
- **Table Editor**: Ver e editar dados
- **Auth**: Gerenciar usuários
- **Storage**: Ver arquivos
- **Logs**: Ver requisições

### Database (Supabase Dashboard)
- **Table Editor**: Interface visual
- **SQL Editor**: Queries diretas
- **Database > Schema**: Ver estrutura
- **Database > Replication**: Realtime

## 🔐 Variáveis de Ambiente

```env
# Conecta Frontend → Backend → Database
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

Essas variáveis são usadas em:
- ✅ `src/lib/supabase.ts` - Cliente Supabase
- ✅ Todas as chamadas de API
- ✅ Autenticação
- ✅ Storage
- ✅ Realtime

## 📊 Resumo Visual

```
┌─────────────────────────────────────────┐
│  FRONTEND (Seu Computador)              │
│  src/ → JavaScript/TypeScript           │
│  Roda no navegador                      │
│  http://localhost:5173                  │
└──────────────┬──────────────────────────┘
               │
               │ .env (credenciais)
               │
┌──────────────▼──────────────────────────┐
│  BACKEND (Nuvem Supabase)               │
│  API REST auto-gerada                   │
│  Auth, Storage, Realtime                │
│  https://xxx.supabase.co                │
└──────────────┬──────────────────────────┘
               │
               │ SQL
               │
┌──────────────▼──────────────────────────┐
│  DATABASE (Nuvem Supabase)              │
│  PostgreSQL                             │
│  Tabelas + RLS + Policies               │
│  database-schema.sql                    │
└─────────────────────────────────────────┘
```

## 🎯 Vantagens desta Arquitetura

✅ **Frontend separado** - Focado só em UI/UX
✅ **Backend gerenciado** - Supabase cuida de tudo
✅ **Sem servidor próprio** - Serverless
✅ **Escalável** - Supabase escala automaticamente
✅ **Seguro** - RLS + Políticas de acesso
✅ **Rápido** - CDN global + Cache
✅ **Realtime** - WebSockets nativos
✅ **Type-safe** - TypeScript em todo Frontend

---

**🎉 Agora você entende a arquitetura completa do NextWork!**
