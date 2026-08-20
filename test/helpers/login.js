const request = require('supertest')

async function login(obj) {
    return request('http://localhost:4000')
        .post('/graphql')
        .send({
            query: `mutation Login($email: String!, $senha: String!) {
                        login(email: $email, senha: $senha) {
                            token
                        }
                    }`,
            variables: obj
        })
}
module.exports = {
    login
}