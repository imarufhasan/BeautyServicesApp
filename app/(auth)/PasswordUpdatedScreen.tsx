import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PasswordUpdatedScreen() {
  const handleGoToLogin = () => {
    router.push("/(auth)/LoginScreen");
  };

  const handleBackToHome = () => {
    router.push("/(customer)/(tabs)/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8F9]" edges={["top"]}>
      <View className="flex-1 items-center justify-center px-8">
        <LinearGradient
          colors={[COLORS.baseColor1, COLORS.baseColor2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: COLORS.baseColor1,
            shadowOpacity: 0.35,
            shadowRadius: 20,
            elevation: 6,
          }}
        >
          <Ionicons name="checkmark" size={44} color="#fff" />
        </LinearGradient>

        <Text className="text-xl font-extrabold text-[#161119] mt-6">
          Password Updated!
        </Text>
        <Text className="text-xs text-[#8A8590] text-center mt-2 leading-5">
          Your password has been successfully updated.{"\n"}Your account is now
          secure.
        </Text>

        <View className="w-full mt-8">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleGoToLogin}
            className="rounded-full overflow-hidden"
          >
            <LinearGradient
              colors={[COLORS.baseColor1, COLORS.baseColor2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 items-center rounded-full"
            >
              <Text className="text-white text-base font-extrabold">
                Go to Login
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleBackToHome}
            className="items-center justify-center rounded-full py-4 mt-3 border bg-white"
            style={{ borderColor: "#EFEAF3" }}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: COLORS.baseColor }}
            >
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
