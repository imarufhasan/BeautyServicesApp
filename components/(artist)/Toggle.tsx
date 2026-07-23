import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Animated, Pressable } from "react-native";

interface ToggleProps {
  value: boolean;
  onValueChange: (next: boolean) => void;
  accessibilityLabel?: string;
}

const WIDTH = 44;
const HEIGHT = 24;
const THUMB = 20;

export function Toggle({
  value,
  onValueChange,
  accessibilityLabel,
}: ToggleProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      style={{ width: WIDTH, height: HEIGHT, borderRadius: HEIGHT / 2 }}
    >
      {value ? (
        <LinearGradient
          colors={["#fb7185", "#fdba74"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: WIDTH,
            height: HEIGHT,
            borderRadius: HEIGHT / 2,
            justifyContent: "center",
          }}
        >
          <Animated.View
            style={{
              width: THUMB,
              height: THUMB,
              borderRadius: THUMB / 2,
              backgroundColor: "white",
              marginLeft: WIDTH - THUMB - 2,
            }}
          />
        </LinearGradient>
      ) : (
        <Animated.View
          style={{
            width: WIDTH,
            height: HEIGHT,
            borderRadius: HEIGHT / 2,
            backgroundColor: "#e2e8f0",
            justifyContent: "center",
          }}
        >
          <Animated.View
            style={{
              width: THUMB,
              height: THUMB,
              borderRadius: THUMB / 2,
              backgroundColor: "white",
              marginLeft: 2,
            }}
          />
        </Animated.View>
      )}
    </Pressable>
  );
}
