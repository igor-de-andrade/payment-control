const request = require('supertest')

async function login(variables) {
    return request('http://localhost:4000')
        .post('/graphql')
        .send({
            query: `mutation Login($email: String!, $senha: String!) {
                      login(email: $email, senha: $senha) {
                       token
                         }
                         }`,
            variables: variables
        })
}

module.exports = {
    login
}