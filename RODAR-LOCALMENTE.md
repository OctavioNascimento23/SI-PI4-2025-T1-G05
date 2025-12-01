# 🚀 Como Rodar o NextWork Localmente

Seu banco de dados já está configurado e conectado! Siga estes passos simples.

## ✅ Pré-requisitos Confirmados

- ✅ Banco de dados Supabase configurado
- ✅ Todas as tabelas criadas (11 tabelas)
- ✅ Storage bucket `profile-photos` criado
- ✅ RLS (Row Level Security) habilitado
- ✅ Credenciais no arquivo `.env`

## 🎯 Rodar o Projeto - 2 Comandos

### 1️⃣ Instalar dependências (se ainda não fez)

```bash
npm install
```

**Aguarde até ver:** `added XXX packages`

### 2️⃣ Iniciar o servidor

```bash
npm run dev
```

**Você verá:**
```
  VITE v5.4.2  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 3️⃣ Abrir no navegador

Abra: **http://localhost:5173**

## 🎉 Pronto! O que você pode fazer agora:

### ✅ Criar sua primeira conta

1. Clique em **"Entrar"**
2. Clique em **"Criar uma conta"**
3. Preencha:
   - **Nome**: Seu nome
   - **Email**: seu@email.com
   - **Senha**: minimo 6 caracteres
   - **Tipo**: Escolha "Empresário/Comerciante" ou "Consultor"
4. Clique em **"Criar Conta"**
5. ✨ Você será redirecionado ao Dashboard!

### ✅ Testar Upload de Foto

1. No menu superior, clique em **"Perfil"**
2. Clique em **"Escolher Foto"**
3. Selecione uma imagem (JPG, PNG, GIF)
4. A foto será enviada automaticamente para o Supabase Storage! 📸

### ✅ Testar o Chat (2 usuários)

**Passo 1: Criar Consultor**
1. Faça logout (se estiver logado)
2. Crie uma conta como **"Consultor"**
3. Complete o perfil

**Passo 2: Solicitar Consultoria**
1. Faça logout
2. Login como Comerciante
3. Vá em **"Buscar Consultoria"**
4. Clique em **"Solicitar Consultoria"** em algum consultor
5. Escreva uma descrição

**Passo 3: Aceitar e Conversar**
1. Faça logout
2. Login como Consultor
3. No Dashboard, veja a solicitação pendente
4. Clique em **"Aceitar"**
5. Clique em **"Abrir Chat"**

**Passo 4: Testar Chat em Tempo Real**
- Abra 2 navegadores (ou aba anônima)
- Um como Comerciante, outro como Consultor
- Digite mensagens
- Veja aparecer INSTANTANEAMENTE! ⚡

## 📊 Verificar Dados no Supabase

Enquanto o projeto roda, você pode ver os dados em tempo real:

1. Acesse: https://supabase.com/dashboard
2. Entre no seu projeto
3. Vá em **Table Editor**
4. Veja as tabelas sendo preenchidas:
   - `usuario` - Usuários criados
   - `negocio` - Negócios cadastrados
   - `consultoria` - Consultorias solicitadas
   - `mensagem_chat` - Mensagens do chat

## 🗄️ Estrutura do Banco (Confirmada)

Todas estas tabelas já existem e estão prontas:

✅ **usuario** - Comerciantes e Consultores
✅ **negocio** - Negócios cadastrados
✅ **diagnostico** - Diagnósticos realizados
✅ **roadmap** - Planos de ação
✅ **consultoria** - Consultorias
✅ **mensagem_chat** - Chat em tempo real
✅ **experiencia_consultor** - Experiências profissionais
✅ **projeto_consultor** - Portfolio
✅ **avaliacao_consultor** - Avaliações
✅ **acompanhamento_conteudo** - Tracking de conteúdo
✅ **conteudo_educativo** - Materiais educativos

**Storage:**
✅ **profile-photos** - Bucket público para fotos

## 🛑 Parar o Servidor

Pressione **Ctrl + C** no terminal onde está rodando `npm run dev`

## 🔧 Comandos Úteis

```bash
# Rodar desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Verificar tipos TypeScript
npm run typecheck

# Verificar código (linter)
npm run lint
```

## 🐛 Problemas Comuns

### ❌ Porta 5173 já está em uso

```bash
# Matar processo na porta
npx kill-port 5173

# Rodar novamente
npm run dev
```

### ❌ Erro "EADDRINUSE"

O servidor já está rodando em outra janela. Feche-a ou use o comando acima.

### ❌ Erro ao conectar com Supabase

Verifique o arquivo `.env`:
```env
VITE_SUPABASE_URL=https://yfcttgknviahspzwjzly.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### ❌ Upload de foto não funciona

1. Vá em https://supabase.com/dashboard
2. Seu projeto > Storage
3. Verifique se `profile-photos` existe e é público

## 📱 Acessar de Outro Dispositivo

Para acessar de celular/tablet na mesma rede:

```bash
npm run dev -- --host
```

Depois acesse: `http://SEU-IP:5173`

## 🔍 Debug Mode

Para ver logs detalhados no console do navegador:

1. Pressione **F12**
2. Vá na aba **Console**
3. Veja requests, erros, logs

## 🎓 Próximos Passos

Agora que está rodando:

1. ✅ Explore todas as funcionalidades
2. ✅ Leia **ARQUITETURA.md** para entender o código
3. ✅ Veja **ESTRUTURA-PASTAS.md** para navegar
4. ✅ Use **CHECKLIST.md** para testar tudo

## 📊 Status da Conexão

✅ **Supabase URL**: `https://yfcttgknviahspzwjzly.supabase.co`
✅ **Banco conectado**: Sim
✅ **Tabelas criadas**: 11 tabelas
✅ **Storage configurado**: Sim
✅ **RLS ativado**: Sim
✅ **Servidor local**: http://localhost:5173

---

## 🎉 Tudo Funcionando!

Você está rodando o NextWork localmente com:
- ✅ Chat em tempo real
- ✅ Upload de fotos
- ✅ Autenticação completa
- ✅ Banco de dados na nuvem
- ✅ 11 tabelas prontas
- ✅ RLS configurado

**Aproveite!** 🚀
