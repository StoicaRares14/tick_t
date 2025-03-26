import { gql, useMutation } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View, Button, TextInput } from "react-native";

const CREATE_TICKET_MUTATION = gql`
  mutation createTicket($tickets: [CreateTicketInput!]!) {
    createTicket(tickets: $tickets) {
      id
      eventId
      email
    }
  }
`;

export default function BuyTicketsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const eventId = Number(params.eventId);
  const ticketCountTickets = Number(params.ticketCount) || 0;
  const soldTickets = Number(params.purchasedCount) || 0;
  const [quantity, setQuantity] = useState(1);
  const remainingTickets = ticketCountTickets - soldTickets;
  const [createTicket, { loading, error }] = useMutation(
    CREATE_TICKET_MUTATION
  );

  const handleBuyTickets = async () => {
    try {
      const tickets = [];
      for (let i = 0; i < quantity; i++) {
        tickets.push({
          email: params.email,
          eventId: eventId,
          purchaseDate: new Date().toISOString(),
          userId: params.userId,
        });
      }

      const result = await createTicket({
        variables: { tickets },
      });
      console.log(result);
      router.push({
        pathname: "/(tabs)/(home)/ConfirmationPage",
        params: { eventId, quantity, email: params.email },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>ticketCount: {remainingTickets} tickets</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Button
          title="-"
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
        />
        <TextInput
          value={quantity.toString()}
          onChangeText={(text) => {
            const value = parseInt(text) || 0;
            setQuantity(Math.min(Math.max(1, value), remainingTickets));
          }}
          keyboardType="numeric"
          style={{ width: 50, textAlign: "center" }}
        />
        <Button
          title="+"
          onPress={() => setQuantity(Math.min(quantity + 1, remainingTickets))}
        />
      </View>
      <Button
        title={`Buy ${quantity} ticket${quantity > 1 ? "s" : ""}`}
        onPress={handleBuyTickets}
      />
    </View>
  );
}
