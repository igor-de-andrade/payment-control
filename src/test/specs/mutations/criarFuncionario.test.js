const request = require('supertest')
const { expect } = require('chai')
describe('Mutation - Criar Funcionário', () => {
    let token
    before(async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
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
        token = resposta.body.data.login.token
    })
    it('deve criar um funcinário quando preencho os campos obrigatórios de forma válida', async () => {
        let cpf = Date.now()
        console.log(cpf)
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
                        id
                        cpf
                        nome
                        salario_base
                        admissao
                        desligamento
                    }
                }`,
                variables: {
                    input: {
                        cpf: `${cpf}`,
                        nome: "IARA STEVANI",
                        salario_base: 8500.85,
                        admissao: "2026-01-05",
                        desligamento: ""
                    }
                }
            })
        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.criarFuncionario).to.have.property('id')
    })
    it('deve criar um funcinário quando preencho todos os campos de forma válida', async () => {
        let cpf = Date.now()
        console.log(cpf)
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
                        id
                        cpf
                        nome
                        salario_base
                        admissao
                        desligamento
                    }
                }`,
                variables: {
                    input: {
                        cpf: `${cpf}`,
                        nome: "JOAOZINHO",
                        salario_base: 8500.85,
                        admissao: "2026-01-05",
                        desligamento: "2026-10-20"
                    }
                }
            })
        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.criarFuncionario).to.have.property('id')
    })
    it(' Não deve permitir criar funcionario sem informar o salario', async () => {
        let cpf = Date.now()
        console.log(cpf)
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
                        id
                        cpf
                        nome
                        salario_base
                        admissao
                        desligamento
                    }
                }`,
                variables: {
                    input: {
                        cpf: `${cpf}`,
                        nome: "JOAOZINHO",
                        admissao: "2026-01-05"
                    }
                }
            })
        expect(resposta.status).to.equal(400)
        expect(resposta.body.errors[0]).to.have.property('message', 'Variable "$input" got invalid value { cpf: "' + cpf + '", nome: "JOAOZINHO", admissao: "2026-01-05" }; Field "salario_base" of required type "Float!" was not provided.')
     })
     it(' Não deve criar funcionario quando data de desligamento quando data desligamento superior que data de admissao', async () => {
        let cpf = Date.now()
        console.log(cpf)
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
                        id
                        cpf
                        nome
                        salario_base
                        admissao
                        desligamento
                    }
                }`,
                variables: {
                    input: {
                        cpf: `${cpf}`,
                        nome: "JOAOZINHO",
                        admissao: "2026-01-05",
                        desligamento: "2025-10-20",
                        salario_base: 8500.85
                    }
                }
            })
        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Desligamento não pode ser anterior à admissão.')
     })
})