# ARCA Frontend

## Descrição
Interface web do sistema ARCA (Arquivo de Repositórios e Conteúdos Acadêmicos), desenvolvida com Next.js 15 e React 19. Oferece uma experiência moderna e responsiva para acesso aos conteúdos educacionais, incluindo artigos, revistas, vídeos e documentos.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 18+** ou superior - [Download Node.js](https://nodejs.org/)
- **npm 9+** (incluído com Node.js) ou **yarn** ou **pnpm**

### Verificar instalação

```bash
# Verificar Node.js
node -version

# Verificar npm
npm -version
```

## Configuração

### 1. Instalar dependências

```bash
# Navegue até o diretório do frontend
cd arca-frontend

# Instale as dependências
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> **Nota:** Por padrão, se a variável não for definida, a aplicação usa `http://localhost:8080` como URL da API.

#### Variáveis de ambiente disponíveis:
- **NEXT_PUBLIC_API_URL**: URL base do backend (padrão: `http://localhost:8080`)

## Como Rodar o Projeto Localmente

### Método 1: Modo Desenvolvimento (Recomendado)

#### Com Turbopack (mais rápido)
```bash
npm run dev
```

#### Sem Turbopack
```bash
npm run dev:normal
```

A aplicação estará disponível em: **http://localhost:3000**

> **Turbopack** é o novo bundler do Next.js, oferecendo compilação mais rápida. Use `dev:normal` se encontrar problemas de compatibilidade.

### Método 2: Modo Produção

#### Build da aplicação
```bash
npm run build
```

#### Executar em modo produção
```bash
npm start
```

A aplicação estará disponível em: **http://localhost:3000**

### Método 3: Rodar com porta customizada

```bash
# Modo desenvolvimento
npm run dev -- -p 3001

# Modo produção
npm start -- -p 3001
```

## Scripts Disponíveis

```bash
# Rodar servidor de desenvolvimento com Turbopack
npm run dev

# Rodar servidor de desenvolvimento sem Turbopack
npm run dev:normal

# Criar build de produção
npm run build

# Rodar build de produção
npm start

# Limpar cache do Next.js (se necessário)
rm -rf .next
```

## Gerenciadores de Pacotes Alternativos

### Usando Yarn
```bash
# Instalar dependências
yarn

# Rodar desenvolvimento
yarn dev

# Build de produção
yarn build

# Rodar produção
yarn start
```

### Usando pnpm
```bash
# Instalar dependências
pnpm install

# Rodar desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Rodar produção
pnpm start
```

## Estrutura do Projeto

```
arca-frontend/
├── public/                      # Arquivos estáticos
├── src/
│   ├── app/                     # App Router do Next.js
│   │   ├── layout.tsx           # Layout principal
│   │   ├── page.tsx             # Página inicial
│   │   ├── globals.css          # Estilos globais
│   │   ├── Menu.tsx             # Menu de navegação
│   │   ├── NavHeader.tsx        # Cabeçalho
│   │   ├── admin/               # Páginas administrativas
│   │   │   ├── articles/        # Gerenciar artigos
│   │   │   ├── journals/        # Gerenciar revistas
│   │   │   ├── videos/          # Gerenciar vídeos
│   │   │   ├── documents/       # Gerenciar documentos
│   │   │   ├── users/           # Gerenciar usuários
│   │   │   └── ...
│   │   ├── login/               # Página de login
│   │   ├── cedoc/               # Seção CEDOC
│   │   ├── pedagogico/          # Seção Pedagógico
│   │   ├── saoleoemcine/        # Seção São Leo em Cine
│   │   └── context/             # Contexts React
│   │       ├── AuthContext.tsx  # Autenticação
│   │       ├── PermissionsContext.tsx
│   │       └── ThemeContext.tsx # Tema
│   ├── components/              # Componentes reutilizáveis
│   │   ├── articles/
│   │   ├── documents/
│   │   ├── journals/
│   │   └── videos/
│   └── lib/                     # Utilitários
│       ├── api.ts               # Cliente API
│       └── cookies.ts           # Manipulação de cookies
├── next.config.ts               # Configuração Next.js
├── tsconfig.json                # Configuração TypeScript
├── package.json                 # Dependências
└── README.md
```

## Funcionalidades Principais

### Para Usuários
- **Pesquisa e navegação** de conteúdos educacionais
- **Visualização** de artigos, revistas, vídeos e documentos
- **Sistema de comentários** em recursos
- **Tema claro/escuro**
- **Acesso por categorias** (CEDOC, Pedagógico, São Leo em Cine)

### Para Administradores
- **Gerenciamento completo** de conteúdos
- **Controle de usuários** e permissões
- **Gerenciamento de categorias** e repositórios
- **Aprovação de comentários**

## Páginas Principais

- `/` - Página inicial pública
- `/login` - Autenticação
- `/admin` - Painel administrativo
- `/admin/articles` - Gerenciar artigos
- `/admin/journals` - Gerenciar revistas
- `/admin/videos` - Gerenciar vídeos
- `/admin/documents` - Gerenciar documentos
- `/admin/users` - Gerenciar usuários
- `/cedoc` - Seção CEDOC
- `/pedagogico` - Seção Pedagógico
- `/saoleoemcine` - Seção São Leo em Cine

## Configurações Adicionais

### Alterar porta do servidor
```bash
# No arquivo package.json, adicione a flag -p
"dev": "next dev --turbopack -p 3001"

# Ou use diretamente no terminal
npm run dev -- -p 3001
```

### Hot Reload
O Next.js possui hot reload automático no modo desenvolvimento. Sempre que você salvar um arquivo, a página será atualizada automaticamente.

### TypeScript
O projeto usa TypeScript com verificação de tipos rigorosa. Para verificar tipos:

```bash
# Verificar erros de tipo
npx tsc --noEmit
```

## Integração com Backend

O frontend se comunica com o backend através da API REST. Certifique-se de que:

1. **Backend está rodando** em `http://localhost:8080` (ou URL configurada)
2. **CORS está habilitado** no backend para aceitar requisições do frontend
3. **Variável de ambiente** `NEXT_PUBLIC_API_URL` está configurada corretamente

### Testando conexão com backend

Abra o console do navegador (F12) e verifique:
- Se há erros de CORS
- Se as chamadas API retornam status 200
- Se o token JWT está sendo enviado corretamente

## Troubleshooting

### Erro: "Module not found"
```bash
# Limpe o cache e reinstale dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 3000 is already in use"
```bash
# Opção 1: Pare o processo na porta 3000
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Opção 2: Use outra porta
npm run dev -- -p 3001
```

### Erro: "Failed to fetch" ou problemas de CORS
- Verifique se o backend está rodando
- Verifique a configuração de CORS no backend
- Verifique a URL da API no `.env.local`

### Build está lento
- Use Turbopack: `npm run dev`
- Limpe o cache: `rm -rf .next`
- Atualize Node.js para versão mais recente

### Erro: "Cannot find module" após adicionar dependência
```bash
# Reinstale as dependências
npm install
```

### Erros de TypeScript
```bash
# Verifique erros de tipo
npx tsc --noEmit

# Verifique o arquivo tsconfig.json está correto
```

## Desenvolvimento

### Adicionar novas dependências
```bash
# Dependência de produção
npm install nome-do-pacote

# Dependência de desenvolvimento
npm install -D nome-do-pacote
```

### Criar nova página
1. Crie um arquivo `page.tsx` no diretório `src/app/sua-rota/`
2. A página estará disponível em `/sua-rota`

Exemplo:
```typescript
// src/app/nova-pagina/page.tsx
export default function NovaPagina() {
  return <h1>Minha Nova Página</h1>;
}
```

### Debug no VS Code
Crie `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 9229
    }
  ]
}
```

## Docker

Para rodar com Docker, consulte o `Dockerfile` na raiz do projeto:

```bash
# Build da imagem
docker build -t arca-frontend .

# Executar container
docker run -p 3000:3000 arca-frontend
```

Ou use o `docker-compose.yml` na raiz do projeto:

```bash
cd ..
docker-compose up
```

## Tecnologias Utilizadas

- **Next.js 15.5.0** - Framework React com renderização híbrida
- **React 19.1.0** - Biblioteca para interfaces
- **TypeScript 5** - Superset JavaScript com tipagem
- **Turbopack** - Bundler de última geração
- **CSS Modules** - Estilização com escopo local
- **Context API** - Gerenciamento de estado
- **JWT** - Autenticação com tokens

## Boas Práticas

- Use **TypeScript** para garantir type safety
- Mantenha **componentes pequenos e reutilizáveis**
- Use **CSS Modules** para evitar conflitos de estilos
- Aproveite o **App Router** do Next.js para roteamento
- Use **Server Components** quando possível para melhor performance
- Implemente **loading states** e **error boundaries**

## Recursos de Aprendizado

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação React](https://react.dev/)
- [Documentação TypeScript](https://www.typescriptlang.org/docs/)
- [Tutorial Next.js](https://nextjs.org/learn)

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Deploy

### Vercel (Recomendado)
O Next.js é mantido pela Vercel, oferecendo deploy simplificado:

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outros provedores
- **Netlify**: Suporte completo para Next.js
- **AWS Amplify**: Hosting com CI/CD
- **Railway**: Deploy rápido com containers
- **Docker**: Auto-hospedado

## Licença

Este projeto é de uso interno da instituição.

## Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.
