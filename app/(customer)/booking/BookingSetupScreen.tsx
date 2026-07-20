import AppHeader from "@/components/common/AppHeader";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type BookingService = {
  id: string;
  name: string;
  price: number;
};

export type VisitType = "home_visit" | "home_studio";
export type BookingMode = "quick" | "request";

export type BookingSetupParams = {
  artistId: string;
  artistName: string;
  services: BookingService[]; // pre-selected services coming from the profile screen
  dateLabel: string; // e.g. "July 8, 2026"
  timeLabel: string; // e.g. "10:30 AM"
};

// ---------------------------------------------------------------------------
// Dummy/default data — used only when this screen is opened standalone
// (e.g. previewing in isolation). Real usage should always pass `params`.
// ---------------------------------------------------------------------------
const DUMMY_PARAMS: BookingSetupParams = {
  artistId: "1",
  artistName: "Sophia Laurent",
  services: [{ id: "s1", name: "Bridal Makeup", price: 380 }],
  dateLabel: "July 8, 2026",
  timeLabel: "10:30 AM",
};

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-base font-extrabold text-[#161119] mb-3">
    {children}
  </Text>
);

const SummaryRow = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <View className="flex-row items-center justify-between py-2">
    <Text
      className={
        bold
          ? "text-sm font-extrabold text-[#161119]"
          : "text-xs text-[#8A8590]"
      }
    >
      {label}
    </Text>
    <Text
      className={
        bold
          ? "text-base font-extrabold text-[#161119]"
          : "text-xs font-bold text-[#161119]"
      }
    >
      {value}
    </Text>
  </View>
);

const Divider = () => (
  <View className="h-[1px] bg-[#F0DEE3]" style={{ marginVertical: 4 }} />
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function BookingSetupScreen({
  params = DUMMY_PARAMS,
}: {
  params?: BookingSetupParams;
}) {
  const [selectedServices, setSelectedServices] = useState<BookingService[]>(
    params.services,
  );
  const [visitType, setVisitType] = useState<VisitType>("home_visit");
  const [notes, setNotes] = useState("");
  const [bookingMode, setBookingMode] = useState<BookingMode>("quick");

  const total = useMemo(
    () => selectedServices.reduce((sum, s) => sum + s.price, 0),
    [selectedServices],
  );

  const handleRemoveService = (id: string) => {
    setSelectedServices((prev) => prev.filter((s) => s.id !== id));
  };

  const visitTypeLabel =
    visitType === "home_visit" ? "Home Visit" : "Home Studio";
  const bookingModeLabel = bookingMode === "quick" ? "Instant" : "Request";

  const handleConfirmBooking = () => {
    router.push({
      pathname: "/booking/checkout",
      params: {
        artistId: params.artistId,
        artistName: params.artistName,
        serviceTags: JSON.stringify(selectedServices.map((s) => s.name)),
        visitType: visitTypeLabel,
        dateLabel: params.dateLabel,
        timeLabel: params.timeLabel,
        durationLabel: "3 hours", // TODO: replace with real duration from selected service
        subtotal: String(total),
        travelFee: "25", // TODO: replace with real travel fee from artist profile
      },
    });
  };

  const handleSaveDraft = () => {
    // TODO: persist draft locally or via API
  };

  return (
    <SafeAreaView className="flex-1 mb-10 bg-[#FBF9FC]" edges={["top"]}>
      {/* Header */}
      <AppHeader title="Booking Setup" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Selected Services */}
        <View className="px-5 mt-2">
          <SectionTitle>Selected Services</SectionTitle>
          <View className="flex-row flex-wrap">
            {selectedServices.length === 0 && (
              <Text className="text-xs text-[#8A8590]">
                No services selected.
              </Text>
            )}
            {selectedServices.map((service) => (
              <View
                key={service.id}
                className="flex-row items-center bg-[#F4E4FF] rounded-full pl-4 pr-2 py-2 mr-2 mb-2"
              >
                <Text
                  className="text-sm font-extrabold mr-1.5"
                  style={{ color: "#B57EDC" }}
                >
                  {service.name}
                </Text>
                <Text className="text-sm text-[#8A8590] mr-2">
                  ${service.price}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveService(service.id)}
                  className="w-5 h-5 items-center justify-center"
                >
                  <Ionicons name="close" size={14} color="#B57EDC" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Visit Type */}
        <View className="px-5 mt-5">
          <SectionTitle>Visit Type</SectionTitle>
          <View className="flex-row" style={{ gap: 12 }}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setVisitType("home_visit")}
              className="flex-1 items-center justify-center rounded-[16px] py-5 border"
              style={{
                backgroundColor:
                  visitType === "home_visit" ? "#F4E4FF" : "#fff",
                borderColor: visitType === "home_visit" ? "#D9AEF0" : "#EFEAF3",
                borderWidth: visitType === "home_visit" ? 1.5 : 1,
              }}
            >
              <Ionicons
                name="home-outline"
                size={22}
                color={visitType === "home_visit" ? "#B57EDC" : "#8A8590"}
              />
              <Text
                className="text-sm font-bold mt-2"
                style={{
                  color: visitType === "home_visit" ? "#B57EDC" : "#8A8590",
                }}
              >
                Home Visit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setVisitType("home_studio")}
              className="flex-1 items-center justify-center rounded-[16px] py-5 border"
              style={{
                backgroundColor:
                  visitType === "home_studio" ? "#F4E4FF" : "#fff",
                borderColor:
                  visitType === "home_studio" ? "#D9AEF0" : "#EFEAF3",
                borderWidth: visitType === "home_studio" ? 1.5 : 1,
              }}
            >
              <Ionicons
                name="easel-outline"
                size={22}
                color={visitType === "home_studio" ? "#B57EDC" : "#8A8590"}
              />
              <Text
                className="text-sm font-bold mt-2"
                style={{
                  color: visitType === "home_studio" ? "#B57EDC" : "#8A8590",
                }}
              >
                Home Studio
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Special Notes */}
        <View className="px-5 mt-5">
          <SectionTitle>Special Notes</SectionTitle>
          <View
            className="bg-white rounded-[16px] border"
            style={{ borderColor: "#EFEAF3" }}
          >
            <TextInput
              value={notes}
              onChangeText={(text) => setNotes(text.slice(0, 300))}
              placeholder={
                "e.g. Bridal event on July 12 — prefer natural glam with long-wear finish. Sensitive skin, please avoid heavy fragrance."
              }
              placeholderTextColor="#C7C1CD"
              multiline
              maxLength={300}
              className="text-xs text-[#161119] px-4 pt-4"
              style={{ minHeight: 100, textAlignVertical: "top" }}
            />
            <Text className="text-[10px] text-[#B0AAB6] text-right px-4 pb-3">
              {notes.length}/300
            </Text>
          </View>
        </View>

        {/* Booking Mode */}
        <View className="px-5 mt-5">
          <SectionTitle>Booking Mode</SectionTitle>
          <View className="flex-row" style={{ gap: 12 }}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setBookingMode("quick")}
              className="flex-1 rounded-[16px] p-4 border"
              style={{
                backgroundColor: bookingMode === "quick" ? "#F4E4FF" : "#fff",
                borderColor: bookingMode === "quick" ? "#D9AEF0" : "#EFEAF3",
                borderWidth: bookingMode === "quick" ? 1.5 : 1,
              }}
            >
              <Ionicons
                name="flash"
                size={18}
                color={bookingMode === "quick" ? "#B57EDC" : "#8A8590"}
              />
              <Text
                className="text-sm font-extrabold mt-2"
                style={{
                  color: bookingMode === "quick" ? "#B57EDC" : "#161119",
                }}
              >
                Quick Booking
              </Text>
              <Text className="text-[11px] text-[#8A8590] mt-0.5">
                Confirm right away
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setBookingMode("request")}
              className="flex-1 rounded-[16px] p-4 border"
              style={{
                backgroundColor: bookingMode === "request" ? "#F4E4FF" : "#fff",
                borderColor: bookingMode === "request" ? "#D9AEF0" : "#EFEAF3",
                borderWidth: bookingMode === "request" ? 1.5 : 1,
              }}
            >
              <Ionicons
                name="paper-plane-outline"
                size={18}
                color={bookingMode === "request" ? "#B57EDC" : "#8A8590"}
              />
              <Text
                className="text-sm font-extrabold mt-2"
                style={{
                  color: bookingMode === "request" ? "#B57EDC" : "#161119",
                }}
              >
                Request Booking
              </Text>
              <Text className="text-[11px] text-[#8A8590] mt-0.5">
                Artist approves first
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Booking Summary */}
        <View className="px-5 mt-5">
          <SectionTitle>Booking Summary</SectionTitle>
          <View
            className="rounded-[18px] px-4 py-3"
            style={{
              backgroundColor: "#FCEBEF",
              borderColor: "#F6C9D6",
              borderWidth: 1,
            }}
          >
            {selectedServices.map((service) => (
              <SummaryRow
                key={service.id}
                label={service.name}
                value={`$${service.price}`}
              />
            ))}

            <Divider />

            <SummaryRow label="Date" value={params.dateLabel} />
            <SummaryRow label="Time" value={params.timeLabel} />
            <SummaryRow label="Visit Type" value={visitTypeLabel} />
            <SummaryRow label="Booking Mode" value={bookingModeLabel} />

            <Divider />

            <SummaryRow label="Total" value={`$${total}`} bold />
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom actions */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-gray-100 px-5 pt-3"
        style={{ paddingBottom: 30 }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleConfirmBooking}
          className="rounded-2xl overflow-hidden"
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center rounded-full"
          >
            <Text className="text-white text-lg font-extrabold">
              Confirm Booking
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSaveDraft}
          className="items-center mt-3"
        >
          <Text className="text-base font-bold text-[#8A8590]">Save Draft</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
