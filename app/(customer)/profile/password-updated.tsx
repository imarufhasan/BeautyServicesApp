import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PasswordUpdatedScreen() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#FFF9F9" }}>
      <View className="flex-1 items-center justify-center px-8">
        <LinearGradient
          colors={["#FF6FB4", "#FFA36C"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="checkmark" size={40} color="#fff" />
        </LinearGradient>

        <Text className="text-xl font-extrabold text-[#161119] mt-6">
          Password Updated!
        </Text>
        <Text className="text-sm text-[#8A8590] text-center mt-2 leading-5">
          Your password has been successfully updated.{"\n"}Your account is now
          secure.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/home")}
          className="w-full rounded-full items-center py-4 mt-8 border"
          style={{ borderColor: "#EFEAF3", backgroundColor: "#fff" }}
        >
          <Text className="text-sm font-bold" style={{ color: "#B57EDC" }}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
