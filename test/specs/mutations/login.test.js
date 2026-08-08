const request = require('supertest')
const { expect } = require('chai')
const { login } = require('../../helpers/login.js')

describe('Mutation - Login', () => {
    it('Deve realizar login com sucesso quando informo credenciais válidas', async () => {
       const usuario =  {
            email: 'admin@admin.com',
            senha: '123456'
        }

        const resposta = await login(usuario)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.login).to.have.property('token')
        expect(resposta.body.data.login.token).to.not.be.empty
        expect(resposta.body.data.login.token).to.be.string
        expect(resposta.body.data.login.token).to.include('ey')

    })
    it('Não deve realizar login com senha inválidas', async () => {
        const usuario =  {
            email: 'admin@admin.com',
            senha: '1234567'
        }

        const resposta = await login(usuario)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')
    })
    it('Não deve realizar login sem informar o campo de senha na requisição', async () => {
            
        const usuario =   {
            email: 'bruna@bruna.com'
        }

        const resposta = await login(usuario)

        expect(resposta.status).to.equal(400)
    })
    it('Não deve realizar login com senha diferente de string', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                        token
                    }
                }`,
                variables: {
                    email: 'bruna@bruna.com',
                    senha: 1234567
                }
            })

        expect(resposta.status).to.equal(400)
        
    })
    it('Não deve realizar login com e-mail inválido', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                        token
                    }
                }`,
                variables: {
                    email: 'brunabruna.com',
                    senha: '1234567'
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')
    })
    it('Não deve realizar login ao informar espaços em branco antes da senha', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                        token
                    }
                }`,
                variables: {
                    email: 'brunabruna.com',
                    senha: ' 1234567'
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')
    })
    it('Não deve realizar login ao nõ informar e-mail e senha', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                        token
                    }
                }`,
                variables: {
                  
                }
            })

        expect(resposta.status).to.equal(400)
     
    })
    it('Não deve realizar login com usuario inativo', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                    login(email: $email, senha: $senha) {
                        token
                    }
                }`,
                variables: {
                  email: 'teste@teste.com',
                  senha: '1234567'
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')
     
    })
    
})