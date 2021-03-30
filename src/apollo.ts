import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LOCALSTORAGE_TOKEN } from "./constants";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "wss://happyjy-uber-eats-backend.herokuapp.com/graphql"
      : "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      //backend 설정중 appModule.js > GraphQLModule에 req.headers, connection.context객체에 선언한 TOKEN_KEY값을 기준으로 설정
      "X-JWT": authTokenVar() || "",
    },
  },
});

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://happyjy-uber-eats-backend.herokuapp.com/graphql"
      : "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "",
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

export const client = new ApolloClient({
  // uber-eats-backend url
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
