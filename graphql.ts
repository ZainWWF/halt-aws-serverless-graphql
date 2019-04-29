import { ApolloServer } from "apollo-server-lambda";
import { DynamoDB } from "aws-sdk";
import executableSchema from "./schemas/executable-schema";

const server = new ApolloServer({
  schema: executableSchema,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    dynamoDb: new DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000"
    })
  })
});

exports.graphqlHandler = server.createHandler();
