// app/checkout.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Modal,
  KeyboardAvoidingView,
  StatusBar,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/services/supabaseClient";
import { coupons } from "@/data/mockData"; // keep your existing coupons list

const { width } = Dimensions.get("window");

type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
};

const checkLogin = async () => {
  const mobile = await AsyncStorage.getItem("userMobile");
  return mobile ? true : false;
};

export default function CheckoutPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mode = params?.mode || "delivery";

  // cart & user state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card">(
    "cash"
  );
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // optimistic
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dineinBooking, setDineinBooking] = useState(null);
  const loadDineinDetails = async () => {
    try {
      const stored = await AsyncStorage.getItem("dineinBooking");
      if (stored) {
        setDineinBooking(JSON.parse(stored));
      }
    } catch (err) {
      console.log("loadDineinDetails error", err);
    }
  };
  const scheduledParam = Array.isArray(params?.scheduled)
    ? params.scheduled[0]
    : params?.scheduled || null;
  // load cart & applied coupon & user
  const loadCart = async () => {
    try {
      const raw = await AsyncStorage.getItem("cart");
      const c = raw ? JSON.parse(raw) : [];
      setCart(c);
    } catch (e) {
      console.warn("loadCart error", e);
    }
  };

  const loadAppliedCoupon = async () => {
    try {
      const raw = await AsyncStorage.getItem("appliedCoupon");
      if (raw) {
        const parsed = JSON.parse(raw);
        setAppliedCoupon(parsed);
        setCouponCode(parsed.code || "");
      }
    } catch (e) {
      console.warn("loadAppliedCoupon error", e);
    }
  };

  const loadUserFromSupabase = async () => {
    try {
      const mobile = await AsyncStorage.getItem("userMobile");
      if (!mobile) {
        setIsLoggedIn(false);
        setShowLoginModal(true);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("mobile", mobile)
        .single();

      if (error || !data) {
        setIsLoggedIn(false);
        setShowLoginModal(true);
      } else {
        setIsLoggedIn(true);
        setUserName(data.name || "");
        setUserPhone(data.mobile || "");
        if (data.address) setUserAddress(data.address);
        setShowLoginModal(false);
      }
    } catch (err) {
      console.warn("loadUserFromSupabase error", err);
      setIsLoggedIn(false);
      setShowLoginModal(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
      loadAppliedCoupon();
      loadUserFromSupabase();
      loadDineinDetails();
    }, [])
  );

  // computed
  const subtotal = cart.reduce(
    (s, it) => s + (it.price || 0) * (it.quantity || 1),
    0
  );
  const deliveryFee = mode === "dinein" ? 0 : subtotal <= 500 ? 2 : 0;

  const discount = appliedCoupon
    ? subtotal * (appliedCoupon.discountPercent / 100)
    : 0;
  const total = subtotal + deliveryFee - discount;

  // coupon apply
  const handleApplyCoupon = async () => {
    const code = (couponCode || "").trim().toUpperCase();
    if (!code) {
      Alert.alert("Enter coupon code");
      return;
    }
    setCouponLoading(true);
    // try data/mockData coupons first
    const found =
      (coupons || []).find(
        (c) => c.code.toUpperCase() === code && c.isActive
      ) || null;

    if (!found) {
      setCouponLoading(false);
      Alert.alert("Invalid coupon");
      return;
    }
    await AsyncStorage.setItem("appliedCoupon", JSON.stringify(found));
    setAppliedCoupon(found);
    setCouponLoading(false);
    Alert.alert("Coupon applied", `${found.discountPercent}% off`);
  };

  // place order logic per your request:
  const handlePlaceOrder = async () => {
    setLoading(true);

    const logged = await checkLogin();
    if (!logged) {
      setLoading(false);
      Alert.alert("Login Required", "Please login to place order", [
        { text: "Login", onPress: () => router.push("/login") },
      ]);
      return;
    }

    if (!userName || !userPhone) {
      setLoading(false);
      Alert.alert("Please enter name and phone");
      return;
    }

    const mobile = await AsyncStorage.getItem("userMobile");

    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("mobile", mobile)
      .single();

    if (!userData) {
      setLoading(false);
      Alert.alert("User not found", "Please login again", [
        { text: "Login", onPress: () => router.push("/login") },
      ]);
      return;
    }
    // Save payment info locally
    await AsyncStorage.setItem("payment_method", paymentMethod);
    await AsyncStorage.setItem("payment_status", "Paid");

    // your payload as is...
    const payload = {
      user_id: userData.id,
      order_type: mode === "dinein" ? "dinein" : "delivery",
      status: mode === "dinein" ? "confirmed" : "received",
      branch_name: "Moti Mahal - Sitabuldi",
      items: mode === "dinein" ? [...cart] : cart,
      total_amount: total,
      delivery_address: mode === "delivery" ? userAddress : null,
      meta: {},
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(payload)
      .select()
      .single();

    if (error) {
      setLoading(false);
      Alert.alert("Order Failed", error.message);
      return;
    }

    await AsyncStorage.removeItem("cart");
    await AsyncStorage.removeItem("appliedCoupon");

    setLoading(false);

    if (mode === "dinein") {
      router.replace({
        pathname: "/reservationSuccess",
        params: {
          orderId: data.id,
          date: dineinBooking?.date,
          time: dineinBooking?.timeSlot,
          guests: dineinBooking?.guests,
        },
      });
    } else {
      router.replace({
        pathname: "/orderPlaced",
        params: {
          type: "delivery",
          orderId: data.id,
          total: total,
          payment: paymentMethod,
        },
      });
    }
  };

  const isPlaceOrderDisabled = loading || !userName || !userPhone;

  // login flow
  const goToLogin = () => {
    setShowLoginModal(false);
    router.push("/login");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header: KEEP TITLE "Checkout" per your request, styling like Cart */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <AntDesign name="left" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === "dinein" ? "Dine-in Checkout" : "Checkout"}
        </Text>
        <View style={{ width: 40 }} />
      </View> */}

      <ScrollView
        style={{ flex: 1, padding: 16 }}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {/* show scheduled banner if param present */}
        {scheduledParam ? (
          <LinearGradient
            colors={["#FF7A36", "#FF3D4A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.scheduledBanner}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.scheduledIconBox}>
                <Feather name="clock" size={20} color="#fff" />
              </View>

              <View style={{ marginLeft: 12 }}>
                <Text style={styles.scheduledBannerTitle}>Scheduled Order</Text>

                <Text style={styles.scheduledBannerSub}>
                  Will be placed at{" "}
                  {new Date(scheduledParam).toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}{" "}
                  today
                </Text>
              </View>
            </View>
          </LinearGradient>
        ) : null}

        {/* Order Summary (collapsible) */}
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => setShowOrderSummary(!showOrderSummary)}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>
              Order Summary ({cart.length} items)
            </Text>
            <Feather
              name="chevron-down"
              size={20}
              style={[
                styles.chev,
                {
                  transform: [{ rotate: showOrderSummary ? "180deg" : "0deg" }],
                },
              ]}
            />
          </TouchableOpacity>

          {showOrderSummary && (
            <View style={{ padding: 12 }}>
              {cart.map((it) => (
                <View key={it.id} style={styles.orderItem}>
                  <Image
                    source={{
                      uri: it.image || "https://via.placeholder.com/80",
                    }}
                    style={styles.orderItemImage}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderItemName} numberOfLines={1}>
                      {it.name}
                    </Text>
                    <Text style={styles.orderItemQty}>
                      Qty: {it.quantity || 1}
                    </Text>
                  </View>
                  <Text style={styles.orderItemPrice}>
                    ₹{((it.price || 0) * (it.quantity || 1)).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Price Comparison card (same as cart styling) */}
        <View style={[styles.card, { marginTop: 12 }]}>
          <LinearGradient
            colors={["#FB923C", "#F43F5E"]}
            style={styles.priceCardHeader}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Price Comparison
            </Text>
            <Text style={styles.priceCardSubtitle}>
              See how much you save with us
            </Text>
            <View style={styles.bestValue}>
              <Text style={{ color: "#fff", fontSize: 12 }}>Best Value</Text>
            </View>
          </LinearGradient>

          <View style={{ padding: 12 }}>
            {/* 🔥 Header row */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingBottom: 8,
                borderBottomWidth: 1,
                borderBottomColor: "#EEE",
              }}
            >
              <Text style={{ flex: 1, fontWeight: "700" }}>Item</Text>
              <Text
                style={{ width: 70, textAlign: "center", fontWeight: "700" }}
              >
                Our
              </Text>
              <Text
                style={{ width: 70, textAlign: "center", fontWeight: "700" }}
              >
                Zomato
              </Text>
              <Text
                style={{ width: 70, textAlign: "center", fontWeight: "700" }}
              >
                Swiggy
              </Text>
            </View>

            {/* 🔥 Rows */}
            {cart.map((it) => {
              const ourPrice = (it.price || 0) * (it.quantity || 1);
              const zomato = Math.round(ourPrice * 1.15);
              const swiggy = Math.round(ourPrice * 1.18);

              return (
                <View
                  key={it.id}
                  style={{
                    flexDirection: "row",
                    paddingVertical: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ flex: 1 }}>
                    {it.name}
                    {it.quantity > 1 ? ` (×${it.quantity})` : ""}
                  </Text>

                  <Text style={{ width: 70, textAlign: "center" }}>
                    ₹{ourPrice}
                  </Text>
                  <Text style={{ width: 70, textAlign: "center" }}>
                    ₹{zomato}
                  </Text>
                  <Text style={{ width: 70, textAlign: "center" }}>
                    ₹{swiggy}
                  </Text>
                </View>
              );
            })}

            {/* 🔥 TOTAL ROW — single column look */}
            <View
              style={{
                flexDirection: "row",
                paddingTop: 12,
                marginTop: 6,
                borderTopWidth: 1,
                borderTopColor: "#EEE",
                alignItems: "center",
              }}
            >
              <Text style={{ flex: 1, fontWeight: "700" }}>Total</Text>

              <Text
                style={{
                  width: 70,
                  textAlign: "center",
                  fontWeight: "700",
                  color: "#22C55E",
                }}
              >
                ₹{subtotal.toFixed(0)}
              </Text>

              <Text style={{ width: 70, textAlign: "center" }}>
                ₹{(subtotal * 1.15).toFixed(0)}
              </Text>

              <Text style={{ width: 70, textAlign: "center" }}>
                ₹{(subtotal * 1.18).toFixed(0)}
              </Text>
            </View>

            {/* Savings */}
            <View style={styles.savingsBox}>
              <View style={styles.saveRow}>
                <Text style={styles.saveLabel}>You save vs Zomato:</Text>
                <Text style={styles.saveValue}>
                  ₹{Math.round(subtotal * 0.15)}
                </Text>
              </View>

              <View style={styles.saveRow}>
                <Text style={styles.saveLabel}>You save vs Swiggy:</Text>
                <Text style={styles.saveValue}>
                  ₹{Math.round(subtotal * 0.18)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact details */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionTitle}>Contact Details</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="John Doe"
          />

          <Text style={[styles.label, { marginTop: 8 }]}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={userPhone}
            onChangeText={setUserPhone}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
          />
          <>
            <Text style={[styles.label, { marginTop: 8 }]}>
              Delivery Address
            </Text>
            <TextInput
              style={[styles.input, { minHeight: 60 }]}
              value={userAddress}
              onChangeText={setUserAddress}
              placeholder="House, Street, Landmark..."
              multiline
            />
          </>
        </View>

        {/* Special Instructions */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <TextInput
            style={[styles.input, { minHeight: 80 }]}
            value={instructions}
            onChangeText={setInstructions}
            placeholder="Less spicy, no onions..."
            multiline
          />
        </View>

        {/* Coupon */}
        {/* Promo Code */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionTitle}>Promo Code</Text>

          <View style={styles.promoBox}>
            <Feather name="tag" size={18} color="#9CA3AF" />

            <TextInput
              style={styles.promoInput}
              value={couponCode}
              onChangeText={setCouponCode}
              placeholder={
                appliedCoupon ? appliedCoupon.code : "Enter Promo Code"
              }
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
            />

            <TouchableOpacity
              onPress={handleApplyCoupon}
              style={styles.promoApplyBtn}
            >
              <Text style={styles.promoApplyText}>
                {couponLoading ? "..." : "Apply"}
              </Text>
            </TouchableOpacity>
          </View>

          {appliedCoupon && (
            <Text style={styles.promoAppliedText}>
              ✓ {appliedCoupon.code} applied — {appliedCoupon.discountPercent}%
              off
            </Text>
          )}
        </View>

        {/* Payment method */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {[
            { id: "cash", label: "Cash on Delivery" },
            { id: "upi", label: "UPI Payment" },
            { id: "card", label: "Card Payment" },
          ].map((m) => (
            <TouchableOpacity
              key={m.id}
              onPress={() => setPaymentMethod(m.id as any)}
              style={[
                styles.paymentRow,
                paymentMethod === m.id ? styles.paymentRowActive : {},
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Left Icon */}
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "#F3F4F6",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  {m.id === "cash" && (
                    <Feather name="dollar-sign" size={20} color="#111" />
                  )}
                  {m.id === "upi" && (
                    <Feather name="smartphone" size={20} color="#111" />
                  )}
                  {m.id === "card" && (
                    <Feather name="credit-card" size={20} color="#111" />
                  )}
                </View>

                {/* Title + Subtitle */}
                <View>
                  <Text style={{ fontWeight: "700", fontSize: 15 }}>
                    {m.label}
                  </Text>

                  {m.id === "cash" && (
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>
                      Pay when you receive
                    </Text>
                  )}
                  {m.id === "upi" && (
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>
                      Google Pay, PhonePe
                    </Text>
                  )}
                  {m.id === "card" && (
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>
                      Visa, Mastercard
                    </Text>
                  )}
                </View>
              </View>

              {/* Right side radio */}
              <View
                style={[
                  styles.radio,
                  paymentMethod === m.id ? styles.radioActive : {},
                ]}
              >
                {paymentMethod === m.id ? (
                  <View style={styles.radioDot} />
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text>Subtotal:</Text>
            <Text>₹{subtotal.toFixed(2)}</Text>
          </View>
          {mode === "delivery" && (
            <View style={styles.summaryRow}>
              <Text>Delivery Fee:</Text>
              <Text>₹{deliveryFee.toFixed(2)}</Text>
            </View>
          )}

          {appliedCoupon && (
            <View style={styles.summaryRow}>
              <Text>Discount:</Text>
              <Text>- ₹{discount.toFixed(2)}</Text>
            </View>
          )}
          <View
            style={[
              styles.summaryRow,
              {
                marginTop: 8,
                paddingTop: 8,
              },
            ]}
          >
            <Text style={{ fontWeight: "700" }}>Total Amount:</Text>
            <Text style={{ fontWeight: "700" }}>₹{total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* bottom sticky */}
      <View style={styles.bottom}>
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Total Amount</Text>
          <Text style={styles.priceValue}>₹{total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={isPlaceOrderDisabled}
          style={[
            styles.placeBtn,
            isPlaceOrderDisabled ? { opacity: 0.5 } : {},
          ]}
        >
          <Text style={styles.placeBtnText}>
            {loading ? "Processing..." : "Place Order"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* login modal */}
      <Modal visible={showLoginModal} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.box}>
            <Text style={{ fontWeight: "700", fontSize: 18, marginBottom: 8 }}>
              Please login to continue
            </Text>
            <Text style={{ color: "#666", marginBottom: 16 }}>
              We need your phone number and name to place the order.
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={() => setShowLoginModal(false)}
                style={modalStyles.btnAlt}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={goToLogin}
                style={modalStyles.btnPrimary}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  Go to Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// styles - copied and adapted from the Cart file you gave (keeps exact look)
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop:
      (Platform.OS === "android" ? StatusBar.currentHeight ?? 20 : 44) + 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },

  scheduledBanner: {
    backgroundColor: "#FFEDD5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  scheduledTitle: { fontWeight: "700", color: "#7c2d12" },
  scheduledSub: { color: "#7c2d12", marginTop: 4 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  cardTitle: { fontWeight: "700" },
  chev: { color: "#666" },

  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  orderItemImage: { width: 64, height: 64, borderRadius: 10 },
  orderItemName: { fontWeight: "700" },
  orderItemQty: { fontSize: 12, color: "#666" },
  orderItemPrice: { fontWeight: "700", color: "#FF5733" },

  priceCardHeader: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  bestValue: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },

  tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  tableItem: { flex: 1, fontSize: 12, color: "#111" },
  tableCenter: { width: 70, textAlign: "center", fontSize: 12, color: "#111" },

  sectionTitle: { fontWeight: "700", marginBottom: 8 },
  label: { fontSize: 12, color: "#666", marginTop: 6, marginBottom: 4 },
  promoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  promoInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#111",
  },
  promoApplyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  promoApplyText: {
    color: "#FF5733",
    fontWeight: "700",
  },
  promoAppliedText: {
    marginTop: 8,
    color: "#16A34A",
    marginLeft: 4,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEE",
  },

  //   scheduledBanner: {
  //   width: "100%",
  //   padding: 16,
  //   borderRadius: 14,
  //   marginBottom: 16,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   elevation: 3,
  // },

  scheduledIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  scheduledBannerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },

  scheduledBannerSub: {
    fontSize: 12,
    marginTop: 2,
    color: "rgba(255,255,255,0.9)",
  },

  applyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    marginTop: 8,
  },
  paymentRowActive: { borderColor: "#111", backgroundColor: "#FFF" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#DDD",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: "#111" },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#111",
  },

  summaryCard: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  bottom: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 50,

    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    justifyContent: "space-between",
    alignItems: "center",
  },

  priceBox: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },

  priceLabel: {
    fontSize: 12,
    color: "#666",
  },

  priceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginTop: 2,
  },

  placeBtn: {
    flex: 1,
    backgroundColor: "#FF5733",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginLeft: 10,
    justifyContent: "center",
    flexDirection: "row",
  },
  placeBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  // reuse cart styles for item list and price card look
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  itemImg: { width: 70, height: 70, borderRadius: 10, resizeMode: "cover" },
  itemName: { fontWeight: "700", fontSize: 15 },
  itemBy: { color: "#6B7280", fontSize: 12, marginTop: 4 },
  rating: { flexDirection: "row", alignItems: "center" },
  itemPrice: { fontWeight: "700", color: "#FF5733", marginLeft: 8 },

  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 999,
    paddingHorizontal: 8,
    marginLeft: 12,
  },
  qtyBtn: { padding: 6 },
  qtyText: { paddingHorizontal: 8, fontWeight: "700" },

  // price card inner styles
  priceCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  priceCardBody: { padding: 12, backgroundColor: "#fff" },
  priceTableHeader: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    alignItems: "center",
  },
  priceCardSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginTop: 4,
    position: "absolute",
    left: 11,
    top: 30,
    right: 0,
  },
  tableColItem: { flex: 1, fontSize: 12, color: "#374151" },
  tableColCenter: {
    width: 70,
    textAlign: "center",
    fontSize: 12,
    color: "#374151",
  },

  totalsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  savingsBox: {
    marginTop: 12,
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 10,
  },
  saveRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  saveLabel: { color: "#374151" },
  saveValue: { color: "#16A34A", fontWeight: "700" },

  voucherRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    height: 52,
    marginTop: 6,
  },
  voucherInput: { flex: 1, marginLeft: 10, paddingRight: 12 },
  applyBtnSmall: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
  },

  timeInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    width: 120,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  box: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  btnPrimary: {
    backgroundColor: "#FF5733",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  btnAlt: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    flex: 1,
  },
});
