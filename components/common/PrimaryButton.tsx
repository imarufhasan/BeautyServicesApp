import { COLORS } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity } from "react-native";

export function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-1 overflow-hidden rounded-full"
    >
      <LinearGradient
        colors={[COLORS.baseColor1, COLORS.baseColor2]}
        style={{
          borderRadius: 999,
        }}
        className="items-center py-2.5"
      >
        <Text className="text-xs font-semibold text-white">{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
