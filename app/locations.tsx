import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const LOCATIONS = [
  {
    id: "1",
    name: "Moti Mahal - Sitabuldi",
    address: "Plot No 12, Central Avenue, Sitabuldi, Nagpur - 440012",
    distance: "2.5 km",
    cloudKitchen: true,
    dineIn: true,
    rating: 4.8,
    timing: "Open • 11:00 AM - 11:00 PM",
  },
  {
    id: "2",
    name: "Moti Mahal - Dharampeth",
    address: "45 West High Court Road, Dharampeth, Nagpur - 440010",
    distance: "3.8 km",
    cloudKitchen: true,
    dineIn: true,
    rating: 4.7,
    timing: "Open • 11:00 AM - 11:30 PM",
  },
  {
    id: "3",
    name: "Moti Mahal - Sadar",
    address: "22 Main Road, Near Railway Station, Sadar, Nagpur - 440001",
    distance: "5.2 km",
    cloudKitchen: true,
    dineIn: false,
    rating: 4.6,
    timing: "Open • 11:00 AM - 10:00 PM",
  },
  {
    id: "4",
    name: "Moti Mahal - Wardha Road",
    address: "Plot 78, Wardha Road, Near Square Mall, Nagpur - 440025",
    distance: "6.5 km",
    cloudKitchen: true,
    dineIn: true,
    rating: 4.7,
    timing: "Open • 10:30 AM - 11:00 PM",
  },
  {
    id: "5",
    name: "Moti Mahal - Civil Lines",
    address: "18 Residency Road, Civil Lines, Nagpur - 440001",
    distance: "8.1 km",
    cloudKitchen: true,
    dineIn: true,
    rating: 4.9,
    timing: "Open • 11:00 AM - 11:30 PM",
  },
  {
    id: "6",
    name: "Moti Mahal - Manish Nagar",
    address: "Behind Eternity Mall, Manish Nagar, Nagpur - 440027",
    distance: "9.4 km",
    cloudKitchen: true,
    dineIn: false,
    rating: 4.5,
    timing: "Open • 11:00 AM - 10:30 PM",
  },
];

export default function LocationsPage() {
  return (
    <ScrollView style={styles.container}>
      {/* Cards */}
      {LOCATIONS.map((loc) => (
        <View key={loc.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.name}>{loc.name}</Text>

            <View style={styles.ratingBox}>
              <Ionicons name="star" size={14} color="#4CAF50" />
              <Text style={styles.ratingText}>{loc.rating}</Text>
            </View>
          </View>

          <Text style={styles.address}>{loc.address}</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconRow}>
              <Ionicons name="location-sharp" size={14} color="#FF5733" />
              <Text style={styles.infoText}>{loc.distance} away</Text>
            </View>

            <View style={styles.iconRow}>
              <Feather name="clock" size={14} color="#444" />
              <Text style={styles.infoText}>{loc.timing}</Text>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tagRow}>
            {loc.dineIn && (
              <View style={[styles.tag, { backgroundColor: "#FFEBEB" }]}>
                <MaterialIcons name="restaurant" size={14} color="#D9534F" />
                <Text style={[styles.tagText, { color: "#D9534F" }]}>
                  Dine-in
                </Text>
              </View>
            )}

            <View style={[styles.tag, { backgroundColor: "#E8F5FF" }]}>
              <Ionicons name="bicycle" size={14} color="#0277BD" />
              <Text style={[styles.tagText, { color: "#0277BD" }]}>
                Delivery
              </Text>
            </View>

            <View style={[styles.tag, { backgroundColor: "#E9F9EE" }]}>
              <Ionicons name="bag-check" size={14} color="#2E7D32" />
              <Text style={[styles.tagText, { color: "#2E7D32" }]}>
                Takeaway
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#FFF5EE" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 2 },
  sub: { color: "#777", marginBottom: 12 },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 14,
  },

  row: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontSize: 16, fontWeight: "700" },

  ratingBox: {
    backgroundColor: "#E8FFE8",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  ratingText: { marginLeft: 4, fontSize: 12, color: "#2E7D32" },
  address: { marginTop: 6, color: "#555" },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  iconRow: { flexDirection: "row", alignItems: "center" },
  infoText: { marginLeft: 4, color: "#444", fontSize: 12 },

  tagRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  tag: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: "center",
    gap: 5,
  },
  tagText: { fontSize: 12, fontWeight: "600" },
});
