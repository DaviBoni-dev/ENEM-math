-- ==========================================================
-- MathFlow (ENEM Math) - Estrutura do Banco de Dados PostgreSQL
-- ==========================================================

-- 1. Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255), -- Pode ser nulo caso o login seja via Google
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Temas / Tópicos de Matemática
CREATE TABLE IF NOT EXISTS temas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    area_geral VARCHAR(255)
);

-- 3. Tabela de Questões
CREATE TABLE IF NOT EXISTS questoes (
    id SERIAL PRIMARY KEY,
    enunciado TEXT NOT NULL,
    comando TEXT NOT NULL,
    alternativa_a TEXT NOT NULL,
    alternativa_b TEXT NOT NULL,
    alternativa_c TEXT NOT NULL,
    alternativa_d TEXT NOT NULL,
    alternativa_e TEXT NOT NULL,
    resposta_correta VARCHAR(5) NOT NULL,
    ano_enem VARCHAR(10) NOT NULL,
    urls_imagens TEXT[], -- Array de URLs de imagens associadas à questão
    url_imagem_principal TEXT,
    disciplina VARCHAR(50) DEFAULT 'matematica',
    tema VARCHAR(255),
    tema_id INTEGER REFERENCES temas(id) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Histórico de Respostas dos Usuários
CREATE TABLE IF NOT EXISTS historico_respostas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    questao_id INTEGER NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
    opcao_escolhida VARCHAR(5) NOT NULL,
    acertou BOOLEAN NOT NULL,
    data_resposta TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Histórico de Simulados Concluídos
CREATE TABLE IF NOT EXISTS simulados_concluidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    ano_enem VARCHAR(10) NOT NULL,
    total_questoes INTEGER NOT NULL,
    total_acertos INTEGER NOT NULL,
    tempo_segundos INTEGER NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- DADOS INICIAIS (SEED) - Temas Principais do ENEM
-- ==========================================================
INSERT INTO temas (nome, area_geral) VALUES
    ('Geometria Plana', 'Geometria'),
    ('Geometria Espacial', 'Geometria'),
    ('Funções e Gráficos', 'Álgebra'),
    ('Estatística e Médias', 'Estatística e Probabilidade'),
    ('Probabilidade', 'Estatística e Probabilidade'),
    ('Porcentagem e Matemática Financeira', 'Aritmética'),
    ('Razão, Proporção e Regra de Três', 'Aritmética'),
    ('Trigonometria', 'Geometria e Álgebra'),
    ('Análise Combinatória', 'Aritmética e Álgebra')
ON CONFLICT (nome) DO NOTHING;

