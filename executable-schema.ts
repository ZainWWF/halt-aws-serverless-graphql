import { makeExecutableSchema } from "graphql-tools";
import {
  schema as creatProfileSchema,
  typeResolvers as createProfileTypeResolvers,
  queryResolvers as createProfileQueryResolvers,
  mutationResolvers as createProfileMUtationResolvers
} from "./schemas/createProfile";

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
const schema = [...rootSchema, ...creatProfileSchema];

const resolvers = {
  ...createProfileTypeResolvers,

  Query: {
    testMessage: (): string => {
      return "Hello World!";
    },
    ...createProfileQueryResolvers
  },

  Mutation: {
    ...createProfileMUtationResolvers
  }
};

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});

export default executableSchema;
