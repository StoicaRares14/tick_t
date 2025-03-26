import { Link, useNavigation } from "expo-router";
import { Text, View } from "react-native";

export default function ProfileScreen() {
  const naviagion = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
      }}
    >
      <Text style={{ color: "white" }}>Profile Page</Text>
      <Link href="/(tabs)/(home)">Go to Home</Link>
    </View>
  );
}
