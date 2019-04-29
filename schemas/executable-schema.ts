import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "../resolvers";
import { schema as profileSchema } from ".";

const rootSchema = [
  `
      type Query {
          testMessage: String!
      }
      type Mutation {
        testMessage(name: String): String!
      }
      schema {
        query: Query  
        mutation: Mutation
      }
  `
];
const schema = [...rootSchema, ...profileSchema];

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});

export default executableSchema;
