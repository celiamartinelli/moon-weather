import {
  Image,
  StyleSheet,
  Platform,
  View,
  ImageSourcePropType,
  Dimensions,
  Button,
} from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import * as Location from "expo-location";
import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import tw from "../../tw-rn";
import LottieView from "lottie-react-native";

import { useRoute } from "@react-navigation/native";

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
    north: any;
    south: any;
  };
};

type Props = {
  route: any;
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

export default function HomeScreen() {
  // console.log("latitude", lat, "longitude", long);
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
  const [latitude, setLatitude] = useState(48.8566);
  const [longitude, setLongitude] = useState(2.3522);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState<any | null>(null);
  const [urlImg, setUrlImg] = useState<string | null>(null);

  const route = useRoute();
  const { cityProps } = route.params || {};
  console.log("cityProps", cityProps);

  const fetchDataCity = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      console.log("data", data);
      setCityName(
        data.address.city || data.address.town || data.address.village
      );
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du nom de la ville:",
        error
      );
    }
  };

  const fetchAstronomyData = async () => {
    if (!latitude || !longitude) {
      console.error("Latitude ou longitude non définies.");
      return;
    }
    const apiKey = "1e005ffe6aaa4ae69a3125812242509";
    const date = new Date().toISOString().split("T")[0];

    console.log("cityName", cityName);

    const city = cityProps
      ? cityProps
      : cityName?.city || cityName?.town || cityName?.village;
    console.log("city", city);
    const url = `http://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${city}&dt=${date}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // console.log("Données de localisation et d'astronomie", data);

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
      } = data?.astronomy?.astro;
      // console.log("data.astronomy.astro", data.astronomy.astro);
      const { name, region, country, localtime, lat } = data?.location;

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
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setGeoError("Permission de localisation refusée");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log("location", location);

      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      await fetchDataCity();
      fetchAstronomyData();
    })();
  }, [cityProps]);

  useEffect(() => {
    getMoonPhaseImage(moonData.moonPhase, location.lat);
  }, []);

  const getMoonPhaseImage = (
    phase: MoonPhase,
    lat: number
  ): ImageSourcePropType | null => {
    const hemisphere = lat > 0 ? "north" : "south";
    let image: ImageSourcePropType | undefined;

    switch (phase) {
      case "New Moon":
        image =
          hemisphere === "north"
            ? require("../../assets/images/moon/north-new-moon.png")
            : require("../../assets/images/moon/south-new-moon.png");
        break;
      case "Waxing Crescent":
        image =
          hemisphere === "north"
            ? require("../../assets/images/moon/north-first-crescent.png")
            : require("../../assets/images/moon/south-first-crescent.png");
        break;
      case "First Quarter":
        image =
          hemisphere === "north"
            ? require("../../assets/images/moon/north-first-quarter.png")
            : require("../../assets/images/moon/south-first-quarter.png");
        break;
      case "Waxing Gibbous":
        image =
          hemisphere === "north"
            ? require("../../assets/images/moon/north-waxing-gibbous.png")
            : require("../../assets/images/moon/south-waxing-gibbous.png");
        break;
      case "Full Moon":
        image =
          hemisphere === "north"
            ? require("../../assets/images/moon/north-full-moon.png")
            : require("../../assets/images/moon/south-full-moon.png");
        break;
      case "Waning Gibbous":
        image =
          hemisphere === "north"
            ? require("../../assets/images/moon/north-waning-gibbous.png")
            : require("../../assets/images/moon/south-waning-gibbous.png");
        break;
      case "Last Quarter":
        image =
          hemisphere === "north"
            ? require("../../assets/images/moon/north-last-quarter.png")
            : require("../../assets/images/moon/south-last-quarter.png");
        break;
      case "Waning Crescent":
        image =
          hemisphere === "north"
            ? require("../../assets/images/moon/north-waning-crescent.png")
            : require("../../assets/images/moon/south-waning-crescent.png");
        break;
      default:
        image = undefined;
    }

    setUrlImg(image);
  };

  return (
    <View style={tw`flex-1 relative pt-16 bg-bg`}>
      <LottieView
        style={tw``}
        resizeMode="cover"
        source={require("../../assets/images/animation/Background.json")}
        autoPlay
        loop
      />
      <View style={tw`flex-1 justify-center items-center`}>
        <Button title="ici" onPress={fetchAstronomyData} />
        <Image
          style={tw`w-70 h-70 mx-auto`}
          source={
            urlImg || require("../../assets/images/moon/north-full-moon.png")
          }
        />
        <ThemedView style={tw`bg-inherit text-white`}>
          <ThemedText type="subtitle">
            {cityProps
              ? cityProps
              : cityName?.city || cityName?.town || cityName?.village}
          </ThemedText>
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
