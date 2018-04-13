import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import VueApollo from 'vue-apollo';

const httpLink = new HttpLink({
  uri: `${process.env.API_URL}/graphql`,
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

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
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
