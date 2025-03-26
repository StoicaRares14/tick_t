import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function TicketDetailsScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
      }}
    >
      <Text style={{ color: "white" }}>Ticket Details Page</Text>
      <Link href="/(tabs)/(home)">Go to Home</Link>
    </View>
  );
}
