import client from "@/apollo-client";
import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Stack>
        <Stack.Screen name="(home)" />
      </Stack>
    </ApolloProvider>
  );
}
