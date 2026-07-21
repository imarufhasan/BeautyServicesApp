import GradientActionButton from "@/components/common/GradientActionButton";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

export type BlockReason =
  "Holiday" | "Personal Work" | "Medical Leave" | "Private Event" | "Other";

export interface BlockDateInput {
  date: string;
  reason: BlockReason;
  notes: string;
}

const REASONS: BlockReason[] = [
  "Holiday",
  "Personal Work",
  "Medical Leave",
  "Private Event",
  "Other",
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: BlockDateInput) => void;
}

export default function BlockDateModal({ visible, onClose, onSave }: Props) {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState<BlockReason>("Holiday");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (visible) {
      setDate("");
      setReason("Holiday");
      setNotes("");
    }
  }, [visible]);

  const canSave = date.trim().length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-[24px] bg-[#FFF6F8] pt-3 px-5 pb-8">
          <View className="self-center w-10 h-1 rounded-full bg-[#E3E0E6] mb-3" />

          <View className="flex-row items-center justify-between pb-4 mb-4 border-b border-[#F1E4E8]">
            <Text className="text-[19px] font-extrabold text-[#161119]">
              Block a Date
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-[#F1EEF1] items-center justify-center"
              hitSlop={8}
            >
              <Ionicons name="close" size={16} color="#8A8590" />
            </TouchableOpacity>
          </View>

          <Text className="text-[14px] font-bold text-[#161119] mb-2">
            Select Date
          </Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="e.g. Fri, Jul 10"
            placeholderTextColor="#B7B2BC"
            className="rounded-[14px] border border-[#ECECEC] bg-white px-4 py-3.5 text-[14px] text-[#161119] mb-5"
          />

          <Text className="text-[14px] font-bold text-[#161119] mb-3">
            Reason
          </Text>
          <View className="mb-5" style={{ gap: 10 }}>
            {REASONS.map((r) => {
              const active = r === reason;
              return (
                <TouchableOpacity
                  key={r}
                  onPress={() => setReason(r)}
                  className={`flex-row items-center rounded-2xl border px-4 py-3.5 ${
                    active
                      ? "border-orange-300 bg-orange-50"
                      : "border-transparent bg-[#F7F5F7]"
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                      active ? "border-orange-400" : "border-[#D9D5DE]"
                    }`}
                  >
                    {active && (
                      <View className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                    )}
                  </View>
                  <Text
                    className={`text-[14px] font-medium ${active ? "text-orange-600" : "text-[#161119]"}`}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text className="text-[14px] font-bold text-[#161119] mb-2">
            Notes <Text className="text-[#B7B2BC] font-normal">(optional)</Text>
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes..."
            placeholderTextColor="#B7B2BC"
            multiline
            textAlignVertical="top"
            className="rounded-[14px] border border-[#ECECEC] bg-white px-4 py-3.5 text-[14px] text-[#161119] mb-6"
            style={{ minHeight: 90 }}
          />

          <View
            style={{ opacity: canSave ? 1 : 0.5 }}
            pointerEvents={canSave ? "auto" : "none"}
          >
            <GradientActionButton
              title="Save Block Date"
              onPress={() => onSave({ date, reason, notes })}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
