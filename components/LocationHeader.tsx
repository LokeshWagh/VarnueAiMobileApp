import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function LocationsHeader({ navigation }: any) {
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
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          All Moti Mahal Branches
        </Text>
        <Text style={{ fontSize: 13, color: "#666" }}>
          6 locations across Nagpur
        </Text>
      </View>
    </View>
  );
}
