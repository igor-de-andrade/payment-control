const request = require('supertest')
const { expect } = require('chai')
const { login } = require('../../helpers/login.js')
const loginData = require('../../fixtures/login.json')
 
describe('Mutation - Login', () => {

    it.only('CT1 - Deve realiza o login com sucesso com credenciais validas', async function () {
        const resposta = await login(loginData.admin)
        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.login).to.have.property('token')
    });

    it.only('CT2 - Não deve realizar o login com sucesso quando informo credenciais invalidas', async function () {
        const usuario = { ...loginData.admin, senha: '12589855'}
        const resposta = await login(usuario)
        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')
    });

    it.only('CT3 - Não deve realizar o login com sucesso se o campo de senha está vazio somente com aspas dupla', async function () {
        const usuario = { ...loginData.admin, senha: ' ' }
        const resposta = await login(usuario)

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')

    });

    it.only('CT4 - Não deve realizar o login com sucesso se o campo de login e senha está vazio somente com aspas dupla', async function () {
        const usuario = { ...loginData.admin, email: ' ', senha: ' '}
        const resposta = await login(usuario)
        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')

    });

    it.only('CT5 - Não deve realizar o login com sucesso se o campo de login está vazio somente com aspas dupla', async function () {
        const usuario = { ...loginData.admin, email: ' ' }
        const resposta = await login(usuario)
        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')
        expect(resposta.body.errors[0]).to.have.property('locations').that.is.an('array');

    });


    it.only('CT6 - Não deve realizar o login com sucesso pois o usuario está inativo', async function () {
        const resposta = await login(loginData.pgats)
        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.')

    });
})