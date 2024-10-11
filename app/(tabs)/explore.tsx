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
    console.log("data", JSON.stringify(data, null, 2));
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
  };

  const handleSelectPress = (cityProps: string) => {
    navigation.navigate("index", {
      cityProps: cityProps,
    });
  };

  const knownCities = [
    {
      name: "New York",
      latitude: 40.7128,
      longitude: -74.006,
      displayName: "New York, New York, United States",
    },
    {
      name: "Paris",
      latitude: 48.8566,
      longitude: 2.3522,
      displayName: "Paris, Île-de-France, France",
    },
    {
      name: "Tokyo",
      latitude: 35.6762,
      longitude: 139.6503,
      displayName: "Tokyo, Kanto, Japan",
    },
    {
      name: "London",
      latitude: 51.5074,
      longitude: -0.1278,
      displayName: "London, England, United Kingdom",
    },
    {
      name: "Moscow",
      latitude: 55.7558,
      longitude: 37.6173,
      displayName: "Moscow, Moscow, Russia",
    },
    {
      name: "Mexico City",
      latitude: 19.4326,
      longitude: -99.1332,
      displayName: "Mexico City, Mexico City, Mexico",
    },
    {
      name: "Beijing",
      latitude: 39.9042,
      longitude: 116.4074,
      displayName: "Beijing, Beijing, China",
    },
    {
      name: "Berlin",
      latitude: 52.52,
      longitude: 13.405,
      displayName: "Berlin, Berlin, Germany",
    },
    {
      name: "Sydney",
      latitude: -33.8688,
      longitude: 151.2093,
      displayName: "Sydney, New South Wales, Australia",
    },
    {
      name: "São Paulo",
      latitude: -23.5505,
      longitude: -46.6333,
      displayName: "São Paulo, São Paulo, Brazil",
    },
    {
      name: "Johannesburg",
      latitude: -26.2041,
      longitude: 28.0473,
      displayName: "Johannesburg, Gauteng, South Africa",
    },
    {
      name: "Buenos Aires",
      latitude: -34.6037,
      longitude: -58.3816,
      displayName: "Buenos Aires, Buenos Aires, Argentina",
    },
    {
      name: "Lima",
      latitude: -12.0464,
      longitude: -77.0428,
      displayName: "Lima, Lima Province, Peru",
    },
    {
      name: "Jakarta",
      latitude: -6.2088,
      longitude: 106.8456,
      displayName: "Jakarta, Jakarta Special Capital Region, Indonesia",
    },
    {
      name: "Auckland",
      latitude: -36.8485,
      longitude: 174.7633,
      displayName: "Auckland, Auckland, New Zealand",
    },
  ];

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
            style={tw`bg-purple p-2 rounded-lg`}
            onPress={handleSearch}
          >
            <Text style={tw`text-white`}>{t(`explore.search`)}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {results.length === 0 ? (
            <View
              style={tw`flex-row flex-wrap w-full justify-center items-center`}
            >
              {knownCities.map((city) => (
                <TouchableOpacity
                  key={`${city.latitude}-${city.longitude}`}
                  style={tw`px-1 py-2 flex items-center border border-white rounded-lg m-1 bg-white bg-opacity-8 w-80`}
                  onPress={() => handleSelectPress(city.name)}
                >
                  <ThemedText style={tw`flex justify-center`} type="subtitle">
                    {city.name}
                  </ThemedText>
                  <View style={tw`w-75`}>
                    <ThemedText style={tw`flex justify-start text-sm`}>
                      {city.displayName}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={tw`flex-row flex-wrap`}>
              {results.map((item) => (
                <TouchableOpacity
                  key={`${item.latitude}-${item.longitude}`}
                  style={tw`p-2 border-b border-gray-200 w-full`}
                  onPress={() => handlePress(item.latitude, item.longitude)}
                >
                  <ThemedText>{item.name}</ThemedText>
                  <ThemedText style={tw`text-xs`}>
                    {item.displayName}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
