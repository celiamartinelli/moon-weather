import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Button,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import LottieView from "lottie-react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTranslation } from "react-i18next";
import tw from "@/tw-rn";

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const [cityName, setCityName] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const { t } = useTranslation();

  const fetchCoordinates = async (city: string) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${city}&format=json`
    );
    const data = await response.json();
    // console.log("data", JSON.stringify(data, null, 2));

    const formattedResults = data.map((item: any) => ({
      name: item.name,
      displayName: item.display_name,
      latitude: item.lat,
      longitude: item.lon,
    }));

    setResults(formattedResults);

    formattedResults.forEach((result: any) => {
      fetchCityFromCoordinates(result.latitude, result.longitude);
    });
  };

  const fetchCityFromCoordinates = async (lat: string, lon: string) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();
    // console.log("data", JSON.stringify(data, null, 2));
  };

  const handleSearch = () => {
    if (cityName) {
      fetchCoordinates(cityName);
    } else {
      console.error("Le nom de la ville ne peut pas être null");
    }
  };

  const handlePress = (cityProps: string) => {
    navigation.navigate("index", {
      cityProps: cityName,
    });
    setCityName(null);
    results.length = 0;
  };

  const knownCities = [
    { name: "Paris", latitude: 48.8566, longitude: 2.3522 },
    { name: "New York", latitude: 40.7128, longitude: -74.006 },
    { name: "Tokyo", latitude: 35.6895, longitude: 139.6917 },
    { name: "London", latitude: 51.5074, longitude: -0.1278 },
    { name: "Sydney", latitude: -33.8688, longitude: 151.2093 },
  ];

  const handleCityPress = (cityName: string) => {
    handlePress(cityName);
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
            placeholder={t(`explore.input`)}
            placeholderTextColor="white"
            value={cityName || ""}
            onChangeText={setCityName}
          />
          <TouchableOpacity
            style={tw`bg-blue-500 p-2 rounded-lg`}
            onPress={handleSearch}
          >
            <Text style={tw`text-white`}>{t(`explore.search`)}</Text>
          </TouchableOpacity>
        </View>
        {/* <ScrollView>
          {results.map((item) => (
            <TouchableOpacity
              key={`${item.latitude}-${item.longitude}`}
              style={tw`p-2 border-b border-gray-200`}
              onPress={() => handlePress(item.latitude, item.longitude)}
            >
              <ThemedText>{item.name}</ThemedText>
              <ThemedText style={tw`text-xs`}>{item.displayName}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView> */}
        <ScrollView>
          {results.length === 0
            ? knownCities.map((city) => (
                <TouchableOpacity
                  key={city.name}
                  style={tw`p-2 border-b border-gray-200`}
                  onPress={() => handleCityPress(city.name)}
                >
                  <ThemedText>{city.name}</ThemedText>
                </TouchableOpacity>
              ))
            : results.map((item) => (
                <TouchableOpacity
                  key={`${item.latitude}-${item.longitude}`}
                  style={tw`p-2 border-b border-gray-200`}
                  onPress={() => handlePress(item.latitude, item.longitude)}
                >
                  <ThemedText>{item.name}</ThemedText>
                  <ThemedText style={tw`text-xs`}>
                    {item.displayName}
                  </ThemedText>
                </TouchableOpacity>
              ))}
        </ScrollView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
