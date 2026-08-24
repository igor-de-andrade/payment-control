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

    it('Criar funcionário quando preencho os campos obrigatórios', async () => {
        let cpf = Date.now()
        console.log(cpf)

        const resposta = await request ('http://localhost:4000')
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
                        nome: "Funcionario7",
                        salario_base: 4600.00,
                        admissao: "2026-03-03",
                        desligamento: ""
                    }
                }     
            })

            expect(resposta.status).to.equal(200)
            expect(resposta.body.data.criarFuncionario).to.have.property('id')
    })

    it('Não criar funcionário quando não preencho os campos obrigatórios', async () => {
        let cpf = Date.now()
        console.log(cpf)

        const resposta = await request ('http://localhost:4000')
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
                        nome: "Funcionario8",
                        salario_base: 4600.00,
                        admissao: "",
                        desligamento: ""
                    }
                }     
            })

            expect(resposta.status).to.equal(200)
            expect(resposta.body.errors[0]).to.have.property('message', 'CPF, nome, salário base e admissão são obrigatórios.')
    })

    it('Não criar funcionário quando não preencho com funcionário já cadastrado', async () => {
        let cpf = Date.now()
        console.log(cpf)

        const resposta = await request ('http://localhost:4000')
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
                        cpf: '12345678904',
                        nome: "Funcionario7",
                        salario_base: 4600.00,
                        admissao: "2026-03-03",
                        desligamento: ""
                    }
                }     
            })

            expect(resposta.status).to.equal(200)
            expect(resposta.body.errors[0]).to.have.property('message', 'Já existe funcionário com este CPF.')
    })

    it('Não criar funcionário quando a data de admissão é menor que a de demissão', async () => {
        let cpf = Date.now()
        console.log(cpf)

        const resposta = await request ('http://localhost:4000')
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
                        nome: "Funcionario7",
                        salario_base: 4600.00,
                        admissao: "2026-03-03",
                        desligamento: "2025-03-03"
                    }
                }     
            })

            expect(resposta.status).to.equal(200)
            expect(resposta.body.errors[0]).to.have.property('message', 'Desligamento não pode ser anterior à admissão.')
    })

    it('Não criar funcionário quando não há valor de cpf, nome e salário', async () => {
        let cpf = Date.now()
        console.log(cpf)

        const resposta = await request ('http://localhost:4000')
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
                        admissao: "2026-03-03",
                        desligamento: ""
                    }
                }     
            })

            expect(resposta.status).to.equal(400)
            expect(resposta.body.errors[0]).to.have.property('message', 'Variable \"$input\" got invalid value { admissao: \"2026-03-03\", desligamento: \"\" }; Field \"cpf\" of required type \"String!\" was not provided.')
    })

    
}) 
