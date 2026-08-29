const request    = require ('supertest')
const { expect } = require('chai')
const { login, login2 }  = require('../../helpers/login.js')
const loginData = require('../../fixtures/login.json')

describe('Mutation - Login', () => {
    it('deve realizar login com sucesso quando informo credenciais validas', async () => {
        
        //Criar uma const com os dados do login
        //const usuario  = {email: "admin@admin.com", senha: "123456"}
        //const resposta = await login(usuario)
        
        //ou
        
        //Passar o email e senha como parametro
        //const resposta = await login2("admin@admin.com", "123456")

        //ou

        //passar o obj de um arquivo json
        const resposta = await login(loginData.admin)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.login).to.have.property('token')
        expect(resposta.body.data.login.token).to.not.be.empty
        expect(resposta.body.data.login.token).to.be.a('string')
        expect(resposta.body.data.login.token).to.include('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ')

    })

    it('não deve realizar login quando informo email errado', async () => {
        //passar o obj de um arquivo json
        const usuario = {...loginData.admin, email: 'admin@admin123.com'}
        const resposta = await login(usuario)
        
        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')
    })  

    it('não deve realizar login quando informo senha errada', async () => {
        const usuario = {...loginData.admin, senha: '1234567'}
        const resposta = await login(usuario)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')

    })    

    it('não deve aceitar numérico no campo email', async () => {
        //passar o obj de um arquivo json
        const usuario = {...loginData.admin, email: 1}
        const resposta = await login(usuario)
        
        expect(resposta.status).to.equal(400)
        expect(resposta.body.errors[0]).to.have.property('message', 'Variable \"$email\" got invalid value 1; String cannot represent a non string value: 1')

    })

    it('não deve aceitar numérico no campo senha', async () => {
        const usuario = {...loginData.admin, senha: 1}
        const resposta = await login(usuario)

        expect(resposta.status).to.equal(400)
        expect(resposta.body.errors[0]).to.have.property('message', 'Variable \"$senha\" got invalid value 1; String cannot represent a non string value: 1')

    })

    it('não deve realizar login quando informo credenciais de um usuário inativo', async () => {
        const resposta = await login(loginData.Miriam)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')

    })

    it('não deve realizar login quando não informo o email', async () => {
        const { email, ...usuario} = loginData.admin
        const resposta = await login(usuario)

        expect(resposta.status).to.equal(400)
        expect(resposta.body.errors[0]).to.have.property('message', 'Variable \"$email\" of required type \"String!\" was not provided.')

    })

    it('não deve realizar login quando não informo a senha', async () => {
        const { senha, ...usuario} = loginData.admin
        const resposta = await login(usuario)

        expect(resposta.status).to.equal(400)
        expect(resposta.body.errors[0]).to.have.property('message', 'Variable \"$senha\" of required type \"String!\" was not provided.')

    })

})