const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { verifyToken } = require('./services/authService');
const userRepository = require('./repositories/userRepository');

async function buildContext({ req }) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return { user: null };
  try {
    const payload = verifyToken(header.slice(7));
    const user = userRepository.findById(payload.sub);
    return { user: user?.ativo ? user : null };
  } catch (_) {
    return { user: null };
  }
}
async function start() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false,
    plugins: [{
      async requestDidStart() {
        return {
          async willSendResponse({ response }) {
            if (response.body.kind !== 'single') return;
            const errors = response.body.singleResult.errors;
            if (errors?.some((error) => error.extensions?.code === 'BAD_USER_INPUT')) {
              response.http.status = 400;
            }
          },
        };
      },
    }],
  });
  await server.start();
  app.use('/graphql', cors(), express.json(), expressMiddleware(server, { context: buildContext }));
  const port = Number(process.env.PORT) || 4000;
  app.listen(port, () => console.log(`GraphQL disponível em http://localhost:${port}/graphql`));
}
start().catch((error) => { console.error(error); process.exit(1); });

module.exports = { buildContext };
