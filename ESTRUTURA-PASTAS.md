# 📁 Estrutura de Pastas - NextWork

Visualização completa da organização do projeto.

## 🌳 Árvore Completa

```
nextwork/
│
├── 📄 Arquivos de Configuração (Raiz)
│   ├── .env                          → Credenciais Supabase
│   ├── .gitignore                    → Arquivos ignorados pelo Git
│   ├── package.json                  → Dependências e scripts
│   ├── package-lock.json             → Lock de dependências
│   ├── tsconfig.json                 → Config TypeScript
│   ├── tsconfig.app.json             → Config TypeScript (App)
│   ├── tsconfig.node.json            → Config TypeScript (Node)
│   ├── vite.config.ts                → Config Vite
│   ├── tailwind.config.js            → Config TailwindCSS
│   ├── postcss.config.js             → Config PostCSS
│   └── eslint.config.js              → Config ESLint
│
├── 📚 Documentação
│   ├── README.md                     → Documentação principal
│   ├── COMECE-AQUI.md               → Guia para iniciantes ⭐
│   ├── QUICKSTART.md                → Instalação rápida (3 passos)
│   ├── ARQUITETURA.md               → Frontend/Backend/Database
│   ├── CHECKLIST.md                 → Testes e verificações
│   ├── ESTRUTURA-PASTAS.md          → Este arquivo
│   ├── CONFIGURACAO-BANCO.md        → Banco de dados detalhado
│   └── PROJETO-COMPLETO.md          → Especificação completa
│
├── 📁 src/ - FRONTEND (React + TypeScript)
│   │
│   ├── 🎨 Componentes Reutilizáveis
│   │   └── components/
│   │       ├── Button.tsx           → Botões estilizados
│   │       ├── Card.tsx             → Cards de conteúdo
│   │       ├── Input.tsx            → Campos de formulário
│   │       ├── Navbar.tsx           → Menu de navegação
│   │       ├── PhotoUpload.tsx      → Upload de fotos
│   │       └── StarRating.tsx       → Sistema de estrelas
│   │
│   ├── 📄 Páginas da Aplicação
│   │   └── pages/
│   │       ├── Index.tsx                    → Homepage
│   │       ├── Auth.tsx                     → Login/Cadastro
│   │       ├── NotFound.tsx                 → Página 404
│   │       │
│   │       ├── 👤 COMERCIANTE
│   │       │   ├── DashboardEmpresa.tsx     → Dashboard principal
│   │       │   ├── PerfilCliente.tsx        → Perfil (editar)
│   │       │   ├── CriarNegocio.tsx         → Cadastrar negócio
│   │       │   ├── Diagnostico.tsx          → Diagnóstico digital
│   │       │   ├── Roadmap.tsx              → Roadmap de melhorias
│   │       │   ├── BuscarConsultoria.tsx    → Buscar consultores
│   │       │   └── Chat.tsx                 → Chat com consultor
│   │       │
│   │       ├── 👔 CONSULTOR
│   │       │   ├── DashboardConsultor.tsx   → Dashboard principal
│   │       │   ├── PerfilConsultor.tsx      → Perfil profissional
│   │       │   ├── SerConsultor.tsx         → Cadastro consultor
│   │       │   └── Chat.tsx                 → Chat com cliente
│   │       │
│   │       └── 📚 CONTEÚDO
│   │           └── ConteudoEducativo.tsx    → Materiais educativos
│   │
│   ├── 🔐 Contextos (Estado Global)
│   │   └── contexts/
│   │       └── AuthContext.tsx      → Autenticação e usuário
│   │
│   ├── 🔌 Serviços (API)
│   │   └── services/
│   │       └── database.ts          → CRUD operations
│   │
│   ├── ⚙️ Configurações
│   │   └── lib/
│   │       └── supabase.ts          → Cliente Supabase + Interfaces
│   │
│   ├── 🚦 Rotas
│   │   └── App.tsx                  → Definição de rotas
│   │
│   ├── 🎨 Estilos
│   │   └── index.css                → Estilos globais + Tailwind
│   │
│   ├── 🚀 Inicialização
│   │   └── main.tsx                 → Entry point
│   │
│   └── 📝 Tipos
│       └── vite-env.d.ts            → Tipos Vite
│
├── 📁 supabase/ - BANCO DE DADOS
│   └── migrations/                  → Migrations SQL
│       ├── .keep
│       ├── 20251121193944_create_nextwork_schema.sql
│       ├── 20251121194350_add_usuario_insert_policy.sql
│       ├── 20251121194651_add_consultant_profile_fields.sql
│       ├── 20251121195549_expand_business_types_and_chat_v2.sql
│       ├── 20251122005428_add_ratings_remove_premium.sql
│       ├── 20251122021352_add_consultant_profile_fields.sql
│       ├── 20251122025956_add_consultoria_description.sql
│       └── 20251122034351_create_profile_photos_storage.sql
│
├── 📁 public/                       → Arquivos estáticos
│
├── 📁 dist/                         → Build de produção (gerado)
│
├── 📁 node_modules/                 → Dependências (gerado)
│
└── 🗄️ Schema SQL
    └── database-schema.sql          → Schema completo do banco
```

## 📂 Pastas Principais

### 1. 🎨 `src/` - Frontend

**O que é:** Todo código que roda no navegador

**Contém:**
- Interface visual (componentes)
- Lógica de apresentação
- Navegação entre páginas
- Chamadas à API

**Linguagem:** TypeScript + React

### 2. 🧩 `src/components/` - Componentes

**O que é:** Componentes reutilizáveis

**Exemplos:**
- `Button.tsx` - Usado em várias páginas
- `Card.tsx` - Container de conteúdo
- `PhotoUpload.tsx` - Upload de fotos

**Quando criar novo componente:**
- ✅ Se vai usar em 2+ lugares
- ✅ Se tem lógica complexa
- ✅ Se quer isolar funcionalidade

### 3. 📄 `src/pages/` - Páginas

**O que é:** Cada página da aplicação

**Estrutura:**
```
pages/
├── Index.tsx          → / (homepage)
├── Auth.tsx           → /auth (login)
├── DashboardEmpresa.tsx → /dashboard-empresa
└── ...
```

**Cada página:**
- ✅ Uma rota específica
- ✅ Layout completo
- ✅ Pode usar vários componentes

### 4. 🔐 `src/contexts/` - Estado Global

**O que é:** Dados compartilhados entre páginas

**Exemplo:**
```typescript
AuthContext.tsx
├── Usuário logado
├── Função de login
├── Função de logout
└── Estado de autenticação
```

**Usado por:** Todas as páginas que precisam saber quem está logado

### 5. 🔌 `src/services/` - Comunicação com Backend

**O que é:** Funções que falam com o banco de dados

**Exemplo:**
```typescript
database.ts
├── negocioService.create()
├── negocioService.getAll()
├── consultoriaService.create()
└── ...
```

**Quando usar:**
- ✅ Criar registro
- ✅ Buscar dados
- ✅ Atualizar registro
- ✅ Deletar registro

### 6. ⚙️ `src/lib/` - Configurações

**O que é:** Configurações e setup

**Contém:**
```typescript
supabase.ts
├── Cliente Supabase (conexão)
├── Interfaces TypeScript
└── Tipos do banco de dados
```

### 7. 🗄️ `supabase/migrations/` - Banco de Dados

**O que é:** Histórico de mudanças no banco

**Cada arquivo:**
- ✅ Uma mudança no banco
- ✅ Executado em ordem
- ✅ Versionado
- ✅ Reversível

**Exemplo:**
```sql
20251121193944_create_nextwork_schema.sql
└── Cria tabelas iniciais

20251122025956_add_consultoria_description.sql
└── Adiciona campo descrição
```

## 🔍 Como Encontrar Algo

### "Onde está a página de login?"
📁 `src/pages/Auth.tsx`

### "Onde está o botão que uso?"
📁 `src/components/Button.tsx`

### "Onde está a função que salva negócio?"
📁 `src/services/database.ts` → `negocioService.create()`

### "Onde está a conexão com Supabase?"
📁 `src/lib/supabase.ts`

### "Onde está o contexto de autenticação?"
📁 `src/contexts/AuthContext.tsx`

### "Onde estão as rotas?"
📁 `src/App.tsx`

### "Onde está o schema do banco?"
📁 `database-schema.sql` (completo)
📁 `supabase/migrations/` (incremental)

## 📝 Arquivos Importantes

### Configuração

| Arquivo | Descrição |
|---------|-----------|
| `.env` | Credenciais Supabase (NUNCA committar) |
| `package.json` | Dependências e scripts |
| `tsconfig.json` | Config TypeScript |
| `vite.config.ts` | Config do bundler |
| `tailwind.config.js` | Config do CSS framework |

### Documentação

| Arquivo | Quando Usar |
|---------|-------------|
| `COMECE-AQUI.md` | Primeira vez no projeto |
| `QUICKSTART.md` | Instalar rapidamente |
| `ARQUITETURA.md` | Entender estrutura |
| `CHECKLIST.md` | Testar funcionalidades |
| `README.md` | Referência completa |

### Código

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/main.tsx` | Entry point (início) |
| `src/App.tsx` | Rotas principais |
| `src/lib/supabase.ts` | Conexão com backend |
| `src/contexts/AuthContext.tsx` | Autenticação |

## 🎯 Fluxo de Dados nos Arquivos

```
1. USUÁRIO clica em "Salvar Negócio"
   ↓
2. src/pages/CriarNegocio.tsx
   Captura dados do formulário
   ↓
3. src/services/database.ts
   negocioService.create(dados)
   ↓
4. src/lib/supabase.ts
   supabase.from('negocio').insert()
   ↓
5. BACKEND (Supabase na nuvem)
   Valida e salva
   ↓
6. DATABASE (PostgreSQL na nuvem)
   INSERT INTO negocio...
   ↓
7. RETORNA para a página
   Mostra sucesso
```

## 🔧 Modificar o Projeto

### Adicionar nova página

1. Criar `src/pages/MinhaNovaPage.tsx`
2. Adicionar rota em `src/App.tsx`
3. Adicionar link no menu (se necessário)

### Adicionar novo componente

1. Criar `src/components/MeuComponente.tsx`
2. Importar onde precisar:
   ```typescript
   import { MeuComponente } from '../components/MeuComponente'
   ```

### Adicionar nova tabela no banco

1. Criar migration em `supabase/migrations/`
2. Escrever SQL para criar tabela
3. Adicionar políticas RLS
4. Executar migration no Supabase

### Adicionar novo serviço

1. Adicionar em `src/services/database.ts`:
   ```typescript
   export const meuService = {
     create: async (data) => { ... },
     getAll: async () => { ... }
   }
   ```

## 📊 Estatísticas do Projeto

```
Total de Arquivos:
├── Componentes: 6
├── Páginas: 13
├── Contextos: 1
├── Serviços: 1
├── Migrations: 8
└── Documentação: 8

Linhas de Código (aprox):
├── TypeScript: ~5000
├── SQL: ~1500
├── CSS: ~200
└── Config: ~300
```

---

**💡 Dica:** Use o buscador do VS Code (Ctrl+P) para encontrar arquivos rapidamente!
