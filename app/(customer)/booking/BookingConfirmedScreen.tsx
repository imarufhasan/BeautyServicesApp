import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type BookingConfirmedParams = {
  bookingId: string; // e.g. "BK-2025-07124"
  artistName: string;
  artistAvatar: ImageSourcePropType;
  serviceSummary: string; // e.g. "Bridal Makeup · Hair Styling & Updo"
  dateLabel: string;
  timeLabel: string;
  visitType: string;
  location: string;
  paymentMethodLabel: string; // e.g. "Visa •••• 4242"
  amountPaid: number;
};

// ---------------------------------------------------------------------------
// Dummy/default data — used only when this screen is opened standalone.
// Real usage should always pass `params` from the checkout flow.
// ---------------------------------------------------------------------------
const AVATAR = require("../../../assets/images/home/pic1.png");

const DUMMY_PARAMS: BookingConfirmedParams = {
  bookingId: "BK-2025-07124",
  artistName: "Sofia Laurent",
  artistAvatar: AVATAR,
  serviceSummary: "Bridal Makeup · Hair Styling & Updo",
  dateLabel: "Saturday, July 12, 2025",
  timeLabel: "10:00 AM",
  visitType: "Mobile — At Your Location",
  location: "47 Park Ave, New York, NY",
  paymentMethodLabel: "Visa •••• 4242",
  amountPaid: 85.4,
};

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
const SummaryRow = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <View className="flex-row items-start justify-between py-2.5">
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
          : "text-xs font-bold text-[#161119] text-right"
      }
      style={{ maxWidth: "60%" }}
    >
      {value}
    </Text>
  </View>
);

const Divider = () => (
  <View className="h-[1px] bg-[#F0DEE3]" style={{ marginVertical: 2 }} />
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function BookingConfirmedScreen({
  params = DUMMY_PARAMS,
}: {
  params?: BookingConfirmedParams;
}) {
  const handleViewBooking = () => {
    router.push("/(customer)/(tabs)/bookings");
  };

  const handleBackToHome = () => {
    router.push("/(customer)/(tabs)/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 40 }}
      >
        {/* Success glow + check */}
        <View className="items-center">
          <View
            className="items-center justify-center rounded-full"
            style={{
              width: 96,
              height: 96,
              shadowColor: COLORS.baseColor1,
              shadowOpacity: 0.35,
              shadowRadius: 20,
              elevation: 6,
            }}
          >
            <LinearGradient
              colors={[COLORS.baseColor1, COLORS.baseColor2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="checkmark" size={40} color="#fff" />
            </LinearGradient>
          </View>

          <Text className="text-xl font-extrabold text-[#161119] mt-5">
            Booking Confirmed!
          </Text>
          <Text className="text-xs text-[#8A8590] text-center mt-2 px-10 leading-5">
            Your appointment has been successfully booked. A confirmation has
            been sent to your email.
          </Text>

          <View className="bg-[#EAF7F3] rounded-full px-3 py-1.5 mt-4 flex-row items-center">
            <Ionicons
              name="shield-checkmark-outline"
              size={12}
              color="#1A5A52"
              style={{ marginRight: 5 }}
            />
            <Text className="text-xs font-bold" style={{ color: "#1A5A52" }}>
              Booking ID: {params.bookingId}
            </Text>
          </View>
        </View>

        {/* Booking summary card */}
        <View className="px-5 mt-7">
          <View
            className="bg-white rounded-[20px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <Text className="text-[11px] font-bold text-[#9A94A0] mb-3 tracking-wide">
              BOOKING SUMMARY
            </Text>

            <View className="flex-row items-center mb-3">
              <Image
                source={params.artistAvatar}
                style={{ width: 44, height: 44, borderRadius: 12 }}
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-extrabold text-[#161119]">
                  {params.artistName}
                </Text>
                <Text className="text-xs text-[#8A8590] mt-0.5">
                  {params.serviceSummary}
                </Text>
              </View>
            </View>

            <Divider />

            <SummaryRow label="Date" value={params.dateLabel} />
            <SummaryRow label="Time" value={params.timeLabel} />
            <SummaryRow label="Visit Type" value={params.visitType} />
            <SummaryRow label="Location" value={params.location} />
            <SummaryRow
              label="Payment Method"
              value={params.paymentMethodLabel}
            />
            <SummaryRow label="Booking ID" value={params.bookingId} />

            <Divider />

            <SummaryRow
              label="Amount Paid"
              value={`$${params.amountPaid.toFixed(2)}`}
              bold
            />
          </View>
        </View>

        {/* Actions */}
        <View className="px-5 mt-6">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleViewBooking}
            className="rounded-full overflow-hidden"
          >
            <LinearGradient
              colors={[COLORS.baseColor1, COLORS.baseColor2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 items-center rounded-full"
            >
              <Text className="text-white text-base font-extrabold">
                View My Booking
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleBackToHome}
            className="items-center justify-center rounded-full py-4 mt-3 border"
            style={{ borderColor: "#F6C9D6", backgroundColor: "#FCEBEF" }}
          >
            <Text className="text-sm font-bold" style={{ color: "#FC6C8C" }}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
