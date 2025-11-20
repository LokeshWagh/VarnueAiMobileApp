import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookPage() {
  const router = useRouter();

  const handleTakeaway = () => router.push("/view-all-catgy");
  const handleDineIn = () => router.push("/dinein");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Book Your Experience</Text>
          <Text style={styles.headerSub}>
            Choose how you'd like to dine with us
          </Text>
        </View>

        <View style={styles.inner}>
          {/* TAKEAWAY */}
          <TouchableOpacity
            onPress={handleTakeaway}
            style={styles.optionCard}
            activeOpacity={0.9}
          >
            <View style={styles.row}>
              <View style={styles.iconGreen}>
                <Feather name="shopping-bag" size={32} color="#059669" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Takeaway</Text>
                <Text style={styles.optionSub}>
                  Order ahead and pick up your meal when it's ready
                </Text>

                <View style={{ marginTop: 6 }}>
                  {[
                    "Quick pickup",
                    "Skip the wait",
                    "Ready in 20-30 minutes",
                  ].map((point, index) => (
                    <View key={index} style={styles.bulletRow}>
                      <View style={styles.bulletGreen} />
                      <Text style={styles.bulletText}>{point}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* DINE-IN */}
          <TouchableOpacity
            onPress={handleDineIn}
            style={styles.optionCard}
            activeOpacity={0.9}
          >
            <View style={styles.row}>
              <View style={styles.iconOrange}>
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={32}
                  color="#FF5733"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Dine-In</Text>
                <Text style={styles.optionSub}>
                  Reserve a table and enjoy your meal at our restaurant
                </Text>

                <View style={{ marginTop: 6 }}>
                  {[
                    "Book a table",
                    "Pre-order your meal",
                    "Full dining experience",
                  ].map((point, index) => (
                    <View key={index} style={styles.bulletRow}>
                      <View style={styles.bulletOrange} />
                      <Text style={styles.bulletText}>{point}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* INFO BOX */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Why Book Ahead?</Text>

            <View style={{ marginTop: 4 }}>
              <Text style={styles.infoItem}>
                ✨ Save time with pre-prepared orders
              </Text>
              <Text style={styles.infoItem}>
                🎯 Guaranteed table availability
              </Text>
              <Text style={styles.infoItem}>
                ⭐ Priority service for pre-orders
              </Text>
              <Text style={styles.infoItem}>
                💰 Exclusive deals for advance bookings
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 10 : 4,
    paddingBottom: 18,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  headerTitle: { fontSize: 22, fontWeight: "700", color: "#111" },
  headerSub: { fontSize: 14, color: "#6B7280", marginTop: 4 },

  inner: { padding: 20 },

  optionCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  row: { flexDirection: "row", gap: 16 },

  iconGreen: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
  },
  iconOrange: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: "#FFF1ED",
    justifyContent: "center",
    alignItems: "center",
  },

  optionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  optionSub: { fontSize: 14, color: "#6B7280", marginBottom: 8 },

  bulletRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  bulletGreen: {
    width: 6,
    height: 6,
    backgroundColor: "#059669",
    borderRadius: 10,
    marginRight: 6,
  },
  bulletOrange: {
    width: 6,
    height: 6,
    backgroundColor: "#FF5733",
    borderRadius: 10,
    marginRight: 6,
  },
  bulletText: { fontSize: 12, color: "#374151" },

  infoBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    marginTop: 10,
  },

  infoTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111",
    marginBottom: 8,
  },
  infoItem: { color: "#6B7280", fontSize: 14, marginBottom: 4 },
});
