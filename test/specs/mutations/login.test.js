const request = require('supertest')
const { expect } = require('chai')
const { login } = require('./helpers/login.js')
const loginData = require('./fixtures/login.json')

describe('Mutation Login', () => {
    it('Deve realizar login com sucesso quando informo credenciais válidas', async () => {
        const resposta = await login(loginData.admin)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.login).to.have.property('token')
        expect(resposta.body.data.login.token).to.not.be.empty
        expect(resposta.body.data.login.token).to.be.a('string')
        expect(resposta.body.data.login.token).to.include('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')

        //const obj = {token: null}
        //expect(obj.token).to.not.be.null.empty
    })

    it('Não deve realizar login com sucesso quando informo credenciais inválidas', async () => {
        const usuario = { ...loginData.admin, senha: '1234567'}
        const resposta = await login(usuario)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')
    })
    it('Não deve realizar login com sucesso quando não informo a senha', async () => {
        const { senha, ...usuario } = loginData.admin
        const resposta = await login(usuario)

        expect(resposta.status).to.equal(400)
        expect(resposta.body.errors[0]).to.have.property('message', 'Variable \"$senha\" of required type \"String!\" was not provided.')
    })

    /*it('Deve criar um usuário', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation CriarUsuario($input: CriarUsuarioInput!) {
                          criarUsuario(input: $input) {
                                id
                                email
                                nome
                                ativo
                            }
                        }`,
                variables: {
                    input: {
                        "email": "testecadastro6@teste.com",
                        "senha": "123abc",
                        "nome": "testecadastro06",
                        "ativo": true
                    }
                }
            })
        console.log('STATUS:', resposta.status)
        console.log('BODY:', JSON.stringify(resposta.body, null, 2))

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.criarUsuario.id).to.not.be.null.empty

    })*/

    it('Não deve realizar login sem email', async () => {
        const { email, ...usuario } = loginData.admin
        const resposta = await login(usuario)

        expect(resposta.status).to.equal(400)
        expect(resposta.body.errors[0]).to.have.property('message', 'Variable \"$email\" of required type \"String!\" was not provided.')
    })

    it('Não deve realizar login com usuário inativo', async () => {
        const resposta = await login(loginData.pgtas)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')
    })
})    