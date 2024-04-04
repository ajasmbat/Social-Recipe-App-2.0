import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faRobot,
  faHome,
  faInbox,
  faUser,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { View } from "react-native";

import { Tabs } from "expo-router";
import Colors from "../../../config/Colors";
import AppText from "../../../components/AppText";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarShowLabel: false,
        headerBackground: () => (
          <View style={{ backgroundColor: Colors.gray }}></View>
        ),
      }}
    >
      <Tabs.Screen
        name="CommunityScreen"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon size={28} icon={faRobot} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="AboutScreen"
        options={{
          title: "Settings",

          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon size={28} icon={faReceipt} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Community",

          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon size={28} icon={faHome} color={color} />
          ),

          headerTitle: () => (
            <AppText
              moreStyles={{
                fontFamily: "Montserrat",
                fontSize: 25,
                alignSelf: "center",
              }}
            >
              Explore Recipes
            </AppText>
          ),
        }}
      />
      <Tabs.Screen
        name="MessageScreen"
        options={{
          title: "Message",

          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon size={28} icon={faInbox} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon size={28} icon={faUser} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
