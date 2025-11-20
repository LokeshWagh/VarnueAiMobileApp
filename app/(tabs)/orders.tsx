// app/orders.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type OrderItem = {
  id?: string;
  name?: string;
  price?: number;
  quantity?: number;
  [k: string]: any;
};

type OrderRaw = {
  id: string;
  user_id?: string;
  order_type?: string;
  status?: string;
  branch_name?: string;
  branch_id?: string | null;
  items?: any;
  total_amount?: number;
  guests?: number | null;
  time_slot?: string | null;
  scheduled_at?: string | null;
  delivery_addr?: string | null;
  pickup_drop?: boolean | null;
  vehicle_type?: string | null;
  meta?: any;
  created_at?: string;
  updated_at?: string;
  [k: string]: any;
};

const { width } = Dimensions.get("window");
const CARD_RADIUS = 16;

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRaw[]>([]);
  const [filtered, setFiltered] = useState<OrderRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const getLoggedInUserId = async () => {
    try {
      const mobile = await AsyncStorage.getItem("userMobile");
      if (!mobile) return null;

      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("mobile", mobile)
        .single();

      if (error || !data) return null;
      return data.id;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  // fetch orders from supabase with fallback to mockData
  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      // ⭐ 1) logged-in user ka ID lao
      const userId = await getLoggedInUserId();
      if (!userId) {
        setOrders([]);
        setFiltered([]);
        setLoading(false);
        return;
      }

      // ⭐ 2) sirf us user ke orders fetch karo
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("supabase error", error.message);
        setOrders([]);
        setFiltered([]);
        setLoading(false);
        return;
      }

      // ⭐ 3) Items parse karo
      const normalized = (data || []).map((o) => {
        let items = [];
        try {
          if (!o.items) items = [];
          else if (Array.isArray(o.items)) items = o.items;
          else items = JSON.parse(o.items);
        } catch {
          items = [];
        }
        return { ...o, items };
      });

      setOrders(normalized);
      setFiltered(normalized);
    } catch (err) {
      console.log("loadOrders error:", err);
      setOrders([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    // optional: real-time subscription can be added here if you want live updates
  }, [loadOrders]);

  // filter by search q
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFiltered(orders);
      return;
    }
    const result = orders.filter((o) => {
      const idMatch = o.id?.toLowerCase().includes(q);
      const itemMatch =
        Array.isArray(o.items) &&
        o.items.some((it: any) =>
          (it.name || "").toString().toLowerCase().includes(q)
        );
      const branchMatch = (o.branch_name || "").toLowerCase().includes(q);
      return Boolean(idMatch || itemMatch || branchMatch);
    });
    setFiltered(result);
  }, [searchQuery, orders]);

  // helpers
  const formatDateNice = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    const suffix = (n: number) => {
      if (n > 3 && n < 21) return "th";
      switch (n % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    return `${day}${suffix(day)} ${month} ${year}`;
  };

  const getStatusConfig = (status?: string) => {
    const s = (status || "").toLowerCase();

    // 1️⃣ Confirmed → ✓
    if (s === "confirmed")
      return { label: "Order Confirmed", color: "#7C3AED", icon: "check" };

    // 2️⃣ Delivered / Completed → ✓ (Green)
    if (s === "delivered" || s === "completed")
      return { label: "Order Delivered", color: "#16A34A", icon: "check" };

    // 3️⃣ Cancelled → X
    if (s === "cancelled")
      return { label: "Order Cancelled", color: "#EF4444", icon: "x" };

    // 4️⃣ Preparing → Clock
    if (s === "preparing")
      return { label: "Order Preparing", color: "#3B82F6", icon: "clock" };

    // 5️⃣ Baaki sab → default box icon (📦)
    return { label: "Order Received", color: "#0EA5E9", icon: "box" };
  };

  const getMenuItemImage = (name?: string) => {
    // If you have real images, map names -> urls. Else placeholder.
    return "https://via.placeholder.com/140x140.png?text=Food";
  };

  const canCancel = (o: OrderRaw) => {
    const s = (o.status || "").toLowerCase();
    return s !== "delivered" && s !== "completed" && s !== "cancelled";
  };
  const canTrack = (o: OrderRaw) => canCancel(o);

  // UI handlers
  const handleCancel = (o: OrderRaw) => {
    if (!canCancel(o)) return Alert.alert("Cannot cancel");
    Alert.alert(
      "Cancel",
      "Cancel not implemented — implement supabase update here."
    );
  };

  const handleTrack = (o: OrderRaw) => {
    Alert.alert("Track", "Open tracking screen (not implemented).");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const renderOrderCard = ({ item }: { item: OrderRaw }) => {
    const statusCfg = getStatusConfig(item.status);

    // first item of the order
const firstItem =
  Array.isArray(item.items) && item.items.length > 0 ? item.items[0] : null;

    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardTop}>
          <Text style={styles.cardType}>Order</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.cardHeader}
          onPress={() => router.push(`/orderDetail?id=${item.id}`)}
        >
          <View style={styles.statusLeft}>
            <View
              style={[
                styles.statusCircle,
                { backgroundColor: `${statusCfg.color}22` },
              ]}
            >
              <Text style={[styles.statusIcon, { color: statusCfg.color }]}>
                {statusCfg.icon === "check"
                  ? "✓"
                  : statusCfg.icon === "clock"
                  ? "⏱"
                  : "📦"}
              </Text>
            </View>

            <View style={{ minWidth: 0 }}>
              <Text style={styles.statusLabel}>{statusCfg.label}</Text>
              <Text style={styles.statusSub}>
                {formatDateNice(item.created_at)}
              </Text>
            </View>
          </View>

          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => router.push(`/orderDetail?id=${item.id}`)}
          style={styles.cardBody}
        >
          <Image
            source={{
              uri:
                firstItem?.image ||
                "https://via.placeholder.com/140x140.png?text=Food",
            }}
            style={styles.itemImage}
          />

          <View style={styles.itemDetails}>
            <Text numberOfLines={1} style={styles.itemTitle}>
              {firstItem?.name || "Unknown Item"}
            </Text>

            <Text style={styles.itemMeta}>
              Qty: {firstItem?.qty ?? firstItem?.quantity ?? 1}
            </Text>

            <View style={styles.branchRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={14}
                color="#FF5733"
              />
              <Text numberOfLines={1} style={styles.branchText}>
                {item.branch_name ?? "Unknown Branch"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ACTION BUTTONS */}
        <View style={styles.actionRow}>
          {canCancel(item) && (
            <TouchableOpacity
              style={styles.actionBtnAlt}
              onPress={() => handleCancel(item)}
            >
              <Text style={styles.actionAltText}>Cancel</Text>
            </TouchableOpacity>
          )}

          {canTrack(item) && (
            <TouchableOpacity
              style={styles.actionBtnPrimary}
              onPress={() => handleTrack(item)}
            >
              <Text style={styles.actionPrimaryText}>Track Order</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // top fixed header + search
  const HeaderAndSearch = (
    <View style={{ backgroundColor: "#fff" }}>
      <View
        style={{
          paddingTop:
            Platform.OS === "android" ? StatusBar.currentHeight + 10 : 24,
          paddingHorizontal: 16,
          paddingBottom: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#EEE",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#111" }}>
          Orders
        </Text>

        {/* <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            backgroundColor: "#F4F4F4",
          }}
        >
          <Feather name="filter" size={20} color="#4A90E2" />
        </TouchableOpacity> */}
      </View>

      {/* Search box */}
      <View
        style={{
          marginTop: 10,
          marginHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#F8F8F8",
          borderRadius: 12,
          paddingHorizontal: 12,
          height: 48,
        }}
      >
        <Feather name="search" size={18} color="#9CA3AF" />
        <TextInput
          placeholder="Search order"
          placeholderTextColor="#9CA3AF"
          style={{ flex: 1, marginLeft: 10 }}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {HeaderAndSearch}

      <View style={styles.listWrap}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FF5733"
            style={{ marginTop: 36 }}
          />
        ) : filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Feather name="shopping-bag" size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySub}>
              {searchQuery
                ? "Try adjusting your search or filters."
                : "Your order history will appear here."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(i) => i.id}
            renderItem={renderOrderCard}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: Platform.OS === "android" ? 120 : 160,
            }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F7FA" },

  headerWrap: {
    backgroundColor: "#fff",
    borderBottomColor: "#EEE",
    borderBottomWidth: 1,
  },
  header: {
    paddingTop: Platform.OS === "android" ? 18 : 28,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
  },

  searchBarWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 50,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    color: "#111827",
  },

  listWrap: { flex: 1 },

  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  cardTop: { padding: 12, paddingBottom: 8 },
  cardType: { fontWeight: "700", color: "#111827" },

  cardHeader: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  statusCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  statusIcon: { fontSize: 18, fontWeight: "700" },
  statusLabel: { fontWeight: "700", color: "#111827" },
  statusSub: { fontSize: 12, color: "#6B7280" },

  cardBody: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 12,
    alignItems: "center",
  },

  itemImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    resizeMode: "cover",
    backgroundColor: "#eee",
  },
  reservationPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#FFF3EE",
    alignItems: "center",
    justifyContent: "center",
  },

  itemDetails: { flex: 1, minWidth: 0 },
  itemTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  itemMetaRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  itemMeta: { fontSize: 12, color: "#6B7280" },

  branchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  branchText: { color: "#374151", fontSize: 13 },

  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    padding: 12,
  },
  actionBtnAlt: {
    flex: 1,
    maxWidth: 160,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  actionAltText: { color: "#374151", fontWeight: "600" },
  actionBtnPrimary: {
    flex: 1,
    maxWidth: 160,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF5733",
  },
  actionPrimaryText: { color: "#fff", fontWeight: "700" },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    alignItems: "center",
    gap: 10,
  },
  footerLabel: { color: "#6B7280" },
  footerValue: { fontWeight: "700", color: "#111827" },
  footerUpdated: {
    color: "#9CA3AF",
    fontSize: 12,
    flex: 1,
    textAlign: "right",
  },

  emptyWrap: { alignItems: "center", justifyContent: "center", marginTop: 60 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    color: "#111827",
  },
  emptySub: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
