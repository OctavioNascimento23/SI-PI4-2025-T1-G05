-- ===================================
-- Criação dos ENUMs
-- ===================================

-- Tipo de usuário
CREATE TYPE IF NOT EXISTS tipo_usuario_enum AS ENUM ('Comerciante', 'Consultor');

-- Tipo de plano
CREATE TYPE IF NOT EXISTS plano_enum AS ENUM ('Gratuito', 'Premium');

-- Tipo de negócio
CREATE TYPE IF NOT EXISTS tipo_negocio_enum AS ENUM ('Bar', 'Padaria', 'Mercadinho');

-- Status do roadmap
CREATE TYPE IF NOT EXISTS status_roadmap_enum AS ENUM ('Em andamento', 'Concluído');

-- Versão de acesso ao conteúdo
CREATE TYPE IF NOT EXISTS versao_acesso_enum AS ENUM ('Gratuito', 'Premium');

-- ===================================
-- Criação das tabelas
-- ===================================

-- USUARIO
CREATE TABLE IF NOT EXISTS USUARIO (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario tipo_usuario_enum NOT NULL,
    plano plano_enum NOT NULL,
    ra VARCHAR(50),
    curso VARCHAR(100),
    telefone VARCHAR(50)
);

-- NEGOCIO
CREATE TABLE IF NOT EXISTS NEGOCIO (
    id_negocio SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    nome_negocio VARCHAR(255) NOT NULL,
    tipo_negocio tipo_negocio_enum NOT NULL,
    descricao_inicial TEXT
);

-- DIAGNOSTICO
CREATE TABLE IF NOT EXISTS DIAGNOSTICO (
    id_diagnostico SERIAL PRIMARY KEY,
    id_negocio INT NOT NULL REFERENCES NEGOCIO(id_negocio) ON DELETE CASCADE,
    data_diagnostico DATE NOT NULL,
    respostas_json JSONB,
    pontuacao_digital INT
);

-- ROADMAP
CREATE TABLE IF NOT EXISTS ROADMAP (
    id_roadmap SERIAL PRIMARY KEY,
    id_diagnostico INT NOT NULL REFERENCES DIAGNOSTICO(id_diagnostico) ON DELETE CASCADE,
    data_geracao DATE NOT NULL,
    etapas_detalhadas TEXT,
    status status_roadmap_enum NOT NULL
);

-- CONSULTORIA
CREATE TABLE IF NOT EXISTS CONSULTORIA (
    id_consultoria SERIAL PRIMARY KEY,
    id_usuario_comerciante INT NOT NULL REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    id_usuario_consultor INT NOT NULL REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    data_hora_agendamento TIMESTAMP NOT NULL,
    link_reuniao VARCHAR(255),
    historico_chat TEXT,
    observacoes_suporte TEXT
);

-- CONTEUDO_EDUCATIVO
CREATE TABLE IF NOT EXISTS CONTEUDO_EDUCATIVO (
    id_conteudo SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    url_acesso VARCHAR(255),
    versao_acesso versao_acesso_enum NOT NULL
);

-- ACOMPANHAMENTO_CONTEUDO (Entidade associativa)
CREATE TABLE IF NOT EXISTS ACOMPANHAMENTO_CONTEUDO (
    id_usuario INT NOT NULL REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    id_conteudo INT NOT NULL REFERENCES CONTEUDO_EDUCATIVO(id_conteudo) ON DELETE CASCADE,
    data_acesso DATE NOT NULL,
    PRIMARY KEY (id_usuario, id_conteudo)
);