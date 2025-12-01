# 🚀 Guia Rápido de Instalação - NextWork

Este guia te ajudará a rodar o projeto em **menos de 10 minutos**.

## ⚡ Setup Rápido (3 Passos)

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Configurar Supabase

**Criar projeto (2 minutos):**
1. Acesse https://supabase.com
2. Faça login/cadastro (gratuito)
3. Clique em "New Project"
4. Preencha:
   - **Name**: NextWork
   - **Database Password**: (crie uma senha forte)
   - **Region**: South America (São Paulo)
5. Clique em "Create new project"
6. Aguarde ~2 minutos

**Copiar credenciais:**
1. No menu lateral, clique em ⚙️ **Settings**
2. Clique em **API**
3. Copie os seguintes valores:
   - **Project URL** (ex: https://abcdefgh.supabase.co)
   - **anon public** (chave longa começando com eyJ...)

### 3️⃣ Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=cole_sua_url_aqui
VITE_SUPABASE_ANON_KEY=cole_sua_chave_aqui
```

**Exemplo preenchido:**
```env
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjE2MTYxNiwiZXhwIjoxOTMxNzM3NjE2fQ.abcdefgh123456789
```

## 🗄️ Configurar Banco de Dados

### Opção 1: Automático (Recomendado) ⚡

As migrations serão executadas automaticamente quando você rodar o projeto pela primeira vez.

### Opção 2: Manual 📝

1. No Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em **+ New query**
3. Copie TODO o conteúdo do arquivo `database-schema.sql`
4. Cole no editor
5. Clique em **RUN** (ou pressione Ctrl+Enter)
6. Aguarde aparecer "Success. No rows returned"

## ▶️ Rodar o Projeto

```bash
npm run dev
```

Abra: **http://localhost:5173**

## ✅ Testar o Sistema

### Criar Primeira Conta:

1. Clique em **"Entrar"**
2. Clique em **"Criar uma conta"**
3. Preencha:
   - Nome: João Silva
   - Email: joao@email.com
   - Senha: 123456
   - Tipo: **Empresário/Comerciante**
4. Clique em **"Criar Conta"**
5. ✨ Você será redirecionado ao Dashboard!

### Testar Upload de Foto:

1. No menu superior, clique em **Perfil**
2. Você verá um componente de upload com um círculo
3. Clique em **"Escolher Foto"**
4. Selecione uma imagem do seu computador
5. A foto será enviada automaticamente! 📸

### Testar Chat:

**Criar conta de consultor:**
1. Faça logout (botão "Sair" no menu)
2. Crie outra conta, mas escolha **"Consultor"**
3. Complete o perfil do consultor

**Solicitar consultoria:**
1. Faça login como comerciante
2. Clique em **"Buscar Consultoria"**
3. Escolha um consultor
4. Clique em **"Solicitar Consultoria"**
5. Escreva uma descrição e envie

**Aceitar e conversar:**
1. Faça login como consultor
2. Vá no Dashboard
3. Veja a solicitação pendente
4. Clique em **"Aceitar"**
5. Clique em **"Abrir Chat"**
6. Digite mensagens em tempo real! 💬

## 🐛 Problemas Comuns

### ❌ Erro: "Invalid API key"

**Solução:**
- Verifique se copiou corretamente a URL e a chave do Supabase
- Certifique-se de que não há espaços extras no `.env`
- A URL deve começar com `https://`
- A chave deve começar com `eyJ`

### ❌ Erro: "relation does not exist"

**Solução:**
- Execute o script SQL do banco de dados
- Vá em Supabase > SQL Editor
- Execute o arquivo `database-schema.sql`

### ❌ Erro ao fazer upload de foto

**Solução:**
1. No Supabase, vá em **Storage**
2. Clique em **Create bucket**
3. Nome: `profile-photos`
4. Marque **Public bucket**
5. Clique em **Create**

### ❌ Porta 5173 já está em uso

**Solução:**
```bash
# Mate o processo na porta 5173
npx kill-port 5173

# Rode novamente
npm run dev
```

## 📁 Estrutura de Pastas (Simplificada)

```
nextwork/
│
├── src/                    ← Frontend (React + TypeScript)
│   ├── components/         ← Componentes reutilizáveis
│   ├── pages/             ← Páginas da aplicação
│   ├── contexts/          ← Autenticação
│   ├── services/          ← Comunicação com banco
│   └── lib/               ← Configuração Supabase
│
├── supabase/
│   └── migrations/        ← Migrations do banco
│
├── database-schema.sql    ← Schema completo do banco
├── .env                   ← Suas credenciais
└── package.json          ← Dependências
```

## 🎯 Divisão Frontend / Backend / Database

### 🎨 Frontend (Tudo em `src/`)
- **Componentes visuais**: `src/components/`
- **Páginas**: `src/pages/`
- **Rotas**: `src/App.tsx`
- **Estilos**: TailwindCSS inline

### ⚙️ Backend (Supabase - Gerenciado na nuvem)
- **API REST**: Auto-gerada pelo Supabase
- **Autenticação**: Supabase Auth
- **Storage**: Supabase Storage (fotos)
- **Realtime**: WebSockets (chat)

### 💾 Database (PostgreSQL no Supabase)
- **Schema**: `database-schema.sql`
- **Migrations**: `supabase/migrations/`
- **Gerenciado**: Via Supabase Dashboard
- **Local**: Nenhum banco local necessário!

## 🔐 Fluxo de Dados

```
Frontend (React)
    ↓
Supabase Client (src/lib/supabase.ts)
    ↓
Supabase API (Na nuvem)
    ↓
PostgreSQL Database (Na nuvem)
```

## 📚 Próximos Passos

1. ✅ Leia o `README.md` completo
2. ✅ Explore a documentação em `CONFIGURACAO-BANCO.md`
3. ✅ Veja o projeto completo em `PROJETO-COMPLETO.md`
4. ✅ Customize o projeto para suas necessidades

## 💡 Dicas

- **Desenvolvimento**: O Vite tem Hot Reload - suas mudanças aparecem instantaneamente
- **Database**: Use o Table Editor do Supabase para visualizar dados
- **Logs**: Abra o Console do navegador (F12) para ver logs
- **Realtime**: O chat atualiza automaticamente sem refresh!

## 🆘 Precisa de Ajuda?

1. Verifique a seção **"Solução de Problemas"** no `README.md`
2. Verifique se todas as dependências foram instaladas
3. Confirme que o Supabase está configurado corretamente
4. Verifique os logs no console do navegador

---

**🎉 Pronto! Você está rodando o NextWork localmente!**
