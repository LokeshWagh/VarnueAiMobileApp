// app/dinein.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  Switch,
  Dimensions,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

// your real mock data
import {
  menuItems as MOCK_MENU_ITEMS,
  menuCategories as MOCK_CATEGORIES,
} from "@/data/mockData";

const { width } = Dimensions.get("window");

type MenuItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  categoryId?: string;
};

export default function DineInPage() {
  const router = useRouter();

  // --- booking UI
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const timeSlots = [
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
  ];

  const [timeSlot, setTimeSlot] = useState<string>("");
  const [guests, setGuests] = useState<number>(2);
  const [showPicker, setShowPicker] = useState(false);

  // pickup / drop
  const [pickupDropEnabled, setPickupDropEnabled] = useState<boolean>(false);
  const [vehicleType, setVehicleType] = useState<"Bike" | "Car">("Car");

  // 👉 Preorder category & products (Dynamic)
  const categories = MOCK_CATEGORIES ?? [];
  const allMenuItems = MOCK_MENU_ITEMS ?? {};

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showPreOrder, setShowPreOrder] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [preOrderItems, setPreOrderItems] = useState<
    (MenuItem & { quantity: number })[]
  >([]);

  // 👉 Load items only when category is tapped
  useEffect(() => {
    if (!selectedCategory) {
      setMenuItems([]);
      return;
    }
    const arr = allMenuItems[selectedCategory] ?? [];
    setMenuItems(arr);
  }, [selectedCategory]);

  // add / remove
  const addPreOrderItem = (item: MenuItem) => {
    setPreOrderItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // date = "2025-11-19", time = "11:30 AM"
  function convertToISO(date: string, time: string) {
    try {
      if (!date || !time) return null;

      // Convert 11:30 AM -> 11:30
      let [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":");

      let h = parseInt(hours);

      if (modifier === "PM" && h !== 12) h += 12;
      if (modifier === "AM" && h === 12) h = 0;

      const finalISO = new Date(
        `${date}T${h.toString().padStart(2, "0")}:${minutes}:00`
      );

      return finalISO.toISOString();
    } catch (err) {
      console.log("convertToISO error:", err);
      return null;
    }
  }

  const removePreOrderItem = (id: string) => {
    setPreOrderItems((prev) => {
      const found = prev.find((p) => p.id === id);
      if (!found) return prev;

      if (found.quantity > 1) {
        return prev.map((p) =>
          p.id === id ? { ...p, quantity: p.quantity - 1 } : p
        );
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const getItemQuantity = (id: string) => {
    const it = preOrderItems.find((p) => p.id === id);
    return it ? it.quantity : 0;
  };

  const preOrderTotal = preOrderItems.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );

  const handleProceedToCheckout = async () => {
    if (!date || !timeSlot) {
      Alert.alert("Please select date and time");
      return;
    }
    const scheduledParam = convertToISO(date, timeSlot);
    if (!scheduledParam) {
      Alert.alert("Invalid date/time");
      return;
    }

    const bookingDetails = {
      date,
      timeSlot,
      guests,
      pickupDropEnabled,
      vehicleType: pickupDropEnabled ? vehicleType : null,
    };

    await AsyncStorage.setItem("dineinBooking", JSON.stringify(bookingDetails));
    await AsyncStorage.setItem("preOrderItems", JSON.stringify(preOrderItems));

    router.push({
      pathname: "/checkout",
      params: {
        scheduled: scheduledParam,
        mode: "dinein",
      },
    } as any);
  };

  return (
    <ScrollView
      style={{ backgroundColor: "#fff" }}
      contentContainerStyle={{ paddingBottom: 140, backgroundColor: "#fff" }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.heading}>Reserve your table</Text>
        <Text style={styles.sub}>Choose how you like to dine with us</Text>
      </View>

      <View style={styles.container}>
        {/* Select Date */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.fieldLabel}>Select Date</Text>

          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{
              backgroundColor: "#fff",
              paddingVertical: 14,
              paddingHorizontal: 18,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: "#E5E7EB",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 10,
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text style={{ color: "#111", fontSize: 15 }}>{date}</Text>
            <Feather name="calendar" size={20} color="#374151" />
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={new Date(date)}
              mode="date"
              display="spinner"
              minimumDate={new Date()} // aaj ke pehle date disable
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                  const formatted = selectedDate.toISOString().split("T")[0];
                  setDate(formatted);
                }
              }}
            />
          )}
        </View>

        {/* Select Time */}
        <View style={{ marginTop: 25 }}>
          <Text style={styles.fieldLabel}>Select Time</Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 12,
            }}
          >
            {timeSlots.map((slot) => {
              const active = timeSlot === slot;

              return (
                <TouchableOpacity
                  key={slot}
                  onPress={() => setTimeSlot(slot)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    borderWidth: active ? 0 : 1.5,
                    borderColor: "#E5E7EB",
                    backgroundColor: active ? "#111" : "#fff",
                    shadowColor: active ? "#000" : "transparent",
                    shadowOpacity: active ? 0.15 : 0,
                    shadowRadius: active ? 4 : 0,
                    shadowOffset: active ? { width: 0, height: 2 } : undefined,
                  }}
                >
                  <Text
                    style={{
                      color: active ? "#fff" : "#374151",
                      fontWeight: "500",
                      fontSize: 13,
                    }}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* GUESTS */}
        <View style={{ marginTop: 18 }}>
          <Text style={styles.fieldLabel}>Number of Guests</Text>
          <View style={styles.guestsRow}>
            <TouchableOpacity
              onPress={() => setGuests(Math.max(1, guests - 1))}
              style={styles.guestBtn}
            >
              <Feather name="minus" size={18} color="#111" />
            </TouchableOpacity>

            <Text style={styles.guestsCount}>{guests}</Text>

            <TouchableOpacity
              onPress={() => setGuests(Math.min(20, guests + 1))}
              style={styles.guestBtn}
            >
              <Feather name="plus" size={18} color="#111" />
            </TouchableOpacity>
          </View>
        </View>

        {/* PICKUP & DROP SERVICE */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => setPickupDropEnabled(!pickupDropEnabled)}
            style={{
              borderWidth: 1.5,
              borderColor: "#FFDFC7",
              backgroundColor: "#FFF9F5",
              padding: 16,
              borderRadius: 18,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ fontWeight: "700", fontSize: 16, color: "#111" }}>
                Pickup & Drop Service
              </Text>
              <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>
                We’ll pick you up and drop you back home
              </Text>
            </View>

            <Switch
              value={pickupDropEnabled}
              onValueChange={setPickupDropEnabled}
              thumbColor="#fff"
              trackColor={{ false: "#D1D5DB", true: "#FF5733" }}
            />
          </TouchableOpacity>

          {/* IF TOGGLE ENABLED */}
          {pickupDropEnabled && (
            <View
              style={{
                marginTop: 14,
                borderWidth: 1.5,
                borderColor: "#FFE5DB",
                padding: 18,
                borderRadius: 18,
              }}
            >
              {/* VEHICLE TITLE */}
              <Text
                style={{
                  color: "#374151",
                  marginBottom: 12,
                  fontWeight: "600",
                }}
              >
                Select Vehicle Type
              </Text>

              {/* BIKE + CAR BUTTONS */}
              <View style={{ flexDirection: "row", gap: 16 }}>
                {/* BIKE */}
                <TouchableOpacity
                  onPress={() => setVehicleType("Bike")}
                  style={[
                    {
                      flex: 1,
                      padding: 14,
                      borderRadius: 16,
                      borderWidth: 1.5,
                      borderColor: "#F3F4F6",
                      backgroundColor: "#fff",
                      alignItems: "center",
                    },
                    vehicleType === "Bike" && {
                      borderColor: "#FF5733",
                      backgroundColor: "#FFF3EE",
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: "#FFE8DF",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="motorbike"
                      size={22}
                      color="#FF5733"
                    />
                  </View>

                  <Text style={{ fontWeight: "700", marginTop: 8 }}>Bike</Text>
                  <Text style={{ fontSize: 12, color: "#6B7280" }}>
                    ₹50 per trip
                  </Text>
                </TouchableOpacity>

                {/* CAR */}
                <TouchableOpacity
                  onPress={() => setVehicleType("Car")}
                  style={[
                    {
                      flex: 1,
                      padding: 14,
                      borderRadius: 16,
                      borderWidth: 1.5,
                      borderColor: "#F3F4F6",
                      backgroundColor: "#fff",
                      alignItems: "center",
                    },
                    vehicleType === "Car" && {
                      borderColor: "#FF5733",
                      backgroundColor: "#FFF3EE",
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: "#FFE8DF",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="car"
                      size={22}
                      color="#FF5733"
                    />
                  </View>

                  <Text style={{ fontWeight: "700", marginTop: 8 }}>Car</Text>
                  <Text style={{ fontSize: 12, color: "#6B7280" }}>
                    ₹120 per trip
                  </Text>
                </TouchableOpacity>
              </View>

              {/* SERVICE COMPARISON */}
              <View
                style={{
                  marginTop: 18,
                  borderWidth: 1.5,
                  borderColor: "#FFDFC7",
                  borderRadius: 16,
                  padding: 14,
                  backgroundColor: "#FFF9F5",
                }}
              >
                {/* HEADER */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontWeight: "700", color: "#1E3A8A" }}>
                    Service Comparison
                  </Text>
                  <Text
                    style={{
                      backgroundColor: "#D1FAE5",
                      paddingVertical: 4,
                      paddingHorizontal: 10,
                      borderRadius: 12,
                      color: "#059669",
                      fontWeight: "600",
                    }}
                  >
                    Best Rates
                  </Text>
                </View>

                {/* TABLE HEADER */}
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: "#F3F4F6",
                    paddingBottom: 6,
                  }}
                >
                  <Text
                    style={{ flex: 1, fontWeight: "700", color: "#374151" }}
                  >
                    Details
                  </Text>
                  <Text style={{ width: 50, textAlign: "center" }}>Us</Text>
                  <Text style={{ width: 50, textAlign: "center" }}>Ola</Text>
                  <Text style={{ width: 50, textAlign: "center" }}>Uber</Text>
                  <Text style={{ width: 50, textAlign: "center" }}>Rapido</Text>
                </View>

                {/* PRICING DATA */}
                {[
                  {
                    title: "Base Fare",
                    bike: ["30", "35", "38", "32"],
                    car: ["60", "70", "75", "68"],
                  },
                  {
                    title: "Per KM",
                    bike: ["12", "14", "15", "13"],
                    car: ["12", "14", "15", "13"],
                  },
                  {
                    title: "5 KM Trip",
                    bike: ["70", "85", "93", "77"],
                    car: ["120", "140", "150", "133"],
                  },
                  {
                    title: "Round Trip",
                    bike: ["100", "140", "155", "125"],
                    car: ["200", "240", "260", "220"],
                  },
                ].map((row, index) => {
                  const data = vehicleType === "Bike" ? row.bike : row.car;

                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        marginBottom: 10,
                        alignItems: "center",
                      }}
                    >
                      {/* Title */}
                      <Text style={{ flex: 1, color: "#374151" }}>
                        {row.title}
                      </Text>

                      {/* Prices */}
                      {data.map((price, i) => (
                        <Text
                          key={i}
                          style={{
                            width: 50,
                            textAlign: "center",
                            backgroundColor: i === 0 ? "#ECFDF5" : "#F3F4F6",
                            color: i === 0 ? "#16A34A" : "#111",
                            paddingVertical: 4,
                            borderRadius: 6,
                            fontWeight: "600",
                          }}
                        >
                          ₹{price}
                        </Text>
                      ))}
                    </View>
                  );
                })}

                {/* SAVINGS */}
                <View style={{ marginTop: 10 }}>
                  <Text style={{ color: "#6B7280" }}>You save:</Text>

                  <Text
                    style={{
                      color: "#EF4444",
                      marginTop: 4,
                      fontWeight: "700",
                    }}
                  >
                    {vehicleType === "Bike"
                      ? "Up to ₹55 per round trip"
                      : "Up to ₹60 per round trip"}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* PRE ORDER */}
        <View style={{ marginTop: 18 }}>
          {/* Toggle Header */}
          <TouchableOpacity
            onPress={() => setShowPreOrder(!showPreOrder)}
            style={[
              styles.preorderToggle,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <View>
              <Text style={{ fontWeight: "700" }}>
                Pre-order Food (Optional)
              </Text>
              <Text style={{ color: "#6B7280", marginTop: 4 }}>
                Order ahead and save time
              </Text>
            </View>

            <Feather
              name={showPreOrder ? "chevrons-down" : "chevrons-right"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          {/* SHOW CONTENT ONLY IF OPEN */}
          {showPreOrder && (
            <View
              style={{
                marginTop: 14,
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 14,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              {/* TITLE */}
              <Text style={{ fontWeight: "700", marginBottom: 10 }}>
                Browse Menu
              </Text>

              {/* CATEGORY PILLS WITH EMOJI + NAME */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 12 }}
              >
                {categories.map((c) => {
                  const active = selectedCategory === c.id;

                  return (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => {
                        if (active) {
                          setSelectedCategory(""); // remove filter
                        } else {
                          setSelectedCategory(c.id);
                        }
                      }}
                      style={[
                        {
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 8,
                          paddingHorizontal: 14,
                          borderRadius: 999,
                          backgroundColor: "#fff",
                          borderWidth: 1,
                          borderColor: "#E5E7EB",
                          marginRight: 8,
                          gap: 6,
                        },
                        active && {
                          backgroundColor: "#111",
                          borderColor: "#111",
                        },
                      ]}
                    >
                      {/* CATEGORY EMOJI */}
                      <Text
                        style={{
                          fontSize: 16,
                        }}
                      >
                        {c.icon}
                      </Text>

                      {/* CATEGORY NAME */}
                      <Text
                        style={[
                          { color: "#374151", fontWeight: "700" },
                          active && { color: "#fff" },
                        ]}
                      >
                        {c.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* MENU ITEMS */}
              <View style={{ marginTop: 4 }}>
                {menuItems
                  .filter((item) =>
                    selectedCategory
                      ? item.categoryId === selectedCategory
                      : true
                  )
                  .map((it) => {
                    const qty = getItemQuantity(it.id);
                    return (
                      <View key={it.id} style={styles.menuRow}>
                        <Image
                          source={{ uri: it.image }}
                          style={styles.menuImg}
                        />

                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={{ fontWeight: "700" }} numberOfLines={1}>
                            {it.name}
                          </Text>
                          <Text style={{ color: "#374151", marginTop: 6 }}>
                            ₹{it.price}
                          </Text>
                        </View>

                        {/* ADD / REMOVE */}
                        {qty === 0 ? (
                          <TouchableOpacity
                            onPress={() => addPreOrderItem(it)}
                            style={styles.addBtn}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontWeight: "700",
                                fontSize: 12,
                              }}
                            >
                              Add
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.qtyControl}>
                            <TouchableOpacity
                              onPress={() => removePreOrderItem(it.id)}
                              style={styles.qtyBtn}
                            >
                              <Feather name="minus" size={14} color="#111" />
                            </TouchableOpacity>

                            <Text
                              style={{ marginHorizontal: 8, fontWeight: "700" }}
                            >
                              {qty}
                            </Text>

                            <TouchableOpacity
                              onPress={() => addPreOrderItem(it)}
                              style={styles.qtyBtn}
                            >
                              <Feather name="plus" size={14} color="#111" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    );
                  })}

                {/* Total Section */}
                {preOrderItems.length > 0 && (
                  <View
                    style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTopWidth: 1,
                      borderTopColor: "#F3F4F6",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ color: "#6B7280" }}>
                        {preOrderItems.reduce((t, i) => t + i.quantity, 0)}{" "}
                        items
                      </Text>
                      <Text style={{ fontWeight: "700" }}>
                        ₹{preOrderTotal}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {/* BUTTON */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            onPress={handleProceedToCheckout}
            style={[
              styles.proceedBtn,
              (!date || !timeSlot) && { opacity: 0.6 },
            ]}
            disabled={!date || !timeSlot}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              {preOrderItems.length > 0
                ? "Proceed to Checkout"
                : "Confirm Reservation"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: 20,
    paddingTop:
      (Platform.OS === "android" ? StatusBar.currentHeight ?? 20 : 44) + 6,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
  },
  heading: { fontSize: 22, fontWeight: "700", color: "#111" },
  sub: { fontSize: 14, color: "#6B7280", marginTop: 4 },

  container: { padding: 20, backgroundColor: "#fff" },

  rowCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  fieldLabel: { fontWeight: "700", color: "#374151", marginBottom: 6 },

  dateBox: { flexDirection: "row", alignItems: "center" },
  dateText: { marginLeft: 8, color: "#111", fontWeight: "700" },

  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  timeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  timeBtnActive: { backgroundColor: "#111", borderColor: "#111" },
  timeBtnText: { color: "#111", fontSize: 13 },

  guestsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 12,
  },
  guestBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  guestsCount: { fontSize: 28, fontWeight: "700" },

  switchCard: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  vehicleCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FEECE6",
    backgroundColor: "#fff",
  },

  vehicleOption: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  vehicleOptionActive: {
    borderColor: "#FF5733",
    backgroundColor: "rgba(255,87,51,0.05)",
  },

  vehicleIconGreen: {
    width: 44,
    height: 44,
    backgroundColor: "#FFEFE9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleIconOrange: {
    width: 44,
    height: 44,
    backgroundColor: "#FFEFE9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  serviceCompare: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FDECE7",
    overflow: "hidden",
  },

  serviceHeader: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bestBadge: {
    backgroundColor: "rgba(255,255,255,0.20)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  serviceBody: { padding: 12, backgroundColor: "#fff" },

  svcTableHeader: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  svcCol: { flex: 1, fontSize: 12, color: "#374151" },
  svcCenter: { width: 60, textAlign: "center", color: "#374151" },
  svcCenterBadge: {
    width: 60,
    backgroundColor: "#ECFDF5",
    color: "#16A34A",
    borderRadius: 8,
    paddingVertical: 3,
    textAlign: "center",
  },

  svcRow: {
    flexDirection: "row",
    paddingVertical: 8,
    alignItems: "center",
  },

  savingsBox: {
    marginTop: 10,
    backgroundColor: "#ECFDF5",
    padding: 10,
    borderRadius: 8,
  },

  preorderToggle: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: "#111",
    borderColor: "#111",
  },
  pillText: { color: "#374151", fontWeight: "700" },

  menuRow: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    alignItems: "center",
  },
  menuImg: {
    width: 64,
    height: 64,
    borderRadius: 10,
    resizeMode: "cover",
  },

  addBtn: {
    backgroundColor: "#111",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  qtyControl: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    padding: 6,
    borderRadius: 12,
    alignItems: "center",
  },
  qtyBtn: { padding: 6 },

  proceedBtn: {
    backgroundColor: "#FF5733",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
});
