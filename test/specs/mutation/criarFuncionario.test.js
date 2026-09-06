const request = require('supertest')
const { expect } = require('chai')

describe('Criar Funcionario Mutation', () => {
    let token

    before(async () => {
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
        token = resposta.body.data.login.token
    })

    it.only('deve criar um funcionario com sucesso quando preencho os campos obrigatorios de forma válida', async() => {
        let cpf = Date.now()
        console.log(cpf)

        const resposta = await request('http://localhost:4000')
        .post('/graphQL')
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
                    nome: "Beatriz",
                    salario_base: 8500.30,
                    admissao: "2025-07-03",
                    desligamento: "2026-09-15"
                }
            }
        })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.criarFuncionario).to.have.property('id')
    })

    it.only('nao deve criar um funcionario quando nao enviado token', async() => {
        let cpf = Date.now()
        console.log(cpf)

        const resposta = await request('http://localhost:4000')
        .post('/graphQL')
       
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
                    nome: "Beatriz",
                    salario_base: 8500.30,
                    admissao: "2025-07-03",
                    desligamento: "2026-09-15"
                }
            }
        })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0].message).to.includes("Autenticação obrigatória.")
    })

    it.only('deve criar um funcionario quando enviado apenas inputs obrigatórios cpf,nome,salario_base,admissao', async() => {
        let cpf = Date.now()
        console.log(cpf)

        const resposta = await request('http://localhost:4000')
        .post('/graphQL')
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
                    nome: "Beatriz",
                    salario_base: 8500.30,
                    admissao: "2025-07-03"
                }
            }
        })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.criarFuncionario).to.have.property('id')
        
    })

    it.only('nao deve criar um funcionario com sucesso quando nao envio um campo obrigatorio', async() => {
        let cpf = Date.now()
        console.log(cpf)

        const resposta = await request('http://localhost:4000')
        .post('/graphQL')
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
                    nome: "Beatriz",
                    salario_base: 8500.30,
                    admissao: "2025-07-03",
                    desligamento: "2026-09-15"
                }
            }
        })

        expect(resposta.status).to.equal(400)
        console.log(resposta.body.errors[0].message)
        expect(resposta.body.errors[0].message).to.includes("Variable \"$input\" got invalid value { nome: \"Beatriz\", salario_base: 8500.3, admissao: \"2025-07-03\", desligamento: \"2026-09-15\" }; Field \"cpf\" of required type \"String!\" was not provided.")
    })

    it.only('nao deve criar um funcionario quando tanto cadastrar um mesmo cpf', async() => {
        let cpf = Date.now()
        console.log(cpf)

         const resposta = await request('http://localhost:4000')
        .post('/graphQL')
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
                    nome: "Beatriz",
                    salario_base: 8500.30,
                    admissao: "2025-07-03",
                    desligamento: "2026-09-15"
                }
            }
        })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.criarFuncionario).to.have.property('id')

        const resposta2 = await request('http://localhost:4000')
        .post('/graphQL')
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
                    nome: "Beatriz",
                    salario_base: 8500.30,
                    admissao: "2025-07-03",
                    desligamento: "2026-09-15"
                }
            }
        })

        expect(resposta2.status).to.equal(200)
        console.log(resposta2.body.errors[0].message)
        expect(resposta2.body.errors[0].message).to.includes("Já existe funcionário com este CPF.")
    })
})