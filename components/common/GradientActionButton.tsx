import { COLORS } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export default function GradientActionButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      className="rounded-full overflow-hidden"
      style={{
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <LinearGradient
        colors={[COLORS.baseColor1, COLORS.baseColor2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="py-4 items-center justify-center rounded-full"
      >
        <View className="flex-row items-center justify-center">
          {loading && (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: 8 }}
            />
          )}

          {!loading && icon && <View style={{ marginRight: 6 }}>{icon}</View>}

          <Text className="text-white text-base font-extrabold">
            {loading ? `${title}...` : title}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
