import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const GRAPHQL_ENDPOINT = 'https://patient-pony-99.hasura.app/v1/graphql';
const HASURA_ADMIN_SECRET = 'VFTKOCbQwgWTDNpboYmFdoA0fWRSTnlPKnSh7C7Tqr1GziwlKobak7bv2xu20OL1'; // Replace with your actual admin secret

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;