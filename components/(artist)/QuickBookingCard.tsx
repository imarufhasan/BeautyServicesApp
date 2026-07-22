import { QuickBookingConfig } from "@/components/(artist)/QuickBookingModal";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GradientSwitch, InfoRow } from "./SharedControls";

interface QuickBookingCardProps {
  quickBookingConfig: QuickBookingConfig;
  onToggleEnabled: (v: boolean) => void;
  onOpenModal: () => void;
}

export default function QuickBookingCard({
  quickBookingConfig,
  onToggleEnabled,
  onOpenModal,
}: QuickBookingCardProps) {
  return (
    <View
      className="rounded-3xl bg-white p-4 shadow-sm mb-5"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-base font-bold text-gray-900">
            Quick Booking
          </Text>
          <Text className="text-xs text-gray-400">
            Auto-confirm client bookings
          </Text>
        </View>
        <GradientSwitch
          value={quickBookingConfig.enabled}
          onValueChange={onToggleEnabled}
        />
      </View>
      <View className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3">
        <Text className="text-[13px] text-emerald-700">
          Clients can Quickly confirm bookings without manual approval from you.
        </Text>
      </View>
      <View className="mt-3">
        <InfoRow
          label="Minimum Notice"
          value={`${quickBookingConfig.minimumNoticeHours}h`}
        />
        <InfoRow
          label="Booking Buffer"
          value={`${quickBookingConfig.bookingBufferMinutes} min`}
        />
        <InfoRow
          label="Max / Day"
          value={`${quickBookingConfig.maxPerDay} bookings`}
        />
      </View>
      <TouchableOpacity onPress={onOpenModal} className="mt-2 items-center">
        <Text className="text-sm font-semibold text-rose-400">
          ✎ Edit Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
}
