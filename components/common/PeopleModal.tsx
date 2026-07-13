import BottomSheetModal from "@/components/common/BottomSheetModal";
import ModalHeader from "@/components/common/ModalHeader";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import GradientButton from "./GradientButton";
import { fetchPeopleConfig, PeopleConfig } from "./homeSearchApi";

interface PeopleModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (count: number) => void;
  initialCount?: number | null;
}

export default function PeopleModal({
  visible,
  onClose,
  onSelect,
  initialCount,
}: PeopleModalProps) {
  const [config, setConfig] = useState<PeopleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(initialCount ?? 1);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    fetchPeopleConfig()
      .then((cfg) => {
        setConfig(cfg);
        setCount(initialCount ?? cfg.default);
      })
      .finally(() => setLoading(false));
  }, [visible]);

  const dec = () => setCount((c) => Math.max(config?.min ?? 1, c - 1));
  const inc = () => setCount((c) => Math.min(config?.max ?? 10, c + 1));

  const handleConfirm = () => {
    onSelect(count);
    onClose();
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      maxHeightPercent={0.5}
    >
      <ModalHeader title="Number of People" onClose={onClose} />

      {loading ? (
        <View className="py-10 items-center">
          <ActivityIndicator color={COLORS.baseColor} />
        </View>
      ) : (
        <View className="items-center py-4">
          <Text className="text-sm text-[#8A8590] mb-5">
            How many people need services?
          </Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={dec}
              disabled={count <= (config?.min ?? 1)}
              className="w-11 h-11 rounded-full bg-[#F4F2F6] items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={18} color="#161119" />
            </TouchableOpacity>

            <Text className="text-3xl font-extrabold text-[#161119] mx-8">
              {count}
            </Text>

            <TouchableOpacity
              onPress={inc}
              disabled={count >= (config?.max ?? 10)}
              className="w-11 h-11 rounded-full items-center justify-center"
              style={{ backgroundColor: COLORS.baseColor }}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-[#B7B2BC] mt-3">
            {count === 1 ? "guest" : "guests"}
          </Text>
        </View>
      )}

      {/* <ConfirmButton label="Confirm" onPress={handleConfirm} /> */}
      <GradientButton
        label="Confirm"
        onPress={handleConfirm}
        style={{ marginTop: 20 }}
      />
    </BottomSheetModal>
  );
}
