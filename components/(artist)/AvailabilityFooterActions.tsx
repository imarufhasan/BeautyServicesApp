import { COLORS } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AvailabilityFooterActionsProps {
  onReset?: () => void;
  onSave: () => void;
}

export default function AvailabilityFooterActions({
  onReset,
  onSave,
}: AvailabilityFooterActionsProps) {
  return (
    <View className="flex-row" style={{ gap: 12 }}>
      <TouchableOpacity
        style={{ borderColor: COLORS.baseColor, borderWidth: 1 }}
        className="flex-1 h-[45px] items-center justify-center rounded-full border py-3.5"
        onPress={onReset}
      >
        <Text
          style={{ color: COLORS.baseColor }}
          className="text-base font-semibold"
        >
          Reset Changes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 overflow-hidden rounded-full"
        onPress={onSave}
      >
        <LinearGradient
          colors={[COLORS.baseColor1, COLORS.baseColor2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="items-center h-[45px] justify-center py-3.5"
        >
          <Text className="text-base font-semibold text-white">
            Save Availability
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
