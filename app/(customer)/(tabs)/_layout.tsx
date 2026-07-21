import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabIcon = ({
  focused,
  outlineName,
  filledName,
}: {
  focused: boolean;
  outlineName: keyof typeof Ionicons.glyphMap;
  filledName: keyof typeof Ionicons.glyphMap;
}) => {
  if (focused) {
    return (
      <LinearGradient
        colors={[COLORS.baseColor1, COLORS.baseColor2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={filledName} size={19} color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <View
      style={{
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name={outlineName} size={19} color="#8A8590" />
    </View>
  );
};

export default function CustomerTabsLayout() {
  const insets = useSafeAreaInsets();

  const TAB_BAR_CONTENT_HEIGHT = 58;

  const bottomPadding =
    Platform.OS === "ios" ? insets.bottom : Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.baseColor,
        tabBarInactiveTintColor: "#8A8590",
        tabBarStyle: {
          height: TAB_BAR_CONTENT_HEIGHT + bottomPadding,
          paddingTop: 6,
          paddingBottom: bottomPadding,
          borderTopWidth: 1,
          borderTopColor: "#EFEAF3",
          backgroundColor: "#fff",
          position: "absolute",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              outlineName="home-outline"
              filledName="home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              outlineName="reader-outline"
              filledName="reader"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              outlineName="chatbubble-outline"
              filledName="chatbubble"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              outlineName="person-outline"
              filledName="person"
            />
          ),
        }}
      />
    </Tabs>
  );
}
