# ✅ Checklist de Instalação - NextWork

Use este checklist para garantir que tudo está funcionando corretamente.

## 📋 Pré-Instalação

- [ ] Node.js 18+ instalado
  ```bash
  node --version  # Deve mostrar v18.x.x ou superior
  ```

- [ ] npm instalado
  ```bash
  npm --version   # Deve mostrar 9.x.x ou superior
  ```

- [ ] Git instalado (opcional)
  ```bash
  git --version
  ```

## 🔧 Configuração Inicial

### 1. Dependências

- [ ] Executei `npm install`
- [ ] Não houve erros durante a instalação
- [ ] Pasta `node_modules` foi criada

### 2. Supabase

- [ ] Criei conta no Supabase
- [ ] Criei um novo projeto
- [ ] Projeto está ativo e acessível
- [ ] Copiei a Project URL
- [ ] Copiei a anon/public key

### 3. Variáveis de Ambiente

- [ ] Arquivo `.env` existe na raiz do projeto
- [ ] `VITE_SUPABASE_URL` está preenchido
- [ ] `VITE_SUPABASE_ANON_KEY` está preenchido
- [ ] Não há espaços extras nas variáveis
- [ ] URL começa com `https://`
- [ ] Key começa com `eyJ`

**Exemplo correto:**
```env
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗄️ Banco de Dados

### Opção A: Migrations Automáticas

- [ ] Arquivo `supabase/migrations/` existe
- [ ] Migrations serão executadas automaticamente

### Opção B: SQL Manual

- [ ] Abri o SQL Editor no Supabase
- [ ] Copiei conteúdo do `database-schema.sql`
- [ ] Executei o script SQL
- [ ] Recebi "Success. No rows returned"
- [ ] Tabelas aparecem no Table Editor

**Verificar tabelas criadas:**
- [ ] `usuario`
- [ ] `negocio`
- [ ] `diagnostico`
- [ ] `roadmap`
- [ ] `consultoria`
- [ ] `mensagem_chat`
- [ ] `experiencia_consultor`
- [ ] `projeto_consultor`
- [ ] `avaliacao_consultor`
- [ ] `conteudo_educativo`

### Storage (Fotos)

- [ ] Bucket `profile-photos` existe
- [ ] Bucket está marcado como "Public"
- [ ] Políticas de storage estão configuradas

**Verificar no Supabase:**
1. Storage > Buckets
2. Deve aparecer `profile-photos`
3. Status: Public

## ▶️ Executar o Projeto

- [ ] Executei `npm run dev`
- [ ] Não houve erros no terminal
- [ ] Vejo mensagem: "Local: http://localhost:5173/"
- [ ] Projeto abriu no navegador
- [ ] Página inicial carregou corretamente

## 🧪 Testar Funcionalidades

### Teste 1: Cadastro de Usuário

- [ ] Cliquei em "Entrar" ou "Começar Agora"
- [ ] Cliquei em "Criar uma conta"
- [ ] Preenchi o formulário:
  - Nome: João Silva
  - Email: joao@teste.com
  - Senha: 123456
  - Tipo: Empresário/Comerciante
- [ ] Cliquei em "Criar Conta"
- [ ] Fui redirecionado ao Dashboard
- [ ] Vejo meu nome no dashboard
- [ ] Menu superior aparece com meu nome

### Teste 2: Autenticação

- [ ] Cliquei em "Sair" no menu
- [ ] Fui redirecionado para a página inicial
- [ ] Cliquei em "Entrar"
- [ ] Fiz login com o usuário criado
- [ ] Voltei ao Dashboard
- [ ] Sessão foi mantida (refresh funciona)

### Teste 3: Upload de Foto

- [ ] No menu, cliquei em "Perfil"
- [ ] Vejo componente de upload de foto
- [ ] Cliquei em "Escolher Foto"
- [ ] Selecionei uma imagem (JPG/PNG)
- [ ] Imagem foi enviada
- [ ] Preview da foto apareceu
- [ ] Foto aparece no menu superior

**Verificar no Supabase:**
- [ ] Storage > profile-photos
- [ ] Minha foto aparece na pasta

### Teste 4: Criar Negócio (Comerciante)

- [ ] No Dashboard, cliquei em "Solicitar Ajuda"
- [ ] Preenchi o formulário:
  - Nome: Minha Padaria
  - Tipo: Padaria
  - Outros campos (opcional)
- [ ] Cliquei em "Salvar"
- [ ] Negócio aparece no Dashboard
- [ ] Consigo ver detalhes do negócio

### Teste 5: Diagnóstico

- [ ] No negócio criado, cliquei em "Diagnóstico"
- [ ] Respondi as perguntas do diagnóstico
- [ ] Diagnóstico foi salvo
- [ ] Vejo resultado do diagnóstico

### Teste 6: Consultor (Segunda Conta)

- [ ] Fiz logout
- [ ] Criei nova conta como "Consultor"
- [ ] Preenchi perfil de consultor
- [ ] Adicionei bio e experiências
- [ ] Upload de foto funcionou

### Teste 7: Buscar Consultoria

- [ ] Login como Comerciante
- [ ] Cliquei em "Buscar Consultoria"
- [ ] Vejo lista de consultores
- [ ] Cliquei em "Solicitar Consultoria"
- [ ] Modal abriu
- [ ] Escrevi descrição da necessidade
- [ ] Cliquei em "Enviar Solicitação"
- [ ] Recebi confirmação

### Teste 8: Aceitar Consultoria

- [ ] Login como Consultor
- [ ] Vejo consultoria pendente no Dashboard
- [ ] Vejo descrição enviada pelo comerciante
- [ ] Cliquei em "Aceitar"
- [ ] Status mudou para "Em Andamento"
- [ ] Botão "Abrir Chat" apareceu

### Teste 9: Chat em Tempo Real

**Preparação:**
- [ ] Abri navegador 1: Login como Comerciante
- [ ] Abri navegador 2: Login como Consultor

**Comerciante:**
- [ ] No Dashboard, cliquei em "Abrir Chat"
- [ ] Chat abriu
- [ ] Vejo nome e foto do consultor
- [ ] Digitei mensagem
- [ ] Pressionei Enter
- [ ] Mensagem apareceu do meu lado (azul)

**Consultor:**
- [ ] No Dashboard, cliquei em "Abrir Chat"
- [ ] INSTANTANEAMENTE vejo a mensagem do comerciante (cinza)
- [ ] Digitei resposta
- [ ] Mensagem apareceu

**Comerciante:**
- [ ] INSTANTANEAMENTE vejo resposta do consultor
- [ ] Chat funciona em tempo real! ✨

### Teste 10: Videoconferência

- [ ] Como Consultor, no chat cliquei em "Adicionar Reunião"
- [ ] Colei link do Google Meet (ou Zoom)
- [ ] Link foi salvo
- [ ] Botão mudou para "Entrar na Reunião"
- [ ] Como Comerciante, vejo o mesmo botão
- [ ] Cliquei no botão
- [ ] Link abriu em nova aba

## 🔍 Verificações no Console

Abra o Console do navegador (F12):

- [ ] Não há erros em vermelho
- [ ] Conexão com Supabase estabelecida
- [ ] Requests para API funcionando
- [ ] WebSocket conectado (para chat)

## 📊 Verificações no Supabase

### Authentication

- [ ] Vá em Authentication > Users
- [ ] Vejo usuários criados
- [ ] Email confirmado automaticamente

### Database

- [ ] Vá em Table Editor
- [ ] Tabela `usuario` tem registros
- [ ] Tabela `negocio` tem registros
- [ ] Tabela `consultoria` tem registros
- [ ] Tabela `mensagem_chat` tem mensagens

### Storage

- [ ] Vá em Storage > profile-photos
- [ ] Vejo fotos enviadas
- [ ] Consigo abrir as fotos (são públicas)

## ✅ Tudo Funcionando?

Se marcou TODOS os itens acima:

🎉 **PARABÉNS! Seu NextWork está 100% funcional!**

## ❌ Encontrou Problemas?

### Erro comum 1: "Invalid API key"
**Solução:**
```env
# Verifique .env - não pode ter espaços
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Erro comum 2: "relation does not exist"
**Solução:**
1. Supabase > SQL Editor
2. Execute `database-schema.sql`

### Erro comum 3: Upload de foto não funciona
**Solução:**
1. Supabase > Storage > Create bucket
2. Nome: `profile-photos`
3. Marque: Public

### Erro comum 4: Chat não atualiza
**Solução:**
1. Verifique tabela `mensagem_chat` existe
2. Supabase > Database > Replication
3. Habilite Realtime para `mensagem_chat`

### Erro comum 5: Porta em uso
**Solução:**
```bash
npx kill-port 5173
npm run dev
```

## 📚 Próximos Passos

- [ ] Li o `README.md` completo
- [ ] Li o `ARQUITETURA.md` para entender a estrutura
- [ ] Explorei o código em `src/`
- [ ] Vi as migrations em `supabase/migrations/`
- [ ] Entendi a separação Frontend/Backend/Database

## 🎯 Checklist de Desenvolvimento

Se vai modificar o projeto:

- [ ] Entendi a estrutura de pastas
- [ ] Sei onde estão os componentes (`src/components/`)
- [ ] Sei onde estão as páginas (`src/pages/`)
- [ ] Entendo como funciona o AuthContext
- [ ] Sei como fazer queries no banco (`src/services/`)
- [ ] Li sobre RLS (Row Level Security)
- [ ] Testei fazer uma modificação simples
- [ ] Rodei `npm run typecheck` antes de commitar

---

**✅ Use este checklist sempre que configurar o projeto em um novo ambiente!**
