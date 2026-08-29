const request = require ('supertest')

async function login(variables) {
    return request('http://localhost:4000')
                .post('/graphql')
                .send({
                    query:`mutation Login($email: String!, $senha: String!) {
                        login(email: $email, senha: $senha) {
                            token
                        }
                    }`,
                    variables: variables
                })

}
//Tambe´m pode ser feito assim nas variaveis
async function login2(email, senha) {
    return request('http://localhost:4000')
                .post('/graphql')
                .send({
                    query:`mutation Login($email: String!, $senha: String!) {
                        login(email: $email, senha: $senha) {
                            token
                        }
                    }`,
                    variables: {
                        email: email,
                        senha: senha
                    }
                })

}

module.exports = {
    login,
    login2
}