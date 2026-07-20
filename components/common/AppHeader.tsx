import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type AppHeaderProps = {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
};

export default function AppHeader({
  title,
  showBack = true,
  onBackPress,
}: AppHeaderProps) {
  return (
    <View className="relative flex-row items-center px-5 pt-4 pb-3 mb-2 border-b border-[#F1EFF3]">
      {showBack ? (
        <TouchableOpacity
          onPress={onBackPress ?? (() => router.back())}
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 1,
          }}
        >
          <Ionicons name="chevron-back" size={18} color="#161119" />
        </TouchableOpacity>
      ) : (
        <View className="w-10 h-10" />
      )}

      {/* Absolute center title */}
      <View className="absolute left-0 right-0 items-center">
        <Text className="text-xl font-extrabold text-[#161119]">{title}</Text>
      </View>
    </View>
  );
}
