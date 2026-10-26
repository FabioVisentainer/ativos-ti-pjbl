-- Esquema relacional do Sistema de Controle de Ativos de Informática.
-- Valores de enum são gravados em VARCHAR (nome da constante Kotlin) e protegidos por CHECK.

CREATE TABLE colaborador (
    id        BIGINT       NOT NULL AUTO_INCREMENT,
    nome      VARCHAR(120) NOT NULL,
    matricula VARCHAR(20)  NOT NULL,
    setor     VARCHAR(60)  NOT NULL,
    situacao  VARCHAR(10)  NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_colaborador_matricula UNIQUE (matricula),
    CONSTRAINT ck_colaborador_situacao CHECK (situacao IN ('ATIVO', 'INATIVO'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE usuario (
    id                BIGINT       NOT NULL AUTO_INCREMENT,
    nome              VARCHAR(120) NOT NULL,
    conta_corporativa VARCHAR(160) NOT NULL,
    perfil            VARCHAR(20)  NOT NULL,
    ultimo_acesso     DATETIME     NULL,
    situacao          VARCHAR(10)  NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_usuario_conta UNIQUE (conta_corporativa),
    CONSTRAINT ck_usuario_perfil CHECK (perfil IN ('COLABORADOR', 'TECNICO_TI', 'GESTOR_TI')),
    CONSTRAINT ck_usuario_situacao CHECK (situacao IN ('ATIVO', 'INATIVO'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE ativo (
    id                BIGINT         NOT NULL AUTO_INCREMENT,
    tipo              VARCHAR(60)    NOT NULL,
    marca             VARCHAR(80)    NOT NULL,
    modelo            VARCHAR(120)   NOT NULL,
    numero_patrimonio VARCHAR(30)    NOT NULL,
    numero_serie      VARCHAR(60)    NOT NULL,
    status            VARCHAR(20)    NOT NULL,
    colaborador_id    BIGINT         NULL,
    setor             VARCHAR(60)    NULL,
    data_aquisicao    DATE           NOT NULL,
    valor_aquisicao   DECIMAL(12, 2) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_ativo_patrimonio UNIQUE (numero_patrimonio),
    CONSTRAINT fk_ativo_colaborador FOREIGN KEY (colaborador_id) REFERENCES colaborador (id),
    CONSTRAINT ck_ativo_status CHECK (status IN ('EM_ESTOQUE', 'EM_USO', 'EM_MANUTENCAO', 'BAIXADO'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE manutencao (
    id        BIGINT         NOT NULL AUTO_INCREMENT,
    data      DATE           NOT NULL,
    ativo_id  BIGINT         NOT NULL,
    tipo      VARCHAR(12)    NOT NULL,
    descricao VARCHAR(255)   NOT NULL,
    custo     DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_manutencao_ativo FOREIGN KEY (ativo_id) REFERENCES ativo (id),
    CONSTRAINT ck_manutencao_tipo CHECK (tipo IN ('CORRETIVA', 'PREVENTIVA'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE alocacao (
    id             BIGINT NOT NULL AUTO_INCREMENT,
    ativo_id       BIGINT NOT NULL,
    colaborador_id BIGINT NOT NULL,
    data_retirada  DATE   NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_alocacao_ativo FOREIGN KEY (ativo_id) REFERENCES ativo (id),
    CONSTRAINT fk_alocacao_colaborador FOREIGN KEY (colaborador_id) REFERENCES colaborador (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE movimentacao (
    id                 BIGINT       NOT NULL AUTO_INCREMENT,
    data               DATE         NOT NULL,
    ativo_id           BIGINT       NOT NULL,
    operacao           VARCHAR(60)  NOT NULL,
    colaborador_id     BIGINT       NULL,
    registrado_por_id  BIGINT       NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_movimentacao_ativo FOREIGN KEY (ativo_id) REFERENCES ativo (id),
    CONSTRAINT fk_movimentacao_colaborador FOREIGN KEY (colaborador_id) REFERENCES colaborador (id),
    CONSTRAINT fk_movimentacao_usuario FOREIGN KEY (registrado_por_id) REFERENCES usuario (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
