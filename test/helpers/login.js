const { executarGraphQL } = require('./graphql')
const loginFixture = require('../fixtures/login.json')

const LOGIN_MUTATION = `mutation Login($email: String!, $senha: String!) {
    login(email: $email, senha: $senha) {
        {{campos}}
    }
}`

const CRIAR_USUARIO_MUTATION = `mutation CriarUsuario($input: CriarUsuarioInput!) {
    criarUsuario(input: $input) {
        id
    }
}`

async function executarLogin(credenciais, campos = 'token') {
    const { email, senha } = credenciais

    return executarGraphQL({
        query: LOGIN_MUTATION.replace('{{campos}}', campos),
        variables: { email, senha }
    })
}

async function obterToken(credenciais = loginFixture.credenciaisValidas) {
    const resposta = await executarLogin(credenciais)
    return resposta.body.data.login.token
}

async function executarCriarUsuario(input) {
    return executarGraphQL({
        query: CRIAR_USUARIO_MUTATION,
        variables: { input }
    })
}

module.exports = {
    executarLogin,
    obterToken,
    executarCriarUsuario,
    loginFixture
}
