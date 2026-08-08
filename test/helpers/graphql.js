const request = require('supertest')
const { API_URL } = require('./config')

async function executarGraphQL({ query, variables, token }) {
    const requisicao = request(API_URL).post('/graphql')

    if (token) {
        requisicao.set('Authorization', `Bearer ${token}`)
    }

    return requisicao.send({ query, variables })
}

module.exports = { executarGraphQL }
