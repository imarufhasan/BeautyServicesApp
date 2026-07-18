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
    // <View className="flex-row items-center justify-between px-5 py-3">
    //   {showBack ? (
    //     <TouchableOpacity
    //       onPress={onBackPress ?? (() => router.back())}
    //       className="w-12 h-12 rounded-full bg-white items-center justify-center"
    //       style={{
    //         shadowColor: COLORS.baseColor,
    //         shadowOpacity: 0.06,
    //         shadowRadius: 6,
    //         elevation: 1,
    //       }}
    //     >
    //       <Ionicons name="chevron-back" size={20} color="#161119" />
    //     </TouchableOpacity>
    //   ) : (
    //     <View className="w-12 h-12" />
    //   )}

    //   <Text className="text-xl mx-2 flex-1 font-extrabold text-[#161119]">
    //     {title}
    //   </Text>

    //   <View className="w-9 h-9" />
    // </View>

    <View className="flex-row items-center px-5 pt-4 pb-3 mb-2 border-b border-[#F1EFF3]">
      {showBack ? (
        <TouchableOpacity
          onPress={onBackPress ?? (() => router.back())}
          className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3"
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
        <View className="w-12 h-12" />
      )}
      <Text className="text-xl font-extrabold text-[#161119]">{title}</Text>
    </View>
  );
}
