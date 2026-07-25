import AppHeader from "@/components/common/AppHeader";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DECLINE_REASONS = [
  "Schedule Conflict",
  "Outside Service Area",
  "Personal Emergency",
  "Not Comfortable With Request",
  "Other",
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Text
    className="text-[11px] font-extrabold tracking-wide"
    style={{ color: "#F0924A" }}
  >
    {children}
  </Text>
);

export default function DeclineBookingScreen() {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const params = useLocalSearchParams<{
    bookingId?: string;
    clientName?: string;
    bookingDate?: string;
    bookingTime?: string;
    serviceName?: string;
  }>();

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const canSubmit = !!selectedReason;

  const handleSubmit = () => {
    // if (!canSubmit) return;

    setShowDeclineModal(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]">
      {/* Header */}
      {/* <View className="flex-row items-center px-5 pt-4 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3 shadow"
        >
          <Ionicons name="chevron-back" size={18} color="#111827" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Decline Booking</Text>
      </View> */}
      <AppHeader title="Decline Booking" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {/* Current booking card */}
        <View className="rounded-3xl border-[1px] border-gray-100 bg-white p-5 mt-1">
          <SectionLabel>BOOKING REQUEST</SectionLabel>

          <View className="flex-row flex-wrap mt-3" style={{ gap: 10 }}>
            <View
              className="rounded-2xl p-3"
              style={{ backgroundColor: "#FFF3EA", width: "47%" }}
            >
              <View className="flex-row items-center mb-1">
                <Ionicons name="calendar-outline" size={12} color="#F0924A" />
                <Text
                  className="text-[10px] font-bold ml-1"
                  style={{ color: "#F0924A" }}
                >
                  Date
                </Text>
              </View>
              <Text className="text-sm font-bold text-gray-900">
                {params.bookingDate ?? "Today, Jul 2"}
              </Text>
            </View>

            <View
              className="rounded-2xl p-3"
              style={{ backgroundColor: "#FFF3EA", width: "47%" }}
            >
              <View className="flex-row items-center mb-1">
                <Ionicons name="time-outline" size={12} color="#F0924A" />
                <Text
                  className="text-[10px] font-bold ml-1"
                  style={{ color: "#F0924A" }}
                >
                  Time
                </Text>
              </View>
              <Text className="text-sm font-bold text-gray-900">
                {params.bookingTime ?? "2:00 PM"}
              </Text>
            </View>

            <View
              className="rounded-2xl p-3"
              style={{ backgroundColor: "#FFF3EA", width: "47%" }}
            >
              <View className="flex-row items-center mb-1">
                <Ionicons name="star-outline" size={12} color="#F0924A" />
                <Text
                  className="text-[10px] font-bold ml-1"
                  style={{ color: "#F0924A" }}
                >
                  Service
                </Text>
              </View>
              <Text className="text-sm font-bold text-gray-900">
                {params.serviceName ?? "Full Glam Makeup"}
              </Text>
            </View>

            <View
              className="rounded-2xl p-3"
              style={{ backgroundColor: "#FFF3EA", width: "47%" }}
            >
              <View className="flex-row items-center mb-1">
                <Ionicons name="person-outline" size={12} color="#F0924A" />
                <Text
                  className="text-[10px] font-bold ml-1"
                  style={{ color: "#F0924A" }}
                >
                  Client
                </Text>
              </View>
              <Text className="text-sm font-bold text-gray-900">
                {params.clientName ?? "Sophia Williams"}
              </Text>
            </View>
          </View>
        </View>

        {/* Reason for decline */}
        <View className="rounded-3xl border-[1px] border-gray-100 bg-white p-5 mt-4">
          <SectionLabel>REASON FOR DECLINE</SectionLabel>

          <View className="flex-row flex-wrap mt-3" style={{ gap: 8 }}>
            {DECLINE_REASONS.map((reason) => {
              const isSelected = selectedReason === reason;
              return (
                <TouchableOpacity
                  key={reason}
                  activeOpacity={0.85}
                  onPress={() => setSelectedReason(reason)}
                  style={{ borderRadius: 100, overflow: "hidden" }}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={[COLORS.baseColor1, COLORS.baseColor2]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ paddingVertical: 9, paddingHorizontal: 14 }}
                    >
                      <Text className="text-xs font-bold text-white">
                        {reason}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View
                      style={{
                        paddingVertical: 9,
                        paddingHorizontal: 14,
                        backgroundColor: "#F5F5F5",
                      }}
                    >
                      <Text className="text-xs font-bold text-gray-600">
                        {reason}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Message to client */}
        <View className="rounded-3xl border-[1px] border-gray-100 bg-white p-5 mt-4">
          <SectionLabel>MESSAGE TO CLIENT (OPTIONAL)</SectionLabel>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Let them know a bit more, if you'd like..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="text-sm text-gray-900 mt-3"
            style={{
              backgroundColor: "#F5F5F5",
              borderRadius: 14,
              paddingVertical: 12,
              paddingHorizontal: 14,
              minHeight: 100,
            }}
          />
        </View>

        {/* Helper text */}
        <Text className="text-xs text-gray-400 text-center mt-5">
          {canSubmit
            ? "You're all set — this will notify the client."
            : "Select a reason to continue"}
        </Text>

        {/* Submit button */}
        <TouchableOpacity
          activeOpacity={canSubmit ? 0.85 : 1}
          onPress={handleSubmit}
          disabled={!canSubmit}
          className="rounded-full overflow-hidden mt-3"
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center rounded-full"
            style={{ opacity: canSubmit ? 1 : 0.45 }}
          >
            <Text className="text-white text-base font-bold">Send Decline</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showDeclineModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeclineModal(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/30 px-5">
          <View className="w-full rounded-[28px] bg-white px-6 py-7">
            {/* Drag handle removed for center modal */}

            {/* Icon */}
            <View className="items-center mb-5">
              <LinearGradient
                colors={[COLORS.baseColor1, COLORS.baseColor2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#F0924A",
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  elevation: 4,
                }}
              >
                <Ionicons name="close-circle" size={32} color="#fff" />
              </LinearGradient>
            </View>

            <Text className="text-xl font-bold text-gray-900 text-center">
              Booking Declined
            </Text>

            <Text className="text-sm text-gray-400 text-center mt-2 leading-5 px-4">
              {params.clientName || "The client"} will be notified that this
              booking request was declined.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setShowDeclineModal(false);
                router.replace("/(artist)/(tabs)/availability");
              }}
              className="rounded-full overflow-hidden mt-7"
            >
              <LinearGradient
                colors={[COLORS.baseColor1, COLORS.baseColor2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 items-center rounded-full"
              >
                <Text className="text-white text-base font-bold">
                  Back to Dashboard
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
