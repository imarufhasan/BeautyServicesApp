import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ModalHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <Text className="text-lg font-extrabold text-[#161119]">{title}</Text>
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.7}
        className="w-8 h-8 rounded-full bg-[#F4F2F6] items-center justify-center"
      >
        <Ionicons name="close" size={16} color="#6B6570" />
      </TouchableOpacity>
    </View>
  );
}
