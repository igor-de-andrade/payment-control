# Documentação das funções auxiliares de teste

## `gerarCpf()`

**Arquivo:** `test/helpers/cpf.js`

**Descrição:**  
Gera automaticamente um CPF válido com 11 dígitos numéricos, incluindo os dois dígitos verificadores calculados pelo algoritmo oficial.

**Argumentos:**  
Nenhum.

**Retorno:**  
- **Tipo:** `string`
- **Formato:** 11 caracteres numéricos, por exemplo `"52998224725"`.

---

## `executarGraphQL({ query, variables, token })`

**Arquivo:** `test/helpers/graphql.js`

**Descrição:**  
Executa uma requisição GraphQL genérica contra a API. Centraliza o POST em `/graphql` e o header de autenticação.

**Argumentos:**  
- `query` (`string`): operation GraphQL a ser executada.
- `variables` (`object`, opcional): variáveis da operation.
- `token` (`string`, opcional): JWT enviado no header `Authorization`.

**Retorno:**  
- **Tipo:** `Promise<Response>` do supertest.
- **Detalhes:** contém `status`, `body.data` e `body.errors`.

---

## `executarLogin(credenciais, campos)`

**Arquivo:** `test/helpers/login.js`

**Descrição:**  
Executa a mutation `login` recebendo um objeto de credenciais e os campos desejados na resposta.

**Argumentos:**  
- `credenciais` (`object`): objeto com `email` e `senha`.
- `campos` (`string`, opcional): campos GraphQL retornados. Padrão: `"token"`.

**Retorno:**  
- **Tipo:** `Promise<Response>` do supertest.

---

## `obterToken(credenciais)`

**Arquivo:** `test/helpers/login.js`

**Descrição:**  
Realiza login e retorna apenas o token JWT, pronto para ser usado em mutations autenticadas.

**Argumentos:**  
- `credenciais` (`object`, opcional): objeto com `email` e `senha`. Padrão: `fixtures/login.json > credenciaisValidas`.

**Retorno:**  
- **Tipo:** `Promise<string>`
- **Formato:** JWT retornado pela mutation `login`.

---

## `executarCriarUsuario(input)`

**Arquivo:** `test/helpers/login.js`

**Descrição:**  
Executa a mutation `criarUsuario` sem autenticação, usada para preparar cenários de teste.

**Argumentos:**  
- `input` (`object`): payload com `email`, `senha`, `nome` e `ativo`.

**Retorno:**  
- **Tipo:** `Promise<Response>` do supertest.

---

## `executarCriarFuncionario(input, token)`

**Arquivo:** `test/helpers/funcionario.js`

**Descrição:**  
Executa a mutation `criarFuncionario` com os dados informados e autenticação opcional.

**Argumentos:**  
- `input` (`object`): payload de criação do funcionário.
- `token` (`string | null`): JWT do usuário autenticado. Se `null`, a requisição é enviada sem autenticação.

**Retorno:**  
- **Tipo:** `Promise<Response>` do supertest.

---

## `dadosFuncionarioValidos(cpf)`

**Arquivo:** `test/helpers/funcionario.js`

**Descrição:**  
Monta um payload válido para criar funcionário, combinando CPF gerado automaticamente com os dados base definidos em `fixtures/criarFuncionario.json`.

**Argumentos:**  
- `cpf` (`string`, opcional): CPF a ser usado. Padrão: valor retornado por `gerarCpf()`.

**Retorno:**  
- **Tipo:** `object`
- **Formato:** `{ cpf, nome, salario_base, admissao }`

---

## Fixtures

**Arquivos:**  
- `test/fixtures/login.json`
- `test/fixtures/criarFuncionario.json`

**Descrição:**  
Armazenam dados estáticos reutilizáveis nos testes, como credenciais, payloads base, CPFs inválidos e mensagens de erro esperadas.
