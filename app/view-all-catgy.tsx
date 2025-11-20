import { menuCategories, menuItems } from "@/data/mockData";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function ViewAllCategoryPage() {
  
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [cart, setCart] = useState([]);

  // Category list (All Items + rest)
  const categories = ["All Items", ...menuCategories];

  // Filtering items
  const filteredItems =
    selectedCategory === "All Items"
      ? Object.values(menuItems).flat()
      : menuItems[selectedCategory] || [];

  // Add / Remove Toggle Logic
  const addToCart = async (item) => {
    const exists = cart.find((i) => i.id === item.id);
    let updatedCart;

    if (exists) {
      updatedCart = cart.filter((i) => i.id !== item.id); // Remove item
    } else {
      updatedCart = [...cart, { ...item, quantity: 1 }]; // Add item
    }

    setCart(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const renderItem = ({ item }) => {
    const isInCart = cart.find((i) => i.id === item.id);

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.foodImg} />

        <View style={{ flex: 1 }}>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.desc}>{item.description}</Text>
        </View>

        {/* ADD BUTTON */}
        <TouchableOpacity
          onPress={() => addToCart(item)}
          style={[styles.addBtn, isInCart && styles.addBtnActive]}
        >
          <Text style={[styles.addText, isInCart && styles.addTextActive]}>
            Add +
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (

    <>
     <Stack.Screen
        options={{
          title: "All Items",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "700",
            color: "#000",
          },
        }}
      />

    <View style={styles.container}>
      {/* CATEGORY ROW */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryRow}
      >
        {categories.map((cat) => {
          const isActive =
            selectedCategory === "All Items"
              ? cat === "All Items"
              : selectedCategory === cat.id;

          return (
            <TouchableOpacity
              key={cat === "All Items" ? "all" : cat.id}
              style={[styles.catBtn, isActive && styles.catBtnActive]}
              onPress={() =>
                setSelectedCategory(cat === "All Items" ? "All Items" : cat.id)
              }
            >
              <View style={styles.catInner}>
                {/* Icon (only real categories get icon) */}
                {cat !== "All Items" && (
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                )}

                {/* Label */}
                <Text style={[styles.catText, isActive && styles.catTextActive]}>
                  {cat === "All Items" ? "All Items" : cat.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ITEM LIST */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      />

      {/* BOTTOM CART BAR */}
      {cart.length > 0 && (
        <LinearGradient
          colors={["#FF7A3E", "#FF4B2B"]}
          style={styles.cartBar}
        >
          {/* White Item Count Box */}
          <View style={styles.itemBox}>
            <Text style={styles.itemBoxText}>
              {cart.reduce((t, i) => t + i.quantity, 0)} Item
            </Text>
          </View>

          {/* Price */}
          <Text style={styles.cartPrice}>
            ₹{cart.reduce((t, i) => t + i.quantity * i.price, 0)}
          </Text>

          {/* View Order */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/cart")}
            style={styles.cartBtn}
          >
            <Text style={styles.cartBtnText}>View Order</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </View>
    </>
  );
}

// ⭐ STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  categoryRow: {
    marginVertical: 16,
  },

  catBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  catInner: {
    flexDirection: "row",
    alignItems: "center",
  },

  catIcon: {
    fontSize: 16,
    marginRight: 6,
  },

  catBtnActive: {
    backgroundColor: "#FF6433",
    borderColor: "#FF6433",
  },

  catText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },

  catTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  // ITEM CARD
  card: {
    flexDirection: "row",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  foodImg: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },

  foodName: {
    fontSize: 16,
    fontWeight: "700",
  },

  price: {
    marginTop: 2,
    fontSize: 14,
    color: "#FF6433",
    fontWeight: "700",
  },

  desc: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
    width: "95%",
  },

  // ADD BUTTON
  addBtn: {
    backgroundColor: "#f3f3f3",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "center",
  },

  addBtnActive: {
    backgroundColor: "#FF6433",
  },

  addText: {
    color: "#333",
    fontWeight: "700",
  },

  addTextActive: {
    color: "#fff",
  },

  // CART BAR
  cartBar: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 10,
  },

  itemBox: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },

  itemBoxText: {
    color: "#FF4B2B",
    fontWeight: "700",
    fontSize: 14,
  },

  cartPrice: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  cartBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },

  cartBtnText: {
    color: "#FF4B2B",
    fontWeight: "700",
  },
});
