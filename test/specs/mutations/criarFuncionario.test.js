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
    it('deve criar um funcionário quando preencho os campos obrigatórios de forma válida', async () => {
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
    it('deve criar um funcionário quando preencho todos os campos de forma válida', async () => {
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
    it('Não deve criar um funcionário quando não informado o CPF', async () => {
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
                        cpf: "",
                        nome: "JOAOZINHO",
                        salario_base: 8500.85,
                        admissao: "2026-01-05",
                        desligamento: "2026-10-20"
                    }
                }
            })
        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'CPF, nome, salário base e admissão são obrigatórios.')
    })
    it('Não deve criar um funcionário quando não informado o nome', async () => {
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
                        cpf: "${cpf}",
                        nome: "",
                        salario_base: 8500.85,
                        admissao: "2026-01-05",
                        desligamento: "2026-10-20"
                    }
                }
            })
        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'CPF, nome, salário base e admissão são obrigatórios.')
    })
    it('Não deve criar um funcionário quando informada data de emissão em formato inválido', async () => {
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
                        cpf: "${cpf}",
                        nome: "Pedro",
                        salario_base: 1000,
                        admissao: "01-01-2026",
                        desligamento: "2026-10-20"
                    }
                }
            })
        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Admissão deve estar no formato YYYY-MM-DD e ser uma data válida.')
    })
     it('Não deve criar um funcionário quando removido todos os dados do input', async () => {
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
                
                    }
                }
            })
        expect(resposta.status).to.equal(400)
        
    })
    it('Não deve criar um funcionário quando não informo o salário base', async () => {
        let cpf = Date.now()
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
                        desligamento: "2026-10-20"
                    }
                }
            })
        expect(resposta.status).to.equal(400)
        expect(resposta.body).to.have.property('errors')
        expect(resposta.body.errors[0]).to.have.property('message').that.includes('Field "salario_base" of required type "Float!" was not provided.')
    })

    it.skip('Não deve criar um funcionário quando preencho o mesmo cpf', async () => {
   
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
                        nome: "Lucia",
                        salario_base: 7500.85,
                        admissao: "2026-01-05"
                    }
                }
            })
        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.criarFuncionario).to.have.property('id')

        const resposta2 = await request('http://localhost:4000')
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
                        nome: "Maria",
                        salario_base: 10500.85,
                        admissao: "2026-01-05",
                        desligamento: ""
                    }
                }
            })
        expect(resposta2.status).to.equal(200)
        expect(resposta2.body).to.have.property('errors')
        expect(resposta2.body.errors[0]).to.have.property('message', 'Já existe funcionário com este CPF.')
    })

     it('não deve criar um funcinário quando a data de desligamento é inferior à data de admissão', async () => {
        let cpf = Date.now()
    
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
                        admissao: "2026-08-05",
                        desligamento: "2026-08-04"
                    }
                }
            })
        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', `Desligamento não pode ser anterior à admissão.`)
    })

})