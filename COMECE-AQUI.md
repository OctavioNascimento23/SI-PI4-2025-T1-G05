# 👋 COMECE AQUI - NextWork

**Bem-vindo ao NextWork!** Este é o guia para você começar rapidamente.

## 🎯 O que é o NextWork?

Uma plataforma completa que conecta **pequenos negócios** com **consultores especializados** para crescimento e transformação digital.

**Funcionalidades principais:**
- 💬 Chat em tempo real
- 📸 Upload de fotos de perfil
- 🎥 Videoconferência integrada
- 📊 Diagnóstico digital
- 🗺️ Roadmap personalizado
- ⭐ Sistema de avaliações

## 📚 Qual guia você precisa?

### 🚀 Quero rodar o projeto AGORA
→ Leia: **[QUICKSTART.md](QUICKSTART.md)**
- ⏱️ Tempo: 10 minutos
- 📝 3 passos simples
- ✅ Perfeito para começar

### 🏗️ Quero entender a arquitetura
→ Leia: **[ARQUITETURA.md](ARQUITETURA.md)**
- 📖 Explica Frontend, Backend e Database
- 🔍 Mostra como tudo se conecta
- 💡 Ideal antes de modificar código

### ✅ Instalei, funciona?
→ Leia: **[CHECKLIST.md](CHECKLIST.md)**
- ☑️ Checklist completo de testes
- 🧪 Testa todas as funcionalidades
- 🐛 Soluções para problemas comuns

### 📖 Quero todos os detalhes
→ Leia: **[README.md](README.md)**
- 📚 Documentação completa
- 🔐 Segurança e RLS
- 🛠️ Tecnologias utilizadas

## ⚡ Instalação Rápida (Resumo)

```bash
# 1. Instalar dependências
npm install

# 2. Configurar Supabase
# Crie conta em: https://supabase.com
# Crie projeto e pegue URL + KEY

# 3. Editar .env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_key_aqui

# 4. Rodar
npm run dev

# 5. Abrir navegador
# http://localhost:5173
```

## 🗂️ Estrutura do Projeto

```
📁 FRONTEND (React + TypeScript)
   src/
   ├── components/     → Botões, Cards, etc
   ├── pages/          → Páginas da aplicação
   ├── contexts/       → Autenticação
   ├── services/       → API calls
   └── lib/            → Config Supabase

📁 BACKEND (Supabase - Na Nuvem)
   ✅ API REST auto-gerada
   ✅ Autenticação
   ✅ Storage (fotos)
   ✅ Realtime (chat)

📁 DATABASE (PostgreSQL - Na Nuvem)
   supabase/migrations/   → Migrations
   database-schema.sql    → Schema completo
```

## 🎓 Fluxo de Aprendizado Recomendado

### Dia 1: Configuração
1. ✅ Instale seguindo o **QUICKSTART.md**
2. ✅ Teste com o **CHECKLIST.md**
3. ✅ Explore a interface

### Dia 2: Entendimento
1. ✅ Leia o **ARQUITETURA.md**
2. ✅ Navegue pelo código em `src/`
3. ✅ Veja o banco no Supabase Dashboard

### Dia 3: Modificação
1. ✅ Faça uma mudança simples (ex: cor de botão)
2. ✅ Crie um componente novo
3. ✅ Adicione um campo na tabela

## 💻 Tecnologias Principais

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React 18 + TypeScript + Vite + TailwindCSS |
| **Backend** | Supabase (Serverless) |
| **Database** | PostgreSQL (Supabase) |
| **Autenticação** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Realtime** | Supabase Realtime (WebSockets) |

## 📝 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Roda em localhost:5173

# Build
npm run build           # Build de produção
npm run preview         # Preview do build

# Qualidade
npm run lint            # Verifica erros
npm run typecheck       # Verifica tipos TypeScript

# Utilidades
npx kill-port 5173      # Mata processo na porta
```

## 🆘 Problemas?

### ❌ Não instalou?
→ Veja **[QUICKSTART.md](QUICKSTART.md)** passo a passo

### ❌ Deu erro?
→ Veja **[CHECKLIST.md](CHECKLIST.md)** seção "Encontrou Problemas?"

### ❌ Não entendeu?
→ Veja **[ARQUITETURA.md](ARQUITETURA.md)** para entender como funciona

## 🎯 Casos de Uso

### Para Aprender React + TypeScript
✅ Bom exemplo de:
- Componentes funcionais
- Hooks (useState, useEffect, useContext)
- TypeScript com React
- Formulários com validação
- Rotas com React Router

### Para Aprender Supabase
✅ Bom exemplo de:
- Autenticação
- CRUD operations
- Row Level Security (RLS)
- Storage de arquivos
- Realtime (WebSockets)

### Para Projeto Real
✅ Bom exemplo de:
- Arquitetura escalável
- Segurança (RLS)
- Upload de arquivos
- Chat em tempo real
- Sistema de avaliações

## 🚦 Próximos Passos

1. ✅ [QUICKSTART.md](QUICKSTART.md) - Instale o projeto
2. ✅ [CHECKLIST.md](CHECKLIST.md) - Teste tudo
3. ✅ [ARQUITETURA.md](ARQUITETURA.md) - Entenda como funciona
4. ✅ [README.md](README.md) - Documentação completa
5. ✅ Explore o código!

## 📖 Todos os Documentos Disponíveis

### 🚀 Para Começar
- **[COMECE-AQUI.md](COMECE-AQUI.md)** ⭐ - Você está aqui!
- **[QUICKSTART.md](QUICKSTART.md)** - Instalação em 3 passos (< 10 min)
- **[CHECKLIST.md](CHECKLIST.md)** - Verifique se tudo funciona

### 📚 Para Entender
- **[README.md](README.md)** - Documentação completa
- **[ARQUITETURA.md](ARQUITETURA.md)** - Frontend/Backend/Database
- **[ESTRUTURA-PASTAS.md](ESTRUTURA-PASTAS.md)** - Organização de arquivos

### 🗄️ Para Desenvolver
- **[CONFIGURACAO-BANCO.md](CONFIGURACAO-BANCO.md)** - Detalhes do banco
- **[PROJETO-COMPLETO.md](PROJETO-COMPLETO.md)** - Especificação completa
- **database-schema.sql** - Schema SQL completo

## 🎉 Pronto!

Você tem tudo que precisa para começar!

**Recomendação:** Comece pelo **[QUICKSTART.md](QUICKSTART.md)** 🚀

---

**Desenvolvido com ❤️ para ajudar pequenos negócios a crescerem no digital**

*Dúvidas? Veja os guias acima ou explore o código em `src/`*
