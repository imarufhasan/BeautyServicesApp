import GradientActionButton from "@/components/common/GradientActionButton";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export type BlockReason =
  "Holiday" | "Personal Work" | "Medical Leave" | "Private Event" | "Other";

export interface BlockDateInput {
  id?: string;
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

const formatDateLabel = (d: Date): string =>
  d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: BlockDateInput) => void;
  /** Pass an existing blocked date to open the modal in edit mode */
  initial?: BlockDateInput | null;
}

export default function BlockDateModal({
  visible,
  onClose,
  onSave,
  initial,
}: Props) {
  const isEditMode = !!initial?.id;

  const [id, setId] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateLabel, setDateLabel] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reason, setReason] = useState<BlockReason>("Holiday");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (visible) {
      if (initial) {
        setId(initial.id);
        setDateLabel(initial.date);
        setReason(initial.reason);
        setNotes(initial.notes);

        const parsedDate = new Date(initial.date);
        if (!isNaN(parsedDate.getTime())) {
          setSelectedDate(parsedDate);
        }
      } else {
        setId(undefined);
        setDateLabel("");
        setReason("Holiday");
        setNotes("");
        setSelectedDate(new Date());
      }
    }
  }, [visible, initial]);

  const handleDateChange = (event: any, picked?: Date) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    if (picked) {
      setSelectedDate(picked);
      setDateLabel(formatDateLabel(picked));
    }
    if (event.type === "set") {
      setShowDatePicker(false);
    }
  };

  const canSave = dateLabel.trim().length > 0;

  const handleSave = () => {
    onSave({ id, date: dateLabel, reason, notes });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View
            className="rounded-t-[24px] bg-[#FFF6F8] pt-3 px-5 pb-6"
            style={{ maxHeight: "92%" }}
          >
            <View className="self-center w-10 h-1 rounded-full bg-[#E3E0E6] mb-3" />

            <View className="flex-row items-center justify-between pb-4 mb-4 border-b border-[#F1E4E8]">
              <Text className="text-[19px] font-extrabold text-[#161119]">
                {isEditMode ? "Edit Blocked Date" : "Block a Date"}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-[#F1EEF1] items-center justify-center"
                hitSlop={8}
              >
                <Ionicons name="close" size={16} color="#8A8590" />
              </TouchableOpacity>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 100,
              }}
            >
              <Text className="text-[14px] font-bold text-[#161119] mb-2">
                Select Date
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowDatePicker(true)}
                className="rounded-[14px] border border-[#ECECEC] bg-white px-4 py-3.5 mb-5"
              >
                <Text
                  style={{ color: dateLabel ? "#161119" : "#B7B2BC" }}
                  className="text-[14px]"
                >
                  {dateLabel || "e.g. Fri, Jul 10"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}

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
                Notes{" "}
                <Text className="text-[#B7B2BC] font-normal">(optional)</Text>
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
                  title={isEditMode ? "Update Blocked Date" : "Save Block Date"}
                  onPress={handleSave}
                  height={45}
                  textSize={"14"}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
