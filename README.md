# API de Filmes — CRUD com Controller e Service

Backend simples para cadastrar, listar, consultar, atualizar e remover filmes (título, imagem e nota).
O projeto é organizado em camadas, cada uma com uma responsabilidade:

|Camada|Pasta|O que faz|
|-|-|-|
|Rotas|`src/routes`|Liga cada URL + método HTTP a um método do controller|
|Controller|`src/controller`|Recebe a requisição, valida os dados e devolve a resposta HTTP com o status certo|
|Service|`src/services`|Regras de acesso a dados: conversa com o banco através do Prisma|
|Prisma|`src/prisma`|Cria o cliente do Prisma usado pelo service|

## Tecnologias

* Node.js v25 e npm
* Express v5
* Prisma v7 (com adapter `better-sqlite3`)
* SQLite
* TypeScript

## Como rodar o projeto

**1. Clone o repositório e instale as dependências**

```bash
git clone <link-do-repositorio>
cd <pasta-do-projeto>
npm install
```

**2. Crie o arquivo `.env` na raiz** (ele não é versionado)

```env
DATABASE\_URL="file:./dev.db"
```

**3. Crie o banco de dados**

```bash
npx prisma db push
```

Cria o arquivo SQLite (se ainda não existir) com a tabela definida em `prisma/schema.prisma`.

**4. Gere o Prisma Client**

```bash
npx prisma generate
```

Gera a pasta `src/generated`. Ela não deve ser editada e também não vai para o GitHub (está no `.gitignore`).

**5. Inicie o servidor**

```bash
npm run dev
```

O servidor sobe em `http://localhost:3001`.

### Scripts disponíveis

|Comando|Descrição|
|-|-|
|`npm run dev`|Servidor em modo desenvolvimento (reinicia ao salvar)|
|`npm run build`|Compila o TypeScript para a pasta `dist`|
|`npm start`|Executa a versão compilada|
|`npm run prisma:generate`|Gera o Prisma Client|
|`npm run prisma:studio`|Abre o Prisma Studio no navegador|

> O Prisma Studio usa a URL `file://./dev.db` como contorno para uma incompatibilidade com SQLite. A aplicação continua usando `file:./dev.db`. Rode o Studio em outro terminal, com o servidor ligado.

## Modelo de dados

```prisma
model Filme {
  id        Int      @id @default(autoincrement())
  titulo    String
  imagem    String
  nota      Float
  createdAt DateTime @default(now())
}
```

## Endpoints

Base: `http://localhost:3001/filmes`

|Método|Rota|Descrição|Sucesso|
|-|-|-|-|
|`GET`|`/filmes`|Lista todos os filmes (mais recentes primeiro)|`200`|
|`GET`|`/filmes/:id`|Busca um filme pelo id|`200`|
|`POST`|`/filmes`|Cadastra um filme|`201`|
|`PUT`|`/filmes/:id`|Atualiza um filme|`200`|
|`DELETE`|`/filmes/:id`|Remove um filme|`204`|

### Corpo da requisição (POST e PUT)

```json
{
  "titulo": "Matrix",
  "imagem": "https://exemplo.com/matrix.jpg",
  "nota": 9.5
}
```

Regras de validação:

* `titulo` e `imagem`: texto, não pode ser vazio
* `nota`: número entre 0 e 10

### Exemplo de uso com curl

```bash
# criar
curl -X POST http://localhost:3001/filmes \\
  -H "Content-Type: application/json" \\
  -d '{"titulo":"Matrix","imagem":"https://exemplo.com/matrix.jpg","nota":9.5}'

# listar
curl http://localhost:3001/filmes

# buscar o filme de id 1
curl http://localhost:3001/filmes/1

# atualizar
curl -X PUT http://localhost:3001/filmes/1 \\
  -H "Content-Type: application/json" \\
  -d '{"titulo":"Matrix Reloaded","imagem":"https://exemplo.com/m2.jpg","nota":8}'

# remover
curl -X DELETE http://localhost:3001/filmes/1
```

### Códigos de erro

|Status|Quando acontece|Exemplo de resposta|
|-|-|-|
|`400`|Corpo inválido ou id que não é um número inteiro positivo|`{ "erro": "O campo 'nota' é obrigatório e deve ser um número entre 0 e 10." }`|
|`404`|Filme com o id informado não existe|`{ "erro": "Filme não encontrado." }`|
|`500`|Erro inesperado no servidor|`{ "erro": "Erro interno ao ..." }`|

## Estrutura do projeto

```text
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controller/
│   │   └── filme.controller.ts
│   ├── routes/
│   │   └── filme.routes.ts
│   ├── services/
│   │   └── filme.service.ts
│   ├── prisma/
│   │   └── client.ts
│   ├── app.ts
│   └── server.ts
├── .env                 (não versionado)
├── prisma.config.ts
├── package.json
└── tsconfig.json
```

## Equipe

|Integrante|Contribuição|
|-|-|
|*Cauã Cesar Brandão Gonçalves - Matrícula: 2025009028*|Service e rotas|
|*Davi Henrique Maia Braga - Matrícula: 2024016350*|Controller|
|*Eduardo Antônio dos Santos Silva - Matrícula: 2025007936*|README|



