import AppHeader from "@/components/common/AppHeader";
import Stars from "@/components/common/Stars";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
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
// export type PaymentMethodId = "apple_pay" | "google_pay" | "paypal" | "card";

export type PaymentMethodId = "stripe";

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
  depositPercent?: number; // defaults to 0.5 (50%) — set to 1 for pay-in-full
};

// ---------------------------------------------------------------------------
// Dummy/default data — used only when this screen is opened standalone.
// Real usage should always pass `params` from the booking flow.
// ---------------------------------------------------------------------------
const AVATAR = require("../../../assets/images/home/home_pic1.png");

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
  subtotal: 60.4,
  travelFee: 25,
  depositPercent: 0.5,
};

// const PAYMENT_METHODS: {
//   id: PaymentMethodId;
//   label: string;
//   icon: React.ReactNode;
// }[] = [
//   {
//     id: "apple_pay",
//     label: "Apple Pay",
//     icon: <Ionicons name="logo-apple" size={20} color="#161119" />,
//   },
//   {
//     id: "google_pay",
//     label: "Google Pay",
//     icon: <Ionicons name="logo-google" size={18} color="#4285F4" />,
//   },
//   {
//     id: "paypal",
//     label: "PayPal",
//     icon: <Ionicons name="logo-paypal" size={18} color="#fff" />,
//   },
//   {
//     id: "card",
//     label: "Visa / Mastercard",
//     icon: <Text className="text-[9px] font-extrabold text-white">VISA</Text>,
//   },
// ];

const PAYMENT_METHOD = {
  id: "stripe",
  label: "Credit / Debit Card",
};

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

const DashedDivider = () => (
  <View
    style={{
      borderBottomWidth: 1,
      borderStyle: "dashed",
      borderColor: "#E3DEE8",
      marginVertical: 10,
    }}
  />
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function CheckoutScreen({
  params = DUMMY_PARAMS,
}: {
  params?: CheckoutParams;
}) {
  // const [selectedPayment, setSelectedPayment] =
  //   useState<PaymentMethodId>("apple_pay");
  const selectedPayment = "stripe";
  const [accepted, setAccepted] = useState(false);

  const total = useMemo(
    () => params.subtotal + params.travelFee,
    [params.subtotal, params.travelFee],
  );

  const depositPercent = params.depositPercent ?? 0.5;

  const depositAmount = useMemo(
    () => total * depositPercent,
    [total, depositPercent],
  );

  const balanceAmount = useMemo(
    () => total - depositAmount,
    [total, depositAmount],
  );

  const depositPercentLabel = `${Math.round(depositPercent * 100)}%`;
  const balancePercentLabel = `${Math.round((1 - depositPercent) * 100)}%`;

  // const paymentMethodLabel = useMemo(() => {
  //   const method = PAYMENT_METHODS.find((m) => m.id === selectedPayment);
  //   return method?.label ?? "";
  // }, [selectedPayment]);

  const paymentMethodLabel = "Stripe";

  const handlePayNow = () => {
    const bookingId = `BK-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 90000 + 10000,
    )}`;

    router.push({
      pathname: "/(customer)/booking/confirmed",
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
        amountPaid: depositAmount.toFixed(2),
        balanceDue: balanceAmount.toFixed(2),
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]" edges={["top"]}>
      <AppHeader title="Checkout" />

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
        {/* <View className="px-5 mt-6">
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
        </View> */}
        {/* Payment Method */}
        <View className="px-5 mt-6">
          <SectionTitle>Payment Method</SectionTitle>

          <TouchableOpacity
            activeOpacity={0.85}
            className="rounded-[16px] p-4 border bg-white"
            style={{
              borderColor: COLORS.baseColor,
              backgroundColor: "#FDEDF1",
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View
                  className="items-center justify-center rounded-full mr-3"
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: COLORS.blueColor2,
                  }}
                >
                  <Ionicons
                    name="card-outline"
                    size={20}
                    color={COLORS.blueColor}
                  />
                </View>

                <View>
                  <Text className="text-sm font-extrabold text-[#161119]">
                    Credit / Debit Card
                  </Text>

                  <Text className="text-xs text-[#8A8590] mt-1">
                    Secure payment powered by Stripe
                  </Text>
                </View>
              </View>

              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: COLORS.baseColor,
                }}
              >
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment Details — 50/50 deposit breakdown, dynamic from params */}
        <View className="px-5 mt-6">
          <View
            className="bg-white rounded-[20px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="pricetag-outline"
                size={16}
                color="#48B9A8"
                style={{ marginRight: 8 }}
              />
              <Text className="text-sm font-extrabold text-[#161119]">
                Payment Details
              </Text>
            </View>

            <Divider />

            {/* Info notice */}
            <View
              className="rounded-2xl px-4 py-4 mt-3"
              style={{ backgroundColor: "#F4EEFB" }}
            >
              <View className="flex-row items-start">
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#8B5FBF"
                  style={{ marginRight: 8, marginTop: 1 }}
                />
                <Text className="flex-1 text-xs leading-5 text-[#4A4453]">
                  You are required to pay a {depositPercentLabel} deposit now.
                  The remaining {balancePercentLabel} is payable to the
                  professional on the day of service.
                </Text>
              </View>
            </View>

            {/* Total service cost */}
            <View className="flex-row items-center justify-between mt-4">
              <Text className="text-xs text-[#8A8590]">Total Service Cost</Text>
              <Text className="text-sm font-extrabold text-[#161119]">
                ${total.toFixed(2)}
              </Text>
            </View>

            <DashedDivider />

            {/* Deposit due today */}
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-bold" style={{ color: "#8B5FBF" }}>
                Deposit Due Today ({depositPercentLabel})
              </Text>
              <Text
                className="text-sm font-extrabold"
                style={{ color: "#8B5FBF" }}
              >
                ${depositAmount.toFixed(2)}
              </Text>
            </View>
            <Text className="text-[11px] text-[#B0AAB8] mt-1">
              (Pay now to confirm your booking)
            </Text>

            <DashedDivider />

            {/* Balance payable to professional */}
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-bold text-[#161119]">
                Balance Payable to Professional ({balancePercentLabel})
              </Text>
              <Text className="text-sm font-extrabold text-[#161119]">
                ${balanceAmount.toFixed(2)}
              </Text>
            </View>
            <Text className="text-[11px] text-[#B0AAB8] mt-1">
              (Payable on the day of service)
            </Text>

            {/* Amount to pay now */}
            <View
              className="flex-row items-center justify-between rounded-2xl px-4 py-4 mt-4"
              style={{ backgroundColor: "#EAF7F3" }}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="shield-checkmark"
                  size={16}
                  color="#1A5A52"
                  style={{ marginRight: 8 }}
                />
                <Text
                  className="text-sm font-extrabold"
                  style={{ color: "#1A5A52" }}
                >
                  Amount to Pay Now
                </Text>
              </View>
              <Text
                className="text-lg font-extrabold"
                style={{ color: "#1A5A52" }}
              >
                ${depositAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setAccepted((a) => !a)}
          className="bg-white rounded-[20px] p-5 mt-4 mx-5 flex-row items-start"
          style={{
            opacity: accepted ? 1 : 0.7,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 2,
          }}
        >
          <TouchableOpacity
            onPress={() => setAccepted((a) => !a)}
            className={`w-6 h-6 rounded-[6px] border-2 items-center justify-center mr-3 mt-0.5 ${
              accepted
                ? "bg-[#B57EDC] border-[#B57EDC]"
                : "border-[#D9D5DE] bg-white"
            }`}
          >
            {accepted && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          <Text className="flex-1 text-sm leading-5 text-[#161119]">
            I confirm I have read the
            <Text className="text-[#B57EDC] font-semibold">
              {" "}
              cancellation Policy
            </Text>{" "}
            acknowledgement.
          </Text>
        </TouchableOpacity>

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
                Pay Now — ${depositAmount.toFixed(2)}
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
      </ScrollView>
    </SafeAreaView>
  );
}
