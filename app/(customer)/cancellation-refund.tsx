import AppHeader from "@/components/common/AppHeader";
import GradientActionButton from "@/components/common/GradientActionButton";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
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
type RefundTier = "full" | "partial" | "none";

export type CancellationBooking = {
  bookingId: string;
  artistName: string;
  artistAvatar: ImageSourcePropType;
  serviceLabel: string; // "Bridal Makeup, Hair Styling & Updo"
  bookingDate: string; // "Saturday, July 12, 2025"
  bookingTime: string; // "10:00 AM"
  statusLabel: string; // "Upcoming"

  paidAmount: number;
  paymentMethod: string; // "Visa •••• 4242"
  transactionId: string;

  // Hours remaining until the appointment — drives which policy tier applies.
  // Replace with a real calculation from bookingDate/bookingTime vs now().
  hoursUntilAppointment: number;

  lateCancellationFee: number;
};

// ---------------------------------------------------------------------------
// Dummy/default data — matches the Booking Details screen's DUMMY_BOOKING
// ---------------------------------------------------------------------------
const AVATAR = require("../../assets/images/home/pic1.png");

const DUMMY_CANCELLATION_BOOKING: CancellationBooking = {
  bookingId: "BK-2025-07124",
  artistName: "Sofia Laurent",
  artistAvatar: AVATAR,
  serviceLabel: "Bridal Makeup, Hair Styling & Updo",
  bookingDate: "Saturday, July 12, 2025",
  bookingTime: "10:00 AM",
  statusLabel: "Upcoming",
  paidAmount: 85.4,
  paymentMethod: "Visa •••• 4242",
  transactionId: "TXN-8847291035",
  hoursUntilAppointment: 72, // > 48h → full refund, matches screenshot
  lateCancellationFee: 20,
};

const CANCELLATION_REASONS = [
  "Change of mind",
  "Emergency",
  "Health Issue",
  "Found Another Artist",
  "Other",
];

const REFUND_TIMELINE_STEPS = [
  "Cancellation Requested",
  "Approval Review",
  "Processing Refund",
  "Refunded to Card",
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-[11px] font-bold text-[#9A94A0] tracking-wide mb-3">
    {children}
  </Text>
);

const InfoRow = ({
  label,
  value,
  valueColor,
  bold,
}: {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
}) => (
  <View className="flex-row items-center justify-between py-2">
    <Text className="text-xs text-[#8A8590]">{label}</Text>
    <Text
      className={`text-xs text-right ${bold ? "font-extrabold" : "font-bold"}`}
      style={{ color: valueColor ?? "#161119", maxWidth: "62%" }}
    >
      {value}
    </Text>
  </View>
);

const PolicyRow = ({
  label,
  pillText,
  pillBg,
  pillColor,
}: {
  label: string;
  pillText: string;
  pillBg: string;
  pillColor: string;
}) => (
  <View className="flex-row items-center justify-between py-2">
    <Text className="text-[13px] text-[#6E6875]">{label}</Text>
    <View
      className="rounded-full px-3 py-1"
      style={{ backgroundColor: pillBg }}
    >
      <Text className="text-[12px] font-bold" style={{ color: pillColor }}>
        {pillText}
      </Text>
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function CancellationRefundScreen({
  booking = DUMMY_CANCELLATION_BOOKING,
}: {
  booking?: CancellationBooking;
}) {
  const params = useLocalSearchParams<{ bookingId?: string }>();

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ---------------------------------------------------------------------
  // Refund policy calculation, driven purely by hoursUntilAppointment.
  // Swap this for a real API call once cancellation rules live server-side.
  // ---------------------------------------------------------------------
  const { tier, refundPercent, lateFeeApplies } = useMemo(() => {
    const hrs = booking.hoursUntilAppointment;
    if (hrs >= 48) {
      return {
        tier: "full" as RefundTier,
        refundPercent: 100,
        lateFeeApplies: false,
      };
    }
    if (hrs >= 24) {
      return {
        tier: "partial" as RefundTier,
        refundPercent: 50,
        lateFeeApplies: false,
      };
    }
    return {
      tier: "none" as RefundTier,
      refundPercent: 0,
      lateFeeApplies: true,
    };
  }, [booking.hoursUntilAppointment]);

  const refundAmount = useMemo(() => {
    const base = (booking.paidAmount * refundPercent) / 100;
    const fee = lateFeeApplies ? booking.lateCancellationFee : 0;
    return Math.max(base - fee, 0);
  }, [
    booking.paidAmount,
    refundPercent,
    lateFeeApplies,
    booking.lateCancellationFee,
  ]);

  const eligibilityMessage = useMemo(() => {
    if (tier === "full") {
      return {
        icon: "checkmark-circle" as const,
        bg: "#EAF7F3",
        textColor: "#1A5A52",
        amountColor: "#1A9C5A",
        title: "Full refund eligible.",
        body: `Your appointment is more than 48 hours away — you qualify for a complete refund of $${refundAmount.toFixed(2)}.`,
      };
    }
    if (tier === "partial") {
      return {
        icon: "alert-circle" as const,
        bg: "#FFF3E0",
        textColor: "#8A5A00",
        amountColor: "#E17100",
        title: "Partial refund eligible.",
        body: `Your appointment is 24–48 hours away — you qualify for a 50% refund of $${refundAmount.toFixed(2)}.`,
      };
    }
    return {
      icon: "close-circle" as const,
      bg: "#FDEDF1",
      textColor: "#8A2F42",
      amountColor: "#E0405B",
      title: "Non-refundable window.",
      body: `Your appointment is under 24 hours away. A late cancellation fee of $${booking.lateCancellationFee.toFixed(2)} applies.`,
    };
  }, [tier, refundAmount, booking.lateCancellationFee]);

  const handleConfirmCancellation = () => {
    //if (!selectedReason) return;
    setSubmitting(true);
    // TODO: call cancel-booking mutation with { bookingId: booking.bookingId, reason: selectedReason }
    // On success, navigate back or to a confirmation screen.
    setTimeout(() => {
      setSubmitting(false);
      router.replace("/bookings");
    }, 600);
  };

  const handleContactSupport = () => {
    router.push({
      pathname: "/(customer)/contact-support",
      params: { bookingId: booking.bookingId },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      {/* Header */}
      <AppHeader title="Cancellation & Refund" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
      >
        {/* Booking Summary card */}
        <View className="mt-1">
          <CardTitle>BOOKING SUMMARY</CardTitle>
          <View
            className="bg-white rounded-[20px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <View className="flex-row items-center">
              <Image
                source={booking.artistAvatar}
                style={{ width: 48, height: 48, borderRadius: 24 }}
                resizeMode="cover"
              />
              <View className="ml-3 flex-1">
                <Text className="text-[15px] font-extrabold text-[#161119]">
                  {booking.artistName}
                </Text>
                <Text className="text-xs text-[#8A8590] mt-0.5">
                  {booking.serviceLabel}
                </Text>
              </View>
            </View>

            <View className="h-[1px] bg-[#F0EEF2] my-3.5" />

            <InfoRow label="Date" value={booking.bookingDate} bold />
            <InfoRow label="Time" value={booking.bookingTime} bold />

            <View className="mt-1">
              <Text className="text-xs text-[#8A8590] mb-2">
                Current Status
              </Text>
              <View
                className="flex-row items-center self-start rounded-full px-3 py-1.5"
                style={{ backgroundColor: "#EAF7F3" }}
              >
                <Ionicons
                  name="ellipse"
                  size={7}
                  color="#1A9C5A"
                  style={{ marginRight: 5 }}
                />
                <Text
                  className="text-[11px] font-bold"
                  style={{ color: "#1A5A52" }}
                >
                  {booking.statusLabel}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Cancellation Policy card */}
        <View className="mt-4">
          <View
            className="bg-white rounded-[20px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <View className="flex-row items-center mb-3">
              <View className="w-9 h-9 rounded-full bg-[#FFF3E0] items-center justify-center mr-2.5">
                <Ionicons name="shield-checkmark" size={16} color="#E1A83E" />
              </View>
              <Text className="text-[15px] font-extrabold text-[#161119]">
                Cancellation Policy
              </Text>
            </View>

            <PolicyRow
              label="Free cancellation"
              pillText="48+ hours before"
              pillBg="#EAF7F3"
              pillColor="#1A9C5A"
            />
            <PolicyRow
              label="50% refund"
              pillText="24–48 hours before"
              pillBg="#FFF3E0"
              pillColor="#C9880F"
            />
            <PolicyRow
              label="Non-refundable"
              pillText="Under 24 hours"
              pillBg="#F4E4FF"
              pillColor="#B57EDC"
            />

            <View className="flex-row items-center justify-between py-2">
              <Text className="text-[13px] text-[#6E6875]">
                Late cancellation fee
              </Text>
              <Text className="text-sm font-extrabold text-[#161119]">
                ${booking.lateCancellationFee.toFixed(2)}
              </Text>
            </View>

            {/* Dynamic eligibility banner */}
            <View
              className="flex-row items-start rounded-[14px] p-3 mt-2"
              style={{ backgroundColor: eligibilityMessage.bg }}
            >
              <Ionicons
                name={eligibilityMessage.icon}
                size={16}
                color={eligibilityMessage.amountColor}
                style={{ marginRight: 8, marginTop: 1 }}
              />
              <Text
                className="flex-1 text-xs leading-5"
                style={{ color: eligibilityMessage.textColor }}
              >
                <Text className="font-extrabold">
                  {eligibilityMessage.title}{" "}
                </Text>
                {eligibilityMessage.body}
              </Text>
            </View>
          </View>
        </View>

        {/* Reason for Cancellation */}
        <View className="mt-6">
          <Text className="text-lg font-extrabold text-[#161119] mb-3">
            Reason for Cancellation
          </Text>

          {CANCELLATION_REASONS.map((reason) => {
            const selected = selectedReason === reason;
            return (
              <TouchableOpacity
                key={reason}
                activeOpacity={0.8}
                onPress={() => setSelectedReason(reason)}
                className="flex-row items-center justify-between bg-white rounded-[16px] px-4 py-4 mb-2.5"
                style={{
                  borderWidth: 1,
                  borderColor: selected ? COLORS.baseColor : "#F0EEF2",
                }}
              >
                <Text className="text-sm text-[#161119]">{reason}</Text>
                <View
                  className="items-center justify-center rounded-full"
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 2,
                    borderColor: selected ? COLORS.baseColor : "#D9D3E0",
                  }}
                >
                  {selected && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: COLORS.baseColor,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Refund Timeline card */}
        <View className="mt-4">
          <View
            className="bg-white rounded-[20px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <CardTitle>REFUND TIMELINE</CardTitle>

            {REFUND_TIMELINE_STEPS.map((label, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === REFUND_TIMELINE_STEPS.length - 1;
              // Only the first step is "active" until the person actually confirms.
              const active = isFirst;

              return (
                <View key={label} className="flex-row">
                  <View className="items-center" style={{ width: 28 }}>
                    {active ? (
                      <LinearGradient
                        colors={[COLORS.baseColor1, COLORS.baseColor2]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      </LinearGradient>
                    ) : (
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: "#E4E0E8",
                        }}
                      />
                    )}
                    {!isLast && (
                      <View
                        style={{
                          width: 2,
                          flex: 1,
                          minHeight: 26,
                          backgroundColor: "#EFEAF3",
                        }}
                      />
                    )}
                  </View>
                  <View className="flex-1 pb-4 pl-2 justify-center">
                    <Text
                      className={`text-sm ${active ? "font-extrabold" : "font-semibold"}`}
                      style={{ color: active ? "#161119" : "#B0AAB6" }}
                    >
                      {label}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Refund Details card */}
        <View className="mt-4">
          <CardTitle>REFUND DETAILS</CardTitle>
          <View
            className="bg-white rounded-[20px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <InfoRow
              label="Refund Amount"
              value={`$${refundAmount.toFixed(2)}`}
              valueColor="#1A9C5A"
              bold
            />
            <InfoRow label="Processing Time" value="5–7 business days" bold />
            <InfoRow
              label="Original Payment"
              value={booking.paymentMethod}
              bold
            />
            <InfoRow
              label="Transaction Ref"
              value={booking.transactionId}
              bold
            />
            <InfoRow label="Wallet Refund" value="Not applicable" bold />
          </View>
        </View>

        {/* Compensation Note card */}
        <View className="mt-4">
          <View
            className="bg-white rounded-[20px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-full bg-[#FDEDF1] items-center justify-center mr-2.5">
                <Ionicons name="alert-circle" size={15} color="#E0405B" />
              </View>
              <Text className="text-[15px] font-extrabold text-[#161119]">
                Compensation Note
              </Text>
            </View>

            <InfoRow label="Automatic Compensation" value="$0.00" bold />
            <InfoRow
              label="Late Cancellation Charge"
              value={
                lateFeeApplies
                  ? `$${booking.lateCancellationFee.toFixed(2)}`
                  : "$0.00"
              }
              bold
            />
            <InfoRow label="Service Fee" value="$0.00" bold />

            <Text className="text-[11px] text-[#B0AAB6] mt-2 leading-4">
              Refund in the form of &apos;platform credit&apos; if cancelled
              more than 48 hours
            </Text>
          </View>
        </View>

        {/* Actions */}
        {/* <TouchableOpacity
          activeOpacity={0.85}
          //disabled={!selectedReason || submitting}
          onPress={handleConfirmCancellation}
          className="rounded-full overflow-hidden mt-6"
          //style={{ opacity: selectedReason ? 1 : 0.5 }}
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center rounded-full"
          >
            <Text className="text-white text-base font-extrabold">
              {submitting ? "Cancelling..." : "Confirm Cancellation"}
            </Text>
          </LinearGradient>
        </TouchableOpacity> */}
        <View className="mt-6">
          <GradientActionButton
            title="Confirm Cancellation"
            onPress={handleConfirmCancellation}
            loading={submitting}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContactSupport}
          className="items-center rounded-full py-4 border mt-3"
          style={{ borderColor: "#F6C9D6" }}
        >
          <Text className="text-sm font-bold" style={{ color: "#FC6C8C" }}>
            Contact Support
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
