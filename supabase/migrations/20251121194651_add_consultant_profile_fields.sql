/*
  # Adicionar Campos de Perfil do Consultor
  
  Adiciona campos para foto de perfil, experiências e projetos dos consultores.
  
  ## Novas Tabelas
  
  1. **experiencia_consultor**
     - Experiências profissionais do consultor
     - Campos: cargo, empresa, período, descrição
     
  2. **projeto_consultor**
     - Projetos e empresas que o consultor ajudou
     - Campos: nome, empresa, link, descrição
  
  ## Modificações
  
  1. Adiciona campos à tabela usuario:
     - `foto_perfil_url` (URL da foto)
     - `bio` (biografia/descrição)
     - `linkedin_url` (perfil LinkedIn)
  
  ## Segurança
  
  - RLS habilitado em todas as novas tabelas
  - Consultores podem gerenciar suas próprias experiências e projetos
  - Todos podem visualizar perfis públicos de consultores
*/

-- Adicionar novos campos à tabela usuario
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuario' AND column_name = 'foto_perfil_url'
  ) THEN
    ALTER TABLE usuario ADD COLUMN foto_perfil_url VARCHAR(500);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuario' AND column_name = 'bio'
  ) THEN
    ALTER TABLE usuario ADD COLUMN bio TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuario' AND column_name = 'linkedin_url'
  ) THEN
    ALTER TABLE usuario ADD COLUMN linkedin_url VARCHAR(500);
  END IF;
END $$;

-- Tabela de Experiências do Consultor
CREATE TABLE IF NOT EXISTS experiencia_consultor (
  id_experiencia uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario uuid NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  cargo VARCHAR(255) NOT NULL,
  empresa VARCHAR(255) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  descricao TEXT,
  created_at timestamptz DEFAULT now()
);

-- Tabela de Projetos do Consultor
CREATE TABLE IF NOT EXISTS projeto_consultor (
  id_projeto uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario uuid NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  nome_projeto VARCHAR(255) NOT NULL,
  empresa VARCHAR(255) NOT NULL,
  link_url VARCHAR(500),
  descricao TEXT,
  data_conclusao DATE,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE experiencia_consultor ENABLE ROW LEVEL SECURITY;
ALTER TABLE projeto_consultor ENABLE ROW LEVEL SECURITY;

-- Políticas para experiencia_consultor
DROP POLICY IF EXISTS "Anyone can view consultant experiences" ON experiencia_consultor;
CREATE POLICY "Anyone can view consultant experiences"
  ON experiencia_consultor FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario
      WHERE usuario.id_usuario = experiencia_consultor.id_usuario
      AND usuario.tipo_usuario = 'Consultor'
    )
  );

DROP POLICY IF EXISTS "Consultants can manage own experiences" ON experiencia_consultor;
CREATE POLICY "Consultants can manage own experiences"
  ON experiencia_consultor FOR ALL
  TO authenticated
  USING (auth.uid() = id_usuario)
  WITH CHECK (auth.uid() = id_usuario);

-- Políticas para projeto_consultor
DROP POLICY IF EXISTS "Anyone can view consultant projects" ON projeto_consultor;
CREATE POLICY "Anyone can view consultant projects"
  ON projeto_consultor FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuario
      WHERE usuario.id_usuario = projeto_consultor.id_usuario
      AND usuario.tipo_usuario = 'Consultor'
    )
  );

DROP POLICY IF EXISTS "Consultants can manage own projects" ON projeto_consultor;
CREATE POLICY "Consultants can manage own projects"
  ON projeto_consultor FOR ALL
  TO authenticated
  USING (auth.uid() = id_usuario)
  WITH CHECK (auth.uid() = id_usuario);
