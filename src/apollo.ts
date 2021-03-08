import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  // uber-eats-backend url
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

