/*
  # Adicionar Campo de Descrição à Consultoria
  
  Adiciona campo para o comerciante descrever sua solicitação de consultoria.
  
  ## Modificações
  
  1. Adiciona campo à tabela consultoria:
     - `descricao` (TEXT) - Descrição da solicitação enviada pelo comerciante
  
  ## Notas
  
  - Campo opcional para permitir solicitações existentes
  - Armazena o contexto e necessidades do comerciante
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultoria' AND column_name = 'descricao'
  ) THEN
    ALTER TABLE consultoria ADD COLUMN descricao TEXT;
  END IF;
END $$;
