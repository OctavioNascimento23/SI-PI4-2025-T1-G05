/*
  # Criar Storage Bucket para Fotos de Perfil
  
  Cria bucket de armazenamento para fotos de perfil dos usuários.
  
  ## Modificações
  
  1. Cria bucket público para fotos:
     - `profile-photos` - Bucket para armazenar fotos de perfil
  
  2. Políticas de Storage:
     - Qualquer pessoa pode visualizar fotos (público)
     - Usuários autenticados podem fazer upload de suas próprias fotos
     - Usuários podem atualizar/deletar apenas suas próprias fotos
  
  ## Notas
  
  - Bucket público para acesso fácil às imagens
  - Controle de acesso baseado no ID do usuário no nome do arquivo
  - Limite de tamanho pode ser configurado no Supabase Dashboard
*/

-- Criar bucket público para fotos de perfil
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Política: Qualquer um pode ver as fotos (público)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Política: Usuários autenticados podem fazer upload
CREATE POLICY "Authenticated users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: Usuários podem atualizar suas próprias fotos
CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: Usuários podem deletar suas próprias fotos
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
