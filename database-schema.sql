-- NextWork Platform Database Schema
-- Execute este script no SQL Editor do Supabase Dashboard

-- Criar tipos ENUM
CREATE TYPE tipo_usuario_enum AS ENUM ('Comerciante', 'Consultor');
CREATE TYPE plano_enum AS ENUM ('Gratuito', 'Premium');
CREATE TYPE tipo_negocio_enum AS ENUM ('Bar', 'Padaria', 'Mercadinho');
CREATE TYPE status_roadmap_enum AS ENUM ('Em andamento', 'Concluído');
CREATE TYPE versao_acesso_enum AS ENUM ('Gratuito', 'Premium');

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
CREATE POLICY "Users can view own profile"
  ON usuario FOR SELECT
  TO authenticated
  USING (auth.uid() = id_usuario);

CREATE POLICY "Users can update own profile"
  ON usuario FOR UPDATE
  TO authenticated
  USING (auth.uid() = id_usuario)
  WITH CHECK (auth.uid() = id_usuario);

CREATE POLICY "Consultors can view other consultors"
  ON usuario FOR SELECT
  TO authenticated
  USING (tipo_usuario = 'Consultor');

-- Políticas RLS para Negocio
CREATE POLICY "Users can view own businesses"
  ON negocio FOR SELECT
  TO authenticated
  USING (auth.uid() = id_usuario);

CREATE POLICY "Users can insert own businesses"
  ON negocio FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id_usuario);

CREATE POLICY "Users can update own businesses"
  ON negocio FOR UPDATE
  TO authenticated
  USING (auth.uid() = id_usuario)
  WITH CHECK (auth.uid() = id_usuario);

CREATE POLICY "Users can delete own businesses"
  ON negocio FOR DELETE
  TO authenticated
  USING (auth.uid() = id_usuario);

-- Políticas RLS para Diagnostico
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

-- Políticas RLS para Roadmap
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
  );

-- Políticas RLS para Consultoria
CREATE POLICY "Users can view own consultations"
  ON consultoria FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id_usuario_comerciante OR
    auth.uid() = id_usuario_consultor
  );

CREATE POLICY "Business owners can create consultations"
  ON consultoria FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id_usuario_comerciante);

CREATE POLICY "Consultants can update assigned consultations"
  ON consultoria FOR UPDATE
  TO authenticated
  USING (auth.uid() = id_usuario_consultor)
  WITH CHECK (auth.uid() = id_usuario_consultor);

-- Políticas RLS para Conteudo Educativo
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
CREATE POLICY "Users can view own content tracking"
  ON acompanhamento_conteudo FOR SELECT
  TO authenticated
  USING (auth.uid() = id_usuario);

CREATE POLICY "Users can insert own content tracking"
  ON acompanhamento_conteudo FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id_usuario);

-- Dados de exemplo para Conteúdo Educativo
INSERT INTO conteudo_educativo (titulo, categoria, url_acesso, versao_acesso) VALUES
  ('Introdução ao Marketing Digital', 'Marketing', 'https://example.com/marketing-digital', 'Gratuito'),
  ('Gestão Financeira para Pequenos Negócios', 'Gestão', 'https://example.com/gestao-financeira', 'Gratuito'),
  ('Estratégias Avançadas de SEO', 'Marketing', 'https://example.com/seo-avancado', 'Premium'),
  ('Como Criar um E-commerce', 'Tecnologia', 'https://example.com/ecommerce', 'Premium'),
  ('Atendimento ao Cliente Digital', 'Atendimento', 'https://example.com/atendimento-digital', 'Gratuito');
