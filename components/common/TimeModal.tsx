import BottomSheetModal from "@/components/common/BottomSheetModal";
import ModalHeader from "@/components/common/ModalHeader";
import { COLORS } from "@/constants/colors";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GradientButton from "./GradientButton";
import { fetchTimeSlots, TimeSlot } from "./homeSearchApi";

interface TimeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (time: TimeSlot) => void;
  /** Selected date (ISO), used to fetch availability for that day */
  dateISO?: string | null;
}

export default function TimeModal({
  visible,
  onClose,
  onSelect,
  dateISO,
}: TimeModalProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    fetchTimeSlots(dateISO ?? "")
      .then(setSlots)
      .finally(() => setLoading(false));
  }, [visible, dateISO]);

  const handleConfirm = () => {
    const slot = slots.find((s) => s.id === selectedId);
    if (!slot) return;
    onSelect(slot);
    onClose();
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <ModalHeader title="Choose Time" onClose={onClose} />

      {loading ? (
        <View className="py-10 items-center">
          <ActivityIndicator color={COLORS.baseColor} />
        </View>
      ) : (
        <ScrollView
          style={{ maxHeight: 360 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap justify-between">
            {slots.map((slot) => {
              const isSelected = selectedId === slot.id;
              return (
                <TouchableOpacity
                  key={slot.id}
                  disabled={!slot.available}
                  onPress={() => setSelectedId(slot.id)}
                  activeOpacity={0.7}
                  className="rounded-2xl py-3 items-center justify-center mb-3"
                  style={{
                    width: "31%",
                    backgroundColor: isSelected ? COLORS.baseColor : "#F7F5F9",
                  }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color: !slot.available
                        ? "#C9C4CF"
                        : isSelected
                          ? "#FFFFFF"
                          : "#161119",
                    }}
                  >
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* <ConfirmButton
        label="Confirm"
        onPress={handleConfirm}
        disabled={!selectedId}
      /> */}
      <GradientButton
        label="Confirm"
        onPress={handleConfirm}
        disabled={!selectedId}
        style={{ marginTop: 20 }}
      />
    </BottomSheetModal>
  );
}
