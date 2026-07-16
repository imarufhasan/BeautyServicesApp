import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

export default function AuthBrandHeader() {
  return (
    <View className="flex-row items-center">
      <LinearGradient
        colors={[COLORS.baseColor1, COLORS.baseColor2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="sparkles" size={20} color="#fff" />
      </LinearGradient>
      <Text
        className="text-lg font-extrabold ml-2"
        style={{ color: "#FC6C8C" }}
      >
        memillennial
      </Text>
    </View>
  );
}
