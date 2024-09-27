import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, View } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import tw from "@/tw-rn";
import LottieView from "lottie-react-native";
import SearchBar from "../../components/SearchBar";

export default function TabTwoScreen() {
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
      <ThemedView style={tw`bg-bg`}>
        <ThemedView style={tw`bg-bg`}>
          <ThemedText type="title">Explore</ThemedText>
        </ThemedView>
        <ThemedView>
          <SearchBar />
        </ThemedView>

        <ThemedText>
          This app includes example code to help you get started.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}
