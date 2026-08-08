const { expect } = require('chai')
const { gerarCpf } = require('../../helpers/cpf')
const { obterToken } = require('../../helpers/login')
const {
    executarCriarFuncionario,
    dadosFuncionarioValidos,
    criarFuncionarioFixture
} = require('../../helpers/funcionario')

describe('Mutation - Criar Funcionario', () => {
    it('deve criar um funcionário com sucesso quando informo dados válidos', async () => {
        const token = await obterToken()
        const cpf = gerarCpf()

        const resposta = await executarCriarFuncionario(dadosFuncionarioValidos(cpf), token)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.criarFuncionario).to.deep.include({
            cpf,
            ...criarFuncionarioFixture.funcionarioValido,
            desligamento: null
        })
        expect(resposta.body.data.criarFuncionario.id).to.be.a('string').and.not.be.empty
    })

    it('não deve criar funcionário com CPF duplicado', async () => {
        const token = await obterToken()
        const input = dadosFuncionarioValidos(gerarCpf())

        const primeira = await executarCriarFuncionario(input, token)
        const segunda = await executarCriarFuncionario(input, token)

        expect(primeira.status).to.equal(200)
        expect(primeira.body.data.criarFuncionario).to.exist
        expect(segunda.status).to.equal(400)
        expect(segunda.body.data).to.be.null
        expect(segunda.body.errors[0].message).to.equal(criarFuncionarioFixture.mensagens.cpfDuplicado)
    })

    it('não deve criar funcionário com CPF inválido', async () => {
        const token = await obterToken()

        for (const cpf of criarFuncionarioFixture.cpfsInvalidos) {
            const resposta = await executarCriarFuncionario(dadosFuncionarioValidos(cpf), token)

            expect(resposta.status).to.equal(400)
            expect(resposta.body.data).to.be.null
            expect(resposta.body.errors[0].message).to.equal(criarFuncionarioFixture.mensagens.cpfInvalido)
        }
    })

    it('não deve criar funcionário sem autenticação', async () => {
        const resposta = await executarCriarFuncionario(dadosFuncionarioValidos(), null)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data).to.be.null
        expect(resposta.body.errors[0].message).to.equal(criarFuncionarioFixture.mensagens.autenticacaoObrigatoria)
    })

    it('não deve criar funcionário com salário base negativo', async () => {
        const token = await obterToken()

        const resposta = await executarCriarFuncionario({
            ...dadosFuncionarioValidos(),
            salario_base: -100
        }, token)

        expect(resposta.status).to.equal(400)
        expect(resposta.body.data).to.be.null
        expect(resposta.body.errors[0].message).to.equal(criarFuncionarioFixture.mensagens.salarioNegativo)
    })

    it('não deve criar funcionário com admissão em formato inválido', async () => {
        const token = await obterToken()

        const resposta = await executarCriarFuncionario({
            ...dadosFuncionarioValidos(),
            admissao: criarFuncionarioFixture.datasInvalidas.admissaoFormatoInvalido
        }, token)

        expect(resposta.status).to.equal(400)
        expect(resposta.body.data).to.be.null
        expect(resposta.body.errors[0].message).to.equal(criarFuncionarioFixture.mensagens.admissaoInvalida)
    })

    it('não deve criar funcionário com desligamento anterior à admissão', async () => {
        const token = await obterToken()

        const resposta = await executarCriarFuncionario({
            ...dadosFuncionarioValidos(),
            admissao: criarFuncionarioFixture.datasInvalidas.admissao,
            desligamento: criarFuncionarioFixture.datasInvalidas.desligamentoAnteriorAdmissao
        }, token)

        expect(resposta.status).to.equal(400)
        expect(resposta.body.data).to.be.null
        expect(resposta.body.errors[0].message).to.equal(criarFuncionarioFixture.mensagens.desligamentoAnteriorAdmissao)
    })
})
