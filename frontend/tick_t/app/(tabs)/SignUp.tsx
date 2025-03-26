import { useState } from "react";
// import { useMutation } from "@apollo/client";
// import { CREATE_USER_MUTATION } from "./graphql/mutations";

import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  // const [createUser, { loading, error }] = useMutation(CREATE_USER_MUTATION);

  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      // const response = await createUser({
      //   variables: {
      //     firstName,
      //     lastName,
      //     username,
      //     password,
      //     email,
      //     birthday,
      //   },
      // });
      // if (response.data.createUser.success) {
      //   // Go back to previous screen or home screen
      //   router.goBack();
      //   // or
      //   router.push("/");
      // } else {
      alert("Error creating user account");
      // }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Form</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
        placeholder="Enter your first name"
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={(text) => setLastName(text)}
        placeholder="Enter your last name"
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={(text) => setUsername(text)}
        placeholder="Choose a username"
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Enter a password"
        secureTextEntry
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        placeholder="Confirm your password"
        secureTextEntry
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="Enter your email address"
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        value={birthday}
        onChangeText={(text) => setBirthday(text)}
        placeholder="Enter your birthday (YYYY-MM-DD)"
        placeholderTextColor="#ccc"
      />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: 250,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
