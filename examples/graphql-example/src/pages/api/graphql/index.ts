import type { NextApiRequest, NextApiResponse } from 'next'
import { ApolloServer } from 'apollo-server-micro';
import { resolverObject } from './resolver';
import { typeDefinitions } from './typeDefs';

export const config = {
  api: {
    bodyParser: false
  }
}

const apolloServer = new ApolloServer({ typeDefs: typeDefinitions, resolvers: resolverObject })
await apolloServer.start()

export default function graphql(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('access-control-allow-methods', 'POST')
  res.setHeader('access-control-allow-origin', '*')
  return apolloServer.createHandler({ path: '/api/graphql' })(req, res)
}