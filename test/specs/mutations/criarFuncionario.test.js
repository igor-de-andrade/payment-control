const request = require('supertest');
const { expect } = require('chai');

describe('Mutation - Criar Funcionario', () => {

    let token;
    before(async function () {

        const resposta = await request('http://localhost:4000')
                .post('/graphql')
                .send({
                    query: `mutation Login($email: String!, $senha: String!) {
                          login(email: $email, senha: $senha) {
                           token
                             }
                             }`,
                    variables: {
                           "email": "admin@admin.com",
                           "senha": "123456"
                    }
                })
                 expect(resposta.status).to.equal(200)
                 expect(resposta.body.data.login).to.have.property('token')
                 token = resposta.body.data.login.token;
    })

    it('CT1 - Deve criar um funcionario com sucesso com todas os campos obrigátorios com sucesso', async function() {
        let cpf = Date.now().toString();

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
                "input":{
                    "cpf": `${cpf}`,
                    "nome": "Graziela Mendes",
                    "salario_base": 10000.00 ,
                    "admissao": "2001-12-05",
                    "desligamento": null
                }
            }
        });

         expect(resposta.status).to.equal(200);
         expect(resposta.body.data.criarFuncionario).to.have.property('id');        
    });


    it('CT2 - Deve criar um funcionario com sucesso com todos os campos de forma valida ', async function() {
        let cpf = Date.now().toString();

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
                "input":{
                    "cpf": `${cpf}`,
                    "nome": "Joao Mendes",
                    "salario_base": 10000.00 ,
                    "admissao": "2001-12-05",
                    "desligamento": "2026-04-08"
                }
            }
        });

         expect(resposta.status).to.equal(200);
         expect(resposta.body.data.criarFuncionario).to.have.property('id');

         
    });

   it('CT3 - Não deve criar funcionario pois o campo CPF está vazio.', async function() {

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
                "input":{
                    "cpf": "",
                    "nome": "Joao Mendes",
                    "salario_base": 10000.00 ,
                    "admissao": "2001-12-05",
                    "desligamento": "2026-04-08"
                }
            }
        });

         expect(resposta.status).to.equal(200);
         expect(resposta.body.errors[0]).to.have.property('message', 'CPF, nome, salário base e admissão são obrigatórios.');    
    });

    it('CT4 - Não deve criar funcionário pois o campo NOME está vazio ', async function() {
        let cpf = Date.now().toString();

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
                "input":{
                    "cpf": `${cpf}`,
                    "nome": "",
                    "salario_base": 10000.00 ,
                    "admissao": "2001-12-05",
                    "desligamento": "2026-04-08"
                }
            }
        });

         expect(resposta.status).to.equal(200);
         expect(resposta.body.errors[0]).to.have.property('message', 'CPF, nome, salário base e admissão são obrigatórios.');    

         
    });

    it('CT5 - Não deve criar funcionário pois o campo ADMISSAO não esta na estrutura ', async function() {
        let cpf = Date.now().toString();

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
                        desligamento
                    }
                }`,
            variables: {
                "input":{
                    "cpf": `${cpf}`,
                    "nome": "Graziela Cardoso",
                    "salario_base": 10000.00 ,
                    "desligamento": "2026-04-08"
                }
            }
        });

         expect(resposta.status).to.equal(400);
         expect(resposta.body.errors[0].message).to.include('Field "admissao" of required type "String!" was not provided.');    

         
    });


    
})