import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import GradientActionButton from "../common/GradientActionButton";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function LogoutModal({ visible, onCancel, onConfirm }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View className="flex-1 bg-black/50 items-center justify-center px-5">
          <TouchableWithoutFeedback>
            <View
              className="bg-white w-full rounded-[24px] px-5 py-6"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 15,
                elevation: 10,
              }}
            >
              {/* Icon */}
              <View className="items-center">
                <View className="w-16 h-16 rounded-full bg-[#FFF3E0] items-center justify-center">
                  <Ionicons name="log-out-outline" size={30} color="#E17100" />
                </View>
              </View>

              {/* Title */}
              <Text className="text-lg font-extrabold text-[#161119] text-center mt-5">
                Logout?
              </Text>

              <Text className="text-sm text-[#8A8590] text-center mt-2 leading-5">
                Are you sure you want to logout?
              </Text>

              {/* Buttons */}
              <View className="flex-row mt-6 gap-3">
                {/* Cancel */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onCancel}
                  className="flex-1 h-12 border rounded-full bg-[#F7F4F8] items-center justify-center"
                >
                  <Text className="text-sm font-bold text-[#161119]">
                    Cancel
                  </Text>
                </TouchableOpacity>

                {/* Logout */}
                <View className="flex-1">
                  <GradientActionButton
                    title="Logout"
                    onPress={() => {
                      onConfirm();
                    }}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
