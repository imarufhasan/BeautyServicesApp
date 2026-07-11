import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface GradientButtonProps {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  search?: boolean;
  height?: number;
  borderRadius?: number;
  textSize?: number;
  colors?: readonly [string, string];
}

export default function GradientButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  style,
  search,
  height = 50,
  borderRadius = 12,
  textSize = 18,
  colors = [COLORS.baseColor1, COLORS.baseColor2],
}: GradientButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{
        color: "rgba(255,255,255,0.15)",
      }}
      style={[
        {
          borderRadius,
          overflow: "hidden",
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height,
          borderRadius,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View className="flex-1 w-full justify-center items-center gap-2 flex-row">
          {search && <Ionicons name="search" size={17} color="#FFFFFF" />}
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: textSize,
              }}
            >
              {label}
            </Text>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}
