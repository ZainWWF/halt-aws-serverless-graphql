import { makeExecutableSchema } from "graphql-tools";
import {
  schema as profileSchema,
  typeResolvers as profileTypeResolvers,
  queryResolvers as profileQueryResolvers,
  mutationResolvers as profileMutationResolvers
} from "./schemas/profile";

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

const resolvers = {
  ...profileTypeResolvers,

  Query: {
    testMessage: (): string => {
      return "Hello World!";
    },
    ...profileQueryResolvers
  },

  Mutation: {
    ...profileMutationResolvers
  }
};

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});

export default executableSchema;
