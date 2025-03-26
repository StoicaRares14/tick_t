import client from "@/apollo-client";
import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Stack>
        <Stack.Screen name="(tabs)/(home)" />
        <Stack.Screen name="(tabs)/(profile)" />
        <Stack.Screen name="(tabs)/(settings)" />
      </Stack>
    </ApolloProvider>
  );
}
