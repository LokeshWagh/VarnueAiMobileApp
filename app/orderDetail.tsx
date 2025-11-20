// app/order/[id].tsx

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  FlatList,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "@/services/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");
const PHONE_WIDTH = Math.min(420, width - 32);

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id: orderId } = useLocalSearchParams();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [paymentStatus, setPaymentStatus] = useState("Unknown");
  const [paymentMethod, setPaymentMethod] = useState("N/A");

  const [customerName, setCustomerName] = useState("N/A");
  const [customerPhone, setCustomerPhone] = useState("N/A");

  // -------------------------
  // 🔥 Load user info from users table using stored mobile in localStorage
  // -------------------------
  const loadUserInfo = async () => {
    try {
      const mobile = await AsyncStorage.getItem("userMobile");

      if (!mobile) return;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("mobile", mobile)
        .single();

      if (data) {
        setCustomerName(data.name || "N/A");
        setCustomerPhone(data.mobile || "N/A");
      }
    } catch {}
  };

  // -------------------------
  // 🔥 Load payment status + payment method from local storage
  // -------------------------
  const loadPaymentData = async () => {
    try {
      const pStatus = await AsyncStorage.getItem("payment_status");
      const pMethod = await AsyncStorage.getItem("payment_method");

      if (pStatus) setPaymentStatus(pStatus);
      if (pMethod) setPaymentMethod(pMethod);
    } catch {}
  };

  // -------------------------
  // 🔥 Fetch order from Supabase
  // -------------------------
  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (!data) return;

      let items = [];

      try {
        items = Array.isArray(data.items)
          ? data.items
          : JSON.parse(data.items || "[]");
      } catch {
        items = [];
      }

      setOrder({ ...data, items });
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    loadUserInfo();
    loadPaymentData();
  }, []);

  const formatFullDate = (d?: string) => {
    if (!d) return "N/A";
    const dt = new Date(d);
    if (isNaN(dt as any)) return "N/A";

    return dt.toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "confirmed") return { label: "Confirmed", color: "#F59E0B" };
    if (s === "completed") return { label: "Delivered", color: "#16A34A" };
    if (s === "cancelled") return { label: "Cancelled", color: "#EF4444" };
    return { label: status || "Received", color: "#0EA5E9" };
  };

  if (loading || !order)
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ marginTop: 200, textAlign: "center" }}>Loading…</Text>
      </SafeAreaView>
    );

  const statusCfg = getStatusConfig(order.status);
  const isDineIn = (order.order_type || "").toLowerCase() === "dinein";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="chevron-left" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isDineIn ? "Dine In Order" : "Online Order"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.wrap}>
        {/* ---------------- TOP CARD ---------------- */}
        <View style={styles.infoCard}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.orderDate}>
                {formatFullDate(order.created_at)}
              </Text>
            </View>

            <View>
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: `${statusCfg.color}22` },
                ]}
              >
                <Text style={[styles.statusPillText, { color: statusCfg.color }]}>
                  {statusCfg.label}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.hr} />

          {/* ---------------- Estimated Time ---------------- */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Feather name="clock" size={16} color="#EF4444" />
              <Text style={{ color: "#6B7280" }}>Estimated Time</Text>
            </View>

            <Text style={{ marginTop: 6, fontWeight: "700", color: "#111" }}>
              30-40 mins
            </Text>
          </View>
        </View>

        {/* ---------------- Customer Details ---------------- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Feather name="user" size={16} color="#FF5733" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Customer Name</Text>
              <Text style={styles.detailValue}>{customerName}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Feather name="phone" size={16} color="#FF5733" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Phone Number</Text>
              <Text style={styles.detailValue}>{customerPhone}</Text>
            </View>
          </View>
        </View>

        {/* ---------------- Items ---------------- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items</Text>

          <FlatList
            data={order.items}
            renderItem={({ item }) => {
              const qty = item.qty ?? 1;
              const price = item.price ?? 0;

              return (
                <View style={styles.lineItem}>
                  <Image
                    source={{
                      uri: item.image || "https://via.placeholder.com/100",
                    }}
                    style={styles.lineItemImage}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.lineItemName}>{item.name}</Text>
                    <Text style={styles.lineItemMeta}>
                      Qty: {qty} • ₹{price}
                    </Text>
                  </View>

                  <Text style={styles.lineItemTotal}>
                    ₹{(qty * price).toFixed(2)}
                  </Text>
                </View>
              );
            }}
            keyExtractor={(i, idx) => idx.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        </View>

        {/* ---------------- Payment Summary ---------------- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Summary</Text>

          <View style={styles.priceRow}>
            <Text style={styles.label}>Total Paid</Text>
            <Text style={styles.value}>₹{order.total_amount?.toFixed(2)}</Text>
          </View>

          <View style={[styles.priceRow, { marginTop: 4 }]}>
            <Text style={styles.label}>Payment Status</Text>
            <Text style={styles.value}>On Delivery</Text>
          </View>

          <View style={[styles.priceRow, { marginTop: 4 }]}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>{paymentMethod}</Text>
          </View>
        </View>

        {/* ---------------- Order Info ---------------- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Info</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <MaterialCommunityIcons name="store" size={18} color="#FF5733" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Branch</Text>
              <Text style={styles.detailValue}>{order.branch_name}</Text>
            </View>
          </View>

          {/* schedule_at only for dine-in */}
          {isDineIn && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Feather name="calendar" size={16} color="#FF5733" />
              </View>
              <View>
                <Text style={styles.detailLabel}>Scheduled At</Text>
                <Text style={styles.detailValue}>
                  {formatFullDate(order.scheduled_at)}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------ Styles (UNCHANGED) ------------------ */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F3F1" },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 10 : 12,
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  wrap: { padding: 16, alignItems: "center" },

  infoCard: {
    width: PHONE_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  rowBetween: { flexDirection: "row", justifyContent: "space-between" },

  orderId: { fontWeight: "800", fontSize: 16 },
  orderDate: { color: "#6B7280", marginTop: 4 },

  statusPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusPillText: { fontWeight: "700" },

  hr: { height: 1, backgroundColor: "#f1f1f1", marginVertical: 10 },

  card: {
    width: PHONE_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  cardTitle: { fontWeight: "700", marginBottom: 8 },
  detailRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },

  detailIcon: {
    width: 36,
    height: 36,
    backgroundColor: "#FFF7F5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  detailLabel: { color: "#6B7280", fontSize: 12 },
  detailValue: { fontWeight: "700", marginTop: 4 },

  lineItem: { flexDirection: "row", alignItems: "center" },
  lineItemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#eee",
  },

  lineItemName: { fontWeight: "700" },
  lineItemMeta: { marginTop: 4, color: "#6B7280" },
  lineItemTotal: { fontWeight: "700" },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  label: { color: "#6B7280" },
  value: { fontWeight: "700" },
});
