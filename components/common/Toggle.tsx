import { COLORS } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Animated, TouchableOpacity } from "react-native";

export default function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const anim = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onChange(!value)}
      style={{ width: 48, height: 28, borderRadius: 14, overflow: "hidden" }}
    >
      {value ? (
        <LinearGradient
          colors={[COLORS.baseColor1, COLORS.baseColor2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius: 14, justifyContent: "center" }}
        >
          <Animated.View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "#fff",
              transform: [{ translateX }],
            }}
          />
        </LinearGradient>
      ) : (
        <Animated.View
          style={{
            flex: 1,
            borderRadius: 14,
            backgroundColor: "#E4E1E7",
            justifyContent: "center",
          }}
        >
          <Animated.View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "#fff",
              transform: [{ translateX }],
            }}
          />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}
