import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function ReservationSuccess() {
  const router = useRouter();
  const { orderId, date, time, guests } = useLocalSearchParams();

  return (
    <View style={styles.screen}>
      {/* ✔️ Green Tick */}
      <View style={styles.tickWrap}>
        <View style={styles.tickCircle}>
          <Feather name="check" size={48} color="#2ECC71" />
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Reservation Confirmed!</Text>
      <Text style={styles.sub}>Your table has been reserved</Text>

      {/* White Card Box */}
      <View style={styles.card}>
        {/* Order ID */}
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Feather name="shopping-bag" size={20} color="#111" />
          </View>
          <View>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>{orderId}</Text>
          </View>
        </View>

        {/* Date */}
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Feather name="calendar" size={20} color="#111" />
          </View>
          <View>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{date}</Text>
          </View>
        </View>

        {/* Time */}
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Feather name="clock" size={20} color="#111" />
          </View>
          <View>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>{time}</Text>
          </View>
        </View>

        {/* Guests */}
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Feather name="users" size={20} color="#111" />
          </View>
          <View>
            <Text style={styles.label}>Guests</Text>
            <Text style={styles.value}>{guests} people</Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => router.push("/orders")}
      >
        <Text style={styles.primaryText}>View My Bookings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.secondaryText}>Back to Home</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Please arrive 10 minutes before your reservation time
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9EDEB",
    alignItems: "center",
    paddingTop: 70,
  },

  tickWrap: { marginBottom: 20 },
  tickCircle: {
    width: 90,
    height: 90,
    borderRadius: 100,
    backgroundColor: "#D1F7D6",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#14213D",
    marginTop: 10,
  },
  sub: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  card: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 25,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#F4F4F4",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  label: { fontSize: 12, color: "#6B7280" },
  value: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginTop: 3,
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: 200, // stops overflow
  },

  primaryBtn: {
    marginTop: 30,
    backgroundColor: "#0F172A",
    paddingVertical: 14,
    borderRadius: 14,
    width: "85%",
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontSize: 14, fontWeight: "700" },

  secondaryBtn: {
    marginTop: 15,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DADADA",
    width: "85%",
    alignItems: "center",
  },
  secondaryText: {
    color: "#111",
    fontSize: 14,
    fontWeight: "700",
  },

  note: {
    marginTop: 20,
    color: "#9CA3AF",
    fontSize: 12,
  },
});
