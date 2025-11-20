import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { menuItems } from "@/data/mockData";
import {
  Feather,
  MaterialIcons,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Get All Items from mockData
  const allItems = Object.values(menuItems).flat();
  const product = allItems.find((i) => i.id === id);

  if (!product)
    return (
      <View style={styles.center}>
        <Text>Item not found</Text>
      </View>
    );

  // Add to Cart
  const handleAddToCart = async () => {
    let existingCart = await AsyncStorage.getItem("cart");
    existingCart = existingCart ? JSON.parse(existingCart) : [];

    existingCart.push({ ...product, qty: 1 });

    await AsyncStorage.setItem("cart", JSON.stringify(existingCart));

    router.push("/(tabs)/cart");
  };

  // Calories logic
  const getCalories = (itemName) => {
    const name = itemName.toLowerCase();
    if (name.includes("biryani")) return 650;
    if (name.includes("butter chicken") || name.includes("tikka masala"))
      return 520;
    if (name.includes("paneer")) return 380;
    if (name.includes("dal")) return 220;
    if (name.includes("naan") || name.includes("roti")) return 260;
    if (name.includes("soup")) return 120;
    if (name.includes("roll")) return 420;
    if (name.includes("fried rice")) return 480;
    if (name.includes("tandoori") || name.includes("tikka")) return 340;
    if (name.includes("fish")) return 290;
    if (name.includes("mutton")) return 580;
    if (name.includes("chicken") && !name.includes("butter")) return 450;
    return 350;
  };

  return (
    <>
     <Stack.Screen
        options={{
          title: "Product Detail",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 18,
            color: "#000",
          },
        }}
      />
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconBtn}
        >
          <AntDesign name="left" size={22} color="#111" />
        </TouchableOpacity>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="share" size={20} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <AntDesign name="hearto" size={20} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={{ height: 320 }}>
          <Image
            source={{ uri: product.image }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        {/* Content */}
        <View style={styles.contentBox}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.subtitle}>By McDonald's</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <AntDesign name="star" size={18} color="#FF5733" />
            <Text style={styles.ratingValue}>4.7</Text>
            <Text style={styles.reviews}>(2.3k reviews)</Text>
          </View>

          {/* Price Box */}
          <View style={styles.priceBox}>
            <View>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceValue}>₹{product.price}</Text>
            </View>
            <Text style={{ fontSize: 36 }}>🍽️</Text>
          </View>

          {/* Nutritional Info */}
          <View style={styles.nutritionBox}>
            <Text style={styles.sectionTitle}>Nutritional Info</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={{ fontSize: 20 }}>🔥</Text>
              <Text style={styles.calories}>
                Calories: {getCalories(product.name)} kcal
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>Description</Text>

            <Text style={styles.descriptionText}>
              {showFullDescription
                ? "From fresh bread to dairy... (full description)"
                : "From fresh bread to dairy... (short description)"}
            </Text>

            <TouchableOpacity
              onPress={() => setShowFullDescription(!showFullDescription)}
            >
              <Text style={styles.readMore}>
                {showFullDescription ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Delivery Info */}
          <View style={styles.deliveryBox}>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={{ fontSize: 20 }}>🚚</Text>
              <Text style={styles.deliveryLabel}>Delivery Time</Text>
            </View>
            <Text style={styles.deliveryTime}>25-30 minutes</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Add to Cart */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Feather name="shopping-cart" size={20} color="#fff" />
          <Text style={styles.cartBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    position: "absolute",
    top: 45,
    left: 20,
    right: 20,
    zIndex: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  iconBtn: {
    backgroundColor: "rgba(255,255,255,0.95)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  contentBox: {
    backgroundColor: "#fff",
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  title: { fontSize: 26, fontWeight: "700", color: "#111" },
  subtitle: { fontSize: 14, color: "#777", marginBottom: 10 },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  ratingValue: { fontSize: 16, fontWeight: "700", color: "#111" },
  reviews: { fontSize: 13, color: "#777" },

  priceBox: {
    backgroundColor: "#FFF0E6",
    borderColor: "#FFD4B8",
    borderWidth: 1,
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  priceLabel: { fontSize: 12, color: "#777" },
  priceValue: { fontSize: 26, fontWeight: "700" },

  nutritionBox: {
    backgroundColor: "#f6f6f6",
    padding: 16,
    borderRadius: 18,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 10 },
  calories: { fontSize: 14, color: "#333" },

  descriptionText: { color: "#555", lineHeight: 20 },
  readMore: { color: "#FF5733", marginTop: 6, fontWeight: "600" },

  deliveryBox: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
  },
  deliveryLabel: { fontSize: 12, color: "#777" },
  deliveryTime: { fontSize: 16, fontWeight: "700", color: "#111" },

  bottomContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 50,
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  cartBtn: {
    backgroundColor: "#FF7B00",
    height: 56,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  cartBtnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
