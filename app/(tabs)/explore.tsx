import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import {
  Button,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import tw from "@/tw-rn";

type RootStackParamList = {
  TabTwoScreen: undefined;
  index: { latitude: string; longitude: string };
};

export default function TabTwoScreen() {
  const [cityName, setCityName] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const navigation = useNavigation();
  const fetchCoordinates = async (city: string) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${city}&format=json`
    );
    const data = await response.json();
    console.log("data", JSON.stringify(data, null, 2));

    // Mettre à jour les résultats avec les données obtenues
    const formattedResults = data.map((item: any) => ({
      name: item.name,
      displayName: item.display_name,
      latitude: item.lat,
      longitude: item.lon,
    }));

    setResults(formattedResults); // Mettre à jour l'état avec les résultats

    // Appel de la fonction pour obtenir le nom de la ville pour chaque résultat
    formattedResults.forEach((result: any) => {
      fetchCityFromCoordinates(result.latitude, result.longitude);
    });
  };

  const fetchCityFromCoordinates = async (lat: string, lon: string) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();

    // Mettre à jour le nom de la ville basé sur les coordonnées
    if (data && data.address && data.address.city) {
      console.log("Nom de la ville :", data.address.city);
    }
  };

  const handleSearch = () => {
    if (cityName) {
      fetchCoordinates(cityName);
    } else {
      console.error("Le nom de la ville ne peut pas être null");
    }
  };

  const handlePress = (latitude: string, longitude: string) => {
    navigation.navigate("index", { latitude, longitude });
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#0d1126", dark: "#0d1126" }}
      headerImage={
        <LottieView
          style={tw`w-full h-full mt-2 mx-auto absolute`}
          source={require("../../assets/images/animation/Astronaute.json")}
          autoPlay
          loop
        />
      }
    >
      <ThemedView style={tw`flex-1 bg-bg p-4`}>
        <View style={tw`flex-row mb-4`}>
          <TextInput
            style={tw`flex-1 border border-gray-300 rounded-lg p-2 mr-2 text-white`}
            placeholder="Entrez le nom d'une ville"
            value={cityName || ""}
            onChangeText={setCityName}
          />
          <Button title="Rechercher" onPress={handleSearch} />
        </View>
        <ScrollView>
          {results.map((item) => (
            <TouchableOpacity
              key={`${item.latitude}-${item.longitude}`}
              style={tw`p-2 border-b border-gray-200`}
              onPress={() => handlePress(item.latitude, item.longitude)}
            >
              <ThemedText>{item.name}</ThemedText>
              <ThemedText style={tw`text-xs`}>{item.displayName}</ThemedText>
              {/* <ThemedText>Latitude: {item.latitude}</ThemedText>
              <ThemedText>Longitude: {item.longitude}</ThemedText> */}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
