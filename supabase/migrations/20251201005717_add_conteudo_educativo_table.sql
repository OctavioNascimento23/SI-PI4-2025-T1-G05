/*
  # Criar Tabela de Conteúdo Educativo
  
  Adiciona tabela para armazenar materiais educativos.
  
  ## Modificações
  
  1. Nova Tabela: conteudo_educativo
     - id_conteudo (uuid, PK)
     - titulo (varchar)
     - descricao (text)
     - tipo_conteudo (varchar) - ex: Vídeo, Artigo, Tutorial
     - url_conteudo (text)
     - categoria (varchar) - ex: Marketing Digital, Gestão, Vendas
     - nivel (varchar) - ex: Iniciante, Intermediário, Avançado
     - duracao_minutos (integer) - duração estimada
     - thumbnail_url (text) - imagem de capa
     - ordem (integer) - ordem de exibição
     - created_at (timestamptz)
  
  2. Segurança
     - RLS habilitado
     - Política: Todos podem ver conteúdo (público)
*/

-- Criar tabela de conteúdo educativo
CREATE TABLE IF NOT EXISTS conteudo_educativo (
  id_conteudo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo_conteudo VARCHAR(50) DEFAULT 'Artigo',
  url_conteudo TEXT,
  categoria VARCHAR(100),
  nivel VARCHAR(50) DEFAULT 'Iniciante',
  duracao_minutos INTEGER DEFAULT 10,
  thumbnail_url TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE conteudo_educativo ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem visualizar conteúdo (público)
CREATE POLICY "Anyone can view educational content"
ON conteudo_educativo FOR SELECT
TO public
USING (true);

-- Política: Apenas autenticados podem criar conteúdo (para futura admin área)
CREATE POLICY "Authenticated users can create content"
ON conteudo_educativo FOR INSERT
TO authenticated
WITH CHECK (true);
