# 🐳 Guia Docker - ARCA

## Para mais informações Técnicas do funcionamento

Consultar o arquivo .\DOCUMENTACAO_PROJETO.md

## 📋 Pré-requisitos

- Docker instalado
- Docker Compose instalado

## 🚀 Como usar

### 1. Build e iniciar todos os serviços

```bash
docker-compose up -d --build
```

### 2. Verificar status dos containers

```bash
docker-compose ps
```

### 3. Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### 4. Parar os serviços

```bash
docker-compose down
```

### 5. Parar e remover volumes (apaga dados do banco)

```bash
docker-compose down -v
```

## 🌐 Acessos

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Banco de dados:** localhost:3307

## 🔧 Serviços

### Database (MariaDB)
- Container: `arca-database`
- Porta: 3307
- Usuário: root
- Senha: admin
- Database: arca

### Backend (Spring Boot)
- Container: `arca-backend`
- Porta: 8080
- Aguarda o banco estar saudável antes de iniciar

### Frontend (Next.js)
- Container: `arca-frontend`
- Porta: 3000
- Aguarda o backend estar rodando

## 📝 Comandos úteis

### Reconstruir apenas um serviço

```bash
docker-compose up -d --build backend
```

### Entrar no container

```bash
# Backend
docker exec -it arca-backend sh

# Database
docker exec -it arca-database mariadb -uroot -padmin arca

# Frontend
docker exec -it arca-frontend sh
```

### Reiniciar um serviço

```bash
docker-compose restart backend
```

## 🔄 Atualizar após mudanças no código

### Backend (requer rebuild)
```bash
# Build do JAR localmente primeiro
cd arca-backend
mvn clean package -DskipTests
cd ..

# Rebuild e restart do container
docker-compose up -d --build backend
```

### Frontend (requer rebuild)
```bash
docker-compose up -d --build frontend
```

## 🗄️ Backup do Banco de Dados

```bash
docker exec arca-database mariadb-dump -uroot -padmin arca > backup.sql
```

## 📦 Restaurar Banco de Dados

```bash
docker exec -i arca-database mariadb -uroot -padmin arca < backup.sql
```

## ⚠️ Troubleshooting

### Backend não conecta no banco
- Verifique se o banco está healthy: `docker-compose ps`
- Veja os logs: `docker-compose logs database`

### Frontend não conecta no backend
- Verifique se o backend está rodando: `curl http://localhost:8080`
- Veja os logs: `docker-compose logs backend`

### Porta já em uso
Altere as portas no `docker-compose.yml`:
```yaml
ports:
  - "NOVA_PORTA:PORTA_CONTAINER"
```

# Frontend

Ver o arquivo .\arca-frontend\README.md

# Backend 

Ver o arquivo .\arca-backend\README.md