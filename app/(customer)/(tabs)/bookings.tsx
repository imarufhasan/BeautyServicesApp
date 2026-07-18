import ConfirmationModal from "@/components/common/ConfirmationModal";
import { COLORS } from "@/constants/colors";
import { MOCK_BOOKINGS } from "@/mock/bookings";
import { BookingListItem, BookingStatus } from "@/types/booking";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_STYLES: Record<
  BookingStatus,
  { label: string; bg: string; color: string }
> = {
  upcoming: { label: "Upcoming", bg: "#BAF1E480", color: "#1A8073" },
  pending: { label: "Pending", bg: "#FFF3E0", color: "#E17100" },
  cancelled: { label: "Cancelled", bg: "#FDEDF1", color: "#E0405B" },
  completed: { label: "Completed", bg: "#EAF0FF", color: "#2F5FDB" },
};

const FILTERS: { id: BookingStatus; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "pending", label: "Pending" },
  { id: "cancelled", label: "Cancelled" },
  { id: "completed", label: "Completed" },
];

const BookingCard = ({
  booking,
  handleCancelBooking,
}: {
  booking: BookingListItem;
  handleCancelBooking: (booking: BookingListItem) => void;
}) => {
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
          source={booking.artist.avatar}
          style={{ width: 44, height: 44, borderRadius: 12 }}
          resizeMode="cover"
        />
        <View className="flex-1 ml-3">
          <Text className="text-sm font-extrabold text-[#161119]">
            {booking.artist.name}
          </Text>
          <Text className="text-xs text-[#8A8590] mt-0.5">
            {booking.artist.specialty}
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
            {booking.schedule.date}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={13} color="#8A8590" />
          <Text className="text-[11px] text-[#8A8590] ml-1">
            {booking.schedule.startTime}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={13} color="#8A8590" />
          <Text className="text-[11px] text-[#8A8590] ml-1">
            {booking.location.type === "mobile"
              ? "Mobile Visit"
              : "Home Studio"}
          </Text>
        </View>
      </View>

      <View className="h-[1px] bg-[#F0EEF2] my-3" />

      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xs text-[#8A8590]">Total</Text>
        <Text className="text-base font-extrabold text-[#161119]">
          ${booking.payment.total.toFixed(2)}
        </Text>
      </View>

      <View className="flex-row" style={{ gap: 10 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            // router.push({
            //   pathname: "/booking-details",
            //   params: { bookingData: JSON.stringify(booking) },
            // });
            router.push({
              pathname: "/booking-details",
              params: {
                bookingData: JSON.stringify(booking),
              },
            });
          }}
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
            onPress={() => handleCancelBooking(booking)}
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

export default function MyBookingsScreen({
  bookings = MOCK_BOOKINGS,
}: {
  bookings?: BookingListItem[];
}) {
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState<BookingListItem | null>(null);

  const [selectedFilter, setSelectedFilter] =
    useState<BookingStatus>("upcoming");

  const filteredBookings = useMemo(
    () => bookings.filter((b) => b.status === selectedFilter),
    [bookings, selectedFilter],
  );

  const handleCancelBooking = (booking: BookingListItem) => {
    setSelectedBooking(booking);
    setCancelModalVisible(true);
  };

  const confirmCancelBooking = () => {
    if (!selectedBooking) return;

    console.log("Cancel booking:", selectedBooking.id);

    // TODO API:
    // await cancelBookingMutation(selectedBooking.id)

    setCancelModalVisible(false);
    setSelectedBooking(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-extrabold text-[#161119]">
          My Bookings
        </Text>
        <Text className="text-sm text-[#8A8590] mt-1">
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
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            handleCancelBooking={handleCancelBooking}
          />
        )}
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

      <ConfirmationModal
        visible={cancelModalVisible}
        title="Cancel Booking?"
        message={
          selectedBooking
            ? `Are you sure you want to cancel your ${selectedBooking.status} booking with ${selectedBooking.artist.name}? This option is only available before your appointment begins.`
            : ""
        }
        confirmText="Yes, Cancel"
        cancelText="Keep Booking"
        onConfirm={confirmCancelBooking}
        onCancel={() => {
          setCancelModalVisible(false);
          setSelectedBooking(null);
        }}
      />
    </SafeAreaView>
  );
}
