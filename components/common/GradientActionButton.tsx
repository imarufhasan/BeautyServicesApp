import { COLORS } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  height?: number;
  textSize?: string;
};

export default function GradientActionButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  height = 40,
  textSize = "text-sm",
}: Props) {
  const [showLoader, setShowLoader] = useState(false);

  const handlePress = () => {
    if (disabled || loading || showLoader) return;

    setShowLoader(true);

    setTimeout(() => {
      setShowLoader(false);
      onPress();
    }, 1000);
  };

  const isLoading = loading || showLoader;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={disabled || isLoading}
      className="overflow-hidden rounded-full"
      style={{
        height,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <LinearGradient
        colors={[COLORS.baseColor1, COLORS.baseColor2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="flex-1 items-center justify-center rounded-full"
      >
        <View className="flex-row items-center justify-center">
          {isLoading && (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: 8 }}
            />
          )}

          {!isLoading && icon && <View style={{ marginRight: 6 }}>{icon}</View>}

          <Text className={`font-semibold text-lg text-white ${textSize}`}>
            {isLoading ? `${title}...` : title}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
