# NextWork - Documentação Visual do Projeto

## 🎯 Visão Geral

**NextWork** é uma plataforma completa que conecta pequenos empresários (comerciantes) com consultores especializados para transformação digital de seus negócios.

---

## 📱 Páginas Implementadas

### 1. **Página Inicial (/)**
Landing page com:
- Hero section com título "Transforme Seu Negócio com NextWork"
- 3 cards destacando funcionalidades:
  - Diagnóstico Digital (ícone gráfico azul)
  - Consultoria Especializada (ícone pessoas verde)
  - Conteúdo Educativo (ícone livro roxo)
- Call-to-action com gradiente azul/indigo
- Botões "Começar Agora" e "Seja um Consultor"

### 2. **Login/Cadastro (/auth)**
Página de autenticação com:
- Toggle entre Login e Cadastro
- Formulário de Cadastro:
  - Nome completo
  - Email
  - Senha (mínimo 6 caracteres)
  - Telefone
  - Tipo de usuário (Comerciante/Consultor)
  - Campos extras para Consultores (RA, Curso)
- Formulário de Login:
  - Email
  - Senha
- Mensagens de erro/sucesso
- Design com card centralizado em fundo gradiente

### 3. **Dashboard Empresa (/dashboard-empresa)**
Dashboard do comerciante com:
- Boas-vindas personalizadas
- 4 cards de estatísticas:
  - Total de Negócios (ícone prédio azul)
  - Diagnósticos (ícone gráfico verde)
  - Roadmaps (ícone mapa roxo)
  - Consultorias (ícone pessoas laranja)
- Lista de negócios cadastrados
- Botão para cadastrar novo negócio
- Ações rápidas:
  - Buscar Consultoria
  - Conteúdo Educativo
- Card de upgrade para Premium

### 4. **Dashboard Consultor (/dashboard-consultor)**
Dashboard do consultor com:
- Boas-vindas personalizadas
- 4 cards de estatísticas:
  - Total de consultorias
  - Pendentes (amarelo)
  - Em Andamento (laranja)
  - Concluídas (verde)
- Lista de consultorias pendentes para aceitar
- Lista de consultorias em andamento
- Botões de ação (Aceitar, Chat, Ver Detalhes)

### 5. **Buscar Consultoria (/buscar-consultoria)**
Página de busca de consultores com:
- Grid de cards de consultores
- Cada card mostra:
  - Avatar circular com ícone
  - Nome do consultor
  - Avaliação com estrelas (5 estrelas)
  - Email
  - Telefone (se disponível)
  - Curso (se disponível)
  - Botão "Solicitar Consultoria"
- Mensagem quando não há consultores disponíveis

### 6. **Perfil (/perfil)**
Página de perfil do usuário com:
- Avatar circular grande
- Título "Meu Perfil"
- Formulário de edição:
  - Nome completo
  - Email (desabilitado)
  - Telefone
  - Tipo de usuário (desabilitado)
  - RA e Curso (apenas para consultores)
- Botão "Salvar Alterações"
- Seção "Informações da Conta":
  - Plano atual
  - Data de cadastro
- Mensagem de sucesso ao salvar

### 7. **Página 404 (/qualquer-rota-invalida)**
Página de erro com:
- Grande "404" azul
- Mensagem "Página não encontrada"
- Botão para voltar à home

---

## 🧩 Componentes Criados

### **Button**
Botão reutilizável com variantes:
- `primary` - Azul sólido (padrão)
- `secondary` - Cinza sólido
- `outline` - Borda azul, fundo transparente
- `ghost` - Sem borda, hover cinza

Tamanhos: `sm`, `md`, `lg`

### **Card**
Sistema de cards com:
- `Card` - Container principal
- `CardHeader` - Cabeçalho
- `CardContent` - Conteúdo
- `CardFooter` - Rodapé

### **Input**
Input com:
- Label opcional
- Mensagem de erro
- Estilos de validação
- Ref forwarding para React Hook Form

### **Navbar**
Barra de navegação com:
- Logo "NextWork" com ícone
- Links de navegação
- Botões diferentes para usuário logado/deslogado
- Mostra nome do usuário quando logado
- Botão de logout

---

## 🗄️ Estrutura do Banco de Dados

### **Tabelas:**

1. **usuario**
   - id_usuario (UUID, PK)
   - nome, email, tipo_usuario
   - plano (Gratuito/Premium)
   - ra, curso, telefone
   - created_at

2. **negocio**
   - id_negocio (UUID, PK)
   - id_usuario (FK)
   - nome_negocio, tipo_negocio
   - descricao_inicial
   - created_at

3. **diagnostico**
   - id_diagnostico (UUID, PK)
   - id_negocio (FK)
   - data_diagnostico
   - respostas_json (JSONB)
   - pontuacao_digital
   - created_at

4. **roadmap**
   - id_roadmap (UUID, PK)
   - id_diagnostico (FK)
   - data_geracao
   - etapas_detalhadas
   - status (Em andamento/Concluído)
   - created_at

5. **consultoria**
   - id_consultoria (UUID, PK)
   - id_usuario_comerciante (FK)
   - id_usuario_consultor (FK)
   - data_hora_agendamento
   - link_reuniao
   - historico_chat
   - observacoes_suporte
   - status
   - created_at

6. **conteudo_educativo**
   - id_conteudo (UUID, PK)
   - titulo, categoria, url_acesso
   - versao_acesso (Gratuito/Premium)
   - created_at

7. **acompanhamento_conteudo**
   - id_usuario (FK)
   - id_conteudo (FK)
   - data_acesso
   - PK composta

### **Segurança (RLS):**
- ✅ Row Level Security habilitado em todas as tabelas
- ✅ Usuários só acessam seus próprios dados
- ✅ Consultores podem ver outros consultores
- ✅ Conteúdo Premium restrito a usuários Premium

---

## 🔧 Serviços Implementados

### **negocioService**
- `getAll()` - Lista todos os negócios do usuário
- `getById(id)` - Busca negócio específico
- `create(data)` - Cria novo negócio
- `update(id, data)` - Atualiza negócio
- `delete(id)` - Remove negócio

### **diagnosticoService**
- `getByNegocio(negocioId)` - Lista diagnósticos de um negócio
- `create(data)` - Cria novo diagnóstico

### **roadmapService**
- `getByDiagnostico(diagnosticoId)` - Busca roadmap
- `create(data)` - Cria roadmap
- `updateStatus(id, status)` - Atualiza status

### **consultoriaService**
- `getAll()` - Lista consultorias do usuário
- `create(data)` - Solicita consultoria
- `update(id, data)` - Atualiza consultoria

### **conteudoEducativoService**
- `getAll()` - Lista conteúdo disponível
- `trackAccess(userId, conteudoId)` - Registra acesso

### **usuarioService**
- `getConsultores()` - Lista consultores disponíveis
- `update(id, data)` - Atualiza perfil

---

## 🎨 Design System

### **Cores Principais:**
- Azul: `#2563eb` (blue-600)
- Indigo: `#4f46e5` (indigo-600)
- Verde: `#16a34a` (green-600)
- Roxo: `#9333ea` (purple-600)
- Laranja: `#ea580c` (orange-600)
- Amarelo: `#ca8a04` (yellow-600)

### **Tipografia:**
- Headers: font-bold
- Body: font-medium / font-normal
- Tamanhos: text-sm até text-5xl

### **Espaçamento:**
- Sistema de 4px base (1, 2, 3, 4, 6, 8, 12, 16, 24, 32)
- Gaps: 2, 4, 6, 8
- Padding: 4, 6, 8, 12

### **Componentes UI:**
- Bordas arredondadas: rounded-lg (8px)
- Sombras: shadow-md, shadow-lg
- Transições: transition-colors
- Focus states com ring-2

---

## 🚀 Fluxo de Usuário

### **Comerciante:**
1. Acessa página inicial
2. Clica em "Começar Agora"
3. Cadastra-se como "Empresário/Comerciante"
4. Redireciona para Dashboard Empresa
5. Cadastra seu negócio
6. Pode buscar consultores
7. Solicita consultoria
8. Acompanha consultorias no dashboard

### **Consultor:**
1. Acessa página inicial
2. Clica em "Seja um Consultor"
3. Cadastra-se como "Consultor"
4. Redireciona para Dashboard Consultor
5. Visualiza solicitações pendentes
6. Aceita consultorias
7. Gerencia consultorias em andamento
8. Atualiza status das consultorias

---

## 📦 Arquivos Principais

```
src/
├── App.tsx                      # Rotas e estrutura principal
├── main.tsx                     # Entry point
├── index.css                    # Estilos globais Tailwind
│
├── components/
│   ├── Button.tsx              # Botão reutilizável
│   ├── Card.tsx                # Sistema de cards
│   ├── Input.tsx               # Input com validação
│   └── Navbar.tsx              # Barra de navegação
│
├── contexts/
│   └── AuthContext.tsx         # Context de autenticação
│
├── lib/
│   └── supabase.ts             # Cliente Supabase + tipos
│
├── pages/
│   ├── Index.tsx               # Landing page
│   ├── Auth.tsx                # Login/Cadastro
│   ├── DashboardEmpresa.tsx    # Dashboard comerciante
│   ├── DashboardConsultor.tsx  # Dashboard consultor
│   ├── BuscarConsultoria.tsx   # Busca de consultores
│   ├── PerfilCliente.tsx       # Perfil do usuário
│   └── NotFound.tsx            # Página 404
│
└── services/
    └── database.ts             # Serviços de API
```

---

## ✅ Status do Projeto

- ✅ **Front-end:** 100% completo
- ✅ **Autenticação:** Implementada com Supabase Auth
- ✅ **Banco de Dados:** Schema completo com RLS
- ✅ **Rotas:** Todas protegidas e funcionais
- ✅ **Componentes:** Reutilizáveis e responsivos
- ✅ **Serviços:** CRUD completo para todas entidades
- ✅ **Design:** Moderno e profissional com Tailwind

---

## 🔐 Segurança Implementada

- ✅ Row Level Security (RLS) em todas as tabelas
- ✅ Autenticação obrigatória em rotas protegidas
- ✅ Validação de formulários com React Hook Form + Zod
- ✅ Políticas de acesso baseadas em roles
- ✅ Proteção contra acesso não autorizado

---

## 📝 Próximos Passos

Para usar o projeto:

1. Execute o script SQL no Supabase (database-schema.sql)
2. Configure as variáveis de ambiente (.env já configurado)
3. Execute `npm install` para instalar dependências
4. Execute `npm run dev` para iniciar o servidor

O projeto estará disponível em: http://localhost:5173
