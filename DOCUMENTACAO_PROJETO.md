# Documentação do Projeto ARCA

> **ATENÇÃO IA:** Este documento contém todas as informações essenciais sobre o projeto ARCA para facilitar o entendimento e manutenção do sistema.

---

## 📋 Sumário

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Backend (arca-backend)](#backend-arca-backend)
4. [Frontend (arca-frontend)](#frontend-arca-frontend)
5. [Banco de Dados](#banco-de-dados)
6. [Endpoints da API](#endpoints-da-api)
7. [Modelos de Dados](#modelos-de-dados)
8. [DTOs (Data Transfer Objects)](#dtos-data-transfer-objects)
9. [Relacionamentos entre Entidades](#relacionamentos-entre-entidades)
10. [Configurações](#configurações)
11. [Como Executar](#como-executar)

---

## Visão Geral do Projeto

O **ARCA** é um **Sistema de Gestão Educacional** completo que oferece funcionalidades para:
- Administração de **escolas**
- Gerenciamento de **usuários** com sistema de roles e permissões
- Upload e gerenciamento de **vídeos** educacionais
- Controle de **repositórios** de conteúdo
- Sistema de **permissões** granular por perfil

O projeto é dividido em duas partes principais:
- **arca-backend**: API REST desenvolvida em Java com Spring Boot
- **arca-frontend**: Aplicação web desenvolvida em Next.js com React

---

## Estrutura do Projeto

```
arca/
├── arca-backend/           # API Spring Boot (Java 17)
│   ├── src/main/java/com/arca/backend/
│   │   ├── ArcaBackendApplication.java  # Classe principal
│   │   ├── controller/     # Controladores REST
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── model/          # Entidades JPA
│   │   ├── repository/     # Repositórios JPA
│   │   └── service/        # Camada de serviços
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── database.properties
│   │   └── db/migrations/  # Scripts SQL
│   ├── pom.xml
│   └── Dockerfile
│
└── arca-frontend/          # Aplicação Next.js (React 19)
    ├── src/app/
    │   ├── layout.tsx      # Layout principal
    │   ├── page.tsx        # Página inicial
    │   ├── Menu.tsx        # Menu de navegação global
    │   ├── admin/          # Páginas administrativas
    │   │   ├── page.tsx    # Dashboard admin
    │   │   ├── users/      # Gestão de usuários
    │   │   ├── schools/    # Gestão de escolas
    │   │   ├── videos/     # Gestão de vídeos
    │   │   ├── roles/      # Gestão de funções
    │   │   └── permissions/# Gestão de permissões
    │   ├── public/         # Página pública
    │   └── schools/        # Listagem de escolas
    └── package.json
```

---

## Backend (arca-backend)

### Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Java | 17 | Linguagem de programação |
| Spring Boot | 3.2.5 | Framework principal |
| Spring Data JPA | - | ORM para persistência |
| Spring Security | - | Autenticação e autorização |
| JWT (jjwt) | 0.12.5 | Tokens de autenticação |
| MariaDB | - | Banco de dados |
| Maven | - | Gerenciador de dependências |

### Dependências Principais (pom.xml)

```xml
- spring-boot-starter-web       # API REST
- spring-boot-starter-jdbc      # Conexão com banco
- spring-boot-starter-data-jpa  # JPA/Hibernate
- spring-boot-starter-security  # Segurança
- spring-boot-starter-validation # Validação de dados
- jjwt-api (0.12.5)             # JWT API
- jjwt-impl (0.12.5)            # JWT Implementação
- jjwt-jackson (0.12.5)         # JWT JSON
- mariadb-java-client (3.3.2)   # Driver MariaDB
```

### Pacote Principal

```
com.arca.backend
```

### Classe Principal

```java
// ArcaBackendApplication.java
@SpringBootApplication
public class ArcaBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(ArcaBackendApplication.class, args);
    }
}
```

---

## Autenticação JWT

### Visão Geral

O sistema utiliza **JSON Web Tokens (JWT)** para autenticação stateless. O fluxo é:

1. Usuário faz login com email e senha
2. Backend valida credenciais e retorna um token JWT
3. Frontend armazena o token e envia em todas as requisições
4. Backend valida o token em cada requisição

### Arquivos de Segurança

Localizados em `com.arca.backend.security`:

| Arquivo | Descrição |
|---------|-----------|
| `SecurityConfig.java` | Configuração do Spring Security |
| `JwtService.java` | Geração e validação de tokens JWT |
| `JwtAuthenticationFilter.java` | Filtro que intercepta requisições |
| `CustomUserDetails.java` | Wrapper do User para Spring Security |
| `CustomUserDetailsService.java` | Carrega usuário do banco |

### Configuração JWT

**application.properties:**
```properties
jwt.secret=MinhaChaveSecretaMuitoSeguraParaJWTArcaBackend2025ComMaisDe256Bits
jwt.expiration=86400000  # 24 horas em milissegundos
```

### Endpoints de Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login` | Login do usuário | ❌ Público |
| POST | `/api/auth/register` | Registro de novo usuário | ❌ Público |
| GET | `/api/auth/validate` | Valida token atual | ✅ Requer token |

### Payload de Login (POST /api/auth/login)

**Request:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response (sucesso):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "picture": "https://exemplo.com/foto.png",
  "roles": ["SCHOOL", "ADMIN_CEDOC"]
}
```

### Payload de Registro (POST /api/auth/register)

**Request:**
```json
{
  "name": "Nome Completo",
  "email": "novo@exemplo.com",
  "password": "senha123",
  "phone": "11999999999",
  "phone2": "11888888888",
  "picture": "https://exemplo.com/foto.png",
  "street": "Rua Exemplo",
  "city": "São Paulo",
  "state": "SP",
  "number": "123",
  "zip": "01234-567",
  "schoolId": 1
}
```

### Como Usar o Token no Frontend

```javascript
// Armazenar após login
localStorage.setItem('token', response.token);

// Enviar em requisições
fetch('http://localhost:8080/api/users', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});
```

### Endpoints Públicos vs Protegidos

| Tipo | Padrão | Descrição |
|------|--------|-----------|
| Público | `/api/auth/**` | Autenticação |
| Público | `/api/public/**` | Páginas públicas |
| Protegido | `/**` (outros) | Requer token JWT |

### Roles e Authorities

As roles são mapeadas como authorities com prefixo `ROLE_`:
- `ROOT` → `ROLE_ROOT`
- `SCHOOL` → `ROLE_SCHOOL`
- `ADMIN_CEDOC` → `ROLE_ADMIN_CEDOC`

### Senhas

As senhas são criptografadas com **BCrypt**. Para atualizar senhas existentes, execute:
```sql
-- db/migrations/update_passwords_bcrypt.sql
```

---

## Frontend (arca-frontend)

### Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Next.js | 15.5.0 | Framework React |
| React | 19.1.0 | Biblioteca UI |
| TypeScript | 5.x | Linguagem tipada |
| Turbopack | - | Bundler (dev mode) |

### Scripts Disponíveis

```bash
npm run dev    # Inicia servidor de desenvolvimento (Turbopack)
npm run build  # Gera build de produção
npm run start  # Inicia servidor de produção
```

### Estrutura de Páginas

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/` | `page.tsx` | Página inicial (template Next.js) |
| `/public` | `public/page.tsx` | Página pública do sistema |
| `/admin` | `admin/page.tsx` | Dashboard administrativo |
| `/admin/users` | `admin/users/page.tsx` | CRUD de usuários |
| `/admin/schools` | `admin/schools/page.tsx` | CRUD de escolas |
| `/admin/videos` | `admin/videos/page.tsx` | CRUD de vídeos |
| `/admin/roles` | `admin/roles/page.tsx` | CRUD de funções |
| `/admin/permissions` | `admin/permissions/page.tsx` | CRUD de permissões |

### Menu de Navegação

O menu global está em `src/app/Menu.tsx` e inclui links para:
- Home
- Página Pública
- Administração
- Users
- Roles
- Permissions
- Escolas
- Vídeos
- Tables

### Comunicação com API

O frontend se comunica com o backend via **fetch API** no endereço:
```
http://localhost:8080/api/
```

---

## Banco de Dados

### Configuração de Conexão

**Arquivo:** `src/main/resources/database.properties`

```properties
spring.datasource.url=jdbc:mariadb://localhost:3307/arca
spring.datasource.username=root
spring.datasource.password=admin
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
```

| Parâmetro | Valor |
|-----------|-------|
| Host | localhost |
| Porta | 3307 |
| Database | arca |
| Usuário | root |
| Senha | admin |
| Driver | MariaDB |

### Tabelas do Banco

O schema está definido em `src/main/resources/db/migrations/schema.sql`:

#### Tabelas Auxiliares

| Tabela | Descrição |
|--------|-----------|
| `contacts` | Informações de contato (telefones, email) |
| `addresses` | Endereços (rua, cidade, estado, CEP) |

#### Tabelas de Usuários e Permissões

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários do sistema |
| `roles` | Perfis/funções (ROOT, SCHOOL, ADMIN_CEDOC, etc.) |
| `permissions` | Permissões granulares |
| `user_roles` | Relacionamento N:N entre users e roles |
| `role_permissions` | Relacionamento N:N entre roles e permissions |

#### Tabelas de Negócio

| Tabela | Descrição |
|--------|-----------|
| `persons` | Pessoas (diretores, responsáveis) |
| `schools` | Instituições de ensino |
| `repositories` | Repositórios de conteúdo (CEDOC, Biblioteca Digital, etc.) |
| `categories` | Categorias de conteúdo |
| `videos` | Vídeos educacionais |

### Estrutura Detalhada das Tabelas

#### contacts
```sql
- id BIGINT (PK, AUTO_INCREMENT)
- phone VARCHAR(20)
- phone2 VARCHAR(20)
- email VARCHAR(100)
```

#### addresses
```sql
- id BIGINT (PK, AUTO_INCREMENT)
- street VARCHAR(255)
- city VARCHAR(100)
- state VARCHAR(100)
- number VARCHAR(20)
- zip VARCHAR(20)
```

#### users
```sql
- id BIGINT (PK, AUTO_INCREMENT)
- name VARCHAR(150)
- picture VARCHAR(255)
- contact_id BIGINT (FK -> contacts)
- address_id BIGINT (FK -> addresses)
- school_id BIGINT (FK -> schools, NULLABLE)
- password_hash VARCHAR(255)
- active BOOLEAN (DEFAULT TRUE)
- created_at TIMESTAMP
```

#### roles
```sql
- id BIGINT (PK, AUTO_INCREMENT)
- name VARCHAR(50) (UNIQUE)
- description VARCHAR(255)
```

**Roles Pré-cadastradas:**
1. ROOT - Usuário administrativo
2. SCHOOL - Usuário autenticado pela escola
3. ADMIN_CEDOC - Administrador do CEDOC
4. ADMIN_PEDAGOGICO - Administrador pedagógico
5. ADMIN_CINE - Administrador do CINE
6. ADMIN_GERAL - Administrador geral do sistema

#### permissions
```sql
- id BIGINT (PK, AUTO_INCREMENT)
- name VARCHAR(100) (UNIQUE)
- description VARCHAR(255)
```

**Permissões Disponíveis:**
- `cedoc_view_own_school` - Visualizar documentos do CEDOC da própria escola
- `cedoc_manage` - Upload/Editar/Remover documentos no CEDOC
- `cedoc_create_school` - Cadastrar nova escola no CEDOC
- `pedagogico_read` - Ler revistas e coleções publicadas
- `pedagogico_submit` - Submeter artigo pedagógico
- `pedagogico_moderate` - Moderar e publicar artigos
- `cine_watch` - Assistir São Leo Em Cine
- `cine_submit` - Submeter vídeo no São Leo Em Cine
- `admin_contact` - Comunicação com administradores
- `reports_view_cedoc/pedagogico/cine/all` - Relatórios
- `logs_view_cedoc/pedagogico/cine/all` - Auditoria

#### persons
```sql
- id BIGINT (PK, AUTO_INCREMENT)
- name VARCHAR(150)
- contact_id BIGINT (FK -> contacts)
- address_id BIGINT (FK -> addresses)
- created_at TIMESTAMP
```

#### schools
```sql
- id BIGINT (PK, AUTO_INCREMENT)
- name VARCHAR(150)
- contact_id BIGINT (FK -> contacts)
- address_id BIGINT (FK -> addresses)
- principal_id BIGINT (FK -> persons) # Diretor
- created_at TIMESTAMP
```

#### repositories
```sql
- id BIGINT (PK, AUTO_INCREMENT)
- name VARCHAR(150)
- description TEXT
- created_at TIMESTAMP
```

**Repositórios Pré-cadastrados:**
1. CEDOC - Centro de Documentação
2. Biblioteca Digital Pedagógica

#### categories
```sql
- id BIGINT (PK, AUTO_INCREMENT)
- name VARCHAR(100) (UNIQUE)
- description TEXT
```

#### videos
```sql
- id BIGINT (PK, AUTO_INCREMENT)
- title VARCHAR(255)
- description TEXT
- url VARCHAR(255)
- url_thumbnail VARCHAR(255)
- status VARCHAR(50) (DEFAULT 'PENDING')
- repository_id BIGINT (FK -> repositories)
- user_id BIGINT (FK -> users)
- school_id BIGINT (FK -> schools)
- uploaded_at TIMESTAMP
```

**Status de Vídeos:**
- PENDING (padrão)
- APPROVED
- REJECTED

---

## Endpoints da API

Base URL: `http://localhost:8080/api`

### Users (`/api/users`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/users` | Lista todos os usuários |
| POST | `/api/users` | Cria novo usuário |
| PATCH | `/api/users/{id}` | Atualiza usuário |
| DELETE | `/api/users/{id}` | Remove usuário |
| GET | `/api/users/schools` | Lista escolas (auxiliar) |

**Payload para criação (POST):**
```json
{
  "name": "string",
  "picture": "string (URL)",
  "contact": { "phone": "", "phone2": "", "email": "" },
  "address": { "street": "", "number": "", "city": "", "state": "", "zip": "" },
  "password": "string",
  "roleIds": [1, 2],
  "schoolId": 1
}
```

### Schools (`/api/schools`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/schools` | Lista todas as escolas |
| GET | `/api/schools/{id}` | Busca escola por ID |
| POST | `/api/schools` | Cria nova escola |
| PUT | `/api/schools/{id}` | Atualiza escola |
| DELETE | `/api/schools/{id}` | Remove escola |

**Payload para criação (POST):**
```json
{
  "name": "string",
  "contact": { "phone": "", "phone2": "", "email": "" },
  "address": { "street": "", "number": "", "city": "", "state": "", "zip": "" },
  "principal": {
    "name": "string",
    "contact": { "phone": "", "phone2": "", "email": "" },
    "address": { "street": "", "number": "", "city": "", "state": "", "zip": "" }
  }
}
```

### Videos (`/api/videos`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/videos` | Lista todos os vídeos |
| GET | `/api/videos/{id}` | Busca vídeo por ID |
| GET | `/api/videos/school/{schoolId}` | Vídeos por escola |
| GET | `/api/videos/user/{userId}` | Vídeos por usuário |
| GET | `/api/videos/repository/{repositoryId}` | Vídeos por repositório |
| GET | `/api/videos/status/{status}` | Vídeos por status |
| GET | `/api/videos/school/{schoolId}/status/{status}` | Vídeos por escola e status |
| POST | `/api/videos` | Cria novo vídeo |
| PUT | `/api/videos/{id}` | Atualiza vídeo |
| DELETE | `/api/videos/{id}` | Remove vídeo |

**Payload para criação (POST):**
```json
{
  "title": "string",
  "description": "string",
  "url": "string",
  "urlThumbnail": "string",
  "status": "PENDING",
  "repositoryId": 1,
  "userId": 1,
  "schoolId": 1
}
```

### Roles (`/api/roles`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/roles` | Lista todas as roles |
| POST | `/api/roles` | Cria nova role |
| PATCH | `/api/roles/{id}` | Atualiza role |
| DELETE | `/api/roles/{id}` | Remove role |

### Permissions (`/api/permissions`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/permissions` | Lista todas as permissões |
| POST | `/api/permissions` | Cria nova permissão |
| PATCH | `/api/permissions/{id}` | Atualiza permissão |
| DELETE | `/api/permissions/{id}` | Remove permissão |

### Repositories (`/api/repositories`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/repositories` | Lista todos os repositórios |
| GET | `/api/repositories/{id}` | Busca repositório por ID |
| POST | `/api/repositories` | Cria novo repositório |
| PUT | `/api/repositories/{id}` | Atualiza repositório |
| DELETE | `/api/repositories/{id}` | Remove repositório |

### Outros Endpoints

- `/api/contacts` - Gestão de contatos
- `/api/addresses` - Gestão de endereços
- `/api/persons` - Gestão de pessoas
- `/api/categories` - Gestão de categorias

---

## Modelos de Dados

### Entidades JPA

Localizadas em `com.arca.backend.model`:

| Entidade | Tabela | Descrição |
|----------|--------|-----------|
| `User` | users | Usuários do sistema |
| `Role` | roles | Perfis/funções |
| `Permission` | permissions | Permissões |
| `School` | schools | Escolas |
| `Person` | persons | Pessoas (diretores) |
| `Contact` | contacts | Contatos |
| `Address` | addresses | Endereços |
| `Video` | videos | Vídeos |
| `Repository` | repositories | Repositórios |
| `Category` | categories | Categorias |

### Relacionamentos das Entidades

```
User
├── ManyToOne -> Contact
├── ManyToOne -> Address
├── ManyToOne -> School (NULLABLE)
└── ManyToMany -> Role (via user_roles)

Role
└── ManyToMany -> Permission (via role_permissions)

School
├── ManyToOne -> Contact
├── ManyToOne -> Address
└── ManyToOne -> Person (principal/diretor)

Person
├── ManyToOne -> Contact
└── ManyToOne -> Address

Video
├── ManyToOne -> Repository
├── ManyToOne -> User
└── ManyToOne -> School
```

---

## DTOs (Data Transfer Objects)

Localizados em `com.arca.backend.dto`:

| DTO | Uso |
|-----|-----|
| `VideoDTO` | Resposta completa de vídeo |
| `VideoCreateDTO` | Criação de vídeo |
| `VideoUpdateDTO` | Atualização de vídeo |
| `SchoolDTO` | Resposta de escola |
| `SchoolCreateDTO` | Criação de escola |
| `SchoolUpdateDTO` | Atualização de escola |
| `UserCreateDTO` | Criação de usuário |
| `UserUpdateDTO` | Atualização de usuário |
| `ContactDTO` | Dados de contato |
| `AddressDTO` | Dados de endereço |
| `PersonDTO` | Dados de pessoa |
| `RepositoryDTO` | Dados de repositório |
| `CategoryDTO` | Dados de categoria |

---

## Relacionamentos entre Entidades

### Diagrama de Relacionamentos

```
                    ┌─────────────┐
                    │   Contact   │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────┐       ┌─────────┐        ┌─────────┐
   │  User   │       │  Person │        │  School │
   └────┬────┘       └────┬────┘        └────┬────┘
        │                 │                  │
        │                 └──────────────────┘
        │                        ▲
        └────────────────────────┘
        
   ┌─────────┐      ┌──────────────┐      ┌─────────────┐
   │   User  │◄─────│    Video     │─────►│  Repository │
   └────┬────┘      └──────┬───────┘      └─────────────┘
        │                  │
        │                  ▼
        │            ┌─────────┐
        └───────────►│  School │
                     └─────────┘

   ┌─────────┐      ┌─────────────────┐      ┌────────────┐
   │   User  │◄────►│   user_roles    │◄────►│    Role    │
   └─────────┘      └─────────────────┘      └─────┬──────┘
                                                   │
                                                   ▼
                                        ┌─────────────────────┐
                                        │  role_permissions   │
                                        └──────────┬──────────┘
                                                   │
                                                   ▼
                                            ┌────────────┐
                                            │ Permission │
                                            └────────────┘
```

---

## Configurações

### Backend

**application.properties:**
```properties
spring.config.import=optional:database.properties
server.port=8080

# JWT Configuration
jwt.secret=MinhaChaveSecretaMuitoSeguraParaJWTArcaBackend2025ComMaisDe256Bits
jwt.expiration=86400000
```

**database.properties:**
```properties
spring.datasource.url=jdbc:mariadb://localhost:3307/arca
spring.datasource.username=root
spring.datasource.password=admin
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
```

### CORS

Configurado no `SecurityConfig.java` para permitir:
- Origens: `http://localhost:3000`, `http://localhost:3001`
- Métodos: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Headers: Authorization, Content-Type, X-Requested-With
- Credentials: habilitado

### Docker (Backend)

```dockerfile
FROM openjdk:21-jdk
WORKDIR /app
COPY target/arca-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

---

## Como Executar

### Pré-requisitos

1. **Java 17+** instalado
2. **Node.js 18+** instalado
3. **MariaDB** rodando na porta 3307
4. Banco de dados `arca` criado

### Executando o Banco de Dados

```sql
-- Executar os scripts na ordem:
-- 1. schema.sql (cria as tabelas)
-- 2. data.sql (insere dados iniciais)
```

### Executando o Backend

```bash
cd arca-backend

# Compilar
mvn clean package

# Executar
mvn spring-boot:run
# ou
java -jar target/arca-backend-0.0.1-SNAPSHOT.jar
```

O backend estará disponível em: `http://localhost:8080`

### Executando o Frontend

```bash
cd arca-frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

### Docker

```bash
cd arca-backend
mvn clean package
docker build -t arca-backend .
docker run -p 8080:8080 arca-backend
```

---

## Observações Importantes

1. **Autenticação:** O sistema possui **autenticação JWT implementada**. Endpoints protegidos requerem token no header `Authorization: Bearer <token>`.

2. **CORS:** Configurado para aceitar origens específicas (`localhost:3000` e `localhost:3001`). Para produção, altere no `SecurityConfig.java`.

3. **Validação:** DTOs de autenticação possuem validação com `@Valid`. Outros DTOs ainda precisam.

4. **Porta do MariaDB:** O banco está configurado para porta **3307** (não a padrão 3306).

5. **Status de Vídeos:** Os vídeos têm status (PENDING, APPROVED, REJECTED) mas não há workflow automatizado.

6. **Dados Iniciais:** O arquivo `data.sql` contém dados de exemplo para todas as tabelas.

7. **Senhas:** As senhas são criptografadas com BCrypt. Execute `update_passwords_bcrypt.sql` para atualizar senhas existentes.

8. **Token JWT:** Expira em 24 horas (configurável em `application.properties`).

---

## Próximos Passos Sugeridos

- [x] ~~Implementar autenticação JWT~~
- [ ] Adicionar validação nos demais DTOs (@Valid, @NotNull, etc.)
- [ ] Implementar refresh token
- [ ] Implementar paginação nos endpoints de listagem
- [ ] Adicionar testes unitários e de integração
- [ ] Implementar logging adequado
- [ ] Configurar variáveis de ambiente para produção
- [ ] Implementar recuperação de senha
- [ ] Adicionar rate limiting

---

*Última atualização: Dezembro 2025*
