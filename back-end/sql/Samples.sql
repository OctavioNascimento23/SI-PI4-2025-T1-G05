-- ===================================
-- Populando a tabela USUARIO
-- ===================================
INSERT INTO USUARIO (nome, email, senha_hash, tipo_usuario, plano, ra, curso, telefone)
VALUES
('Alice Silva', 'alice@email.com', 'hash123', 'Comerciante', 'Premium', 'RA123', 'Administração', '+551199999999'),
('Bob Santos', 'bob@email.com', 'hash456', 'Comerciante', 'Gratuito', 'RA124', 'Marketing', '+551198888888'),
('Carla Lima', 'carla@email.com', 'hash789', 'Consultor', 'Premium', NULL, NULL, '+551197777777');

-- Conteúdos
INSERT INTO CONTEUDO_EDUCATIVO (titulo, categoria, url_acesso, versao_acesso)
VALUES
('Como aumentar vendas', 'Marketing', 'https://conteudo1.com', 'Gratuito'),
('Gestão financeira', 'Finanças', 'https://conteudo2.com', 'Premium'),
('Marketing digital', 'Marketing', 'https://conteudo3.com', 'Gratuito');