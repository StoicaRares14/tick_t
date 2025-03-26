import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
      }}
    >
      <Text style={{ color: "white" }}>Settings Page</Text>
      <Link href="/(tabs)/(home)">Go to Home</Link>
    </View>
  );
}
