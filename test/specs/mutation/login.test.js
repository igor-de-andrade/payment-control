const request = require('supertest');
const { expect } = require('chai');

describe ('Login Mutation', () => {
    it('deve realizar login com sucesso quando informo credenciais válidas', async () => {
        const resposta = await request('http://localhost:4000')
        .post('/graphQL')
        .send({
            query: `mutation Login($email: String!, $senha: String!) {
                login(email: $email, senha: $senha) {
                    token
                }
            }`, 
            variables: {
                email: "admin@admin.com",
                senha: "123456"
            }
        })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.login).to.have.property('token')
        expect(resposta.body.data.login.token).to.not.be.empty
        expect(resposta.body.data.login.token).to.be.a('string')
        expect(resposta.body.data.login.token).to.include("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")

    })

    it('não deve realizar login quando informo credenciais de senha inválida', async () => {
        const resposta = await request('http://localhost:4000')
        .post('/graphQL')
        .send({
            query: `mutation Login($email: String!, $senha: String!) {
                login(email: $email, senha: $senha) {
                    token
                }
            }`, 
            variables: {
                email: "admin@admin.com",
                senha: "1234567"
            }
        })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.includes("Credenciais inválidas ou usuário inativo.")
    })

    it('não deve realizar login quando informo credenciais de email inválido', async () => {
        const resposta = await request('http://localhost:4000')
        .post('/graphQL')
        .send({
            query: `mutation Login($email: String!, $senha: String!) {
                login(email: $email, senha: $senha) {
                    token
                }
            }`, 
            variables: {
                email: "adming@admin.com",
                senha: "123456"
            }
        })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.includes("Credenciais inválidas ou usuário inativo.")
    })

    it('não deve realizar login quando informo email no formato inválido', async () => {
        const resposta = await request('http://localhost:4000') 
        .post('/graphQL')
        .send({
            query: `mutation Login($email: String!, $senha: String!) {
                login(email: $email, senha: $senha) {
                    token
                }
            }`, 
            variables: {
                email: "admin.com",
                senha: "1234567"
            }
        })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.includes("Credenciais inválidas ou usuário inativo.")
    })

    it('não deve realizar login quando informo email vazio', async () => {
        const resposta = await request('http://localhost:4000')
        .post('/graphQL')
        .send({
            query: `mutation Login($email: String!, $senha: String!) {
                login(email: $email, senha: $senha) {
                    token
                }
            }`, 
            variables: {
                email: "",
                senha: "123456"
            }
        })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.includes("Credenciais inválidas ou usuário inativo.")
    })

    it('não deve realizar login quando informo senha vazia', async () => {
        const resposta = await request('http://localhost:4000')
        .post('/graphQL') 
        .send({
            query: `mutation Login($email: String!, $senha: String!) {
                login(email: $email, senha: $senha) {
                    token
                }
            }`, 
            variables: {
                email: "admin.com",
                senha: ""
            }
        })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.includes("Credenciais inválidas ou usuário inativo.")
    })

    it('não deve realizar login quando informo credenciais de usuário inativo', async () => {
        const resposta = await request('http://localhost:4000')
        .post('/graphQL') 
        .send({
            query: `mutation Login($email: String!, $senha: String!) {
                login(email: $email, senha: $senha) {
                    token
                }
            }`, 
            variables: {
                email: "pgats@turma3.com",
                senha: "123456"
            }
        })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.includes("Credenciais inválidas ou usuário inativo.")
    })

    it('nao deve realizar login quando não informo o campo email na requisicao', async () => {
        const resposta = await request('http://localhost:4000')
        .post('/graphQL')
        .send({
            query: `mutation Login($email: String!, $senha: String!) {
                login(email: $email, senha: $senha) {
                    token
                }
            }`, 
            variables: {
                senha: "123456"
            }
        })

        expect(resposta.status).to.be.equal(400)
        expect(resposta.body.errors[0].message).to.includes("Variable \"$email\" of required type \"String!\" was not provided.")
    })

    it('nao deve realizar login quando não informo o campo senha na requisicao', async () => {
        const resposta = await request('http://localhost:4000')
        .post('/graphQL')
        .send({
            query: `mutation Login($email: String!, $senha: String!) {
                login(email: $email, senha: $senha) {
                    token
                }
            }`, 
            variables: {
                email: "pgats@turma3.com"
            }
        })

        expect(resposta.status).to.be.equal(400)
        expect(resposta.body.errors[0].message).to.includes("Variable \"$senha\" of required type \"String!\" was not provided.")
    })

})