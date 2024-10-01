import {
  Image,
  StyleSheet,
  Platform,
  View,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import { HelloWave } from "@/components/HelloWave";
// import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import tw from "../../tw-rn";
import LottieView from "lottie-react-native";
import { AnimatedKeyboardOptions } from "react-native-reanimated";

type MoonPhase =
  | "New Moon"
  | "Waxing Crescent"
  | "First Quarter"
  | "Waxing Gibbous"
  | "Full Moon"
  | "Waning Gibbous"
  | "Last Quarter"
  | "Waning Crescent";

type Hemisphere = "north" | "south";

type MoonPhaseImages = {
  [key in MoonPhase]: {
    [key in Hemisphere]: ImageSourcePropType;
  };
};

interface MoonData {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moonPhase: MoonPhase;
  moonIllumination: string;
  isMoonUp: number;
  isSunUp: number;
}

interface LocationData {
  name: string;
  region: string;
  country: string;
  localtime: string;
  lat: number;
}

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [moonData, setMoonData] = useState<MoonData>({
    sunrise: "",
    sunset: "",
    moonrise: "",
    moonset: "",
    moonPhase: "New Moon",
    moonIllumination: "",
    isMoonUp: 0,
    isSunUp: 0,
  });
  const [location, setLocation] = useState<LocationData>({
    name: "",
    region: "",
    country: "",
    localtime: "",
    lat: 0,
  });
  const [loading, setLoading] = useState(true);
  const fetchAstronomyData = async () => {
    const apiKey = "1e005ffe6aaa4ae69a3125812242509"; // Remplacez par votre clé API
    const location = "Paris"; // Vous pouvez remplacer cela par une autre ville ou coordonnées
    const date = new Date().toISOString().split("T")[0]; // Remplacez par la date souhaitée

    const url = `http://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${location}&dt=${date}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log("Données de localisation et d'astronomie", data);

      // Extraction des informations de localisation et d'astronomie
      const {
        sunrise,
        sunset,
        moonrise,
        moonset,
        moon_phase,
        moon_illumination,
        is_moon_up,
        is_sun_up,
      } = data.astronomy.astro;
      const { name, region, country, localtime, lat } = data.location;

      // Mise à jour de l'état avec les informations récupérées
      setMoonData({
        sunrise,
        sunset,
        moonrise,
        moonset,
        moonPhase: moon_phase as MoonPhase,
        moonIllumination: moon_illumination,
        isMoonUp: is_moon_up,
        isSunUp: is_sun_up,
      });

      setLocation({ name, region, country, localtime, lat });
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la requête API", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAstronomyData();
  }, []);

  const getMoonPhaseImage = (
    phase: MoonPhase,
    lat: number
  ): ImageSourcePropType | null => {
    const hemisphere = lat > 0 ? "north" : "south";
    const images: MoonPhaseImages = {
      "New Moon": {
        north: require("../../assets/images/moon/north-new-moon.png"),
        south: require("../../assets/images/moon/south-new-moon.png"),
      },
      "Waxing Crescent": {
        north: require("../../assets/images/moon/north-first-crescent.png"),
        south: require("../../assets/images/moon/south-first-crescent.png"),
      },
      "First Quarter": {
        north: require("../../assets/images/moon/north-first-quarter.png"),
        south: require("../../assets/images/moon/south-first-quarter.png"),
      },
      "Waxing Gibbous": {
        north: require("../../assets/images/moon/north-waxing-gibbous.png"),
        south: require("../../assets/images/moon/south-waxing-gibbous.png"),
      },
      "Full Moon": {
        north: require("../../assets/images/moon/north-full-moon.png"),
        south: require("../../assets/images/moon/south-full-moon.png"),
      },
      "Waning Gibbous": {
        north: require("../../assets/images/moon/north-waning-gibbous.png"),
        south: require("../../assets/images/moon/south-waning-gibbous.png"),
      },
      "Last Quarter": {
        north: require("../../assets/images/moon/north-last-quarter.png"),
        south: require("../../assets/images/moon/south-last-quarter.png"),
      },
      "Waning Crescent": {
        north: require("../../assets/images/moon/north-waning-crescent.png"),
        south: require("../../assets/images/moon/south-waning-crescent.png"),
      },
    };

    return images[phase]?.[hemisphere] || null;
  };

  return (
    <View style={tw`flex-1 relative pt-16 bg-bg `}>
      <LottieView
        resizeMode="cover"
        source={require("../../assets/images/animation/Background.json")}
        autoPlay
        loop
      />
      <View style={tw`flex-1 justify-center items-center`}>
        <Image
          style={tw`w-70 h-70 mx-auto`}
          source={getMoonPhaseImage(moonData.moonPhase, location.lat)}
        />
        <ThemedView style={tw`bg-inherit text-white`}>
          <ThemedText type="subtitle">Données de la Lune</ThemedText>
          {loading ? (
            <ThemedText>Chargement des données...</ThemedText>
          ) : (
            <>
              <ThemedText>Phase lunaire: {moonData.moonPhase}</ThemedText>
              <ThemedText>Lever de la lune: {moonData.moonrise}</ThemedText>
              <ThemedText>Coucher de la lune: {moonData.moonset}</ThemedText>
            </>
          )}
        </ThemedView>
        <ThemedView style={tw`bg-inherit`}>
          <ThemedText type="subtitle">Données Astronomiques</ThemedText>
          {loading ? (
            <ThemedText>Chargement des données...</ThemedText>
          ) : (
            <>
              <ThemedText>Lever du soleil: {moonData.sunrise}</ThemedText>
              <ThemedText>Coucher du soleil: {moonData.sunset}</ThemedText>
              <ThemedText>Lever de la lune: {moonData.moonrise}</ThemedText>
              <ThemedText>Coucher de la lune: {moonData.moonset}</ThemedText>
              <ThemedText>Phase lunaire: {moonData.moonPhase}</ThemedText>
              <ThemedText>
                Illumination lunaire: {moonData.moonIllumination}%
              </ThemedText>
              <ThemedText>
                La lune est-elle visible ? {moonData.isMoonUp ? "Oui" : "Non"}
              </ThemedText>
              <ThemedText>
                Le soleil est-il visible ? {moonData.isSunUp ? "Oui" : "Non"}
              </ThemedText>
            </>
          )}
        </ThemedView>
      </View>
    </View>
  );
}
