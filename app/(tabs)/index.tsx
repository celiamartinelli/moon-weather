import {
  Image,
  StyleSheet,
  Platform,
  View,
  ImageSourcePropType,
  Dimensions,
  Button,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Switch,
} from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import * as Location from "expo-location";
import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import tw from "../../tw-rn";
import LottieView from "lottie-react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { parse, format } from "date-fns";
import Feather from "@expo/vector-icons/Feather";

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
  const { t, i18n } = useTranslation();
  // console.log("latitude", lat, "longitude", long);
  const [isFrench, setIsFrench] = useState(i18n.language === "fr");
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
  const [resetPosition, setResetPosition] = useState(false);
  const [astroSevenData, setAstroSevenData] = useState<any[]>([]);
  const [error, setError] = useState(null);

  const route = useRoute();
  const { cityProps } = route.params || {};
  // console.log("cityProps", cityProps);

  useEffect(() => {
    setCityName(cityProps);
  }, [cityProps]);

  const fetchDataCity = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      // console.log("data", data);
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
    const apiKey = "0d024f07b83f436f8f371944240910";
    const date = new Date().toISOString().split("T")[0];
    let city = cityName;

    const url = `http://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${city}&dt=${date}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      //
      // console.log("Données de localisation et d'astronomie", data);

      if (data.error) {
        return;
      }
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
      } = await data.astronomy.astro;

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

      const moonImage = getMoonPhaseImage(moon_phase as MoonPhase, lat);
      setUrlImg(moonImage);
      // getMoonPhaseImage(moon_phase as MoonPhase, lat);
      setTimeout(() => setLoading(false), 2000);

      setResetPosition(false);
    } catch (error) {
      console.error("Erreur lors de la requête API", error);
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const getMoonPhaseIcon = (moonPhase: MoonPhase) => {
    switch (moonPhase) {
      case "Waxing Crescent":
      case "First Quarter":
      case "Waxing Gibbous":
        return <Feather name="arrow-up-right" size={24} color="white" />;

      case "Waning Gibbous":
      case "Last Quarter":
      case "Waning Crescent":
        return <Feather name="arrow-down-left" size={24} color="white" />;

      default:
        return null;
    }
  };

  const fecthAstronomyDataOnSevenDays = async () => {
    if (!latitude || !longitude) {
      console.error("Latitude ou longitude non définies.");
      return;
    }
    const apiKey = "0d024f07b83f436f8f371944240910";
    let city = cityName;

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        // console.error("Erreur de l'API:", data.error.message);

        return;
      }

      // Vérifiez que les données de prévision existent avant de les utiliser
      if (data && data.forecast && data.forecast.forecastday) {
        const astroData = data.forecast.forecastday.map((day: any) => ({
          date: day.date,
          moon_phase: day.astro.moon_phase,
          moonrise: day.astro.moonrise,
          moonset: day.astro.moonset,
          illumination: day.astro.moon_illumination,
          sunrise: day.astro.sunrise,
          sunset: day.astro.sunset,
          moon_image: getMoonPhaseImage(
            day.astro.moon_phase,
            data.location.lat
          ),
        }));
        setAstroSevenData(astroData);
        // console.log("astroData", data.forecast.forecastday);
      } else {
        console.error(
          "La réponse de l'API ne contient pas les données de prévision attendues."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la requête API", error);
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
      // console.log("location", location);

      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      if (!cityProps || resetPosition) {
        await fetchDataCity();
      }
      fetchAstronomyData();
      setTimeout(() => setLoading(false), 2000);
      fecthAstronomyDataOnSevenDays();
    })();
  }, [resetPosition, cityName]);

  const MoonPhaseCard = ({ item }: { item: any }) => (
    <View
      style={tw`bg-white bg-opacity-15 rounded-lg p-2 m-1 flex items-center shadow-md w-80`}
    >
      {item.moon_image && (
        <Image style={tw`w-20 h-20 mx-auto`} source={item.moon_image} />
      )}
      <ThemedText style={tw`font-bold`}>
        {" "}
        {new Date(item.date).toLocaleDateString(i18n.language, {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        })}
      </ThemedText>
      {/* <ThemedText style={tw`my-2`}>{t("index.moonPhase")}:</ThemedText> */}
      <View style={tw`flex-row justify-center items-center my-3`}>
        <ThemedText>{t(`index.phases.${item.moon_phase}`)} </ThemedText>
        <ThemedText>{getMoonPhaseIcon(moonData.moonPhase)}</ThemedText>
      </View>

      <View
        style={tw`flex-row bg-white bg-opacity-10 rounded-lg mb-5 w-70 justify-center items-center shadow-md`}
      >
        <View style={tw`flex-col justify-center items-center p-8 `}>
          <Image
            source={require("../../assets/icone/icons8-moonrise-48.png")}
            style={tw`w-10 h-10`}
          />
          <ThemedText>
            {isFrench ? formatTimeToFrench(moonData.moonrise) : item.moonrise}
          </ThemedText>
        </View>
        <View style={tw`flex-col justify-center items-center p-8`}>
          <Image
            source={require("../../assets/icone/icons8-moonset-48.png")}
            style={tw`w-10 h-10`}
          />
          <ThemedText>
            {isFrench ? formatTimeToFrench(moonData.moonset) : item.moonset}
          </ThemedText>
        </View>
      </View>
      <ThemedText>
        {" "}
        {t(`index.moonIllumination`)} {item.illumination}%
      </ThemedText>
    </View>
  );

  const renderMoonPhaseCards = () => {
    const rows = [];
    for (let i = 0; i < astroSevenData.length; i += 3) {
      rows.push(
        <View key={i} style={tw`flex flex-wrap flex-row justify-center mb-4 `}>
          {astroSevenData.slice(i, i + 3).map((item, index) => (
            <MoonPhaseCard key={index} item={item} />
          ))}
        </View>
      );
    }
    return rows;
  };
  const getMoonPhaseImage = (
    phase: MoonPhase,
    lat: number
  ): ImageSourcePropType | null => {
    const hemisphere = lat < 0 ? "south" : "north";
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
            ? require("../../assets/images/moon/north-waxing-crescent.png")
            : require("../../assets/images/moon/south-waxing-crescent.png");
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

    // setUrlImg(image);
    return image || null;
  };

  const toggleLanguage = () => {
    const newLanguage = isFrench ? "en" : "fr";
    i18n.changeLanguage(newLanguage);
    setIsFrench(!isFrench);
  };

  const formatTimeToFrench = (time: string) => {
    const parsedTime = parse(time, "hh:mm a", new Date());
    const formattedTime = format(parsedTime, "HH:mm");
    return formattedTime.replace(":", "h");
  };

  return (
    <View style={tw`flex-1 relative pt-16 bg-bg`}>
      <LottieView
        style={tw`top-0`}
        resizeMode="cover"
        source={require("../../assets/images/animation/Background.json")}
        autoPlay
        loop
      />
      <ScrollView>
        {loading ? (
          <LottieView
            style={tw`w-50 h-50 mx-auto justify-end items-center`}
            source={require("../../assets/images/animation/loader.json")}
            autoPlay
            loop
          />
        ) : (
          <View style={tw`flex justify-center items-center`}>
            <ThemedView
              style={tw`bg-inherit w-full text-white flex-row justify-between items-center mx-4 pl-4`}
            >
              <View style={tw`flex-row items-center`}>
                <ThemedText style={tw`text-xs`}>
                  {isFrench ? "FR" : "EN"}{" "}
                </ThemedText>
                <Switch value={isFrench} onValueChange={toggleLanguage} />
              </View>
              <View style={tw`flex-col justify-center items-center`}>
                <View style={tw`flex-row`}>
                  <Entypo name="location-pin" size={24} color="white" />
                  <ThemedText type="subtitle"> {cityName}</ThemedText>
                </View>
              </View>

              <View>
                <TouchableOpacity
                  style={tw`w-20 h-20  flex justify-center items-center`}
                  onPress={() => {
                    setResetPosition(true);
                  }}
                >
                  <LottieView
                    style={tw`w-10 h-10`}
                    source={require("../../assets/images/animation/location.json")}
                    autoPlay
                    loop
                  />
                </TouchableOpacity>
              </View>
            </ThemedView>
            <View style={tw`w-full justify-center items-center mb-2`}>
              <ThemedText style={tw`font-bold`}>
                {new Date(location.localtime).toLocaleDateString(
                  i18n.language,
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </ThemedText>
            </View>

            <Image
              style={tw`w-70 h-70 mx-auto`}
              source={
                urlImg ||
                require("../../assets/images/moon/north-full-moon.png")
              }
            />
            <ThemedView
              style={tw`bg-inherit text-white flex justify-center items-center w-full`}
            >
              {loading ? (
                <ThemedText>Chargement des données...</ThemedText>
              ) : (
                <>
                  {/* <ThemedText type="subtitle">
                    <Ionicons name="moon" size={24} color="white" />
                    Moon
                  </ThemedText> */}
                  <View
                    style={tw`m-2 flex-row justify-center items-center mb-5`}
                  >
                    <ThemedText style={tw``}></ThemedText>
                    <ThemedText style={tw``}>
                      {" "}
                      {t(`index.phases.${moonData.moonPhase}`)}{" "}
                      {getMoonPhaseIcon(moonData.moonPhase)}
                    </ThemedText>
                  </View>
                  <View
                    style={tw`flex-row justify-center mb-5 w-70 bg-white bg-opacity-15 rounded-lg shadow-xl`}
                  >
                    <View style={tw`flex-col justify-center items-center p-8`}>
                      <Image
                        source={require("../../assets/icone/icons8-moonrise-48.png")}
                        style={tw`w-10 h-10`}
                      />
                      <ThemedText>
                        {isFrench
                          ? formatTimeToFrench(moonData.moonrise)
                          : moonData.moonrise}
                      </ThemedText>
                    </View>
                    <View style={tw`flex-col justify-center items-center p-8`}>
                      <Image
                        source={require("../../assets/icone/icons8-moonset-48.png")}
                        style={tw`w-10 h-10`}
                      />
                      <ThemedText>
                        {isFrench
                          ? formatTimeToFrench(moonData.moonset)
                          : moonData.moonset}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={tw``}>
                    <ThemedText>
                      {t(`index.moonIllumination`)} {moonData.moonIllumination}%
                    </ThemedText>
                  </View>
                  <View style={tw`flex-col my-5`}>
                    <ThemedText>
                      {t(`index.isMoonUp`)} {moonData.isMoonUp ? "Oui" : "Non"}
                    </ThemedText>
                    <ThemedText>
                      {t(`index.isSunUp`)} {moonData.isSunUp ? "Oui" : "Non"}
                    </ThemedText>
                  </View>
                </>
              )}
            </ThemedView>
            <ThemedView style={tw`bg-inherit mb-5`}>
              <View style={tw`flex-row justify-center items-center mb-5`}>
                <MaterialIcons
                  style={tw`mr-2`}
                  name="sunny"
                  size={24}
                  color="white"
                />
                <ThemedText
                  type="subtitle"
                  style={tw` flex justify-center items-center`}
                >
                  Sun
                </ThemedText>
              </View>
              {loading ? (
                <ThemedText>{t(`index.dataLoading`)}</ThemedText>
              ) : (
                <View
                  style={tw` flex-row justify-center items-center mb-5 w-70 bg-white bg-opacity-15 rounded-lg`}
                >
                  <View style={tw`flex-col justify-center items-center p-8 `}>
                    <Image
                      source={require("../../assets/icone/icons8-climate-64.png")}
                      style={tw`w-10 h-10`}
                    />
                    <ThemedText>
                      {isFrench
                        ? formatTimeToFrench(moonData.sunrise)
                        : moonData.sunrise}
                    </ThemedText>
                  </View>
                  <View style={tw`flex-col justify-center items-center p-8`}>
                    <Image
                      source={require("../../assets/icone/icons8-sun-64.png")}
                      style={tw`w-10 h-10`}
                    />
                    <ThemedText>
                      {isFrench
                        ? formatTimeToFrench(moonData.sunset)
                        : moonData.sunset}
                    </ThemedText>
                  </View>
                </View>
              )}
            </ThemedView>
            <ThemedView style={tw`bg-inherit justify-center items-center`}>
              <View style={tw`mb-5`}>
                <ThemedText type="subtitle">{t(`index.nextDays`)}</ThemedText>
              </View>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                renderMoonPhaseCards()
              )}
            </ThemedView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
