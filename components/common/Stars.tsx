import { COLORS } from "@/constants/colors";
import { Fontisto } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export type StarsProps = {
  rating: number;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  showValue?: boolean;
};

export default function Stars({
  rating,
  size = 12,
  activeColor = COLORS.baseColor,
  inactiveColor = "#E8E4EC",
  showValue = true,
}: StarsProps) {
  return (
    <View className="flex-row items-center">
      {Array.from({ length: 5 }).map((_, i) => {
        const fillPercentage = Math.min(Math.max(rating - i, 0), 1);

        return (
          <View
            key={i}
            style={{
              width: size,
              height: size,
              marginRight: 2,
            }}
          >
            {/* Empty star */}
            <Fontisto
              name="star"
              size={size}
              color={inactiveColor}
              style={{
                position: "absolute",
              }}
            />

            {/* Filled star */}
            {fillPercentage > 0 && (
              <View
                style={{
                  width: size * fillPercentage,
                  overflow: "hidden",
                  position: "absolute",
                }}
              >
                <Fontisto name="star" size={size} color={activeColor} />
              </View>
            )}
          </View>
        );
      })}

      {showValue && (
        <Text style={{ fontSize: size }} className="text-[#8A8590] ml-1">
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}
