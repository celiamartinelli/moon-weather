import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, View } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import tw from "@/tw-rn";
import LottieView from "lottie-react-native";

export default function TabTwoScreen() {
  return (
    <View style={tw`mt-10`}>
      {/* <ParallaxScrollView
    // headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
    // headerImage={
    //   <Ionicons size={310} name="code-slash" style={styles.headerImage} />
    // }
    > */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <LottieView
        style={tw`w-50 h-50 mx-auto`}
        source={require("../../assets/images/animation/Astronaute.json")}
        autoPlay
        loop
      />
      <ThemedText>
        This app includes example code to help you get started.
      </ThemedText>

      {/* </ParallaxScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
