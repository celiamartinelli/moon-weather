import { Image, StyleSheet, Platform, View } from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import { HelloWave } from "@/components/HelloWave";
// import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import tw from "../../tw-rn";
export default function HomeScreen() {
  const [moonData, setMoonData] = useState({
    sunrise: "",
    sunset: "",
    moonrise: "",
    moonset: "",
    moonPhase: "",
    moonIllumination: "",
    isMoonUp: 0,
    isSunUp: 0,
  });
  const [location, setLocation] = useState({
    name: "",
    region: "",
    country: "",
    localtime: "",
  });
  const [loading, setLoading] = useState(true);
  const fetchAstronomyData = async () => {
    const apiKey = "1e005ffe6aaa4ae69a3125812242509"; // Remplacez par votre clé API
    const location = "Paris"; // Vous pouvez remplacer cela par une autre ville ou coordonnées
    const date = "2024-08-12"; // Remplacez par la date souhaitée

    const url = `http://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${location}&dt=${date}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

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
      const { name, region, country, localtime } = data.location;

      // Mise à jour de l'état avec les informations récupérées
      setMoonData({
        sunrise,
        sunset,
        moonrise,
        moonset,
        moonPhase: moon_phase,
        moonIllumination: moon_illumination,
        isMoonUp: is_moon_up,
        isSunUp: is_sun_up,
      });

      setLocation({ name, region, country, localtime });
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la requête API", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAstronomyData();
  }, []);

  const getMoonPhaseImage = (phase: string) => {
    switch (phase.toLowerCase()) {
      case "new moon":
        return require("../../assets/images/moon/north-new-moon.png");
      case "waxing crescent":
        return require("../../assets/images/moon/north-first-crescent.png");
      case "first quarter":
        return require("../../assets/images/moon/north-first-quarter.png");
      case "waxing gibbous":
        return require("../../assets/images/moon/north-waxing-gibbous.png");
      case "full moon":
        return require("../../assets/images/moon/north-full-moon.png");
      case "waning gibbous":
        return require("../../assets/images/moon/north-waning-gibbous.png");
      case "last quarter":
        return require("../../assets/images/moon/north-last-quarter.png");
      case "waning crescent":
        return require("../../assets/images/moon/north-waning-crescent.png");
      default:
        return null; // Cas par défaut si aucune image n'est trouvée
    }
  };

  return (
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    //   headerImage={
    //     <Image
    //       source={require("@/assets/images/partial-react-logo.png")}
    //       style={styles.reactLogo}
    //     />
    //   }
    // >
    <View style={tw`mt-10`}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={tw`bg-celadon`} type="title">
          Bonjour!
        </ThemedText>
        <HelloWave />
      </ThemedView>
      <Image
        style={tw`w-70 h-70 mx-auto`}
        source={getMoonPhaseImage(moonData.moonPhase)}
      />
      <ThemedView style={styles.stepContainer}>
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
      <ThemedView style={styles.stepContainer}>
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
    // </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
