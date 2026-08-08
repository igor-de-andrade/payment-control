const { executarGraphQL } = require('./graphql')
const { gerarCpf } = require('./cpf')
const criarFuncionarioFixture = require('../fixtures/criarFuncionario.json')

const CRIAR_FUNCIONARIO_MUTATION = `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
    criarFuncionario(input: $input) {
        id
        cpf
        nome
        salario_base
        admissao
        desligamento
    }
}`

async function executarCriarFuncionario(input, token) {
    return executarGraphQL({
        query: CRIAR_FUNCIONARIO_MUTATION,
        variables: { input },
        token
    })
}

function dadosFuncionarioValidos(cpf = gerarCpf()) {
    return {
        cpf,
        ...criarFuncionarioFixture.funcionarioValido
    }
}

module.exports = {
    executarCriarFuncionario,
    dadosFuncionarioValidos,
    criarFuncionarioFixture
}
