-- =====================================
-- INITIAL SYSTEM DATA
-- Sistema ARCA - Dados Iniciais
-- =====================================
-- Este arquivo contém apenas os dados essenciais para o primeiro boot do sistema:
-- - 3 usuários (root, cedoc, pedagógico)
-- - Roles e permissões necessárias

-- Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROOT', 'Administrador root com acesso total ao sistema'),
(2, 'SCHOOL', 'Usuário de escola com permissões básicas'),
(3, 'ADMIN_CEDOC', 'Administrador do CEDOC'),
(4, 'ADMIN_PEDAGOGICO', 'Administrador Pedagógico'),
(5, 'ADMIN_CINE', 'Administrador do São Leo em Cine'),
(6, 'ADMIN_GERAL', 'Administrador Geral');

-- Permissions
INSERT INTO permissions (id, name, description, url_api, url_client) VALUES
(1, 'root.access', 'Acesso total ao sistema', '/api/**', '/**'),
(2, 'cedoc.access', 'Acesso ao CEDOC', '/api/documents/**,/api/categories/**,/api/repositories/**,/api/schools/**,/api/users/**', '/cedoc/**'),
(3, 'pedagogico.access', 'Acesso ao Pedagógico', '/api/articles/**,/api/journals/**,/api/comments/**,/api/categories/**,/api/repositories/**,/api/schools/**,/api/users/**', '/pedagogico/**,/pedagogico/revistas,/pedagogico/artigos'),
(4, 'cine.access', 'Acesso ao São Leo em Cine', '/api/videos/**,/api/repositories/**,/api/schools/**,/api/users/**', '/saoleoemcine/**');

-- Contacts
INSERT INTO contacts (id, phone, phone2, email) VALUES
(1, '123456789', '987654321', 'root@arca.com'),
(2, '51988776655', '51988776644', 'cedoc@arca.com'),
(3, '51977665544', '51977665533', 'pedagogico@arca.com');

-- Addresses
INSERT INTO addresses (id, street, city, state, number, zip) VALUES
(1, 'R. Dom João Becker', 'São Leopoldo', 'RS', '754', '93010-010'),
(2, 'R. Dom João Becker', 'São Leopoldo', 'RS', '754', '93010-010'),
(3, 'R. Dom João Becker', 'São Leopoldo', 'RS', '754', '93010-010');

-- Users (password for all: password123)
INSERT INTO users (id, name, picture, contact_id, address_id, school_id, password_hash, active, created_at) VALUES
(1, 'Root User', 'https://ui-avatars.com/api/?name=Root+User&background=667eea&color=fff', 1, 1, NULL, '$2a$10$rAqlPg4OovruNSkI0h0FI.CoGqkXOaizeqWysYb7qdFX.Et.qy8D6', true, NOW()),
(2, 'Admin CEDOC', 'https://ui-avatars.com/api/?name=Admin+CEDOC&background=48bb78&color=fff', 2, 2, NULL, '$2a$10$rAqlPg4OovruNSkI0h0FI.CoGqkXOaizeqWysYb7qdFX.Et.qy8D6', true, NOW()),
(3, 'Admin Pedagógico', 'https://ui-avatars.com/api/?name=Admin+Pedagogico&background=f6b93b&color=fff', 3, 3, NULL, '$2a$10$rAqlPg4OovruNSkI0h0FI.CoGqkXOaizeqWysYb7qdFX.Et.qy8D6', true, NOW());

-- User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Root User tem role ROOT
(2, 3), -- Admin CEDOC tem role ADMIN_CEDOC
(3, 4); -- Admin Pedagógico tem role ADMIN_PEDAGOGICO

-- Role Permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), -- ROOT tem root.access (acesso total)
(3, 2), -- ADMIN_CEDOC tem cedoc.access
(4, 3), -- ADMIN_PEDAGOGICO tem pedagogico.access
(5, 4), -- ADMIN_CINE tem cine.access
(6, 2), -- ADMIN_GERAL tem cedoc.access
(6, 3), -- ADMIN_GERAL tem pedagogico.access
(6, 4); -- ADMIN_GERAL tem cine.access

