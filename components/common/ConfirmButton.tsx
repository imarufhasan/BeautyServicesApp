import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

export default function ConfirmButton({
  label = "Confirm",
  onPress,
  disabled,
}: {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
      className="mt-5"
    >
      <LinearGradient
        colors={["#FF5FA2", "#FFA35C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="rounded-full py-4 items-center justify-center"
      >
        <Text className="text-white text-base font-bold">{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
