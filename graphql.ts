import  { ApolloServer } from 'apollo-server-lambda';
import executableSchema from './executable-schema';


  
const server = new ApolloServer({
  schema: executableSchema,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
});

exports.graphqlHandler = server.createHandler();