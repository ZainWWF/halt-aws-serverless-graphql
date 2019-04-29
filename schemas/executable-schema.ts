import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "../resolvers";
import {schema as plantationSchema} from './plantationSchema';
import {schema as defaultSchema} from './defaultSchema';


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
const schema = [...rootSchema, ...plantationSchema, ...defaultSchema];

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});

export default executableSchema;
