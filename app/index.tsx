// app/index.tsx
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // wait until router loads
    if (!segments || segments.length === 0) return;

    // 🔥 directly go to HOME (tabs/index)
    router.replace("/(tabs)");
  }, [segments]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#FF5733" />
    </View>
  );
}
