import { EvilIcons, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AllItemsHeader = ({ navigation }: any) => {
  const [hoverHeart, setHoverHeart] = useState(false);

  return (
    <View
      style={{
        width: "100%",
        paddingTop: "12%",
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} />
      </TouchableOpacity>

      <View
        style={{
          marginLeft: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "400", alignItems: "center" }}>
          All Items
        </Text>
      </View>
      <Pressable
        onHoverIn={() => setHoverHeart(true)}
        onHoverOut={() => setHoverHeart(false)}
        style={[styles.heartWrapper, hoverHeart && styles.heartWrapperHover]}
      >
        <EvilIcons
          name="heart"
          size={20}
          color={hoverHeart ? "#fff" : "#000"} // white icon on orange bg
        />
      </Pressable>
    </View>
  );
};

export default AllItemsHeader;

const styles = StyleSheet.create({
  heartWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f3f3",
    alignItems: "center",
    justifyContent: "center",
  },

  heartWrapperHover: {
    backgroundColor: "#FF6433", // orange on hover
  },
});
