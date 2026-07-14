import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type BookingStatus = "upcoming" | "completed" | "cancelled" | "pending";

export type BookingListItem = {
  id: string;
  artistName: string;
  artistAvatar: ImageSourcePropType;
  specialty: string;
  status: BookingStatus;
  dateLabel: string; // e.g. "Jul 12, 2025"
  timeLabel: string; // e.g. "10:00 AM"
  visitType: string; // e.g. "Mobile Visit"
  total: number;
};

// ---------------------------------------------------------------------------
// Mock data — replace with real API data (RTK Query) keyed by customer id
// ---------------------------------------------------------------------------
const AVATAR = require("../../../assets/images/home/pic1.png");
const AVATAR_2 = require("../../../assets/images/home/pic2.png");
const AVATAR_3 = require("../../../assets/images/home/pic3.png");
const AVATAR_4 = require("../../../assets/images/home/pic4.png");

const MOCK_BOOKINGS: BookingListItem[] = [
  {
    id: "BK-2025-07124",
    artistName: "Sofia Laurent",
    artistAvatar: AVATAR,
    specialty: "Bridal Makeup",
    status: "upcoming",
    dateLabel: "Jul 12, 2025",
    timeLabel: "10:00 AM",
    visitType: "Mobile Visit",
    total: 285.4,
  },
  {
    id: "BK-2025-06981",
    artistName: "Amara Osei",
    artistAvatar: AVATAR_2,
    specialty: "Hair Styling",
    status: "pending",
    dateLabel: "Jul 18, 2025",
    timeLabel: "2:00 PM",
    visitType: "Home Studio",
    total: 120,
  },
  {
    id: "BK-2025-05320",
    artistName: "Leila Farouk",
    artistAvatar: AVATAR_3,
    specialty: "Cut & Colour",
    status: "completed",
    dateLabel: "Jun 30, 2025",
    timeLabel: "11:30 AM",
    visitType: "Home Studio",
    total: 95,
  },
  {
    id: "BK-2025-04117",
    artistName: "Isabelle Renaud",
    artistAvatar: AVATAR_4,
    specialty: "Facial Treatment",
    status: "cancelled",
    dateLabel: "Jun 20, 2025",
    timeLabel: "9:00 AM",
    visitType: "Mobile Visit",
    total: 150,
  },
];

// ---------------------------------------------------------------------------
// Status styling
// ---------------------------------------------------------------------------
const STATUS_STYLES: Record<
  BookingStatus,
  { label: string; bg: string; color: string }
> = {
  upcoming: { label: "Upcoming", bg: "#EAF7F3", color: "#1A5A52" },
  pending: { label: "Pending", bg: "#FFF3E0", color: "#E17100" },
  completed: { label: "Completed", bg: "#EAF0FF", color: "#2F5FDB" },
  cancelled: { label: "Cancelled", bg: "#FDEDF1", color: "#E0405B" },
};

const FILTERS: { id: BookingStatus; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "pending", label: "Pending" },
];

// ---------------------------------------------------------------------------
// Booking card
// ---------------------------------------------------------------------------
const BookingCard = ({ booking }: { booking: BookingListItem }) => {
  const statusStyle = STATUS_STYLES[booking.status];
  const canCancel =
    booking.status === "upcoming" || booking.status === "pending";

  return (
    <View
      className="bg-white rounded-[20px] p-4 mb-4"
      style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
    >
      <View className="flex-row items-center">
        <Image
          source={booking.artistAvatar}
          style={{ width: 44, height: 44, borderRadius: 12 }}
          resizeMode="cover"
        />
        <View className="flex-1 ml-3">
          <Text className="text-sm font-extrabold text-[#161119]">
            {booking.artistName}
          </Text>
          <Text className="text-xs text-[#8A8590] mt-0.5">
            {booking.specialty}
          </Text>
        </View>
        <View
          className="flex-row items-center rounded-full px-2.5 py-1"
          style={{ backgroundColor: statusStyle.bg }}
        >
          <Ionicons
            name="ellipse"
            size={7}
            color={statusStyle.color}
            style={{ marginRight: 4 }}
          />
          <Text
            className="text-[10px] font-bold"
            style={{ color: statusStyle.color }}
          >
            {statusStyle.label}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mt-3" style={{ gap: 14 }}>
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={13} color="#8A8590" />
          <Text className="text-[11px] text-[#8A8590] ml-1">
            {booking.dateLabel}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={13} color="#8A8590" />
          <Text className="text-[11px] text-[#8A8590] ml-1">
            {booking.timeLabel}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={13} color="#8A8590" />
          <Text className="text-[11px] text-[#8A8590] ml-1">
            {booking.visitType}
          </Text>
        </View>
      </View>

      <View className="h-[1px] bg-[#F0EEF2] my-3" />

      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xs text-[#8A8590]">Total</Text>
        <Text className="text-base font-extrabold text-[#161119]">
          ${booking.total.toFixed(2)}
        </Text>
      </View>

      <View className="flex-row" style={{ gap: 10 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/booking-details",
              params: { id: booking.id },
            })
          }
          className="flex-1 rounded-full overflow-hidden"
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="justify-center items-center rounded-full h-[40px]"
          >
            <Text className="text-white text-sm font-bold">View Details</Text>
          </LinearGradient>
        </TouchableOpacity>

        {canCancel && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              // TODO: wire to real cancel-booking mutation for booking.id
            }}
            className="flex-1 justify-center items-center rounded-full h-[40px] border"
            style={{ borderColor: COLORS.borderColor }}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: COLORS.baseColor }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function MyBookingsScreen({
  bookings = MOCK_BOOKINGS,
}: {
  bookings?: BookingListItem[];
}) {
  const [selectedFilter, setSelectedFilter] =
    useState<BookingStatus>("upcoming");

  const filteredBookings = useMemo(
    () => bookings.filter((b) => b.status === selectedFilter),
    [bookings, selectedFilter],
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-3 pb-2">
        <Text className="text-xl font-extrabold text-[#161119]">
          My Bookings
        </Text>
        <Text className="text-xs text-[#8A8590] mt-1">
          Manage all your appointments
        </Text>
      </View>

      {/* Filter tabs */}
      <View className="px-5 mt-3 mb-2">
        <View
          className="flex-row bg-white rounded-full p-1.5"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          {FILTERS.map((filter) => {
            const isSelected = filter.id === selectedFilter;
            return (
              <TouchableOpacity
                key={filter.id}
                activeOpacity={0.85}
                onPress={() => setSelectedFilter(filter.id)}
                style={{ flex: 1 }}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={[COLORS.baseColor1, COLORS.baseColor2]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      borderRadius: 999,
                      paddingVertical: 9,
                      alignItems: "center",
                    }}
                  >
                    <Text className="text-xs font-bold text-white">
                      {filter.label}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={{ paddingVertical: 9, alignItems: "center" }}>
                    <Text className="text-xs font-bold text-[#8A8590]">
                      {filter.label}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bookings list */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <BookingCard booking={item} />}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <Ionicons name="calendar-outline" size={36} color="#D9D3E0" />
            <Text className="text-sm text-[#8A8590] mt-3">
              No {STATUS_STYLES[selectedFilter].label.toLowerCase()} bookings
              yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
