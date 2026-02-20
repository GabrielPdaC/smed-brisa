-- Script para atualizar as senhas existentes para BCrypt
-- A senha padrão será: "123456" (hash BCrypt)
-- Execute este script após implementar a autenticação JWT

-- Hash BCrypt para "123456": $2a$10$rAqlPg4OovruNSkI0h0FI.CoGqkXOaizeqWysYb7qdFX.Et.qy8D6
-- Você pode gerar novos hashes usando: https://bcrypt-generator.com/

UPDATE users SET password_hash = '$2a$10$rAqlPg4OovruNSkI0h0FI.CoGqkXOaizeqWysYb7qdFX.Et.qy8D6' WHERE id > 0;

-- Nota: Em produção, cada usuário deve redefinir sua senha
-- Este script é apenas para testes e desenvolvimento
