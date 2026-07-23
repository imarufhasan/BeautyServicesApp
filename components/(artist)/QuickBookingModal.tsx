import GradientActionButton from "@/components/common/GradientActionButton";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { GradientSwitch } from "./SharedControls";

export interface QuickBookingConfig {
  enabled: boolean;
  minimumNoticeHours: number;
  bookingBufferMinutes: number;
  maxPerDay: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  initial: QuickBookingConfig;
  onSave: (config: QuickBookingConfig) => void;
}

const Stepper = ({
  label,
  value,
  unit,
  onDecrement,
  onIncrement,
}: {
  label: string;
  value: number;
  unit: string;
  onDecrement: () => void;
  onIncrement: () => void;
}) => (
  <View className="mb-5">
    <Text className="text-[14px] font-bold text-[#161119] mb-2">{label}</Text>

    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        onPress={onDecrement}
        className="w-10 h-10 rounded-full bg-[#F1EEF1] items-center justify-center"
      >
        <Ionicons name="remove" size={18} color="#8A8590" />
      </TouchableOpacity>

      <View className="flex-row items-baseline">
        <Text className="text-[20px] font-extrabold text-[#161119]">
          {value}
        </Text>

        <Text className="ml-1 text-[13px] text-[#8A8590]">{unit}</Text>
      </View>

      <TouchableOpacity
        onPress={onIncrement}
        className="w-10 h-10 rounded-full bg-[#F1EEF1] items-center justify-center"
      >
        <Ionicons name="add" size={18} color="#8A8590" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function QuickBookingModal({
  visible,
  onClose,
  initial,
  onSave,
}: Props) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [minimumNoticeHours, setMinimumNoticeHours] = useState(
    initial.minimumNoticeHours,
  );
  const [bookingBufferMinutes, setBookingBufferMinutes] = useState(
    initial.bookingBufferMinutes,
  );
  const [maxPerDay, setMaxPerDay] = useState(initial.maxPerDay);

  useEffect(() => {
    if (visible) {
      setEnabled(initial.enabled);
      setMinimumNoticeHours(initial.minimumNoticeHours);
      setBookingBufferMinutes(initial.bookingBufferMinutes);
      setMaxPerDay(initial.maxPerDay);
    }
  }, [visible, initial]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[90%] rounded-t-[24px] bg-[#FFF6F8] px-5 pt-3">
          <View className="self-center w-10 h-1 rounded-full bg-[#E3E0E6] mb-3" />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 40,
            }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between pb-4 mb-4 border-b border-[#F1E4E8]">
              <Text className="text-[19px] font-extrabold text-[#161119]">
                Quick Booking
              </Text>

              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-[#F1EEF1] items-center justify-center"
              >
                <Ionicons name="close" size={16} color="#8A8590" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between rounded-2xl bg-[#FDEFF3] px-4 py-4 mb-4">
              <View className="flex-1 pr-3">
                <Text className="text-[14px] font-bold text-[#161119]">
                  Enable Quick Booking
                </Text>

                <Text className="text-xs text-[#8A8590] mt-0.5">
                  Clients book without your approval
                </Text>
              </View>

              <GradientSwitch value={enabled} onValueChange={setEnabled} />
            </View>

            <View className="rounded-2xl bg-emerald-50 px-4 py-3 mb-5">
              <Text className="text-[13px] leading-5 text-emerald-700">
                Clients can instantly confirm bookings without manual approval.
              </Text>
            </View>

            <Stepper
              label="Minimum Notice"
              value={minimumNoticeHours}
              unit="hours"
              onDecrement={() =>
                setMinimumNoticeHours((v) => Math.max(0, v - 1))
              }
              onIncrement={() => setMinimumNoticeHours((v) => v + 1)}
            />

            <Stepper
              label="Booking Buffer"
              value={bookingBufferMinutes}
              unit="minutes"
              onDecrement={() =>
                setBookingBufferMinutes((v) => Math.max(0, v - 5))
              }
              onIncrement={() => setBookingBufferMinutes((v) => v + 5)}
            />

            <Stepper
              label="Max Bookings / Day"
              value={maxPerDay}
              unit="slots"
              onDecrement={() => setMaxPerDay((v) => Math.max(1, v - 1))}
              onIncrement={() => setMaxPerDay((v) => v + 1)}
            />

            {/* Fixed Button */}
            <View className="pb-8 pt-3">
              <GradientActionButton
                title="Save Settings"
                height={45}
                textSize="14"
                onPress={() =>
                  onSave({
                    enabled,
                    minimumNoticeHours,
                    bookingBufferMinutes,
                    maxPerDay,
                  })
                }
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
