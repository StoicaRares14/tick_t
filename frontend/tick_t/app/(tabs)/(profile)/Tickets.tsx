import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { gql, useQuery } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { Link } from "expo-router";

const GET_USER_TICKETS = gql`
  query findAllTickets($query: QueryTicketInput!) {
    findAllTickets(query: $query) {
      tickets {
        id
        qrCode
        eventId
      }
      next
    }
  }
`;

export default function TicketsScreen() {
  // Fetch tickets for the current user
  const { data, loading, error } = useQuery(GET_USER_TICKETS, {
    variables: { query: { limit: 12 } },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading tickets...</Text>
      </View>
    );
  }

  if (error) {
    console.error("Error fetching tickets:", error);
    return (
      <View style={styles.container}>
        <Text>Error loading tickets.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Tickets</Text>
      {data?.findAllTickets.tickets.length === 0 ? (
        <Text style={styles.noTickets}>
          You haven't purchased any tickets yet.
        </Text>
      ) : (
        <FlatList
          data={data.findAllTickets.tickets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.ticketCard}>
              <Text style={styles.eventName}>Event ID: {item.eventId}</Text>
              <Text>Ticket ID: {item.id}</Text>
              {/* <Text>Date: {item.event.date}</Text>
              <Text>Location: {item.event.location}</Text>
              <Text>Price: ${item.event.price}</Text>
              <Text>Quantity: {item.quantity}</Text> */}
              {/* <Text>
                Purchased At: {new Date(item.purchasedAt).toLocaleDateString()}
              </Text> */}
            </View>
          )}
        />
      )}
      <Link href="/(tabs)/(home)">Go to Home</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  ticketCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
  },
  eventName: { fontSize: 18, fontWeight: "bold" },
  noTickets: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
});
