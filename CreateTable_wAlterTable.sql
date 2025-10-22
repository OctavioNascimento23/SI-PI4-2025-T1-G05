-- ===================================
-- Criação dos ENUMs
-- ===================================

CREATE TYPE tipo_usuario_enum AS ENUM ('Comerciante', 'Consultor');
CREATE TYPE plano_enum AS ENUM ('Gratuito', 'Premium');
CREATE TYPE tipo_negocio_enum AS ENUM ('Bar', 'Padaria', 'Mercadinho');
CREATE TYPE status_roadmap_enum AS ENUM ('Em andamento', 'Concluído');
CREATE TYPE versao_acesso_enum AS ENUM ('Gratuito', 'Premium');

-- ===================================
-- Criação das tabelas (ordem correta)
-- ===================================

-- USUARIO (pai de várias tabelas)
CREATE TABLE USUARIO (
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

-- CONTEUDO_EDUCATIVO (pai da tabela associativa)
CREATE TABLE CONTEUDO_EDUCATIVO (
    id_conteudo SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    url_acesso VARCHAR(255),
    versao_acesso versao_acesso_enum NOT NULL
);

-- NEGOCIO
CREATE TABLE NEGOCIO (
    id_negocio SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    nome_negocio VARCHAR(255) NOT NULL,
    tipo_negocio tipo_negocio_enum NOT NULL,
    descricao_inicial TEXT
);

-- DIAGNOSTICO
CREATE TABLE DIAGNOSTICO (
    id_diagnostico SERIAL PRIMARY KEY,
    id_negocio INT NOT NULL,
    data_diagnostico DATE NOT NULL,
    respostas_json JSONB,
    pontuacao_digital INT
);

-- ROADMAP
CREATE TABLE ROADMAP (
    id_roadmap SERIAL PRIMARY KEY,
    id_diagnostico INT NOT NULL,
    data_geracao DATE NOT NULL,
    etapas_detalhadas TEXT,
    status status_roadmap_enum NOT NULL
);

-- CONSULTORIA
CREATE TABLE CONSULTORIA (
    id_consultoria SERIAL PRIMARY KEY,
    id_usuario_comerciante INT NOT NULL,
    id_usuario_consultor INT NOT NULL,
    data_hora_agendamento TIMESTAMP NOT NULL,
    link_reuniao VARCHAR(255),
    historico_chat TEXT,
    observacoes_suporte TEXT
);

-- ACOMPANHAMENTO_CONTEUDO (entidade associativa)
CREATE TABLE ACOMPANHAMENTO_CONTEUDO (
    id_usuario INT NOT NULL,
    id_conteudo INT NOT NULL,
    data_acesso DATE NOT NULL,
    PRIMARY KEY (id_usuario, id_conteudo)
);

-- ===================================
-- Criação das Foreign Keys
-- ===================================

ALTER TABLE NEGOCIO
ADD CONSTRAINT fk_negocio_usuario
FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
ON DELETE CASCADE;

ALTER TABLE DIAGNOSTICO
ADD CONSTRAINT fk_diagnostico_negocio
FOREIGN KEY (id_negocio) REFERENCES NEGOCIO(id_negocio)
ON DELETE CASCADE;

ALTER TABLE ROADMAP
ADD CONSTRAINT fk_roadmap_diagnostico
FOREIGN KEY (id_diagnostico) REFERENCES DIAGNOSTICO(id_diagnostico)
ON DELETE CASCADE;

ALTER TABLE CONSULTORIA
ADD CONSTRAINT fk_consultoria_comerciante
FOREIGN KEY (id_usuario_comerciante) REFERENCES USUARIO(id_usuario)
ON DELETE CASCADE;

ALTER TABLE CONSULTORIA
ADD CONSTRAINT fk_consultoria_consultor
FOREIGN KEY (id_usuario_consultor) REFERENCES USUARIO(id_usuario)
ON DELETE CASCADE;

ALTER TABLE ACOMPANHAMENTO_CONTEUDO
ADD CONSTRAINT fk_acompanhamento_usuario
FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
ON DELETE CASCADE;

ALTER TABLE ACOMPANHAMENTO_CONTEUDO
ADD CONSTRAINT fk_acompanhamento_conteudo
FOREIGN KEY (id_conteudo) REFERENCES CONTEUDO_EDUCATIVO(id_conteudo)
ON DELETE CASCADE;
