import ConfirmationModal from "@/components/common/ConfirmationModal";
import GradientButton from "@/components/common/GradientButton";
import { COLORS } from "@/constants/colors";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Image,
    ImageSourcePropType,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type BookingStatus = "upcoming" | "completed" | "cancelled" | "pending";

export type TimelineStep = {
  id: string;
  label: string;
  timestamp?: string;
  completed: boolean;
};

export type BookingDetails = {
  bookingId: string;
  status: BookingStatus;
  timeline: TimelineStep[];

  artistName: string;
  artistAvatar: ImageSourcePropType;
  artistSpecialty: string;
  artistRating: number;
  artistReviewCount: number;
  artistPhone: string;

  serviceTags: string[];
  bookingDate: string;
  bookingTime: string;
  duration: string;
  visitType: string;
  address: string;
  travelFee: number;

  paymentMethod: string;
  transactionId: string;
  receiptNo: string;
  paymentStatus: "Paid" | "Refunded" | "Pending";
  paidAmount: number;

  yourNotes?: string;
  artistNotes?: string;

  subtotal: number;
  discount: number;
  total: number;
};

const STATUS_STYLES: Record<
  BookingStatus,
  { label: string; bg: string; color: string }
> = {
  upcoming: { label: "Upcoming", bg: "#EAF7F3", color: "#1A5A52" },
  pending: { label: "Pending", bg: "#FFF3E0", color: "#E17100" },
  completed: { label: "Completed", bg: "#EAF0FF", color: "#2F5FDB" },
  cancelled: { label: "Cancelled", bg: "#FDEDF1", color: "#E0405B" },
};

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-[11px] font-bold text-[#9A94A0] tracking-wide mb-3">
    {children}
  </Text>
);

const InfoRow = ({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) => (
  <View className="flex-row items-start justify-between py-2">
    <Text className="text-xs text-[#8A8590]">{label}</Text>
    <Text
      className="text-xs font-bold text-right"
      style={{ color: valueColor ?? "#161119", maxWidth: "62%" }}
    >
      {value}
    </Text>
  </View>
);

const Divider = () => (
  <View className="h-[1px] bg-[#F0EEF2]" style={{ marginVertical: 2 }} />
);

const Stars = ({ rating }: { rating: number }) => (
  <View className="flex-row items-center">
    <Fontisto name="star" size={11} color="#FC6C8C" />
    <Text className="text-xs font-extrabold text-[#161119] ml-1">
      {rating.toFixed(1)}
    </Text>
  </View>
);

export default function BookingDetailsScreen() {
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(
    null,
  );

  const { bookingData } = useLocalSearchParams<{
    bookingData?: string;
  }>();

  const booking: BookingDetails | null = useMemo(() => {
    if (!bookingData) {
      return null;
    }

    try {
      const item = JSON.parse(bookingData);

      return {
        bookingId: item.bookingNumber,
        status: item.status,

        timeline: [
          {
            id: "1",
            label: "Booking Requested",
            timestamp: item.createdAt,
            completed: true,
          },
          {
            id: "2",
            label: "Artist Confirmed",
            completed: item.status !== "pending" && item.status !== "cancelled",
          },
          {
            id: "3",
            label: "Payment Processed",
            completed:
              item.status === "upcoming" || item.status === "completed",
          },
          {
            id: "4",
            label: "Appointment Date",
            timestamp: `${item.schedule.date} ${item.schedule.startTime}`,
            completed: item.status === "completed",
          },
        ],

        artistName: item.artist.name,
        artistAvatar: item.artist.avatar,
        artistSpecialty: item.artist.specialty,
        artistRating: item.artist.rating,
        artistReviewCount: item.artist.totalReviews,
        artistPhone: "+1 555 555 5555",

        serviceTags: [item.service.name],

        bookingDate: item.schedule.date,
        bookingTime: item.schedule.startTime,
        duration: item.service.duration,

        visitType:
          item.location.type === "mobile"
            ? "Mobile — At Your Location"
            : "Home Studio",

        address: item.location.address,

        travelFee: item.payment.serviceFee,

        paymentMethod: "Visa •••• 4242",
        transactionId: "TXN-" + item.id,
        receiptNo: "RCP-" + item.id,

        paymentStatus: item.status === "cancelled" ? "Refunded" : "Paid",

        paidAmount: item.payment.total,

        subtotal: item.payment.subtotal,
        discount: 0,
        total: item.payment.total,

        yourNotes: "",
        artistNotes: "",
      };
    } catch (error) {
      console.log("Booking parse error:", error);
      return null;
    }
  }, [bookingData]);
  console.log("booking: ", booking?.status);

  if (!booking) {
    return (
      <SafeAreaView className="flex-1 bg-[#FBF9FC] items-center justify-center">
        <Text className="text-sm text-[#8A8590]">Booking not found</Text>
      </SafeAreaView>
    );
  }

  const statusStyle = STATUS_STYLES[booking.status];

  const handleCall = () => {
    Linking.openURL(`tel:${booking.artistPhone.replace(/\s/g, "")}`);
  };

  const handleMessage = () => {
    router.push("/chatScreen");
  };

  const handleReschedule = () => {
    // TODO: navigate to reschedule flow with booking.bookingId
  };

  const handleBookAgain = () => {
    router.push("/artist-details");
  };

  const handleDownloadReceipt = () => {
    // TODO: generate/download PDF receipt
  };

  // const handleCancelBooking = () => {
  //   setCancelModalVisible(true);
  // };
  const handleCancelBooking = () => {
    setSelectedBooking(booking);
    setCancelModalVisible(true);
  };

  const confirmCancelBooking = () => {
    if (!selectedBooking) return;
    console.log("Cancel booking:", selectedBooking);
    setCancelModalVisible(false);
    setSelectedBooking(null);
    router.push("/cancellation-refund");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 1,
          }}
        >
          <Ionicons name="chevron-back" size={18} color="#161119" />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-[#161119]">
          Booking Details
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
      >
        {/* Status + timeline card */}
        <View
          className="bg-white rounded-[20px] p-4 mt-1"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <View className="flex-row items-start justify-between mb-2">
            <View>
              <Text className="text-[11px] text-[#8A8590]">Booking Status</Text>
              <View
                className="flex-row items-center rounded-full px-2.5 py-1 mt-1.5 self-start"
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
            <View className="items-end">
              <Text className="text-[11px] text-[#8A8590]">Booking ID</Text>
              <Text className="text-xs font-extrabold text-[#161119] mt-1.5">
                {booking.bookingId}
              </Text>
            </View>
          </View>

          <Divider />

          <View className="mt-2">
            {booking.timeline.map((step, idx) => {
              const isLast = idx === booking.timeline.length - 1;
              return (
                <View key={step.id} className="flex-row">
                  <View className="items-center" style={{ width: 24 }}>
                    <View
                      className="items-center justify-center rounded-full"
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: step.completed ? "#F4E4FF" : "#F0EEF2",
                      }}
                    >
                      {step.completed ? (
                        <Ionicons name="checkmark" size={12} color="#B57EDC" />
                      ) : (
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "#D9D3E0",
                          }}
                        />
                      )}
                    </View>
                    {!isLast && (
                      <View
                        style={{
                          width: 2,
                          flex: 1,
                          minHeight: 28,
                          backgroundColor: step.completed
                            ? "#E9D5F7"
                            : "#F0EEF2",
                        }}
                      />
                    )}
                  </View>
                  <View className="flex-1 pb-4 pl-2">
                    <Text
                      className="text-sm font-bold"
                      style={{
                        color: step.completed ? "#161119" : "#B0AAB6",
                      }}
                    >
                      {step.label}
                    </Text>
                    {!!step.timestamp && (
                      <Text className="text-[11px] text-[#B0AAB6] mt-0.5">
                        {step.timestamp}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Artist card */}
        <View className="mt-4">
          <CardTitle>ARTIST</CardTitle>
          <View
            className="bg-white rounded-[20px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <View className="flex-row items-center">
              <Image
                source={booking.artistAvatar}
                style={{ width: 52, height: 52, borderRadius: 16 }}
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <View className="flex-row items-center">
                  <Text className="text-sm font-extrabold text-[#161119]">
                    {booking.artistName}
                  </Text>
                  <Ionicons
                    name="checkmark-circle"
                    size={13}
                    color="#48B9A8"
                    style={{ marginLeft: 4 }}
                  />
                </View>
                <Text className="text-xs text-[#8A8590] mt-0.5">
                  {booking.artistSpecialty}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Stars rating={booking.artistRating} />
                  <Text className="text-[11px] text-[#8A8590] ml-1.5">
                    · {booking.artistReviewCount} reviews
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row mt-4" style={{ gap: 10 }}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCall}
                className="flex-1 flex-row items-center justify-center rounded-full py-3 border"
                style={{ borderColor: "#F6C9D6" }}
              >
                <Ionicons
                  name="call-outline"
                  size={14}
                  color="#FC6C8C"
                  style={{ marginRight: 6 }}
                />
                <Text
                  className="text-xs font-bold"
                  style={{ color: "#FC6C8C" }}
                  numberOfLines={1}
                >
                  {booking.artistPhone}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleMessage}
                className="flex-1 rounded-full overflow-hidden"
              >
                <LinearGradient
                  colors={[COLORS.baseColor1, COLORS.baseColor2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-3 h-[40px] items-center rounded-full flex-row justify-center"
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={14}
                    color="#fff"
                    style={{ marginRight: 6 }}
                  />
                  <Text className="text-sm font-bold text-white">Message</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Booking information card */}
        <View className="mt-4">
          <CardTitle>BOOKING INFORMATION</CardTitle>
          <View
            className="bg-white rounded-[20px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <View className="flex-row flex-wrap mb-1">
              {booking.serviceTags.map((tag) => (
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

            <InfoRow label="Booking Date" value={booking.bookingDate} />
            <InfoRow label="Booking Time" value={booking.bookingTime} />
            <InfoRow label="Duration" value={booking.duration} />
            <InfoRow label="Visit Type" value={booking.visitType} />
            <InfoRow label="Address" value={booking.address} />
            <InfoRow
              label="Travel Fee"
              value={`$${booking.travelFee.toFixed(2)}`}
            />
          </View>
        </View>

        {/* Payment card */}
        <View className="mt-4">
          <CardTitle>PAYMENT</CardTitle>
          <View
            className="bg-white rounded-[20px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <InfoRow label="Payment Method" value={booking.paymentMethod} />
            <InfoRow label="Transaction ID" value={booking.transactionId} />
            <InfoRow label="Receipt No." value={booking.receiptNo} />
            <InfoRow
              label="Payment Status"
              value={booking.paymentStatus}
              valueColor={
                booking.paymentStatus === "Paid" ? "#1A9C5A" : "#E17100"
              }
            />

            <Divider />

            <View className="flex-row items-center justify-between pt-2">
              <Text className="text-sm font-extrabold text-[#161119]">
                Paid Amount
              </Text>
              <Text className="text-base font-extrabold text-[#161119]">
                ${booking.paidAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Special notes card */}
        {(booking.yourNotes || booking.artistNotes) && (
          <View className="mt-4">
            <CardTitle>SPECIAL NOTES</CardTitle>
            <View
              className="bg-white rounded-[20px] p-4"
              style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
            >
              {booking.yourNotes && (
                <View className="mb-3">
                  <Text className="text-[11px] font-bold text-[#9A94A0] mb-1.5">
                    Your Notes
                  </Text>
                  <View className="bg-[#F5F2F7] rounded-[14px] p-3">
                    <Text className="text-xs text-[#6E6875] leading-5">
                      {booking.yourNotes}
                    </Text>
                  </View>
                </View>
              )}
              {booking.artistNotes && (
                <View>
                  <Text className="text-[11px] font-bold text-[#9A94A0] mb-1.5">
                    Artist Notes
                  </Text>
                  <View className="bg-[#F5F2F7] rounded-[14px] p-3">
                    <Text className="text-xs text-[#6E6875] leading-5">
                      {booking.artistNotes}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Receipt card */}
        <View className="mt-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[11px] font-bold text-[#9A94A0] tracking-wide">
              RECEIPT
            </Text>
            <TouchableOpacity
              onPress={handleDownloadReceipt}
              className="flex-row items-center bg-[#F4E4FF] rounded-full px-3 py-1.5"
            >
              <Ionicons
                name="download-outline"
                size={12}
                color="#B57EDC"
                style={{ marginRight: 4 }}
              />
              <Text
                className="text-[11px] font-bold"
                style={{ color: "#B57EDC" }}
              >
                Download
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className="bg-white rounded-[20px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <InfoRow
              label="Subtotal"
              value={`$${booking.subtotal.toFixed(2)}`}
            />
            <InfoRow
              label="Travel Fee"
              value={`$${booking.travelFee.toFixed(2)}`}
            />
            <InfoRow
              label="Discount"
              value={`-$${booking.discount.toFixed(2)}`}
            />

            <Divider />

            <View className="flex-row items-center justify-between pt-2">
              <Text className="text-sm font-extrabold text-[#161119]">
                Total
              </Text>
              <Text className="text-base font-extrabold text-[#161119]">
                ${booking.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <View className="flex-row mt-5" style={{ gap: 10 }}>
          {(booking.status === "upcoming" || booking.status === "pending") && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleReschedule}
              className="flex-1 items-center rounded-full py-3 border"
              style={{ borderColor: "#E9D5F7", backgroundColor: "#FAF3FF" }}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="calendar-outline"
                  size={13}
                  color="#B57EDC"
                  style={{ marginRight: 5 }}
                />
                <Text
                  className="text-xs font-bold"
                  style={{ color: "#B57EDC" }}
                >
                  Reschedule
                </Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleMessage}
            className="flex-1 items-center rounded-full py-3 border"
            style={{ borderColor: "#FBDDA6", backgroundColor: "#FFF8EC" }}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="chatbubble-outline"
                size={13}
                color="#E17100"
                style={{ marginRight: 5 }}
              />
              <Text className="text-xs font-bold" style={{ color: "#E17100" }}>
                Message
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleBookAgain}
            className="flex-1 items-center rounded-full py-3 border"
            style={{ borderColor: "#F6C9D6", backgroundColor: "#FCEBEF" }}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="refresh-outline"
                size={13}
                color="#FC6C8C"
                style={{ marginRight: 5 }}
              />
              <Text className="text-xs font-bold" style={{ color: "#FC6C8C" }}>
                Book Again
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Cancel booking */}
        {(booking.status === "upcoming" || booking.status === "pending") && (
          // <TouchableOpacity
          //   activeOpacity={0.85}
          //   onPress={handleCancelBooking}
          //   className="rounded-full overflow-hidden mt-8"
          // >
          //   <LinearGradient
          //     colors={[COLORS.baseColor1, COLORS.baseColor2]}
          //     start={{ x: 0, y: 0 }}
          //     end={{ x: 1, y: 0 }}
          //     className="py-4 items-center rounded-full"
          //   >
          //     <Text className="text-white text-lg font-extrabold">
          //       Cancel Booking
          //     </Text>
          //   </LinearGradient>
          // </TouchableOpacity>
          <GradientButton
            label="Cancel Booking"
            onPress={handleCancelBooking}
            style={{ marginTop: 20, borderRadius: 100 }}
          />
        )}
        {booking.status === "completed" && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/ReviewScreen")}
            className="flex-1 mt-4 items-center rounded-full py-4 border"
            style={{
              borderColor: "#F6C9D6",
              backgroundColor: "#FCEBEF",
            }}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="star-outline"
                size={13}
                color="#FC6C8C"
                style={{ marginRight: 5 }}
              />

              <Text className="text-sm font-bold" style={{ color: "#FC6C8C" }}>
                Review
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      <ConfirmationModal
        visible={cancelModalVisible}
        title="Cancel Booking?"
        message={
          selectedBooking
            ? `Are you sure you want to cancel your ${selectedBooking.status} booking with ${selectedBooking.artistName}? This option is only available before your appointment begins.`
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
