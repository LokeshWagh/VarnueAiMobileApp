import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import React from "react";

export default function OrderPlaced() {
  const router = useRouter();
  const { orderId, total, payment } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <AntDesign name="check" size={40} color="#16A34A" />
        </View>

        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>Your delicious food is being prepared</Text>

        <View style={styles.infoBox}>
          <View style={styles.row}>
            <Feather name="package" size={20} color="#444" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.label}>Order ID</Text>
              <Text style={styles.value}>{orderId}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Feather name="clock" size={20} color="#444" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.label}>Estimated Time</Text>
              <Text style={styles.value}>30-40 minutes</Text>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Total Amount</Text>
            <Text style={[styles.value, { fontWeight: "700" }]}>₹{total}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Payment</Text>
            <Text style={styles.value}>{payment}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace("/(tabs)/orders")}
        >
          <Text style={styles.primaryText}>View My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.secondaryText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdeee7",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  iconCircle: {
    backgroundColor: "#e7f8ed",
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#777",
  },
  infoBox: {
    marginTop: 26,
    width: "100%",
    backgroundColor: "#f8fafc",
    padding: 18,
    borderRadius: 14,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  label: { fontSize: 12, color: "#555" },
  value: { fontSize: 14, color: "#111" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  primaryBtn: {
    marginTop: 24,
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "700" },
  secondaryBtn: {
    marginTop: 14,
    paddingVertical: 12,
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  secondaryText: { color: "#444", fontWeight: "600" },
});
