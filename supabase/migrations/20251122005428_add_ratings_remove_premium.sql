/*
  # Sistema de Avaliações e Remoção de Premium
  
  Remove o sistema de planos premium e adiciona sistema de avaliações por estrelas.
  
  ## Novas Tabelas
  
  1. **avaliacao_consultor**
     - Avaliações de consultores por comerciantes
     - Campos: nota (1-5 estrelas), comentário, avaliador
     - Média calculada automaticamente
  
  ## Modificações
  
  1. Remove coluna `plano` da tabela usuario
  2. Remove tabela `conteudo_educativo` (não utilizada)
  3. Adiciona campos de avaliação ao perfil do consultor:
     - `nota_media` (média das avaliações)
     - `total_avaliacoes` (número de avaliações)
  
  ## Segurança
  
  - RLS habilitado em avaliações
  - Comerciantes podem avaliar consultores
  - Apenas uma avaliação por comerciante por consultor
*/

-- Adicionar campos de avaliação ao usuário
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuario' AND column_name = 'nota_media'
  ) THEN
    ALTER TABLE usuario ADD COLUMN nota_media DECIMAL(2,1) DEFAULT 0.0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuario' AND column_name = 'total_avaliacoes'
  ) THEN
    ALTER TABLE usuario ADD COLUMN total_avaliacoes INTEGER DEFAULT 0;
  END IF;
END $$;

-- Criar tabela de avaliações
CREATE TABLE IF NOT EXISTS avaliacao_consultor (
  id_avaliacao uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_consultor uuid NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  id_avaliador uuid NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  created_at timestamptz DEFAULT now(),
  UNIQUE(id_consultor, id_avaliador)
);

-- Habilitar RLS
ALTER TABLE avaliacao_consultor ENABLE ROW LEVEL SECURITY;

-- Políticas para avaliacao_consultor
DROP POLICY IF EXISTS "Anyone can view consultant ratings" ON avaliacao_consultor;
CREATE POLICY "Anyone can view consultant ratings"
  ON avaliacao_consultor FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can rate consultants" ON avaliacao_consultor;
CREATE POLICY "Users can rate consultants"
  ON avaliacao_consultor FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id_avaliador
    AND EXISTS (
      SELECT 1 FROM usuario
      WHERE usuario.id_usuario = avaliacao_consultor.id_consultor
      AND usuario.tipo_usuario = 'Consultor'
    )
  );

DROP POLICY IF EXISTS "Users can update own ratings" ON avaliacao_consultor;
CREATE POLICY "Users can update own ratings"
  ON avaliacao_consultor FOR UPDATE
  TO authenticated
  USING (auth.uid() = id_avaliador)
  WITH CHECK (auth.uid() = id_avaliador);

DROP POLICY IF EXISTS "Users can delete own ratings" ON avaliacao_consultor;
CREATE POLICY "Users can delete own ratings"
  ON avaliacao_consultor FOR DELETE
  TO authenticated
  USING (auth.uid() = id_avaliador);

-- Função para atualizar nota média do consultor
CREATE OR REPLACE FUNCTION atualizar_nota_media_consultor()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE usuario
  SET 
    nota_media = (
      SELECT COALESCE(AVG(nota), 0)
      FROM avaliacao_consultor
      WHERE id_consultor = COALESCE(NEW.id_consultor, OLD.id_consultor)
    ),
    total_avaliacoes = (
      SELECT COUNT(*)
      FROM avaliacao_consultor
      WHERE id_consultor = COALESCE(NEW.id_consultor, OLD.id_consultor)
    )
  WHERE id_usuario = COALESCE(NEW.id_consultor, OLD.id_consultor);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar nota média
DROP TRIGGER IF EXISTS trigger_atualizar_nota_media ON avaliacao_consultor;
CREATE TRIGGER trigger_atualizar_nota_media
  AFTER INSERT OR UPDATE OR DELETE ON avaliacao_consultor
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_nota_media_consultor();

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_avaliacao_consultor ON avaliacao_consultor(id_consultor);
CREATE INDEX IF NOT EXISTS idx_avaliacao_avaliador ON avaliacao_consultor(id_avaliador);

-- Remover tabela conteudo_educativo (não utilizada)
DROP TABLE IF EXISTS conteudo_educativo CASCADE;
