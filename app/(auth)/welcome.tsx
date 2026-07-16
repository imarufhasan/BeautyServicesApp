import GradientButton from "@/components/common/GradientButton";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

const FEATURES = [
  "Top Quality Service",
  "Transparent Pricing",
  "Easy & Fast Booking",
];

export default function WelcomeScreen() {
  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-white">
      <StatusBar style="light" />

      {/* Background Image */}
      <Image
        source={require("../../assets/images/welcomeImg.png")}
        resizeMode="cover"
        fadeDuration={0}
        className="absolute inset-0"
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* Bottom Gradient */}
      <LinearGradient
        colors={[
          "transparent",
          "rgba(255,255,255,0.65)",
          "rgba(255,255,255,0.92)",
          "#FFFFFF",
        ]}
        className="absolute left-0 right-0 bottom-0"
        style={{
          height: height * 0.52,
        }}
      />

      {/* Content */}
      <View className="flex-1 justify-end px-6 pb-8">
        <View className="w-full max-w-[420px] self-center">
          {/* Title */}
          <View className="items-center">
            <Text className="text-[36px] font-bold text-[#101828] text-center">
              Why choose
            </Text>

            <Text className="mt-1 text-[32px] font-bold text-[#FC6C8C] text-center">
              MemiLennial?
            </Text>
          </View>

          {/* Features */}
          <View className="mt-8 gap-2">
            {FEATURES.map((item) => (
              <View key={item} className="flex-row items-center justify-center">
                <View className="w-2 h-2 rounded-full bg-gray-500 mr-3" />

                <Text className="text-base text-gray-500">{item}</Text>
              </View>
            ))}
          </View>

          <GradientButton
            label="Get Started"
            onPress={() => router.replace("/(auth)/choose-role")}
            style={{ marginTop: 40 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
