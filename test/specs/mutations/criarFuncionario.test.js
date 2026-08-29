const request = require ('supertest')
const { expect} = require('chai')

describe('Mutation - Criar Funcionário', () => {
    let token
    let cpfAmanda = Date.now()

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
        expect(resposta.body.data.login.token).to.not.be.empty
        expect(resposta.body.data.login.token).to.be.a('string')
        expect(resposta.body.data.login.token).to.include('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ')
        token = resposta.body.data.login.token
    })

    it('deve criar um funcionário quando preencho os campos obrigatórios de forma válida', async () => {
        let cpf = Date.now()
        
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query:`mutation CriarFuncionario($input: CriarFuncionarioInput!) {
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
                        "cpf":`${cpf}` ,
                        "nome": "Bruna Teles",
                        "salario_base": 5000.00,
                        "admissao": "2026-01-01",
                        "desligamento": ""
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.criarFuncionario).to.have.property('id') 
        expect(resposta.body.data.criarFuncionario.desligamento).to.be.null;
        
    })

    it ('deve criar um funcionário quando preencho todos os campos de forma válida', async () => {
                
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query:`mutation CriarFuncionario($input: CriarFuncionarioInput!) {
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
                        "cpf":`${cpfAmanda}` ,
                        "nome": "Amanda Teles",
                        "salario_base": 5000.00,
                        "admissao": "2026-01-01",
                        "desligamento": "2026-06-01"
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.criarFuncionario).to.have.property('id') 
        expect(resposta.body.data.criarFuncionario.desligamento).to.not.be.empty
       
    })

    it ('não deve criar um funcionário sem informar o CPF', async () => {
        let cpf = Date.now()
        
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query:`mutation CriarFuncionario($input: CriarFuncionarioInput!) {
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
                        "cpf":"" ,
                        "nome": "Amanda Teles",
                        "salario_base": 5000.00,
                        "admissao": "2026-01-01",
                        "desligamento": "2026-06-01"
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'CPF, nome, salário base e admissão são obrigatórios.')
       
    })

    it ('não deve criar um funcionário sem realizar o login', async () => {
        let cpf = Date.now()
        
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer `)
            .send({
                query:`mutation CriarFuncionario($input: CriarFuncionarioInput!) {
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
                        "cpf":"" ,
                        "nome": "Amanda Teles",
                        "salario_base": 5000.00,
                        "admissao": "2026-01-01",
                        "desligamento": "2026-06-01"
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Autenticação obrigatória.')
       
    })

    it ('não deve criar um funcionário sem passar o campo CPF', async () => {
        let cpf = Date.now()
        
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer `)
            .send({
                query:`mutation CriarFuncionario($input: CriarFuncionarioInput!) {
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
                        "nome": "Amanda Teles",
                        "salario_base": 5000.00,
                        "admissao": "2026-01-01",
                        "desligamento": "2026-06-01"
                    }
                }
            })

        expect(resposta.status).to.equal(400)
        expect(resposta.body.errors[0]).to.have.property('message').to.include('Field \"cpf\" of required type \"String!\" was not provided.')
       
    }) 
    
    it('não deve criar um funcionário já existente', async () => {
        
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query:`mutation CriarFuncionario($input: CriarFuncionarioInput!) {
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
                        "cpf":`${cpfAmanda}` ,
                        "nome": "Amanda Teles",
                        "salario_base": 5000.00,
                        "admissao": "2026-01-01",
                        "desligamento": "2026-06-01"
                    }
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'Já existe funcionário com este CPF.')
       
    })

})