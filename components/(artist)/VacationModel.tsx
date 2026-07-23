import GradientActionButton from "@/components/common/GradientActionButton";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GradientSwitch } from "./SharedControls";
interface VacationConfig {
  enabled: boolean;
  startDate: string;
  endDate: string;
  message: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  initial: VacationConfig;
  onSave: (config: VacationConfig) => void;
}

interface VacationModeCardProps {
  vacationConfig: VacationConfig;
  onToggleEnabled: (v: boolean) => void;
  onOpenModal: () => void;
}

export default function VacationModel({
  visible,
  onClose,
  initial,
  onSave,
}: Props) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [startDate, setStartDate] = useState(initial.startDate);
  const [endDate, setEndDate] = useState(initial.endDate);
  const [message, setMessage] = useState(initial.message);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [startDateObj, setStartDateObj] = useState(new Date());
  const [endDateObj, setEndDateObj] = useState(new Date());
  useEffect(() => {
    if (visible) {
      setEnabled(initial.enabled);
      setStartDate(initial.startDate);
      setEndDate(initial.endDate);
      setMessage(initial.message);
    }
  }, [visible, initial]);

  // Live preview — updates as the artist types, so it "feels" real before saving.
  const previewRange =
    startDate && endDate ? `${startDate} – ${endDate}` : "Select your dates";
  const previewMessage = message || "Taking a break. Back soon! ✨";
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
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

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: 30,
            }}
          >
            <View className="flex-row items-center justify-between pb-4 mb-4 border-b border-[#F1E4E8]">
              <Text className="text-[19px] font-extrabold text-[#161119]">
                Vacation Mode
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-[#F1EEF1] items-center justify-center"
                hitSlop={8}
              >
                <Ionicons name="close" size={16} color="#8A8590" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between rounded-2xl bg-[#F7F5F7] px-4 py-4 mb-5">
              <View className="flex-1 pr-3">
                <Text className="text-[14px] font-bold text-[#161119]">
                  Vacation Mode
                </Text>
                <Text className="text-xs text-[#8A8590] mt-0.5">
                  Hide profile from new clients
                </Text>
              </View>
              <GradientSwitch value={enabled} onValueChange={setEnabled} />
            </View>

            <View className="flex-row mb-4" style={{ gap: 12 }}>
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-[#161119] mb-2">
                  Start Date
                </Text>

                <TouchableOpacity
                  onPress={() => setShowStartPicker(true)}
                  className="rounded-[14px] border border-[#ECECEC] bg-white px-4 py-3.5"
                >
                  <Text
                    className={`text-[14px] ${
                      startDate ? "text-[#161119]" : "text-[#B7B2BC]"
                    }`}
                  >
                    {startDate || "Select date"}
                  </Text>
                </TouchableOpacity>

                {showStartPicker && (
                  <DateTimePicker
                    value={startDateObj}
                    mode="date"
                    minimumDate={new Date()}
                    onChange={(event, date) => {
                      setShowStartPicker(false);

                      if (date) {
                        setStartDateObj(date);
                        setStartDate(formatDate(date));
                      }
                    }}
                  />
                )}
              </View>

              {showStartPicker && (
                <DateTimePicker
                  value={startDateObj}
                  mode="date"
                  minimumDate={new Date()}
                  onChange={(event, date) => {
                    setShowStartPicker(false);

                    if (date) {
                      setStartDateObj(date);
                      setStartDate(formatDate(date));
                    }
                  }}
                />
              )}
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-[#161119] mb-2">
                  End Date
                </Text>
                {/* <TextInput
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="Sat, Jul 25"
                  placeholderTextColor="#B7B2BC"
                  className="rounded-[14px] border border-[#ECECEC] bg-white px-4 py-3.5 text-[14px] text-[#161119]"
                /> */}
                <TouchableOpacity
                  onPress={() => setShowEndPicker(true)}
                  className="rounded-[14px] border border-[#ECECEC] bg-white px-4 py-3.5"
                >
                  <Text
                    className={`text-[14px] ${
                      endDate ? "text-[#161119]" : "text-[#B7B2BC]"
                    }`}
                  >
                    {endDate || "Select date"}
                  </Text>
                </TouchableOpacity>

                {showEndPicker && (
                  <DateTimePicker
                    value={endDateObj}
                    mode="date"
                    minimumDate={startDateObj}
                    onChange={(event, date) => {
                      setShowEndPicker(false);

                      if (date) {
                        setEndDateObj(date);
                        setEndDate(formatDate(date));
                      }
                    }}
                  />
                )}
              </View>
            </View>

            <Text className="text-[14px] font-bold text-[#161119] mb-2">
              Vacation Message
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Let clients know you are away..."
              placeholderTextColor="#B7B2BC"
              multiline
              textAlignVertical="top"
              className="rounded-[14px] border border-[#ECECEC] bg-white px-4 py-3.5 text-[14px] text-[#161119] mb-5"
              style={{ minHeight: 90 }}
            />

            <View className="rounded-2xl bg-emerald-50 px-4 py-3 mb-6">
              <Text className="text-[10px] font-bold tracking-wider text-emerald-500 mb-1.5">
                PREVIEW
              </Text>
              <Text className="text-[14px] font-bold text-[#161119]">
                ☂️ Away: {previewRange}
              </Text>
              <Text className="mt-1 text-[13px] text-[#4B5563]">
                {previewMessage}
              </Text>
            </View>

            <GradientActionButton
              title="Save Vacation"
              onPress={() => onSave({ enabled, startDate, endDate, message })}
              height={45}
              textSize="14"
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
