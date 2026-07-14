import { COLORS } from "@/constants/colors";
import { Fontisto } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

export type StarsProps = {
  rating: number;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
};

export default function Stars({
  rating,
  size = 12,
  activeColor = COLORS.baseColor,
  inactiveColor = "#E8E4EC",
}: StarsProps) {
  return (
    <View className="flex-row items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Fontisto
          key={i}
          name="star"
          size={size}
          color={i < Math.round(rating) ? activeColor : inactiveColor}
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );
}
