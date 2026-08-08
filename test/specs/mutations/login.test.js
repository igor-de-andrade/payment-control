const { expect } = require('chai')
const { executarLogin, executarCriarUsuario, loginFixture } = require('../../helpers/login')

describe('Mutation - Login', () => {
    it('deve realizar login com sucesso quando informo credenciais válidas', async () => {
        const resposta = await executarLogin(loginFixture.credenciaisValidas)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.login).to.have.property('token')
        expect(resposta.body.data.login.token).to.not.be.empty
        expect(resposta.body.data.login.token).to.be.a('string')
        expect(resposta.body.data.login.token).to.include('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
    })

    it('não deve realizar login quando informo senha inválida', async () => {
        const resposta = await executarLogin(loginFixture.credenciaisInvalidas)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', loginFixture.mensagens.credenciaisInvalidas)
        expect(resposta.body.data).to.be.null
    })

    it('não deve realizar login quando informo email não cadastrado', async () => {
        const resposta = await executarLogin(loginFixture.emailNaoCadastrado)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', loginFixture.mensagens.credenciaisInvalidas)
        expect(resposta.body.data).to.be.null
    })

    it('deve retornar os dados do usuário autenticado no login com sucesso', async () => {
        const { email, ...usuarioEsperado } = loginFixture.usuarioAdmin
        const resposta = await executarLogin(
            loginFixture.credenciaisValidas,
            `token
            usuario {
                id
                email
                nome
                ativo
            }`
        )

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.login.usuario).to.deep.include(usuarioEsperado)
        expect(resposta.body.data.login.usuario.email).to.equal(email)
        expect(resposta.body.data.login.usuario.id).to.be.a('string').and.not.be.empty
    })

    it('não deve realizar login quando o usuário está inativo', async () => {
        const credenciaisInativo = {
            ...loginFixture.usuarioInativo,
            email: `inativo.${Date.now()}@teste.com`
        }

        await executarCriarUsuario(credenciaisInativo)
        const resposta = await executarLogin(credenciaisInativo)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', loginFixture.mensagens.credenciaisInvalidas)
        expect(resposta.body.data).to.be.null
    })
})
