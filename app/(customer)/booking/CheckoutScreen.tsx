import { COLORS } from "@/constants/colors";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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
export type PaymentMethodId = "apple_pay" | "google_pay" | "paypal" | "card";

export type CheckoutParams = {
  artistId: string;
  artistName: string;
  artistAvatar: ImageSourcePropType;
  artistSpecialty: string;
  rating: number;
  reviewCount: number;
  serviceTags: string[]; // e.g. ["Bridal Makeup", "Hair Styling & Updo"]
  visitType: string; // e.g. "Mobile — At Your Location"
  dateLabel: string; // e.g. "Saturday, July 12, 2025"
  timeLabel: string; // e.g. "10:00 AM"
  durationLabel: string; // e.g. "3 hours"
  subtotal: number;
  travelFee: number;
};

// ---------------------------------------------------------------------------
// Dummy/default data — used only when this screen is opened standalone.
// Real usage should always pass `params` from the booking flow.
// ---------------------------------------------------------------------------
const AVATAR = require("../../../assets/images/home/pic1.png");

const DUMMY_PARAMS: CheckoutParams = {
  artistId: "1",
  artistName: "Sofia Laurent",
  artistAvatar: AVATAR,
  artistSpecialty: "Bridal & Beauty Artist",
  rating: 4.9,
  reviewCount: 284,
  serviceTags: ["Bridal Makeup", "Hair Styling & Updo"],
  visitType: "Mobile — At Your Location",
  dateLabel: "Saturday, July 12, 2025",
  timeLabel: "10:00 AM",
  durationLabel: "3 hours",
  subtotal: 60,
  travelFee: 25,
};

const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "apple_pay",
    label: "Apple Pay",
    icon: <Ionicons name="logo-apple" size={20} color="#161119" />,
  },
  {
    id: "google_pay",
    label: "Google Pay",
    icon: <Ionicons name="logo-google" size={18} color="#4285F4" />,
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: <Ionicons name="logo-paypal" size={18} color="#fff" />,
  },
  {
    id: "card",
    label: "Visa / Mastercard",
    icon: <Text className="text-[9px] font-extrabold text-white">VISA</Text>,
  },
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
const Stars = ({ rating, size = 11 }: { rating: number; size?: number }) => (
  <View className="flex-row items-center">
    <Fontisto name="star" size={size} color="#FC6C8C" />
    <Text className="text-xs font-extrabold text-[#161119] ml-1">
      {rating.toFixed(1)}
    </Text>
  </View>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-base font-extrabold text-[#161119] mb-3">
    {children}
  </Text>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row items-center justify-between py-2">
    <Text className="text-xs text-[#8A8590]">{label}</Text>
    <Text className="text-xs font-bold text-[#161119]">{value}</Text>
  </View>
);

const PriceRow = ({
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
  <View className="h-[1px] bg-[#EFEAF3]" style={{ marginVertical: 4 }} />
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function CheckoutScreen({
  params = DUMMY_PARAMS,
}: {
  params?: CheckoutParams;
}) {
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethodId>("apple_pay");

  const total = useMemo(
    () => params.subtotal + params.travelFee,
    [params.subtotal, params.travelFee],
  );

  const paymentMethodLabel = useMemo(() => {
    const method = PAYMENT_METHODS.find((m) => m.id === selectedPayment);
    return method?.label ?? "";
  }, [selectedPayment]);

  const handlePayNow = () => {
    const bookingId = `BK-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 90000 + 10000,
    )}`;

    router.push({
      pathname: "/booking/confirmed",
      params: {
        bookingId,
        artistId: params.artistId,
        artistName: params.artistName,
        serviceSummary: params.serviceTags.join(" · "),
        dateLabel: params.dateLabel,
        timeLabel: params.timeLabel,
        visitType: params.visitType,
        location: "47 Park Ave, New York, NY", // TODO: pull from user's saved/selected address
        paymentMethodLabel,
        amountPaid: String(total),
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-3 mt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-2xl bg-white items-center justify-center mr-3"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 1,
          }}
        >
          <Ionicons name="arrow-back" size={18} color="#161119" />
        </TouchableOpacity>
        <Text className="text-lg font-extrabold text-[#161119]">Checkout</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        {/* Booking summary card */}
        <View className="px-5 mt-2">
          <View
            className="bg-white rounded-[20px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <View className="flex-row items-center">
              <Image
                source={params.artistAvatar}
                style={{ width: 48, height: 48, borderRadius: 14 }}
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-extrabold text-[#161119]">
                  {params.artistName}
                </Text>
                <Text className="text-xs text-[#8A8590] mt-0.5">
                  {params.artistSpecialty}
                </Text>
              </View>
              <View className="items-end">
                <Stars rating={params.rating} />
                <Text className="text-[10px] text-[#8A8590] mt-0.5">
                  {params.reviewCount} reviews
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap mt-3">
              {params.serviceTags.map((tag) => (
                <View
                  key={tag}
                  className="bg-[#EAF7F3] rounded-full px-3 py-1.5 mr-2 mb-2"
                >
                  <Text className="text-[11px] font-bold text-[#1A5A52]">
                    {tag}
                  </Text>
                </View>
              ))}
            </View>

            <Divider />

            <InfoRow label="Visit Type" value={params.visitType} />
            <InfoRow label="Date" value={params.dateLabel} />
            <InfoRow label="Time" value={params.timeLabel} />
            <InfoRow label="Duration" value={params.durationLabel} />

            <Divider />

            <PriceRow
              label="Subtotal"
              value={`$${params.subtotal.toFixed(2)}`}
            />
            <PriceRow
              label="Travel Fee"
              value={`$${params.travelFee.toFixed(2)}`}
            />

            <Divider />

            <PriceRow label="Total" value={`$${total.toFixed(2)}`} bold />
          </View>
        </View>

        {/* Payment Method */}
        <View className="px-5 mt-6">
          <SectionTitle>Payment Method</SectionTitle>
          <View className="flex-row flex-wrap" style={{ gap: 12 }}>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = method.id === selectedPayment;
              return (
                <TouchableOpacity
                  key={method.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedPayment(method.id)}
                  style={{ width: "47%" }}
                  className="rounded-[16px] p-4 border bg-white"
                >
                  <View
                    style={{
                      borderRadius: 16,
                      borderWidth: isSelected ? 1.5 : 1,
                      borderColor: isSelected ? "#FC6C8C" : "#EFEAF3",
                      backgroundColor: isSelected ? "#FDEDF1" : "#fff",
                      padding: 14,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  />
                  <View className="flex-row items-center justify-between">
                    <View
                      className="items-center justify-center rounded-full"
                      style={{
                        width: 36,
                        height: 36,
                        backgroundColor:
                          method.id === "paypal" || method.id === "card"
                            ? "#161119"
                            : "#F5F2F7",
                      }}
                    >
                      {method.icon}
                    </View>
                    {isSelected && (
                      <View
                        className="items-center justify-center rounded-full"
                        style={{
                          width: 16,
                          height: 16,
                          backgroundColor: "#FC6C8C",
                        }}
                      >
                        <Ionicons name="checkmark" size={11} color="#fff" />
                      </View>
                    )}
                  </View>
                  <Text className="text-xs font-bold text-[#161119] mt-2">
                    {method.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Payment Details */}
        <View className="px-5 mt-6">
          <View
            className="bg-white rounded-[18px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <View className="flex-row items-center mb-1">
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color="#48B9A8"
                style={{ marginRight: 6 }}
              />
              <Text className="text-xs font-bold text-[#161119]">
                Payment Details
              </Text>
            </View>

            <Divider />

            <PriceRow label="Booking Total" value={`$${total.toFixed(2)}`} />

            <Divider />

            <PriceRow label="Grand Total" value={`$${total.toFixed(2)}`} bold />
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom actions */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-[#FBF9FC] px-5 pt-3"
        style={{ paddingBottom: 60 }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePayNow}
          className="rounded-2xl overflow-hidden"
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center rounded-full"
          >
            <Text className="text-white text-base font-extrabold">
              Pay Now — ${total.toFixed(2)}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleCancel}
          className="items-center justify-center rounded-2xl py-4 mt-3 border"
          style={{ borderColor: "#F6C9D6", backgroundColor: "#FCEBEF" }}
        >
          <Text className="text-sm font-bold" style={{ color: "#FC6C8C" }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
