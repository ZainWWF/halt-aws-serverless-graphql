import { makeExecutableSchema } from "graphql-tools";
import {
  typeResolvers as profileTypeResolvers,
  queryResolvers as profileQueryResolvers,
  mutationResolvers as profileMutationResolvers
} from "./resolvers";
import { schema as profileSchema } from "./schemas";

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
