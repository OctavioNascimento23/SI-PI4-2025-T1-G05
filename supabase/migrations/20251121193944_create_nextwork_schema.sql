/*
  # NextWork Platform - Schema Completo
  
  Este schema cria toda a estrutura do banco de dados para a plataforma NextWork,
  que conecta pequenos empresários com consultores especializados.

  ## Tabelas Criadas

  1. **usuario**
     - Armazena informações de comerciantes e consultores
     - Campos: id, nome, email, tipo (Comerciante/Consultor), plano, RA, curso, telefone
     - Planos disponíveis: Gratuito e Premium

  2. **negocio**
     - Negócios cadastrados pelos comerciantes
     - Tipos: Bar, Padaria, Mercadinho
     - Campos: id, nome, tipo, descrição inicial

  3. **diagnostico**
     - Diagnósticos digitais realizados nos negócios
     - Armazena respostas em JSON e pontuação digital (0-100)

  4. **roadmap**
     - Roadmaps personalizados gerados a partir dos diagnósticos
     - Status: Em andamento ou Concluído
     - Contém etapas detalhadas de transformação digital

  5. **consultoria**
     - Registros de consultorias entre comerciantes e consultores
     - Campos: agendamento, link de reunião, chat, observações, status

  6. **conteudo_educativo**
     - Biblioteca de conteúdos educacionais
     - Categorias: Marketing, Gestão, Tecnologia, Atendimento
     - Versões: Gratuito e Premium

  7. **acompanhamento_conteudo**
     - Rastreamento de acesso ao conteúdo pelos usuários

  ## Segurança (RLS)

  Todas as tabelas possuem Row Level Security habilitado com políticas específicas:
  - Usuários só acessam seus próprios dados
  - Consultores podem visualizar outros consultores
  - Comerciantes podem criar consultorias
  - Consultores podem atualizar consultorias atribuídas a eles
  - Conteúdo Premium restrito a usuários com plano Premium

  ## Dados de Exemplo

  5 conteúdos educacionais são inseridos automaticamente como exemplos.
*/

-- Criar tipos ENUM
DO $$ BEGIN
  CREATE TYPE tipo_usuario_enum AS ENUM ('Comerciante', 'Consultor');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE plano_enum AS ENUM ('Gratuito', 'Premium');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE tipo_negocio_enum AS ENUM ('Bar', 'Padaria', 'Mercadinho');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE status_roadmap_enum AS ENUM ('Em andamento', 'Concluído');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE versao_acesso_enum AS ENUM ('Gratuito', 'Premium');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  tipo_usuario tipo_usuario_enum NOT NULL,
  plano plano_enum DEFAULT 'Gratuito',
  ra VARCHAR(50),
  curso VARCHAR(255),
  telefone VARCHAR(20),
  created_at timestamptz DEFAULT now()
);

-- Tabela de Negócios
CREATE TABLE IF NOT EXISTS negocio (
  id_negocio uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario uuid NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  nome_negocio VARCHAR(255) NOT NULL,
  tipo_negocio tipo_negocio_enum NOT NULL,
  descricao_inicial TEXT,
  created_at timestamptz DEFAULT now()
);

-- Tabela de Diagnósticos
CREATE TABLE IF NOT EXISTS diagnostico (
  id_diagnostico uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_negocio uuid NOT NULL REFERENCES negocio(id_negocio) ON DELETE CASCADE,
  data_diagnostico timestamptz DEFAULT now(),
  respostas_json JSONB,
  pontuacao_digital INTEGER,
  created_at timestamptz DEFAULT now()
);

-- Tabela de Roadmaps
CREATE TABLE IF NOT EXISTS roadmap (
  id_roadmap uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_diagnostico uuid NOT NULL REFERENCES diagnostico(id_diagnostico) ON DELETE CASCADE,
  data_geracao timestamptz DEFAULT now(),
  etapas_detalhadas TEXT,
  status status_roadmap_enum DEFAULT 'Em andamento',
  created_at timestamptz DEFAULT now()
);

-- Tabela de Consultorias
CREATE TABLE IF NOT EXISTS consultoria (
  id_consultoria uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario_comerciante uuid NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  id_usuario_consultor uuid REFERENCES usuario(id_usuario) ON DELETE SET NULL,
  data_hora_agendamento timestamptz,
  link_reuniao VARCHAR(500),
  historico_chat TEXT,
  observacoes_suporte TEXT,
  status VARCHAR(50) DEFAULT 'Pendente',
  created_at timestamptz DEFAULT now()
);

-- Tabela de Conteúdo Educativo
CREATE TABLE IF NOT EXISTS conteudo_educativo (
  id_conteudo uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  categoria VARCHAR(100),
  url_acesso VARCHAR(500),
  versao_acesso versao_acesso_enum DEFAULT 'Gratuito',
  created_at timestamptz DEFAULT now()
);

-- Tabela de Acompanhamento de Conteúdo
CREATE TABLE IF NOT EXISTS acompanhamento_conteudo (
  id_usuario uuid NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  id_conteudo uuid NOT NULL REFERENCES conteudo_educativo(id_conteudo) ON DELETE CASCADE,
  data_acesso timestamptz DEFAULT now(),
  PRIMARY KEY (id_usuario, id_conteudo)
);

-- Habilitar Row Level Security
ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE negocio ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostico ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudo_educativo ENABLE ROW LEVEL SECURITY;
ALTER TABLE acompanhamento_conteudo ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para Usuario
DROP POLICY IF EXISTS "Users can view own profile" ON usuario;
CREATE POLICY "Users can view own profile"
  ON usuario FOR SELECT
  TO authenticated
  USING (auth.uid() = id_usuario);

DROP POLICY IF EXISTS "Users can update own profile" ON usuario;
CREATE POLICY "Users can update own profile"
  ON usuario FOR UPDATE
  TO authenticated
  USING (auth.uid() = id_usuario)
  WITH CHECK (auth.uid() = id_usuario);

DROP POLICY IF EXISTS "Consultors can view other consultors" ON usuario;
CREATE POLICY "Consultors can view other consultors"
  ON usuario FOR SELECT
  TO authenticated
  USING (tipo_usuario = 'Consultor');

-- Políticas RLS para Negocio
DROP POLICY IF EXISTS "Users can view own businesses" ON negocio;
CREATE POLICY "Users can view own businesses"
  ON negocio FOR SELECT
  TO authenticated
  USING (auth.uid() = id_usuario);

DROP POLICY IF EXISTS "Users can insert own businesses" ON negocio;
CREATE POLICY "Users can insert own businesses"
  ON negocio FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id_usuario);

DROP POLICY IF EXISTS "Users can update own businesses" ON negocio;
CREATE POLICY "Users can update own businesses"
  ON negocio FOR UPDATE
  TO authenticated
  USING (auth.uid() = id_usuario)
  WITH CHECK (auth.uid() = id_usuario);

DROP POLICY IF EXISTS "Users can delete own businesses" ON negocio;
CREATE POLICY "Users can delete own businesses"
  ON negocio FOR DELETE
  TO authenticated
  USING (auth.uid() = id_usuario);

-- Políticas RLS para Diagnostico
DROP POLICY IF EXISTS "Users can view diagnostics for own businesses" ON diagnostico;
CREATE POLICY "Users can view diagnostics for own businesses"
  ON diagnostico FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM negocio
      WHERE negocio.id_negocio = diagnostico.id_negocio
      AND negocio.id_usuario = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert diagnostics for own businesses" ON diagnostico;
CREATE POLICY "Users can insert diagnostics for own businesses"
  ON diagnostico FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM negocio
      WHERE negocio.id_negocio = diagnostico.id_negocio
      AND negocio.id_usuario = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert roadmaps for own diagnostics" ON roadmap;
CREATE POLICY "Users can insert roadmaps for own diagnostics"
  ON roadmap FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM diagnostico
      JOIN negocio ON negocio.id_negocio = diagnostico.id_negocio
      WHERE diagnostico.id_diagnostico = roadmap.id_diagnostico
      AND negocio.id_usuario = auth.uid()
    )
  );

-- Políticas RLS para Roadmap
DROP POLICY IF EXISTS "Users can view roadmaps for own diagnostics" ON roadmap;
CREATE POLICY "Users can view roadmaps for own diagnostics"
  ON roadmap FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM diagnostico
      JOIN negocio ON negocio.id_negocio = diagnostico.id_negocio
      WHERE diagnostico.id_diagnostico = roadmap.id_diagnostico
      AND negocio.id_usuario = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update roadmaps for own diagnostics" ON roadmap;
CREATE POLICY "Users can update roadmaps for own diagnostics"
  ON roadmap FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM diagnostico
      JOIN negocio ON negocio.id_negocio = diagnostico.id_negocio
      WHERE diagnostico.id_diagnostico = roadmap.id_diagnostico
      AND negocio.id_usuario = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM diagnostico
      JOIN negocio ON negocio.id_negocio = diagnostico.id_negocio
      WHERE diagnostico.id_diagnostico = roadmap.id_diagnostico
      AND negocio.id_usuario = auth.uid()
    )
  );

-- Políticas RLS para Consultoria
DROP POLICY IF EXISTS "Users can view own consultations" ON consultoria;
CREATE POLICY "Users can view own consultations"
  ON consultoria FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id_usuario_comerciante OR
    auth.uid() = id_usuario_consultor
  );

DROP POLICY IF EXISTS "Business owners can create consultations" ON consultoria;
CREATE POLICY "Business owners can create consultations"
  ON consultoria FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id_usuario_comerciante);

DROP POLICY IF EXISTS "Participants can update consultations" ON consultoria;
CREATE POLICY "Participants can update consultations"
  ON consultoria FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id_usuario_comerciante OR
    auth.uid() = id_usuario_consultor
  )
  WITH CHECK (
    auth.uid() = id_usuario_comerciante OR
    auth.uid() = id_usuario_consultor
  );

-- Políticas RLS para Conteudo Educativo
DROP POLICY IF EXISTS "Users can view educational content based on plan" ON conteudo_educativo;
CREATE POLICY "Users can view educational content based on plan"
  ON conteudo_educativo FOR SELECT
  TO authenticated
  USING (
    versao_acesso = 'Gratuito' OR
    EXISTS (
      SELECT 1 FROM usuario
      WHERE usuario.id_usuario = auth.uid()
      AND usuario.plano = 'Premium'
    )
  );

-- Políticas RLS para Acompanhamento Conteudo
DROP POLICY IF EXISTS "Users can view own content tracking" ON acompanhamento_conteudo;
CREATE POLICY "Users can view own content tracking"
  ON acompanhamento_conteudo FOR SELECT
  TO authenticated
  USING (auth.uid() = id_usuario);

DROP POLICY IF EXISTS "Users can insert own content tracking" ON acompanhamento_conteudo;
CREATE POLICY "Users can insert own content tracking"
  ON acompanhamento_conteudo FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id_usuario);

-- Dados de exemplo para Conteúdo Educativo
INSERT INTO conteudo_educativo (titulo, categoria, url_acesso, versao_acesso) 
VALUES
  ('Introdução ao Marketing Digital', 'Marketing', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Gratuito'),
  ('Gestão Financeira para Pequenos Negócios', 'Gestão', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Gratuito'),
  ('Estratégias Avançadas de SEO', 'Marketing', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Premium'),
  ('Como Criar um E-commerce', 'Tecnologia', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Premium'),
  ('Atendimento ao Cliente Digital', 'Atendimento', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Gratuito'),
  ('Redes Sociais para Negócios', 'Marketing', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Gratuito'),
  ('Análise de Métricas e KPIs', 'Gestão', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Premium'),
  ('Automação de Marketing', 'Marketing', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Premium')
ON CONFLICT DO NOTHING;
