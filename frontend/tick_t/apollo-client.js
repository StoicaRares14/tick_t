import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import * as SecureStore from "expo-secure-store";

// Create an Apollo link to add authorization headers
const authLink = new ApolloLink(async (operation, forward) => {
  const token = await SecureStore.getItemAsync("authToken"); // Retrieve the token from SecureStore
  if (token) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`, // Add Authorization header if token exists
      },
    });
  }
  return forward(operation); // Proceed with the request
});

// Log request details
const logLink = new ApolloLink((operation, forward) => {
  console.log("📡 GraphQL Request:", {
    operationName: operation.operationName,
    variables: operation.variables,
    query: operation.query.loc?.source.body, // Logs the full query
    context: operation.getContext(),
  });

  return forward(operation);
});

// Handle errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.error("⚠️ GraphQL Errors:", graphQLErrors);
  }
  if (networkError) {
    console.error("🚨 Network Error:", networkError);
  }
});

// Apollo HTTP Link
const httpLink = new HttpLink({
  uri: "http://192.168.0.202:3000/graphql", // Update this if using a real device
  fetch,
  fetchOptions: {
    module: "no-cors",
  },
});

// Create Apollo Client
const client = new ApolloClient({
  link: ApolloLink.from([authLink, logLink, errorLink, httpLink]), // Order matters!

  cache: new InMemoryCache(),
});

export default client;
