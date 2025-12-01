# NextWork - Plataforma de Consultoria Digital

Plataforma que conecta pequenos negócios (comerciantes) com consultores especializados para transformação digital e crescimento.

## 📋 Funcionalidades

### Para Comerciantes:
- ✅ Cadastro e gestão de negócios
- ✅ Sistema de diagnóstico digital
- ✅ Roadmap personalizado de melhorias
- ✅ Busca e solicitação de consultorias
- ✅ Chat em tempo real com consultores
- ✅ Upload de foto de perfil
- ✅ Conteúdo educativo

### Para Consultores:
- ✅ Perfil profissional completo
- ✅ Portfolio e experiências
- ✅ Gerenciamento de consultorias
- ✅ Chat em tempo real com clientes
- ✅ Sistema de videoconferência integrado
- ✅ Sistema de avaliações
- ✅ Upload de foto de perfil

## 🏗️ Arquitetura do Projeto

```
nextwork/
├── 📁 frontend/                    # Aplicação React
│   ├── src/
│   │   ├── components/            # Componentes reutilizáveis
│   │   ├── contexts/              # React Contexts (Auth, etc)
│   │   ├── pages/                 # Páginas da aplicação
│   │   ├── services/              # Serviços e APIs
│   │   └── lib/                   # Configurações (Supabase)
│   ├── public/                    # Arquivos estáticos
│   └── package.json
│
├── 📁 database/                    # Banco de Dados (Supabase)
│   └── supabase/
│       └── migrations/            # Migrations do banco
│
└── 📁 docs/                        # Documentação
    ├── CONFIGURACAO-BANCO.md
    └── PROJETO-COMPLETO.md
```

## 🚀 Como Rodar Localmente

📖 **GUIAS DISPONÍVEIS:**
- ⭐ **[RODAR-LOCALMENTE.md](RODAR-LOCALMENTE.md)** - Banco já configurado! Rode em 2 comandos
- 📊 **[STATUS-CONEXAO.md](STATUS-CONEXAO.md)** - Veja o status da sua conexão
- 🚀 **[QUICKSTART.md](QUICKSTART.md)** - Instalação em 3 passos (< 10 min)
- 🏗️ **[ARQUITETURA.md](ARQUITETURA.md)** - Entenda Frontend/Backend/Database
- ✅ **[CHECKLIST.md](CHECKLIST.md)** - Verifique se tudo está funcionando

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta no Supabase (gratuita)
- Git

### Passo 1: Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd nextwork
```

### Passo 2: Instalar Dependências

```bash
npm install
```

### Passo 3: Configurar Supabase

1. **Criar projeto no Supabase:**
   - Acesse [supabase.com](https://supabase.com)
   - Crie uma conta (gratuita)
   - Crie um novo projeto
   - Aguarde a criação (leva ~2 minutos)

2. **Obter credenciais:**
   - No dashboard do Supabase, vá em `Settings > API`
   - Copie a `Project URL`
   - Copie a `anon/public` key

### Passo 4: Configurar Variáveis de Ambiente

Crie ou edite o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_project_url_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

**Exemplo:**
```env
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Passo 5: Configurar o Banco de Dados

#### Opção A: Usar Migrations Automáticas (Recomendado)

As migrations já estão configuradas em `supabase/migrations/`. O Supabase as executará automaticamente quando você conectar o projeto.

#### Opção B: Executar Manualmente

1. No dashboard do Supabase, vá em `SQL Editor`
2. Execute cada arquivo de migration em ordem:
   - `20251121193944_create_nextwork_schema.sql`
   - `20251121194350_add_usuario_insert_policy.sql`
   - E assim por diante...

**Ou execute tudo de uma vez:**

Copie todo o conteúdo do arquivo `database-schema.sql` e execute no SQL Editor.

### Passo 6: Configurar Storage para Fotos

O bucket de storage será criado automaticamente pela migration. Caso precise criar manualmente:

1. No Supabase, vá em `Storage`
2. Clique em `Create bucket`
3. Nome: `profile-photos`
4. Marque como `Public bucket`
5. Clique em `Create bucket`

### Passo 7: Rodar o Projeto

```bash
npm run dev
```

O projeto estará disponível em: **http://localhost:5173**

## 🔑 Primeiro Acesso

### Criar Conta de Comerciante:

1. Acesse http://localhost:5173
2. Clique em "Começar Agora" ou "Entrar"
3. Na tela de login, clique em "Criar uma conta"
4. Preencha os dados:
   - Nome completo
   - Email
   - Senha (mínimo 6 caracteres)
   - Selecione "Empresário/Comerciante"
5. Clique em "Criar Conta"

### Criar Conta de Consultor:

1. Mesmos passos acima
2. Mas selecione "Consultor" como tipo de usuário

## 🗂️ Estrutura Frontend

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Navbar.tsx
│   ├── PhotoUpload.tsx
│   └── StarRating.tsx
│
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Gerenciamento de autenticação
│
├── pages/              # Páginas da aplicação
│   ├── Auth.tsx                    # Login/Cadastro
│   ├── Index.tsx                   # Homepage
│   ├── DashboardEmpresa.tsx       # Dashboard comerciante
│   ├── DashboardConsultor.tsx     # Dashboard consultor
│   ├── BuscarConsultoria.tsx      # Buscar consultores
│   ├── Chat.tsx                   # Chat em tempo real
│   ├── PerfilCliente.tsx          # Perfil comerciante
│   ├── PerfilConsultor.tsx        # Perfil consultor
│   ├── CriarNegocio.tsx           # Cadastrar negócio
│   ├── Diagnostico.tsx            # Diagnóstico digital
│   └── Roadmap.tsx                # Roadmap de melhorias
│
├── services/           # Serviços
│   └── database.ts    # CRUD operations
│
├── lib/               # Configurações
│   └── supabase.ts   # Cliente Supabase
│
└── App.tsx           # Rotas principais
```

## 💾 Estrutura do Banco de Dados

### Tabelas Principais:

| Tabela | Descrição |
|--------|-----------|
| `usuario` | Dados dos usuários (comerciantes e consultores) |
| `negocio` | Negócios cadastrados |
| `diagnostico` | Diagnósticos digitais realizados |
| `roadmap` | Planos de ação gerados |
| `consultoria` | Consultorias solicitadas e em andamento |
| `mensagem_chat` | Mensagens do chat |
| `experiencia_consultor` | Experiências profissionais |
| `projeto_consultor` | Portfolio de projetos |
| `avaliacao_consultor` | Avaliações recebidas |
| `conteudo_educativo` | Conteúdos educativos |

### Storage:

| Bucket | Descrição |
|--------|-----------|
| `profile-photos` | Fotos de perfil dos usuários |

## 🔒 Segurança

- ✅ Row Level Security (RLS) em todas as tabelas
- ✅ Políticas de acesso baseadas em autenticação
- ✅ Usuários só acessam seus próprios dados
- ✅ Validação de tipos com TypeScript
- ✅ Sanitização de inputs
- ✅ Storage com políticas de acesso por usuário

## 📚 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento (porta 5173)

# Build
npm run build           # Cria build de produção
npm run preview         # Preview do build

# Qualidade de Código
npm run lint            # Executa ESLint
npm run typecheck       # Verifica tipos TypeScript
```

## 🛠️ Tecnologias Utilizadas

### Frontend:
- **React 18** - Library UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **React Router DOM v6** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Lucide React** - Ícones

### Backend/Database:
- **Supabase** - Backend as a Service
  - PostgreSQL - Banco de dados
  - Auth - Autenticação
  - Storage - Armazenamento de arquivos
  - Realtime - WebSockets para chat

## 🐛 Solução de Problemas

### Erro: "Invalid API key"
- Verifique se as variáveis no `.env` estão corretas
- Confirme que copiou a URL e a chave corretamente do Supabase

### Erro: "relation does not exist"
- Execute as migrations do banco de dados
- Verifique se todas as tabelas foram criadas no SQL Editor

### Erro ao fazer upload de foto
- Verifique se o bucket `profile-photos` existe
- Confirme que o bucket está marcado como público
- Verifique as políticas de storage

### Chat não funciona
- Verifique se a tabela `mensagem_chat` existe
- Confirme que o Realtime está habilitado no Supabase

## �� Fluxo de Uso Completo

### Comerciante:
1. Criar conta → Login
2. Cadastrar negócio
3. Fazer diagnóstico digital
4. Ver roadmap gerado
5. Buscar consultoria
6. Solicitar consultoria (com descrição)
7. Aguardar aceitação
8. Chat com consultor
9. Videoconferência
10. Avaliar consultor

### Consultor:
1. Criar conta → Login
2. Completar perfil (foto, bio, experiências)
3. Ver consultorias pendentes
4. Aceitar consultoria
5. Chat com cliente
6. Adicionar link de videoconferência
7. Realizar consultoria
8. Receber avaliação

## 📄 Documentação Adicional

- `CONFIGURACAO-BANCO.md` - Detalhes do banco de dados
- `PROJETO-COMPLETO.md` - Especificação completa do projeto
- `database-schema.sql` - Schema completo do banco

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ para ajudar pequenos negócios a crescerem no digital**
