import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

interface AppPlusButtonProps {
  positionStyles?: StyleProp<ViewStyle>;
  size: number;
  color: string;
  onPress: () => void;
}

export default function AppPlusButton({
  positionStyles,
  size,
  color,
  onPress,
}: AppPlusButtonProps) {
  return (
    <View style={positionStyles}>
      <TouchableOpacity
        onPress={onPress}
        style={{ backgroundColor: "white", borderRadius: 100, padding: 5 }}
      >
        <FontAwesomeIcon size={size} icon={faPlus} color={"black"} />
      </TouchableOpacity>
    </View>
  );
}
