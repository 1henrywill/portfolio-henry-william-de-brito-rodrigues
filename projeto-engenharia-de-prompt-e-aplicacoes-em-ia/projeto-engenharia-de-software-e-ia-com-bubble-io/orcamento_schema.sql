-- ============================================================
-- BANCO DE DADOS — SISTEMA DE ORÇAMENTOS
-- Gerado com base no Bubble.io
-- Projeto: Engenharia de Software e IA com Bubble.io
-- Autor: Henry William de Brito Rodrigues
-- ============================================================

-- ------------------------------------------------------------
-- 1. EMPRESA
-- ------------------------------------------------------------
CREATE TABLE empresa (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) UNIQUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. USUÁRIO
-- ------------------------------------------------------------
CREATE TABLE usuario (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    slug        VARCHAR(255) UNIQUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3. CLIENTE
-- ------------------------------------------------------------
CREATE TABLE cliente (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(255) NOT NULL,
    email       VARCHAR(255),
    empresa_id  INT REFERENCES empresa(id) ON DELETE SET NULL,
    slug        VARCHAR(255) UNIQUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 4. CATÁLOGO DE SERVIÇOS
-- ------------------------------------------------------------
CREATE TABLE catalogo_de_servicos (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(255) NOT NULL,
    descricao   TEXT,
    preco       NUMERIC(15, 2),
    slug        VARCHAR(255) UNIQUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 5. BUDGET (ORÇAMENTO)
-- Option Set de status: Pendente | Aprovado | Cancelado
-- Regra: campo creator_id garante isolamento por usuário (Privacy by Design)
-- ------------------------------------------------------------
CREATE TABLE budget (
    id          SERIAL PRIMARY KEY,
    cliente_id  INT REFERENCES cliente(id) ON DELETE SET NULL,
    creator_id  INT REFERENCES usuario(id) ON DELETE SET NULL,
    date        DATE,
    description TEXT,
    status      VARCHAR(50) CHECK (status IN ('Pendente', 'Aprovado', 'Cancelado')) DEFAULT 'Pendente',
    value       NUMERIC(15, 2) DEFAULT 0,
    slug        VARCHAR(255) UNIQUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 6. ORCAMENTO ITEM (itens filhos de um Budget)
-- Relação N:1 com budget — nunca criar lista de itens dentro do budget
-- ------------------------------------------------------------
CREATE TABLE orcamento_item (
    id           SERIAL PRIMARY KEY,
    budget_id    INT NOT NULL REFERENCES budget(id) ON DELETE CASCADE,
    descricao    TEXT,
    quantidade   NUMERIC(10, 2) DEFAULT 1,
    valor_unit   NUMERIC(15, 2) DEFAULT 0,
    valor_total  NUMERIC(15, 2) GENERATED ALWAYS AS (quantidade * valor_unit) STORED,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 7. FASE DO PROJETO (Option Set)
-- ------------------------------------------------------------
CREATE TABLE fase_projeto (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(255) NOT NULL,
    ordem       INT DEFAULT 0,
    slug        VARCHAR(255) UNIQUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 8. PROJETO
-- ------------------------------------------------------------
CREATE TABLE projeto (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(255) NOT NULL,
    cliente_id  INT REFERENCES cliente(id) ON DELETE SET NULL,
    fase_id     INT REFERENCES fase_projeto(id) ON DELETE SET NULL,
    budget_id   INT REFERENCES budget(id) ON DELETE SET NULL,
    slug        VARCHAR(255) UNIQUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 9. DESPESA DO PROJETO
-- ------------------------------------------------------------
CREATE TABLE despesa_projeto (
    id          SERIAL PRIMARY KEY,
    projeto_id  INT NOT NULL REFERENCES projeto(id) ON DELETE CASCADE,
    descricao   TEXT,
    valor       NUMERIC(15, 2) DEFAULT 0,
    data        DATE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 10. DISPOSITIVO (suporte — dispositivos de usuário)
-- ------------------------------------------------------------
CREATE TABLE dispositivo (
    id          SERIAL PRIMARY KEY,
    usuario_id  INT REFERENCES usuario(id) ON DELETE CASCADE,
    tipo        VARCHAR(100),
    token       VARCHAR(500),
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_budget_cliente   ON budget(cliente_id);
CREATE INDEX idx_budget_creator   ON budget(creator_id);
CREATE INDEX idx_budget_status    ON budget(status);
CREATE INDEX idx_budget_date      ON budget(date);
CREATE INDEX idx_orcamento_budget ON orcamento_item(budget_id);
CREATE INDEX idx_projeto_cliente  ON projeto(cliente_id);
CREATE INDEX idx_projeto_fase     ON projeto(fase_id);
CREATE INDEX idx_despesa_projeto  ON despesa_projeto(projeto_id);
CREATE INDEX idx_cliente_empresa  ON cliente(empresa_id);

-- ============================================================
-- SEED — DADOS DE EXEMPLO
-- ============================================================
INSERT INTO empresa (nome, slug) VALUES
    ('Atlas Logistics Inc.',  'atlas-logistics'),
    ('Green Supply Co.',       'green-supply'),
    ('NextGen Tech',           'nextgen-tech'),
    ('Mercado Plus',           'mercado-plus'),
    ('Construtora Bella',      'construtora-bella');

INSERT INTO usuario (nome, email, slug) VALUES
    ('Usuário Master',   'master@sistema.com', 'usuario-master'),
    ('João Rodrigues',   'joao@sistema.com',   'joao-rodrigues'),
    ('Ana Melo',         'ana@sistema.com',    'ana-melo');

INSERT INTO cliente (nome, email, empresa_id, slug) VALUES
    ('ops@atlaslogistics.com',  'ops@atlaslogistics.com',  1, 'atlas-logistics-client'),
    ('contato@greensupply.com', 'contato@greensupply.com', 2, 'green-supply-client'),
    ('hello@nextgentech.com',   'hello@nextgentech.com',   3, 'nextgen-tech-client'),
    ('vendas@mercadoplus.com',  'vendas@mercadoplus.com',  4, 'mercado-plus-client'),
    ('obra@construtora.com',    'obra@construtora.com',    5, 'construtora-bella-client');

INSERT INTO budget (cliente_id, creator_id, date, description, status, value, slug) VALUES
    (1, 1, '2026-03-14', 'Proposta de automação de armazém para o primeiro trimestre', 'Pendente',  24800.00, 'budget-001'),
    (2, 2, '2026-02-02', 'Sistema de rastreamento de inventário',                      'Aprovado',  18500.00, 'budget-002'),
    (3, 3, '2026-01-28', 'Integração de plataforma SaaS enterprise',                   'Aprovado',  67200.00, 'budget-003'),
    (4, 1, '2026-03-10', 'Redesign e migração de e-commerce',                          'Cancelado', 11900.00, 'budget-004'),
    (5, 2, '2026-03-05', 'Módulo de gestão de projetos e fases',                       'Pendente',  33400.00, 'budget-005');

INSERT INTO orcamento_item (budget_id, descricao, quantidade, valor_unit) VALUES
    (1, 'Consultoria de automação',    1, 8000.00),
    (1, 'Implementação de software',   1, 12000.00),
    (1, 'Treinamento da equipe',       2, 2400.00),
    (2, 'Licença de sistema',          1, 9500.00),
    (2, 'Configuração e deploy',       1, 9000.00),
    (3, 'Integração API enterprise',   1, 45000.00),
    (3, 'Suporte anual',               1, 22200.00),
    (4, 'Design UX/UI',                1, 6000.00),
    (4, 'Migração de dados',           1, 5900.00),
    (5, 'Desenvolvimento do módulo',   1, 28000.00),
    (5, 'Documentação técnica',        1, 5400.00);

INSERT INTO fase_projeto (nome, ordem, slug) VALUES
    ('Descoberta',    1, 'descoberta'),
    ('Planejamento',  2, 'planejamento'),
    ('Execução',      3, 'execucao'),
    ('Entrega',       4, 'entrega');

INSERT INTO projeto (nome, cliente_id, fase_id, budget_id, slug) VALUES
    ('Automação Armazém Q1',    1, 2, 1, 'projeto-atlas-q1'),
    ('Rastreamento Inventário', 2, 3, 2, 'projeto-green-supply'),
    ('Integração SaaS',         3, 4, 3, 'projeto-nextgen'),
    ('Gestão de Fases Bella',   5, 1, 5, 'projeto-bella');

INSERT INTO despesa_projeto (projeto_id, descricao, valor, data) VALUES
    (1, 'Passagem aérea — reunião kick-off',    850.00,  '2026-03-20'),
    (1, 'Hotel 2 noites',                        620.00,  '2026-03-21'),
    (2, 'Licença ferramenta de deploy',          300.00,  '2026-02-10'),
    (3, 'Consultoria externa de segurança',     4500.00,  '2026-02-05');
