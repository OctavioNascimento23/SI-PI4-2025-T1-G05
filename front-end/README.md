# NextWork - Plataforma de Consultoria Digital

Plataforma que conecta pequenos negócios (comerciantes) com consultores especializados para transformação digital.

## Funcionalidades

- Autenticação de usuários (Comerciantes e Consultores)
- Dashboard personalizado para cada tipo de usuário
- Gestão de negócios
- Sistema de diagnóstico digital
- Roadmap de melhorias
- Busca e solicitação de consultorias
- Perfil de usuário
- Conteúdo educativo

## Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form + Zod
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Estrutura do Banco de Dados

### Tabelas

1. **usuario** - Informações dos usuários (Comerciantes e Consultores)
2. **negocio** - Negócios cadastrados pelos comerciantes
3. **diagnostico** - Diagnósticos digitais realizados
4. **roadmap** - Planos de ação gerados a partir dos diagnósticos
5. **consultoria** - Solicitações e agendamentos de consultoria
6. **conteudo_educativo** - Materiais educativos
7. **acompanhamento_conteudo** - Rastreamento de acesso ao conteúdo

## Configuração do Projeto

### 1. Instalar Dependências

\`\`\`bash
npm install
\`\`\`

### 2. Configurar Variáveis de Ambiente

As variáveis do Supabase já estão configuradas no arquivo `.env`:

### 3. Criar Schema do Banco de Dados

Execute o script SQL abaixo no SQL Editor do Supabase:

\`\`\`sql
-- Criar tipos ENUM
CREATE TYPE tipo_usuario_enum AS ENUM ('Comerciante', 'Consultor');
CREATE TYPE plano_enum AS ENUM ('Gratuito', 'Premium');
CREATE TYPE tipo_negocio_enum AS ENUM ('Bar', 'Padaria', 'Mercadinho');
CREATE TYPE status_roadmap_enum AS ENUM ('Em andamento', 'Concluído');
CREATE TYPE versao_acesso_enum AS ENUM ('Gratuito', 'Premium');

-- Tabelas (veja o arquivo database-schema.sql para o schema completo)

### 4. Executar o Projeto

\`\`\`bash
npm run dev
\`\`\`

O projeto estará disponível em `http://localhost:5173`

## Fluxo de Uso

### Para Comerciantes:

1. Criar conta como "Empresário/Comerciante"
2. Fazer login
3. Cadastrar negócio
4. Realizar diagnóstico digital
5. Visualizar roadmap de melhorias
6. Buscar consultoria especializada

### Para Consultores:

1. Criar conta como "Consultor"
2. Fazer login
3. Visualizar solicitações de consultoria
4. Aceitar consultorias
5. Gerenciar consultorias em andamento

## Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Políticas de acesso baseadas em autenticação
- Usuários só podem acessar seus próprios dados
- Consultores só podem ver consultorias atribuídas a eles

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa linter
- `npm run typecheck` - Verifica tipos TypeScript


