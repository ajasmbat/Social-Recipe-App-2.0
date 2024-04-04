import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AppText from "./AppText";
import Colors from "../config/Colors";

interface props {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function AppError({ error, setError }: props) {
  const setErrorNull = () => {
    setError(null);
  };
  if (!error) {
    return null;
  }

  return (
    <View
      style={{
        position: "absolute",
        zIndex: 2,
        width: 200,
        height: 200,
        backgroundColor: Colors.background,
        top: "50%",
        left: "50%",
        justifyContent: "space-evenly",
        alignItems: "center",
        transform: [{ translateX: -100 }, { translateY: -50 }],
        borderRadius: 20,
      }}
    >
      <AppText>{error}</AppText>
      <TouchableOpacity
        style={{ backgroundColor: Colors.gray, padding: 10, borderRadius: 100 }}
        onPress={setErrorNull}
      >
        <AppText>Close</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
