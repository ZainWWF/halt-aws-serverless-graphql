import { ApolloServer } from "apollo-server-lambda";
import * as dynamodb from 'serverless-dynamodb-client'
import executableSchema from "./schemas/executable-schema";

const server = new ApolloServer({
  schema: executableSchema,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    dynamoDb: dynamodb.doc

  })
});

exports.graphqlHandler = server.createHandler();
