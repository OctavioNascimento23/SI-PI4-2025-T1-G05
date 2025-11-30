/*
  # Adicionar Política de INSERT para Usuário
  
  Permite que novos usuários sejam criados na tabela usuario durante o signup.
  
  ## Mudanças
  
  1. Adiciona política INSERT para tabela usuario
     - Permite que usuários autenticados criem seu próprio registro
     - Garante que o id_usuario corresponda ao auth.uid()
*/

-- Adicionar política de INSERT para usuario
DROP POLICY IF EXISTS "Users can insert own profile" ON usuario;
CREATE POLICY "Users can insert own profile"
  ON usuario FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id_usuario);
