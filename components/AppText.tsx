import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { useFonts } from "expo-font";

interface AppTextProps {
  moreStyles?: StyleProp<TextStyle>;
  children: ReactNode;
}

export default function AppText({ moreStyles, children }: AppTextProps) {
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Black": require("../assets/Inter.ttf"),
    Montserrat: require("../assets/Montserrat.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return <Text style={[styles.text, moreStyles]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Inter-Black",
  },
});
