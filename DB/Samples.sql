-- ===================================
-- Populando a tabela USUARIO
-- ===================================
INSERT INTO USUARIO (nome, email, senha_hash, tipo_usuario, plano, ra, curso, telefone)
VALUES
('Alice Silva', 'alice@email.com', 'hash123', 'Comerciante', 'Premium', 'RA123', 'Administração', '+551199999999'),
('Bob Santos', 'bob@email.com', 'hash456', 'Comerciante', 'Gratuito', 'RA124', 'Marketing', '+551198888888'),
('Carla Lima', 'carla@email.com', 'hash789', 'Consultor', 'Premium', NULL, NULL, '+551197777777');

-- ===================================
-- Populando a tabela CONTEUDO_EDUCATIVO
-- ===================================
INSERT INTO CONTEUDO_EDUCATIVO (titulo, categoria, url_acesso, versao_acesso)
VALUES
('Como aumentar vendas', 'Marketing', 'https://conteudo1.com', 'Gratuito'),
('Gestão financeira', 'Finanças', 'https://conteudo2.com', 'Premium'),
('Marketing digital', 'Marketing', 'https://conteudo3.com', 'Gratuito');

-- ===================================
-- Populando a tabela NEGOCIO
-- ===================================
INSERT INTO NEGOCIO (id_usuario, nome_negocio, tipo_negocio, descricao_inicial)
VALUES
(1, 'Padaria do Alice', 'Padaria', 'Padaria localizada no centro da cidade'),
(1, 'Bar do Alice', 'Bar', 'Bar especializado em cervejas artesanais'),
(2, 'Mercadinho do Bob', 'Mercadinho', 'Mercadinho de bairro com produtos variados');

-- ===================================
-- Populando a tabela DIAGNOSTICO
-- ===================================
INSERT INTO DIAGNOSTICO (id_negocio, data_diagnostico, respostas_json, pontuacao_digital)
VALUES
(1, '2025-10-22', '{"pergunta1": "sim", "pergunta2": "não"}', 75),
(2, '2025-10-21', '{"pergunta1": "sim", "pergunta2": "sim"}', 85),
(3, '2025-10-20', '{"pergunta1": "não", "pergunta2": "não"}', 60);

-- ===================================
-- Populando a tabela ROADMAP
-- ===================================
INSERT INTO ROADMAP (id_diagnostico, data_geracao, etapas_detalhadas, status)
VALUES
(1, '2025-10-22', '1. Melhorar presença online; 2. Treinamento equipe', 'Em andamento'),
(2, '2025-10-21', '1. Criar promoções semanais; 2. Revisar estoque', 'Concluído'),
(3, '2025-10-20', '1. Atualizar sistema financeiro; 2. Treinamento digital', 'Em andamento');

-- ===================================
-- Populando a tabela CONSULTORIA
-- ===================================
INSERT INTO CONSULTORIA (id_usuario_comerciante, id_usuario_consultor, data_hora_agendamento, link_reuniao, historico_chat, observacoes_suporte)
VALUES
(1, 3, '2025-10-23 10:00:00', 'https://meet.com/1', 'Chat inicial sobre marketing', 'Nenhuma observação'),
(2, 3, '2025-10-24 15:30:00', 'https://meet.com/2', 'Discussão sobre finanças', 'Acompanhamento semanal');

-- ===================================
-- Populando a tabela ACOMPANHAMENTO_CONTEUDO
-- ===================================
INSERT INTO ACOMPANHAMENTO_CONTEUDO (id_usuario, id_conteudo, data_acesso)
VALUES
(1, 1, '2025-10-22'),
(1, 2, '2025-10-22'),
(2, 1, '2025-10-21'),
(2, 3, '2025-10-21');
