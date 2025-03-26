import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Button,
  Text,
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import * as SecureStore from "expo-secure-store"; // Import SecureStore

const GET_EVENT = gql`
  query findOneEvent($id: Int!) {
    findOneEvent(id: $id) {
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
  }
`;

export default function EventDetailsScreen() {
  const { id, event, email } = useLocalSearchParams();
  const router = useRouter();

  // State hooks
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [localEmail, setEmail] = useState(email || "");
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [parsedEvent, setParsedEvent] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  // GraphQL query
  const { data, error, loading } = useQuery(GET_EVENT, {
    variables: { id: Number(id) },
    skip: !!event,
  });

  // Effect to check if token exists in SecureStore
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await SecureStore.getItemAsync("authToken"); // Retrieve token from SecureStore
      console.log("token", token);
      if (token) {
        setIsLoggedIn(true); // User is logged in
      }
    };

    checkLoginStatus();

    if (event && !parsedEvent) {
      const parsed = JSON.parse(event || "{}");
      setParsedEvent(parsed);
    }

    if (!event && !isRefreshed) {
      setIsRefreshed(true);
    }
  }, [event, parsedEvent, isRefreshed]);

  const handleBuyClick = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true); // Show authentication modal if not logged in
    } else {
      handleEmailSubmit(); // Proceed if logged in
    }
  };

  const handleEmailSubmit = () => {
    router.push({
      pathname: "/(tabs)/(home)/BuyTickets",
      params: {
        email: localEmail,
        ticketCount: parsedEvent.ticketCount,
        purchasedCount: parsedEvent.purchasedCount,
        eventId: id,
      },
    });
    setShowAuthModal(false);
  };

  function handleLoginPress() {
    router.push({
      pathname: "/(tabs)/LogIn",
      params: {
        from: `(tabs)/(home)/event/${id}`,
        fromParams: { event, id, email: localEmail },
      },
    });
    setShowAuthModal(false);
  }

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

  const eventToDisplay = parsedEvent || data?.findOneEvent;

  return (
    <View style={styles.container}>
      {eventToDisplay && (
        <>
          <View style={styles.card}>
            <Text style={styles.title}>{eventToDisplay.name}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{eventToDisplay.date}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>{eventToDisplay.location}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Tickets Remaining:</Text>
              <Text style={styles.value}>
                {eventToDisplay.ticketCount - eventToDisplay.purchasedCount}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Price:</Text>
              <Text style={styles.value}>{eventToDisplay.price}</Text>
            </View>

            <Text style={styles.description}>{eventToDisplay.description}</Text>
          </View>

          <Button
            title="Buy Tickets"
            color="#1e88e5"
            onPress={handleBuyClick}
          />
        </>
      )}

      <Modal visible={showAuthModal} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Please log in or provide your email
            </Text>
            <TextInput
              style={styles.emailInput}
              value={localEmail}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email"
            />
            <TouchableOpacity
              style={styles.emailButton}
              onPress={handleEmailSubmit}
            >
              <Text style={styles.emailButtonText}>Submit Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLoginPress}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    color: "#666",
  },
  value: {
    fontSize: 18,
  },
  description: {
    fontSize: 16,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  emailInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  emailButton: {
    backgroundColor: "#1e88e5",
    padding: 10,
    borderRadius: 5,
  },
  emailButtonText: {
    color: "white",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
  },
});
