import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function FiltersHeader({
  navigation,
  upperText,
  lowerText,
}: any) {
  return (
    <View
      style={{
        paddingTop: "12%",
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      }}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} />
      </TouchableOpacity>

      <View style={{ marginLeft: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{upperText}</Text>
        <Text style={{ fontSize: 13, color: "#666" }}>{lowerText}</Text>
      </View>
    </View>
  );
}
