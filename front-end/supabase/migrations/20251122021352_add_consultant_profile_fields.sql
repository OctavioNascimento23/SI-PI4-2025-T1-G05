/*
  # Adicionar Campos de Portfólio e Redes Sociais
  
  Adiciona campos para portfólio e redes sociais ao perfil do consultor.
  
  ## Modificações
  
  1. Adiciona campos ao perfil do usuário:
     - `portfolio_url` (URL do portfólio)
     - `github_url` (GitHub)
     - `instagram_url` (Instagram)
     - `website_url` (Website pessoal)
     - `especialidades` (Array de especialidades)
  
  ## Notas
  
  - Todos os campos são opcionais
  - URLs serão validadas no frontend
*/

-- Adicionar campos de portfólio e redes sociais
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuario' AND column_name = 'portfolio_url'
  ) THEN
    ALTER TABLE usuario ADD COLUMN portfolio_url TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuario' AND column_name = 'github_url'
  ) THEN
    ALTER TABLE usuario ADD COLUMN github_url TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuario' AND column_name = 'instagram_url'
  ) THEN
    ALTER TABLE usuario ADD COLUMN instagram_url TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuario' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE usuario ADD COLUMN website_url TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuario' AND column_name = 'especialidades'
  ) THEN
    ALTER TABLE usuario ADD COLUMN especialidades TEXT[];
  END IF;
END $$;
