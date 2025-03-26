import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, Button } from "react-native";

export default function ConfirmationPageScreen() {
  const { eventName, ticketCount, eventId, email } = useLocalSearchParams();

  const tickets =
    typeof ticketCount === "string" ? parseInt(ticketCount, 10) : 1;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: false,
          gestureEnabled: false,
          title: "Purchase Confirmation",
        }}
      />

      <Text style={styles.heading}>Purchase Successful!</Text>
      <Text style={styles.details}>
        You bought {tickets} ticket{tickets !== 1 ? "s" : ""} for:
      </Text>
      <Text style={styles.eventName}>{eventName || "Event Name"}</Text>

      {email && <Text style={styles.email}>Email: {email}</Text>}

      <View style={styles.buttonsContainer}>
        <Button
          title="Back to Event"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/(home)/event/[id]",
              params: { id: eventId.toString(), email },
            })
          }
        />
        <Button
          title="Go to Home"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/(home)",
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2E7D32",
  },
  details: {
    fontSize: 18,
    marginBottom: 10,
  },
  eventName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  linkButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 130,
    alignItems: "center",
  },
  linkText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
