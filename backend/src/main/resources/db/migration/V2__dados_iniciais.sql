-- Dados iniciais: mesmos registros dos JSONs usados no mock anterior (api/src/data/*.json).
-- Os ids são preservados; vínculos por nome foram convertidos em chaves estrangeiras.

INSERT INTO colaborador (id, nome, matricula, setor, situacao) VALUES
  (1, 'Marina Alves', '0041287', 'Financeiro', 'ATIVO'),
  (2, 'Carlos Nunes', '0038114', 'Suporte', 'ATIVO'),
  (3, 'Priscila Rocha', '0052900', 'Comercial', 'ATIVO'),
  (4, 'Eduardo Lima', '0029045', 'TI', 'ATIVO'),
  (5, 'Renata Farias', '0060221', 'RH', 'ATIVO'),
  (6, 'Tiago Moraes', '0011903', 'Logística', 'INATIVO'),
  (7, 'Juliana Peres', '0058812', 'Recursos Humanos', 'ATIVO'),
  (8, 'Fernanda Ribeiro', '0044210', 'Marketing', 'ATIVO');

INSERT INTO usuario (id, nome, conta_corporativa, perfil, ultimo_acesso, situacao) VALUES
  (1, 'Eduardo Lima', 'eduardo.lima@empresa.com', 'TECNICO_TI', '2026-08-24 09:12:00', 'ATIVO'),
  (2, 'Ana Prado', 'ana.prado@empresa.com', 'TECNICO_TI', '2026-08-23 17:40:00', 'ATIVO'),
  (3, 'Rogério Bastos', 'rogerio.bastos@empresa.com', 'GESTOR_TI', '2026-08-24 08:05:00', 'ATIVO'),
  (4, 'Marina Alves', 'marina.alves@empresa.com', 'COLABORADOR', '2026-08-20 14:22:00', 'ATIVO'),
  (5, 'Tiago Moraes', 'tiago.moraes@empresa.com', 'COLABORADOR', '2026-02-11 10:55:00', 'INATIVO');

INSERT INTO ativo (id, tipo, marca, modelo, numero_patrimonio, numero_serie, status, colaborador_id, setor, data_aquisicao, valor_aquisicao) VALUES
  (1, 'Notebook', 'Dell', 'Latitude 5440', 'PAT-0001', '8KJ2H31', 'EM_USO', 1, 'Financeiro', '2023-03-14', 6890.00),
  (2, 'Notebook', 'Lenovo', 'ThinkPad E14', 'PAT-0002', 'LNV7712', 'EM_MANUTENCAO', 4, 'TI', '2022-08-02', 6200.00),
  (3, 'Monitor', 'LG', '24MK430H', 'PAT-0003', 'LG9920T', 'EM_ESTOQUE', NULL, NULL, '2024-01-10', 899.00),
  (4, 'Notebook', 'Apple', 'MacBook Air M2', 'PAT-0004', 'APL4402', 'EM_USO', 8, 'Marketing', '2023-11-20', 11990.00),
  (5, 'Headset', 'Logitech', 'H390', 'PAT-0005', 'LOG5521', 'EM_USO', 4, 'TI', '2023-05-06', 220.00),
  (6, 'Impressora', 'HP', 'LaserJet Pro M15w', 'PAT-0006', 'HP00871', 'EM_MANUTENCAO', NULL, 'Administrativo', '2021-09-18', 1450.00),
  (7, 'Monitor', 'Samsung', 'S27A400', 'PAT-0007', 'SM00998', 'EM_USO', 1, 'Financeiro', '2023-03-14', 1120.00),
  (8, 'Notebook', 'Dell', 'Vostro 3520', 'PAT-0008', '8KJ2H44', 'BAIXADO', NULL, NULL, '2019-02-25', 4200.00),
  (9, 'Mouse', 'Logitech', 'M170', 'PAT-0009', 'LOG1205', 'EM_USO', 8, 'Marketing', '2023-11-20', 65.00),
  (10, 'Notebook', 'Lenovo', 'IdeaPad 3', 'PAT-0010', 'LNV0341', 'EM_ESTOQUE', NULL, NULL, '2024-04-02', 3450.00),
  (11, 'Teclado', 'Dell', 'KB216', 'PAT-0011', 'MS11204', 'EM_USO', 4, 'TI', '2023-05-06', 95.00),
  (12, 'Notebook', 'HP', 'ProBook 440', 'PAT-0012', 'HP44012', 'EM_MANUTENCAO', 7, 'Recursos Humanos', '2022-06-30', 5680.00),
  (13, 'Monitor', 'LG', '24MK430H', 'PAT-0013', 'LG9921T', 'EM_ESTOQUE', NULL, NULL, '2024-01-10', 899.00),
  (14, 'Dock station', 'Dell', 'WD19S', 'PAT-0014', 'WD19S021', 'EM_USO', 1, 'Financeiro', '2023-03-14', 780.00);

INSERT INTO manutencao (id, data, ativo_id, tipo, descricao, custo) VALUES
  (1, '2026-08-22', 2, 'CORRETIVA', 'Sem áudio no canal esquerdo', 130.00),
  (2, '2026-08-18', 6, 'CORRETIVA', 'Cabo USB rompido', 95.00),
  (3, '2026-06-14', 2, 'CORRETIVA', 'Troca de bateria', 255.50),
  (4, '2026-05-27', 6, 'CORRETIVA', 'Substituição da fonte', 215.00),
  (5, '2026-04-12', 12, 'PREVENTIVA', 'Upgrade de memória e limpeza', 350.00),
  (6, '2026-03-03', 8, 'CORRETIVA', 'Painel com falha permanente', 680.00),
  (7, '2026-02-19', 8, 'PREVENTIVA', 'Limpeza interna e pasta térmica', 500.00),
  (8, '2026-01-10', 12, 'CORRETIVA', 'Troca de teclado', 400.00);

INSERT INTO alocacao (id, ativo_id, colaborador_id, data_retirada) VALUES
  (1, 1, 1, '2023-03-14'),
  (2, 7, 1, '2023-03-14'),
  (3, 4, 8, '2023-11-20'),
  (4, 9, 8, '2023-11-20'),
  (5, 5, 4, '2023-05-06'),
  (6, 11, 4, '2023-05-06'),
  (7, 12, 7, '2022-06-30');

INSERT INTO movimentacao (id, data, ativo_id, operacao, colaborador_id, registrado_por_id) VALUES
  (1, '2026-08-22', 4, 'Alocação', 8, 1),
  (2, '2026-08-21', 2, 'Envio para manutenção', NULL, 1),
  (3, '2026-08-19', 7, 'Alocação', 1, 2),
  (4, '2026-08-18', 8, 'Baixa por obsolescência', NULL, 2),
  (5, '2026-08-15', 11, 'Devolução', 4, 1);
