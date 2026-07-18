import { COLORS } from "@/constants/colors";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";

export default function SplashScreen() {
  useFocusEffect(() => {
    const timer = setTimeout(() => {
      router.push("/(auth)/welcome");
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <View className="flex-1 bg-[#FFF8FA] items-center justify-center">
      <StatusBar style="dark" />

      {/* Logo Icon */}
      <View className=" rounded-[200px] items-center justify-center">
        <Image
          source={require("@/assets/images/app_icon.png")}
          className="w-64 h-64"
          resizeMode="contain"
        />
      </View>

      {/* Brand */}
      <View className="flex-row items-center">
        <Text
          style={{ color: COLORS.textColor1, fontSize: 32, fontWeight: "bold" }}
        >
          me
        </Text>

        <Text
          style={{ color: COLORS.textColor2, fontSize: 32, fontWeight: "bold" }}
        >
          millennial
        </Text>
      </View>

      {/* Tagline */}
      <Text className="mt-3 text-[11px] tracking-[3px] text-[#9B9BA8]">
        YOUR BEAUTY, YOUR WAY
      </Text>

      {/* Bottom Pagination */}
      <View className="absolute bottom-20 flex-row gap-2">
        <View className="w-2 h-2 rounded-full bg-pink-200" />
        <View className="w-2 h-2 rounded-full bg-pink-300" />
        <View className="w-2 h-2 rounded-full bg-pink-400" />
      </View>
    </View>
  );
}
