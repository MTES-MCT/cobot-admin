import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import VueApollo from 'vue-apollo';

const httpLink = new HttpLink({
  uri: `${process.env.API_URL}/graphql`,
});

const wsLink = new WebSocketLink({
  uri: `${process.env.API_URL.replace('http', 'ws')}/subscriptions`,
  options: {
    reconnect: true,
    timeout: 30000,
  },
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('default_auth_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' &&
      operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink),
);

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
  onError: (e) => { console.log(e.graphQLErrors); }, // Works
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $loadingKey: 'loading',
  },
});

export default ({ app, Vue }) => {
  Vue.use(VueApollo);
  app.provide = apolloProvider.provide();
};
