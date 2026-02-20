# ARCA Backend

## Descrição
Projeto Spring Boot para o sistema ARCA (Arquivo de Repositórios e Conteúdos Acadêmicos), que fornece uma API REST para gerenciamento de conteúdo educacional, incluindo artigos, revistas, vídeos, documentos e usuários.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Java 17** ou superior - [Download JDK](https://www.oracle.com/java/technologies/downloads/#java17)
- **Maven 3.6+** - [Download Maven](https://maven.apache.org/download.cgi)
- **MariaDB 10.5+** ou MySQL 8.0+ - [Download MariaDB](https://mariadb.org/download/)

### Verificar instalação

```bash
# Verificar Java
java -version

# Verificar Maven
mvn -version

# Verificar MariaDB
mysql --version
```

## Configuração do Banco de Dados

### 1. Criar o banco de dados

```sql
CREATE DATABASE arca_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configurar credenciais

Crie ou edite o arquivo `src/main/resources/database.properties`:

```properties
spring.datasource.url=jdbc:mariadb://localhost:3306/arca_db
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect
```

> **Nota:** O arquivo `database.properties` não está versionado no Git por questões de segurança. Você deve criá-lo localmente.

### 3. Executar migrations (se houver)

As migrations SQL estão em `src/main/resources/db/migrations/`. Execute-as manualmente no banco de dados caso necessário.

## Como Rodar o Projeto Localmente

### Método 1: Maven com Spring Boot Plugin

#### Compilar o projeto
```bash
# Navegue até o diretório do backend
cd arca-backend

# Compile o projeto (baixa dependências e compila)
mvn clean install
```

#### Rodar a aplicação
```bash
# Executa a aplicação diretamente com Maven
mvn spring-boot:run
```

A aplicação estará disponível em: **http://localhost:8080**

### Método 2: Gerar e executar JAR

#### Gerar o arquivo JAR
```bash
# Compile e gere o arquivo JAR
mvn clean package
```

#### Executar o JAR
```bash
# Execute o arquivo JAR gerado
java -jar target/arca-backend-0.0.1-SNAPSHOT.jar
```

### Método 3: Rodar com perfil específico

Se você tiver diferentes perfis (dev, prod, etc.):

```bash
# Rodar com perfil dev
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Ou com o JAR
java -jar target/arca-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

## Comandos Maven Úteis

```bash
# Limpar build anterior
mvn clean

# Compilar sem rodar testes
mvn clean install -DskipTests

# Rodar apenas os testes
mvn test

# Verificar dependências
mvn dependency:tree

# Atualizar dependências
mvn clean install -U

# Verificar versões das dependências
mvn versions:display-dependency-updates
```

## Estrutura do Projeto

```
arca-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/arca/
│   │   │       ├── backend/        # Classes principais
│   │   │       ├── config/         # Configurações
│   │   │       ├── controller/     # Endpoints REST
│   │   │       ├── model/          # Entidades JPA
│   │   │       ├── repository/     # Repositórios
│   │   │       └── service/        # Lógica de negócio
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── database.properties (não versionado)
│   │       └── db/migrations/      # Scripts SQL
│   └── test/                       # Testes unitários
├── pom.xml                         # Configuração Maven
└── README.md
```

## Endpoints da API

A API estará disponível em `http://localhost:8080/api`

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/register` - Registrar novo usuário

### Recursos (requer autenticação)
- `GET /api/articles` - Listar artigos
- `GET /api/journals` - Listar revistas
- `GET /api/videos` - Listar vídeos
- `GET /api/documents` - Listar documentos
- `GET /api/users` - Listar usuários (admin)

> **Nota:** Consulte a documentação da API ou código-fonte para detalhes completos dos endpoints.

## Configurações da Aplicação

### Porta do servidor
Por padrão, a aplicação roda na porta **8080**. Para alterar:

```properties
# Em application.properties
server.port=8081
```

Ou via linha de comando:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

### JWT
As configurações de JWT estão em `application.properties`:
- **jwt.secret**: Chave secreta para assinar tokens
- **jwt.expiration**: Tempo de expiração (padrão: 24 horas)

## Troubleshooting

### Erro: "Access denied for user"
- Verifique as credenciais no arquivo `database.properties`
- Certifique-se de que o usuário tem permissões no banco de dados

### Erro: "Port 8080 already in use"
- Altere a porta no `application.properties` ou pare o processo que está usando a porta 8080

### Erro: "Cannot resolve dependencies"
- Execute `mvn clean install -U` para forçar atualização das dependências
- Verifique sua conexão com a internet
- Verifique se o repositório Maven central está acessível

### Erro: "Java version mismatch"
- Certifique-se de estar usando Java 17 ou superior
- Verifique com `java -version` e `echo $JAVA_HOME`

## Desenvolvimento

### Hot reload durante desenvolvimento
Para ativar hot reload, adicione ao `pom.xml` (se ainda não estiver):

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

Depois execute:
```bash
mvn spring-boot:run
```

### Debug
Para rodar em modo debug:

```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

Conecte seu IDE na porta 5005.

## Docker

Para rodar com Docker, consulte o `Dockerfile` na raiz do projeto:

```bash
# Build da imagem
docker build -t arca-backend .

# Executar container
docker run -p 8080:8080 arca-backend
```

Ou use o `docker-compose.yml` na raiz do projeto:

```bash
cd ..
docker-compose up
```

## Tecnologias Utilizadas

- **Spring Boot 3.2.5** - Framework principal
- **Spring Security** - Autenticação e autorização
- **Spring Data JPA** - Persistência de dados
- **JWT (JSON Web Token)** - Autenticação stateless
- **MariaDB/MySQL** - Banco de dados
- **Maven** - Gerenciamento de dependências

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

Este projeto é de uso interno da instituição.

## Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.
