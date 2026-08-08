# Guia passo a passo: Login, Token, Usuário e Funcionário

Este documento descreve como autenticar e consumir a API **Payment Control** usando o **Apollo Sandbox** (`http://localhost:4000/graphql`).

---

## Pré-requisitos

1. Entre na pasta do projeto:

```bash
cd payment-control
```

2. Instale as dependências (se ainda não instalou):

```bash
npm install
```

3. Inicie a API:

```bash
npm start
```

4. Abra no navegador:

```
http://localhost:4000/graphql
```

> **Importante:** os dados ficam em memória. Se reiniciar a API (`Ctrl+C` + `npm start`), usuários criados manualmente são perdidos. O usuário admin padrão sempre existe.

### Credenciais padrão

| Campo  | Valor              |
|--------|--------------------|
| E-mail | `admin@admin.com`  |
| Senha  | `123456`           |

---

## Passo 1 — Login (gerar o token)

O token é um **JWT** gerado pela mutation `login`. Ele expira em **8 horas**.

### Operation

```graphql
mutation Login($email: String!, $senha: String!) {
  login(email: $email, senha: $senha) {
    token
    usuario {
      id
      email
      nome
      ativo
    }
  }
}
```

### Variables

```json
{
  "email": "admin@admin.com",
  "senha": "123456"
}
```

Para um usuário criado anteriormente:

```json
{
  "email": "teste@teste.com",
  "senha": "123456"
}
```

### Headers

Deixe **vazio** (login não exige autenticação):

| Key | Value |
|-----|-------|
| *(nenhum)* | *(nenhum)* |

### Resposta esperada

```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "usuario": {
        "id": "00000000-0000-4000-8000-000000000001",
        "email": "admin@admin.com",
        "nome": "ADMIN",
        "ativo": true
      }
    }
  }
}
```

**Copie o valor de `token`** (ou anote também o `id` do usuário — será usado na query `usuario`).

---

## Passo 2 — Configurar o token (Environment variables)

No painel lateral **Environment variables**, cole um **JSON** com a chave `"token"` e o valor `"Bearer "` + JWT:

```json
{
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTQwMDAtODAwMC0wMDAwMDAwMDAwMDEiLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTc4NjE5NDg5OCwiZXhwIjoxNzg2MjIzNjk4fQ.SHo7n6NSUn7KKj4RwCXR-w1W4b7HQCgjFLhVmOG-8XE"
}
```

Em resumo, são **duas strings**:

| Chave JSON | Valor JSON |
|------------|------------|
| `"token"` | `"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."` |

### Passo a passo

1. Faça o **login** e copie **somente** o JWT da resposta (campo `token`)
2. No **Environment variables**, cole o JSON acima
3. Substitua o JWT de exemplo pelo token que você copiou
4. Mantenha `"Bearer "` (com espaço) **antes** do JWT, **dentro das aspas** do valor
5. Tudo em **uma linha**, sem quebra no meio do token

### Exemplo do que colar (substitua o JWT)

```
"token"  →  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

No editor JSON do Sandbox, isso fica:

```json
{
  "token": "Bearer SEU_JWT_AQUI"
}
```

### Erros comuns

| Errado | Por quê |
|--------|---------|
| `token=Bearer eyJ...` | Formato `.env`; use **JSON** com `"token": "Bearer ..."` |
| `"token": "Bearer` em linha separada do JWT | JSON inválido / quebra de linha |
| `"token": "eyJ..."` (sem Bearer) | No header use `{{token}}`; precisa incluir `Bearer` no valor |
| Colocar o token na aba **Variables** | Token vai no **Environment**, não nas Variables da operação |

### Variáveis opcionais para login

Você também pode guardar e-mail e senha no mesmo JSON:

```json
{
  "email": "admin@admin.com",
  "senha": "123456",
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

E usar no login (aba **Variables**):

```json
{
  "email": "{{email}}",
  "senha": "{{senha}}"
}
```

---

## Passo 3 — Configurar o header Authorization

Na aba **Headers** da operação, use os campos **Key** e **Value**:

| Key | Value |
|-----|-------|
| `Authorization` | `{{token}}` |

### Regras importantes

- O **Key** deve ser `Authorization` **sem aspas**
- O **Value** é `{{token}}` — o Sandbox substitui pelo valor do Environment
- Como o Environment já guarda `Bearer eyJ...`, **não** repita `Bearer` no header
- **Não** cole JSON solto na aba Headers (ex: `"Authorization": "Bearer {{token}}"`) — use os campos Key / Value

### Formato errado (causa erro `Invalid name`)

```
Key:   "Authorization"     ← aspas no nome do header
Value: {{token}}
```

Ou texto solto na aba Headers:

```
"Authorization": "Bearer {{token}}"
```

---

## Passo 4 — Consultar um usuário (`usuario`)

A query `usuario` exige **token** e o **id** do usuário.

### Operation

```graphql
query Usuario($usuarioId: ID!) {
  usuario(id: $usuarioId) {
    id
    email
    nome
    ativo
  }
}
```

### Variables

Use o `id` retornado no login:

```json
{
  "usuarioId": "00000000-0000-4000-8000-000000000001"
}
```

### Headers

| Key | Value |
|-----|-------|
| `Authorization` | `{{token}}` |

### Resposta esperada

```json
{
  "data": {
    "usuario": {
      "id": "00000000-0000-4000-8000-000000000001",
      "email": "admin@admin.com",
      "nome": "ADMIN",
      "ativo": true
    }
  }
}
```

---

## Passo 5 (opcional) — Listar todos os usuários

Se quiser buscar **todos** os usuários, use `usuarios` (plural):

### Operation

```graphql
query Usuarios {
  usuarios {
    id
    email
    nome
    ativo
  }
}
```

### Variables

```json
{}
```

### Headers

| Key | Value |
|-----|-------|
| `Authorization` | `{{token}}` |

---

## Passo 6 — Criar funcionário (`criarFuncionario`)

A mutation `criarFuncionario` exige **token** e os campos `cpf`, `nome`, `salario_base` e `admissao`.

### Operation

```graphql
mutation CriarFuncionario($input: CriarFuncionarioInput!) {
  criarFuncionario(input: $input) {
    id
    cpf
    nome
    salario_base
    admissao
    desligamento
  }
}
```

### Variables

```json
{
  "input": {
    "cpf": "12345678901",
    "nome": "João Silva",
    "salario_base": 3500.00,
    "admissao": "2024-01-15",
    "desligamento": null
  }
}
```

### Regras dos campos

| Campo | Obrigatório | Formato |
|-------|-------------|---------|
| `cpf` | Sim | String (ex: `"12345678901"`) |
| `nome` | Sim | String |
| `salario_base` | Sim | Número (ex: `3500.00`) — **sem aspas** |
| `admissao` | Sim | Data `YYYY-MM-DD` (ex: `"2024-01-15"`) |
| `desligamento` | Não | Data `YYYY-MM-DD` ou `null` |

Exemplo com desligamento:

```json
{
  "input": {
    "cpf": "98765432100",
    "nome": "Maria Souza",
    "salario_base": 4200.50,
    "admissao": "2023-06-01",
    "desligamento": "2025-12-31"
  }
}
```

Exemplo omitindo `desligamento`:

```json
{
  "input": {
    "cpf": "12345678901",
    "nome": "João Silva",
    "salario_base": 3500.00,
    "admissao": "2024-01-15"
  }
}
```

### Headers

| Key | Value |
|-----|-------|
| `Authorization` | `{{token}}` |

### Resposta esperada

```json
{
  "data": {
    "criarFuncionario": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "cpf": "12345678901",
      "nome": "João Silva",
      "salario_base": 3500,
      "admissao": "2024-01-15",
      "desligamento": null
    }
  }
}
```

**Copie o `id` retornado** — será usado na consulta `funcionario`.

---

## Passo 7 — Consultar funcionário

### Opção A — Um funcionário por ID (`funcionario`)

#### Operation

```graphql
query Funcionario($funcionarioId: ID!) {
  funcionario(id: $funcionarioId) {
    id
    cpf
    nome
    salario_base
    admissao
    desligamento
  }
}
```

#### Variables

Use o `id` retornado ao criar o funcionário:

```json
{
  "funcionarioId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

#### Headers

| Key | Value |
|-----|-------|
| `Authorization` | `{{token}}` |

#### Resposta esperada

```json
{
  "data": {
    "funcionario": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "cpf": "12345678901",
      "nome": "João Silva",
      "salario_base": 3500,
      "admissao": "2024-01-15",
      "desligamento": null
    }
  }
}
```

### Opção B — Listar todos os funcionários (`funcionarios`)

#### Operation

```graphql
query Funcionarios {
  funcionarios {
    id
    cpf
    nome
    salario_base
    admissao
    desligamento
  }
}
```

#### Variables

```json
{}
```

#### Headers

| Key | Value |
|-----|-------|
| `Authorization` | `{{token}}` |

> **Dica:** se não souber o `id`, execute primeiro `funcionarios` para listar todos e copiar o `id` desejado.

---

## Fluxo completo (resumo)

```
1. npm start
2. Abrir http://localhost:4000/graphql
3. Executar mutation Login → copiar token e id
4. Environment variables → `{ "token": "Bearer eyJ..." }`
5. Headers → Key: `Authorization` | Value: `{{token}}`
6. Executar query Usuario com usuarioId
7. Executar mutation CriarFuncionario → copiar id do funcionário
8. Executar query Funcionario com funcionarioId (ou Funcionarios para listar todos)
```

---

## Teste via terminal (curl)

### Login

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(email: \"admin@admin.com\", senha: \"123456\") { token usuario { id nome } } }"}'
```

### Consultar usuário (substitua TOKEN e ID)

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"query":"query { usuario(id: \"00000000-0000-4000-8000-000000000001\") { id email nome ativo } }"}'
```

### Criar funcionário (substitua TOKEN)

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"query":"mutation { criarFuncionario(input: { cpf: \"12345678901\", nome: \"João Silva\", salario_base: 3500.00, admissao: \"2024-01-15\" }) { id cpf nome salario_base admissao } }"}'
```

### Consultar funcionário (substitua TOKEN e ID)

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"query":"query { funcionario(id: \"ID_DO_FUNCIONARIO\") { id cpf nome salario_base admissao desligamento } }"}'
```

### Listar funcionários (substitua TOKEN)

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"query":"query { funcionarios { id cpf nome salario_base admissao desligamento } }"}'
```

---

## Erros frequentes e soluções

| Erro | Causa provável | Solução |
|------|----------------|---------|
| `400 Bad Request` (CSRF) | Header ou Content-Type incorreto | Reinicie a API; use Headers corretos |
| `Invalid name` | Key do header com aspas (`"Authorization"`) | Use `Authorization` sem aspas |
| `Credenciais inválidas ou usuário inativo` | E-mail/senha errados ou API reiniciada | Confira credenciais ou recrie o usuário |
| `Autenticação obrigatória` | Falta header `Authorization` | Configure `Authorization: {{token}}` |
| `Schema Introspection Failure` | Sandbox desatualizado ou API parada | Recarregue a página (`F5`) e confirme `npm start` |
| Token expirado | JWT válido por 8 horas | Faça login novamente e atualize o Environment |
| `CPF, nome, salário base e admissão são obrigatórios` | Campos com `null` ou vazios | Preencha todos os campos obrigatórios |
| `Admissão deve estar no formato YYYY-MM-DD` | Data no formato errado | Use `"2024-01-15"`, não `"15/01/2024"` |
| `Já existe funcionário com este CPF` | CPF duplicado | Use outro CPF ou consulte o funcionário existente |
| Resposta `null` em `funcionario` | ID incorreto ou funcionário inexistente | Liste com `funcionarios` e copie o `id` correto |

---

## Referência técnica (como o token é gerado)

O token é criado em `src/services/authService.js`:

1. Busca o usuário pelo e-mail.
2. Valida a senha com `bcrypt`.
3. Verifica se o usuário está `ativo`.
4. Gera o JWT com `jsonwebtoken`, contendo `sub` (id) e `email`, expirando em 8 horas.

O servidor valida o token lendo o header:

```
Authorization: Bearer <token>
```

Implementação em `src/server.js` (função `buildContext`).

---

## Checklist rápido por aba

| Operação | Operation | Variables | Headers | Environment |
|----------|-----------|-----------|---------|-------------|
| **Login** | `mutation Login(...)` | `email`, `senha` | vazio | opcional |
| **Usuario** | `query Usuario($usuarioId)` | `usuarioId` | Key: `Authorization` → Value: `{{token}}` | `{ "token": "Bearer eyJ..." }` |
| **Usuarios** | `query Usuarios` | `{}` | Key: `Authorization` → Value: `{{token}}` | `{ "token": "Bearer eyJ..." }` |
| **CriarFuncionario** | `mutation CriarFuncionario($input)` | `input` com cpf, nome, salario_base, admissao | Key: `Authorization` → Value: `{{token}}` | `{ "token": "Bearer eyJ..." }` |
| **Funcionario** | `query Funcionario($funcionarioId)` | `funcionarioId` | Key: `Authorization` → Value: `{{token}}` | `{ "token": "Bearer eyJ..." }` |
| **Funcionarios** | `query Funcionarios` | `{}` | Key: `Authorization` → Value: `{{token}}` | `{ "token": "Bearer eyJ..." }` |
