const request = require('supertest');
const { expect } = require('chai');
const { login } = require('../../helpers/login');
const loginData = require('../../fixtures/login.json');

describe('Mutation Login', () => {
    it('Deve realizar login com sucesso quando informo as credenciais válidas', async () => {
        const resposta = await login(loginData.admin)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.login).to.have.property('token')
        expect(resposta.body.data.login.token).to.not.be.empty
        expect(resposta.body.data.login.token).to.be.a('string')
        expect(resposta.body.data.login.token).to.include('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')

    });

    it('Não deve realizar login com sucesso quando informo as credenciais inválidas', async () => {
        
        const usuario = { ...loginData.admin, senha: '1234567'}    
        const resposta = await login(usuario)
       
        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', "Credenciais inválidas ou usuário inativo.")
    });

    it('Não deve realizar login com sucesso quando o email não é informado', async () => {
        const  { email, ...usuario } = loginData.admin
        const resposta = await login(usuario)


        expect(resposta.status).to.equal(400)
        expect(resposta.body.errors[0]).to.have.property('message', "Variable \"$email\" of required type \"String!\" was not provided.")
              
        })

    });

    it('Não deve realizar login com sucesso quando a senha não é informada', async () => {
        const  { senha, ...usuario } = loginData.admin
        const resposta = await login(usuario)

        expect(resposta.status).to.equal(400)
        expect(resposta.body.errors[0]).to.have.property('message', "Variable \"$senha\" of required type \"String!\" was not provided.")

        })
       

    it('Não deve realizar login com sucesso o usuário estiver inativo', async () => {
        const resposta = await login(loginData.admin2)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', "Credenciais inválidas ou usuário inativo.")

}); 
