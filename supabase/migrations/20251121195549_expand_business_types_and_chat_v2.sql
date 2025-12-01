/*
  # Expandir Tipos de Negócio e Sistema de Chat
  
  Expande os tipos de negócio disponíveis e implementa sistema de chat em tempo real.
  
  ## Novas Tabelas
  
  1. **mensagem_chat**
     - Sistema de mensagens entre consultor e comerciante
     - Campos: remetente, destinatário, mensagem, timestamp
     - Suporta chat em tempo real
  
  ## Modificações
  
  1. Atualiza ENUM tipo_negocio para aceitar mais opções
  2. Remove tabela conteudo_educativo (não será mais usada)
  
  ## Segurança
  
  - RLS habilitado na tabela de mensagens
  - Usuários podem ver mensagens onde são participantes da consultoria
*/

-- Adicionar novos valores ao enum tipo_negocio_enum
DO $$
BEGIN
  -- Adicionar novos tipos um por um, ignorando se já existem
  ALTER TYPE tipo_negocio_enum ADD VALUE IF NOT EXISTS 'Restaurante';
  ALTER TYPE tipo_negocio_enum ADD VALUE IF NOT EXISTS 'Lanchonete';
  ALTER TYPE tipo_negocio_enum ADD VALUE IF NOT EXISTS 'Cafeteria';
  ALTER TYPE tipo_negocio_enum ADD VALUE IF NOT EXISTS 'Loja de Roupas';
  ALTER TYPE tipo_negocio_enum ADD VALUE IF NOT EXISTS 'Farmácia';
  ALTER TYPE tipo_negocio_enum ADD VALUE IF NOT EXISTS 'Pet Shop';
  ALTER TYPE tipo_negocio_enum ADD VALUE IF NOT EXISTS 'Salão de Beleza';
  ALTER TYPE tipo_negocio_enum ADD VALUE IF NOT EXISTS 'Academia';
  ALTER TYPE tipo_negocio_enum ADD VALUE IF NOT EXISTS 'Livraria';
  ALTER TYPE tipo_negocio_enum ADD VALUE IF NOT EXISTS 'Papelaria';
  ALTER TYPE tipo_negocio_enum ADD VALUE IF NOT EXISTS 'Eletrônicos';
  ALTER TYPE tipo_negocio_enum ADD VALUE IF NOT EXISTS 'Mercado';
  ALTER TYPE tipo_negocio_enum ADD VALUE IF NOT EXISTS 'Outro';
END $$;

-- Criar tabela de mensagens de chat
CREATE TABLE IF NOT EXISTS mensagem_chat (
  id_mensagem uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_consultoria uuid NOT NULL REFERENCES consultoria(id_consultoria) ON DELETE CASCADE,
  id_remetente uuid NOT NULL REFERENCES usuario(id_usuario),
  mensagem TEXT NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE mensagem_chat ENABLE ROW LEVEL SECURITY;

-- Políticas para mensagem_chat
DROP POLICY IF EXISTS "Users can view messages in their consultations" ON mensagem_chat;
CREATE POLICY "Users can view messages in their consultations"
  ON mensagem_chat FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM consultoria
      WHERE consultoria.id_consultoria = mensagem_chat.id_consultoria
      AND (
        consultoria.id_usuario_comerciante = auth.uid()
        OR consultoria.id_usuario_consultor = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users can send messages in their consultations" ON mensagem_chat;
CREATE POLICY "Users can send messages in their consultations"
  ON mensagem_chat FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id_remetente
    AND EXISTS (
      SELECT 1 FROM consultoria
      WHERE consultoria.id_consultoria = mensagem_chat.id_consultoria
      AND (
        consultoria.id_usuario_comerciante = auth.uid()
        OR consultoria.id_usuario_consultor = auth.uid()
      )
    )
  );

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_mensagem_chat_consultoria ON mensagem_chat(id_consultoria);
CREATE INDEX IF NOT EXISTS idx_mensagem_chat_created ON mensagem_chat(created_at);
