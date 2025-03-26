import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import * as SecureStore from "expo-secure-store"; // Import SecureStore

const GET_EVENTS = gql`
  query findAllEvents($query: QueryEventInput!) {
    findAllEvents(query: $query) {
      events {
        id
        name
        date
        cover
        description
        location
        price
        purchasedCount
        ticketCount
      }
      next
    }
  }
`;

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for token in SecureStore to determine if the user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");

        if (token) {
          setIsLoggedIn(true); // User is logged in
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  const { loading, error, data } = useQuery(GET_EVENTS, {
    variables: {
      query: { limit: 12 },
    },
  });

  // Logout function to clear the token and update the state
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("authToken"); // Remove token from SecureStore
      setIsLoggedIn(false); // Update the login state
      router.push("/(tabs)/LogIn"); // Redirect to Login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navigateToEvent = (event) => {
    router.push({
      pathname: "/(tabs)/(home)/event/[id]",
      params: {
        id: event.id,
        event: JSON.stringify(event),
      },
    });
  };

  // Determine nav items based on login state
  const navItems = isLoggedIn
    ? [
        { label: "Tickets", route: "/(tabs)/(profile)/Tickets" },
        { label: "Profile", route: "/(tabs)/(profile)" },
        {
          label: "Logout",
          route: "#",
          action: logout, // Add logout action
        },
      ]
    : [{ label: "Login", route: "/(tabs)/LogIn" }];

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    console.log(JSON.stringify(error, null, 2));
    return (
      <View style={styles.container}>
        <Text>Error</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Events</Text>
      <ScrollView style={styles.scrollableList}>
        {data.findAllEvents.events.map((item) => {
          const isSoldOut = item.purchasedCount >= item.ticketCount;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.eventCard, isSoldOut && styles.soldOutCard]}
              onPress={() => navigateToEvent(item)}
              disabled={isSoldOut}
            >
              <Text style={styles.eventname}>{item.name}</Text>
              <Text>{item.date}</Text>
              {isSoldOut ? (
                <Text style={styles.soldOutText}>Sold Out</Text>
              ) : (
                <Text style={styles.ticketCountText}>
                  {item.ticketCount - item.purchasedCount} tickets remaining
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.navBar}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.navButton}
            onPress={item.action ? item.action : () => router.push(item.route)}
          >
            <Text style={styles.navText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  scrollableList: { flex: 1 },
  eventCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
  },
  soldOutCard: {
    backgroundColor: "#cccccc",
  },
  eventname: { fontSize: 18, fontWeight: "bold" },
  soldOutText: {
    color: "red",
    fontWeight: "bold",
    marginTop: 8,
  },
  ticketCountText: {
    color: "green",
    marginTop: 8,
  },
  navBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  navButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    fontSize: 16,
  },
});
