import { menuCategories, menuItems } from "@/data/mockData";
import { supabase } from "@/services/supabaseClient";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

export interface MenuCategory {
  id: string; // or number, depending on your data
  name: string;
  icon: string; // assuming emoji or icon char
}

export interface MenuItem {
  id: string; // should match your DB type
  name: string;
  image: string;
  cuisine: string;
  price: number;
  rating: number;
  dietary: "veg" | "non-veg";
  categoryId: string | number;
  hasDeals?: boolean;
  quantity?: number; // local/cart
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  created_at?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const [cartCount, setCartCount] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<
    string | number | null
  >(null);

  useEffect(() => {
    loadUser();
  }, []);

  const params = useLocalSearchParams();

  const appliedFilters = params?.appliedFilters
    ? JSON.parse(params.appliedFilters as string)
    : null;

  const searchQuery = params?.searchQuery || "";

  const loadUser = async (): Promise<void> => {
    const mobile = await AsyncStorage.getItem("userMobile");
    if (!mobile) return;

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("mobile", mobile)
      .single<User>();

    if (data) setUser(data);
  };

  const loadCartCount = async (): Promise<void> => {
    const raw = await AsyncStorage.getItem("cart");
    const cart: CartItem[] = raw ? JSON.parse(raw) : [];

    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    setCartCount(total);
  };

  const addToCart = async (item: MenuItem): Promise<void> => {
    const raw = await AsyncStorage.getItem("cart");
    let cart: CartItem[] = raw ? JSON.parse(raw) : [];

    const found = cart.find((it) => it.id === item.id);

    if (found) {
      found.quantity = (found.quantity || 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    await AsyncStorage.setItem("cart", JSON.stringify(cart));
    loadCartCount();
  };

  useFocusEffect(
    useCallback(() => {
      loadCartCount();
    }, [])
  );

  // ======= TOP PICKS ITEMS =========
  const allItems = Object.values(menuItems).flat();

  // Filter by selected category
  const topPicks = allItems.filter((item) => {
    // Category clicked on home
    if (selectedCategory && item.categoryId != selectedCategory) return false;

    // Filter: cuisine
    if (appliedFilters?.cuisines?.length > 0) {
      if (!appliedFilters.cuisines.includes(item.cuisine)) return false;
    }

    // Filter: price range
    if (appliedFilters?.priceRange) {
      const [minP, maxP] = appliedFilters.priceRange;
      if (item.price < minP || item.price > maxP) return false;
    }

    // Filter: rating min
    if (appliedFilters?.minRating) {
      if (item.rating < appliedFilters.minRating) return false;
    }

    // Filter: dietary
    if (appliedFilters?.dietary && appliedFilters.dietary !== "all") {
      if (item.dietary !== appliedFilters.dietary) return false;
    }

    // Filter: deals only
    if (appliedFilters?.dealsOnly) {
      if (!item.hasDeals) return false;
    }

    // Filter: search bar
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.cuisine.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <>
      <View style={styles.container1}>
        {/* ================= HEADER ================= */}
        <View style={styles.headerBox}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>
            {user ? user.name : "Guest User"} 👋
          </Text>

          {/* LOCATION ROW */}
          <View style={styles.locationRow}>
            <View style={styles.locationLeft}>
              <Ionicons name="location-sharp" size={20} color="#FF5733" />

              <View>
                <Text style={styles.locationLabel}>Location</Text>
                <Text style={styles.locationValue}>Sitabuildi, Nagpur</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/locations")}
              style={styles.storeBtn}
            >
              <Ionicons name="storefront" size={22} color="#222" />
            </TouchableOpacity>
          </View>

          {/* ================= SEARCH BAR ================= */}
          <TouchableOpacity
            onPress={() => router.push("/filter-screen")}
            style={styles.searchBox}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={20} color="#666" />

            <TextInput
              style={styles.searchInput}
              placeholder="Search & Filter dishes..."
              placeholderTextColor="#888"
              editable={false}
              pointerEvents="none"
            />

            <Feather name="sliders" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View
          style={{ height: 1, backgroundColor: "#eee", marginBottom: 10 }}
        />

        {/* ================= OFFER CARD ================= */}
        <View style={styles.offerCard}>
          <View>
            <Text style={styles.offerTitle}>SPECIAL OFFER</Text>
            <Text style={styles.offerDiscount}>Get 50% OFF</Text>
            <Text style={styles.offerSub}>On your first order above ₹500</Text>

            <TouchableOpacity
              style={styles.orderBtn}
              onPress={() => router.push("/view-all-catgy")}
            >
              <Text style={styles.orderBtnText}>Order Now</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3595/3595455.png",
            }}
            style={styles.offerImage}
          />
        </View>

        {/* ================= RESTAURANT CARD ================= */}
        <View style={styles.restaurantCardContainer}>
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
                }}
                style={styles.image}
              />
              <View style={styles.ratingOverlay}>
                <Ionicons name="star" size={14} color="#FF5733" />
                <Text style={styles.ratingText}>4.8</Text>
              </View>
            </View>

            <View style={styles.content}>
              <Text style={styles.restaurantName}>Moti Mahal</Text>
              <Text style={styles.cuisine}>
                North Indian • Chinese • Continental
              </Text>

              <View style={styles.infoRow}>
                <View style={styles.iconRow}>
                  <Feather name="clock" size={14} color="#FF5733" />
                  <Text style={styles.infoText}>25-30 min</Text>
                </View>
                <View style={styles.iconRow}>
                  <MaterialIcons name="location-on" size={14} color="#FF5733" />
                  <Text style={styles.infoText}>2.5 km away</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ================= CATEGORY SECTION ================= */}
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>Categories</Text>
          <TouchableOpacity
            onPress={() => router.push("/view-all-catgy")}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Feather name="arrow-right" size={16} color="#FF5733" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryList}>
            {menuCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => {
                  if (selectedCategory === category.id) {
                    setSelectedCategory(null); // unselect
                  } else {
                    setSelectedCategory(category.id); // select
                  }
                }}
                style={[
                  styles.categoryBox,
                  selectedCategory === category.id && {
                    borderColor: "#FF5733",
                    borderWidth: 2,
                    backgroundColor: "#fff4e8", // optional light orange, remove if not needed
                  },
                ]}
              >
                <View style={styles.categoryIconContainer}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* ⭐⭐⭐ TOP PICKS SECTION ⭐⭐⭐ */}
        <View style={styles.topWrapper}>
          <Text style={styles.topTitle}>Top Picks for you</Text>

          {topPicks.length === 0 && appliedFilters ? (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text style={{ color: "#777", fontSize: 14 }}>
                No items found matching your filters
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.replace({
                    pathname: "/(tabs)",
                  })
                }
                style={{ marginTop: 10 }}
              >
                <Text style={{ color: "#FF5733", fontWeight: "600" }}>
                  Clear all filters
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={topPicks}
              extraData={selectedCategory}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => router.push(`/product/${item.id}`)}
                  style={styles.topCard}
                >
                  {/* Image */}
                  <View style={styles.topImageWrapper}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.topImage}
                    />

                    {/* Rating */}
                    <View style={styles.topRating}>
                      <Feather name="star" size={12} color="#FF5733" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>

                    {/* Dietary */}
                    <View
                      style={[
                        styles.dietTag,
                        item.dietary === "veg" ? styles.vegBg : styles.nonVegBg,
                      ]}
                    >
                      <Text style={styles.dietText}>
                        {item.dietary === "veg" ? "🟢" : "🔴"}
                      </Text>
                    </View>
                  </View>

                  {/* Details */}
                  <View style={styles.topContent}>
                    <Text style={styles.topName}>{item.name}</Text>
                    <Text style={styles.topCuisine}>{item.cuisine}</Text>

                    <View style={styles.bottomRow}>
                      <View>
                        <Text style={styles.price}>₹{item.price}</Text>
                        {item.hasDeals && (
                          <Text style={styles.deal}>🎉 Deal</Text>
                        )}
                      </View>

                      <TouchableOpacity
                        onPress={() => addToCart(item)}
                        style={styles.addBtn}
                      >
                        <Feather name="plus" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* FLOATING CART BUTTON */}
      {cartCount > 0 && (
        <Animated.View
          entering={ZoomIn}
          exiting={ZoomOut}
          style={styles.cartContainer}
        >
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/cart")}
            style={styles.cartBtn}
          >
            <Feather name="shopping-cart" size={26} color="#fff" />

            <View style={styles.cartBadge}>
              <Text style={styles.badgeText}>
                {cartCount > 99 ? "99+" : cartCount}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container1: {
    position: "fixed",
    backgroundColor: "#fff7f2",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  container: {
    position: "fixed",
    flex: 1,
    backgroundColor: "#fff7f2",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  // HEADER
  headerBox: {
    marginTop: 50,
    marginBottom: 10,
  },
  welcomeText: { fontSize: 16, color: "#777" },
  userName: { fontSize: 22, fontWeight: "700", color: "#111" },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    justifyContent: "space-between",
  },

  locationText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },

  storeBtn: {
    marginLeft: 12,
    backgroundColor: "#f2f2f2",
    padding: 6,
    borderRadius: 10,
  },

  // Search
  searchBox: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 30,
    borderColor: "#eee",
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#222",
  },

  // Offer
  offerCard: {
    marginTop: 20,
    backgroundColor: "#FF7B5A",
    padding: 20,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offerTitle: { fontSize: 12, color: "#fff", opacity: 0.8 },
  offerDiscount: { fontSize: 24, fontWeight: "700", color: "#fff" },
  offerSub: { fontSize: 12, color: "#fff", marginTop: 4 },

  orderBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },

  orderBtnText: {
    color: "#FF5733",
    fontWeight: "700",
  },

  offerImage: { width: 80, height: 80 },

  // Restaurant Card
  restaurantCardContainer: {
    marginTop: 25,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#f0f0f0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    height: 128,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  ratingOverlay: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#333",
  },
  content: {
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 12,
    color: "#666",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
  },

  // Categories
  categoryHeader: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  categoryTitle: { fontSize: 18, fontWeight: "700" },

  viewAll: { color: "#FF5733", fontWeight: "600" },

  categoryList: {
    flexDirection: "row",
    marginTop: 15,
  },
  locationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  locationLabel: {
    fontSize: 12,
    color: "#777",
  },

  locationValue: {
    fontSize: 15,
    color: "#111",
    fontWeight: "600",
    marginTop: 2,
  },

  categoryBox: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  viewAllText: {
    color: "#FF5733",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#fff8e1",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 24,
  },
  // categoryText: {
  //   fontSize: 12,
  //   fontWeight: '500',
  //   color: '#333',
  //   textAlign: 'center',
  // },
  /* TOP PICKS styles */
  topWrapper: {
    paddingVertical: 24,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  topTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  topCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 16,
    width: "48%",
  },
  topImageWrapper: {
    height: 130,
    position: "relative",
  },
  topImage: { width: "100%", height: "100%" },

  topRating: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  dietTag: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  vegBg: { backgroundColor: "#d4f8d4" },
  nonVegBg: { backgroundColor: "#ffd4d4" },

  topContent: {
    padding: 10,
  },
  topName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  topCuisine: {
    fontSize: 11,
    color: "#777",
    marginBottom: 6,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF5733",
  },
  deal: {
    fontSize: 11,
    color: "green",
  },

  addBtn: {
    backgroundColor: "#FF5733",
    width: 30,
    height: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  /* FLOATING CART BUTTON */
  cartContainer: {
    position: "absolute",
    bottom: 90,
    right: 20,
  },
  cartBtn: {
    width: 58,
    height: 58,
    backgroundColor: "#FF7B00",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "white",
    borderColor: "#FF7B00",
    borderWidth: 2,
    width: 22,
    height: 22,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FF7B00",
    fontSize: 10,
    fontWeight: "700",
  },

  categoryText: { color: "#333", fontWeight: "500" },
});
