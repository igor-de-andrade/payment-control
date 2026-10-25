const request = require('supertest');
expect = require('chai').expect;

describe('Mutation - Criar funcionário', () => {
    let token;
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
        token = resposta.body.data.login.token;
        
        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.login).to.have.property('token')

      });

    it('Deve criar um funcionário quando preencho todos os campos obrigatórios de forma válida', async () => {
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
                            nome: "Augusto Ferreira",
                            salario_base: 8500.85,
                            admissao: "2026-01-05",
                            desligamento: ""

                                }
                                    }
                    })

         expect(resposta.status).to.equal(200)
         expect(resposta.body.data.criarFuncionario).to.have.property('id')
    
    
    });



    it('Deve criar um funcionário quando preencho todos os campos de forma válida', async () => {
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
                            nome: "Augusto Ferreira",
                            salario_base: 8500.85,
                            admissao: "2026-01-05",
                            desligamento: "2026-10-20"

                                }
                                    }
                    })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.criarFuncionario).to.have.property('id')
        
    });

    it('Não deve criar um funcionário quando não informa o salário base', async () => {
        let cpf = Date.now()

        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
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
                            nome: "Augusto Ferreira",
                            admissao: "2026-01-05",
                            desligamento: "2026-10-20"
                        }
                    }
        })

        expect(resposta.status).to.equal(400)
        expect(resposta.body.errors[0]).to.have.property('message', `Variable \"$input\" got invalid value { cpf: \"${cpf}\", nome: \"Augusto Ferreira\", admissao: \"2026-01-05\", desligamento: \"2026-10-20\" }; Field \"salario_base\" of required type \"Float!\" was not provided.`)
        
    });
    
  it('Não deve criar um funcionário quando a data de desligamento é inferior à data de admissão', async () => {
        let cpf = Date.now()

        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
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
                            nome: "Augusto Ferreira",
                            admissao: "2026-08-05",
                            salario_base: 8500.85,
                            desligamento: "2026-08-04"
                        }
                    }
        })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', `Desligamento não pode ser anterior à admissão.`)
        
    });

    it('Não deve criar um funcionário que já foi cadastrado anteriormente', async () => {
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
                            nome: "Maria Rita",
                            salario_base: 9500.00,
                            admissao: "2026-01-01"
                            
                            
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
                            nome: "José Pedro",
                            salario_base: 5500.85,
                            admissao: "2026-01-06"
                            
                      
                        }
                    }                    
        })

        expect(resposta2.status).to.equal(200)
        expect(resposta2.body.errors[0]).to.have.property('message', `Já existe funcionário com este CPF.`)
        
    });

});





  
                   
