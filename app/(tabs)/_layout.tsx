import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AntDesign, Entypo, Feather, FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Entypo name="home" size={24} color={color} />
            ) : (
              <AntDesign name="home" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: "Book",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <AntDesign name="calendar" size={24} color={color} />
            ) : (
              <Feather name="calendar" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Entypo name="shopping-bag" size={24} color={color} />
            ) : (
              <Feather name="shopping-bag" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <FontAwesome name="user" size={24} color="black" />
            ) : (
              <Feather name="user" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
