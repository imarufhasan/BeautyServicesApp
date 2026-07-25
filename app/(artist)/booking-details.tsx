import ConfirmationModal from "@/components/common/ConfirmationModal";
import Stars from "@/components/common/Stars";
import { COLORS } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingDetailsScreen() {
  const params = useLocalSearchParams();

  const booking = params.bookingData
    ? JSON.parse(params.bookingData as string)
    : null;
  const status = params.status ? params.status : "";
  console.log("status: ", status);

  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);

  const handleAccept = () => {
    setAcceptModalVisible(true);
  };

  const confirmAccept = () => {
    // TODO: call accept-booking API with booking.id
    console.log("Booking accepted:", booking?.id);
    setAcceptModalVisible(false);
    router.back();
  };

  const handleComplete = () => {
    setCompleteModalVisible(true);
  };

  const confirmComplete = () => {
    // TODO: call complete-booking API with booking.id
    console.log("Booking marked complete:", booking?.id);
    setCompleteModalVisible(false);
    router.back();
  };

  const handleDecline = () => {
    router.push({
      pathname: "/(artist)/decline-booking",
      params: {
        bookingId: booking?.id ?? "",
        clientName: booking?.client?.name ?? "Sophia Williams",
        bookingDate: "Today, Jul 2",
        bookingTime: "2:00 PM",
        serviceName: "Full Glam Makeup",
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]">
      <View className="flex-1">
        {/* Header */}
        <View className="px-5 pt-5 mb-2 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 rounded-full bg-white items-center justify-center shadow"
          >
            <Feather name="chevron-left" size={22} color="#111827" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-gray-900">
            Booking Request
          </Text>

          <TouchableOpacity className="h-10 w-10 rounded-full bg-white items-center justify-center shadow">
            <Feather name="share-2" size={18} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Client Card */}

          <View className="mx-5 mt-2 rounded-3xl border-[1px] border-gray-100 bg-white p-5 flex-row items-center">
            <View>
              <Image
                source={{
                  uri:
                    booking?.client?.avatarUrl || "https://i.pravatar.cc/150",
                }}
                className="h-16 w-16 rounded-full"
              />

              <View className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-emerald-400 items-center justify-center">
                <Feather name="check" size={12} color="white" />
              </View>
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-900">
                {booking?.client?.name || "Sophia Williams"}
              </Text>

              <View className="mt-1 self-start rounded-full bg-emerald-50 px-3 py-1">
                <Text className="text-[11px] font-semibold text-emerald-400">
                  Repeat Client
                </Text>
              </View>

              <Stars rating={Math.round(Number(4.5))} showValue={true} />

              <Text className="mt-1 text-xs text-gray-400">
                12 completed bookings
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(common)/chatScreen")}
              className="h-12 w-12 rounded-full bg-[#76D8CB] items-center justify-center"
            >
              <Feather name="message-circle" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Booking Summary */}

          <View className="mx-5 mt-4 rounded-3xl border-[1px] border-gray-100 bg-white p-5">
            <Text className="text-xs font-bold tracking-widest text-gray-400">
              BOOKING SUMMARY
            </Text>

            <Summary title="Booking ID" value="JK-2601" />

            <Summary title="Service" value="Full Glam Makeup" />

            <Summary title="Date" value="Today, Jul 2" />

            <Summary title="Time" value="2:00 PM" />

            <Summary title="Duration" value="90 min" />

            <Summary title="Visit Type" value="Home Visit" />

            <Summary title="Address" value="123 Maple Street, Beverly Hills" />

            <Summary title="Travel Fee" value="$25" />

            <Summary title="Payment" value="Pending" />

            <View className="mt-3 pt-4 border-t border-gray-100 flex-row justify-between">
              <Text className="text-base font-bold text-gray-900">
                Total Price
              </Text>

              <Text className="text-2xl font-bold text-gray-900">$305</Text>
            </View>
          </View>

          {/* Notes */}

          <View className="mx-5 mt-4 rounded-3xl border-[1px] border-gray-100 bg-white p-5">
            <Text className="text-xs font-bold tracking-widest text-gray-400">
              SPECIAL NOTES
            </Text>

            <View className="mt-4 rounded-2xl bg-pink-50 p-4">
              <Text className="text-xs font-bold text-orange-400">
                Client Instructions
              </Text>

              <Text className="mt-2 text-sm leading-5 text-gray-600">
                Wedding prep — bridesmaids + bride. Please use only vegan
                products.
              </Text>
            </View>

            <View className="mt-5 flex-row">
              <View className="flex-1">
                <Text className="text-xs text-gray-400">
                  Preferred Products
                </Text>

                <Text className="mt-1 text-sm font-semibold text-gray-800">
                  Charlotte Tilbury,
                  {"\n"}
                  NARS
                </Text>
              </View>

              <View className="flex-1">
                <Text className="text-xs text-gray-400">Event Type</Text>

                <Text className="mt-1 text-sm font-semibold text-gray-800">
                  Wedding
                </Text>
              </View>
            </View>
          </View>

          {/* Availability */}

          <View className="mx-5 mt-4 rounded-3xl border-[1px] border-gray-100 bg-white p-5">
            <Text className="text-xs font-bold tracking-widest text-gray-400">
              YOUR AVAILABILITY
            </Text>

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1 rounded-full border border-teal-400 bg-teal-50 py-3 items-center">
                <Text className="text-xs font-bold text-teal-500">
                  ✓ Available
                </Text>
              </View>

              <View className="flex-1 rounded-full border border-gray-200 py-3 items-center">
                <Text className="text-xs font-bold text-gray-500">
                  ⚠ Schedule Conflict
                </Text>
              </View>
            </View>
          </View>

          {status === "pending" ? (
            <View className="bg-white px-5 py-4 border-t border-gray-100">
              <TouchableOpacity activeOpacity={0.85} onPress={handleComplete}>
                <LinearGradient
                  colors={["#FFB777", "#FFB777"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 999,
                    paddingVertical: 16,
                    alignItems: "center",
                  }}
                >
                  <Text className="text-white font-semibold">
                    Click To Complete
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="bg-white px-5 py-4 border-t border-gray-100">
              <TouchableOpacity activeOpacity={0.85} onPress={handleAccept}>
                <LinearGradient
                  colors={[COLORS.baseColor1, COLORS.baseColor2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 999,
                    paddingVertical: 16,
                    alignItems: "center",
                  }}
                >
                  <Text className="text-white font-semibold">Accept</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View className="flex-row mt-3 gap-3">
                <TouchableOpacity
                  onPress={() => router.push("/(artist)/reschedule-booking")}
                  className="flex-1 rounded-2xl border border-pink-200 py-3 items-center"
                >
                  <Text className="text-orange-300 font-semibold text-sm">
                    Reschedule
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDecline}
                  className="flex-1 rounded-2xl border border-pink-200 py-3 items-center"
                >
                  <Text className="text-orange-300 font-semibold text-sm">
                    Decline Booking
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <ConfirmationModal
        visible={acceptModalVisible}
        title="Accept Booking?"
        message={`Are you sure you want to accept ${
          booking?.client?.name || "this client"
        }'s booking request? They'll be notified immediately.`}
        confirmText="Yes, Accept"
        cancelText="Cancel"
        onConfirm={confirmAccept}
        onCancel={() => setAcceptModalVisible(false)}
      />

      <ConfirmationModal
        visible={completeModalVisible}
        title="Mark as Complete?"
        message="Confirm that this booking has been completed. This will notify the client and finalize payment."
        confirmText="Yes, Complete"
        cancelText="Not Yet"
        onConfirm={confirmComplete}
        onCancel={() => setCompleteModalVisible(false)}
      />
    </SafeAreaView>
  );
}

function Summary({ title, value }: { title: string; value: string }) {
  return (
    <View className="flex-row justify-between py-3 border-b border-gray-100">
      <Text className="text-sm text-gray-500">{title}</Text>

      <Text className="text-sm font-semibold text-gray-800 max-w-[60%] text-right">
        {value}
      </Text>
    </View>
  );
}
