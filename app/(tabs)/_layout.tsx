import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import tw from "@/tw-rn";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: [
          tw`bg-bg`,
          {
            borderTopWidth: 0, // Supprimer la ligne au-dessus de la barre d'onglets
            // elevation: 0, // Supprimer l'ombre sur Android
            // shadowOpacity: 0, // Supprimer l'ombre sur iOS
          },
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Moon",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/moon-icon.png")} // Utiliser une image valide
              style={{ width: 24, height: 24, opacity: focused ? 1 : 0.5 }} // Ajuster la taille de l'icône
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/search-glasse.png")} // Utiliser une image valide
              style={{ width: 24, height: 24, opacity: focused ? 1 : 0.5 }} // Ajuster la taille de l'icône
            />
          ),
        }}
      />
    </Tabs>
  );
}
