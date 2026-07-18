import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import GradientButton from "./GradientButton";

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Keep Booking",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/40 items-center justify-center px-5">
        <View className="bg-white w-full rounded-[24px] p-5">
          {/* Icon */}
          <View className="items-center mb-4">
            <View
              className="w-14 h-14 rounded-full items-center justify-center"
              style={{
                backgroundColor: "#FDEDF1",
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={28}
                color={COLORS.baseColor}
              />
            </View>
          </View>

          {/* Title */}
          <Text className="text-lg font-extrabold text-center text-[#161119]">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-sm text-[#8A8590] text-center mt-2 leading-5">
            {message}
          </Text>

          {/* Buttons */}
          <View className="mt-6" style={{ gap: 12 }}>
            {/* <TouchableOpacity
              activeOpacity={0.85}
              onPress={onConfirm}
              className="rounded-full overflow-hidden"
            >
              <LinearGradient
                colors={[COLORS.baseColor1, COLORS.baseColor2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-[46px] items-center justify-center rounded-full"
              >
                <Text className="text-white font-bold text-sm">
                  {confirmText}
                </Text>
              </LinearGradient>
            </TouchableOpacity> */}
            <GradientButton
              label={confirmText}
              onPress={onConfirm}
              textSize={14}
              style={{ marginTop: 20, borderRadius: 100 }}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onCancel}
              className="h-[46px] rounded-full items-center justify-center border"
              style={{
                borderColor: COLORS.borderColor,
              }}
            >
              <Text
                className="font-bold text-sm"
                style={{
                  color: COLORS.baseColor,
                }}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
