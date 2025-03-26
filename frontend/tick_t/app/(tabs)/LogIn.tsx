import { gql, useMutation } from "@apollo/client";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet, TextInput } from "react-native";
import * as SecureStore from "expo-secure-store";

const LOGIN_MUTATION = gql`
  mutation signIn($signInDto: SignInInput!) {
    signIn(signInDto: $signInDto) {
      accessToken
    }
  }
`;

export default function LoginScreen() {
  const route = useRoute();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [from, setFrom] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: async (data) => {
      // Store the token in AsyncStorage or SecureStore
      const token = data.signIn.accessToken;
      try {
        await SecureStore.setItemAsync("authToken", token);

        console.log(await SecureStore.getItemAsync("authToken"));
      } catch (e) {
        setErrorMessage("Failed to save the token.");
      }
    },
    onError: (err) => {
      setErrorMessage("Invalid credentials. Please try again.");
      console.log(err);
    },
  });

  useEffect(() => {
    const params = route.params;
    if (params && params.from) {
      setFrom(params.from);
    }
  }, []);

  const handleLoginPress = async () => {
    try {
      const { data } = await login({
        variables: { signInDto: { username, password } },
      });

      router.back();
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleSignUpPress = () => {
    console.log(route);
    router.push({ pathname: "/(tabs)/SignUp", params: route.params });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={(text) => setUsername(text)}
        placeholder="Enter Email/Username"
        placeholderTextColor="darkgray"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Enter Password"
        placeholderTextColor="darkgray"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLoginPress} />
      <Button title="Sign Up" onPress={handleSignUpPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});
