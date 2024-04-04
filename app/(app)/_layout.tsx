import { Stack } from "expo-router/stack";
import Colors from "../../config/Colors";
import { View, Button, TouchableOpacity } from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBackspace,
  faBackward,
  faCaretLeft,
  faChevronLeft,
  faLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import { Redirect, router } from "expo-router";
import { AppContext } from "../../context/AppContext";
import { useContext } from "react";
import AppText from "../../components/AppText";

export default function AppLayout() {
  const { state, dispatch } = useContext(AppContext);

  if (state.access) {
    return (
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, animation: "fade" }}
        />
        <Stack.Screen
          name="PostScreen"
          options={{
            animation: "slide_from_bottom",
            title: "Create A Post",
            headerBackground: () => (
              <View style={{ flex: 1, backgroundColor: Colors.gray }} />
            ),
            headerTitle: () => (
              <AppText
                moreStyles={{
                  fontFamily: "Montserrat",
                  fontSize: 25,
                  alignSelf: "center",
                }}
              >
                Create Recipe
              </AppText>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <FontAwesomeIcon icon={faChevronLeft} size={20} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="CardDetailScreen"
          options={{
            headerShown: false,
            animation: "fade_from_bottom",
          }}
        />
        <Stack.Screen
          name="OtherProfileScreen"
          options={{
            headerShown: false,
            animation: "fade_from_bottom",
          }}
        />
      </Stack>
    );
  }

  // This will only be reached if state.access is falsy
  return <Redirect href="RegisterScreen" />;
}
