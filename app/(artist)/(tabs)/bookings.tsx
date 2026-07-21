import AppTabBar from "@/components/common/AppTabBar";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { COLORS } from "@/constants/colors";
import { bookingInboxDummyResponse } from "@/constants/dummyData";
import { Booking, BookingStatus } from "@/constants/types";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterKey = "All" | "New Requests" | "Upcoming" | "Pending" | "Completed";

const FILTERS: FilterKey[] = [
  "All",
  "New Requests",
  "Upcoming",
  "Pending",
  "Completed",
];

const STATUS_TO_FILTER: Record<BookingStatus, FilterKey> = {
  new: "New Requests",
  pending: "Pending",
  accepted: "Upcoming",
  completed: "Completed",
  declined: "Pending",
};

export default function BookingInboxScreen() {
  const { summary, bookings } = bookingInboxDummyResponse.data;
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const [search, setSearch] = useState("");
  const [declineBooking, setDeclineBooking] = useState<Booking | null>(null);
  const filtered = bookings.filter((b) => {
    const matchesFilter =
      activeFilter === "All" || STATUS_TO_FILTER[b.status] === activeFilter;
    const matchesSearch =
      !search ||
      b.client.name.toLowerCase().includes(search.toLowerCase()) ||
      b.service.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingRefId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={["top"]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        className="flex-1 bg-rose-50/30"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}

        ListHeaderComponent={
          <>
            <Text className="px-5 pt-4 text-2xl font-bold text-gray-900">
              Booking Inbox
            </Text>

            {/* Search */}
            <View
              className="mx-5 h-12 mt-2 flex-row items-center rounded-2xl bg-white px-4 shadow-sm"
              style={{
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.08,
                shadowRadius: 4,
              }}
            >
              <Feather name="search" size={15} color="red" />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search"
                placeholderTextColor="#9CA3AF"
                className="ml-2 flex-1 text-base text-gray-700"
              />

              {search.trim().length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearch("")}
                  className="ml-2 h-6 w-6 items-center justify-center rounded-full bg-gray-200"
                >
                  <Feather name="x" size={14} color="red" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-4"
              contentContainerStyle={{
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <View className="flex-row" style={{ gap: 8 }}>
                {FILTERS.map((f) => {
                  const active = f === activeFilter;

                  return (
                    <TouchableOpacity
                      key={f}
                      onPress={() => setActiveFilter(f)}
                      activeOpacity={0.8}
                    >
                      {active ? (
                        <LinearGradient
                          colors={[COLORS.baseColor1, COLORS.baseColor2]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{
                            borderRadius: 999,
                          }}
                          className="px-3 py-2"
                        >
                          <Text className="text-xs font-semibold text-white">
                            {f}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View className="rounded-full border border-gray-100 bg-white px-3 py-2">
                          <Text className="text-xs font-semibold text-gray-500">
                            {f}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Summary */}
            <View className="mx-5 mt-4 mb-4 rounded-3xl bg-white p-4 shadow-sm">
              <Text className="mb-3 text-[10px] font-semibold tracking-wider text-gray-400">
                TODAY&apos;S SUMMARY
              </Text>

              <View className="flex-row justify-between">
                <SummaryItem
                  value={String(summary.requests)}
                  label="Requests"
                  color="text-orange-400"
                />

                <SummaryItem
                  value={String(summary.pending)}
                  label="Pending"
                  color="text-amber-500"
                />

                <SummaryItem
                  value={String(summary.accepted)}
                  label="Accepted"
                  color="text-emerald-500"
                />

                <SummaryItem
                  value={`$${summary.earnings}`}
                  label="Earnings"
                  color="text-gray-900"
                />
              </View>
            </View>
          </>
        }

        renderItem={({ item }) => (
          <BookingCard booking={item} onDecline={setDeclineBooking} />
        )}

        ListEmptyComponent={
          <Text className="mt-8 text-center text-sm text-gray-400">
            No bookings found.
          </Text>
        }

        ListFooterComponent={<View />}
      />

      <AppTabBar active="Bookings" />

      <DeclineModal
        booking={declineBooking}
        onClose={() => setDeclineBooking(null)}
      />
    </SafeAreaView>
  );
}

function SummaryItem({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View className="items-center">
      <Text className={`text-lg font-bold ${color}`}>{value}</Text>
      <Text className="mt-0.5 text-[11px] text-gray-400">{label}</Text>
    </View>
  );
}

function BookingCard({
  booking: b,
  onDecline,
}: {
  booking: Booking;
  onDecline: (booking: Booking) => void;
}) {
  return (
    <View className="mb-4 mx-4 rounded-3xl bg-white p-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: b.client.avatarUrl }}
            className="h-11 w-11 rounded-full"
          />
          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text className="text-[15px] font-bold text-gray-900">
                {b.client.name}
              </Text>
              {b.client.isVerified && (
                <View className="ml-1.5 flex-row items-center rounded-full bg-emerald-50 px-1.5 py-0.5">
                  <Feather name="check" size={9} color="#10B981" />
                  <Text className="ml-0.5 text-[9px] font-semibold text-emerald-500">
                    Verified
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-xs text-gray-500">{b.service}</Text>
            <Text className="text-[11px] text-gray-400">{b.requestedAt}</Text>
          </View>
        </View>
        <StatusBadge status={b.status} />
      </View>

      {b.status === "accepted" ? (
        <View className="mt-3 flex-row items-center justify-between">
          <Metric label="Duration" value={`${b.durationMinutes} min`} />
          <Metric
            label="Type"
            value={b.visitType === "Home Visit" ? "Home" : "Studio"}
          />
          <Metric
            label="Earn"
            value={`$${b.amount}`}
            valueColor="text-emerald-500"
          />
        </View>
      ) : (
        <View
          className="mt-3 flex-row flex-wrap items-center"
          style={{ gap: 14 }}
        >
          <View className="flex-row items-center">
            <Feather name="calendar" size={12} color="#9CA3AF" />
            <Text className="ml-1.5 text-xs text-gray-500">{b.date}</Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="clock" size={12} color="#9CA3AF" />
            <Text className="ml-1.5 text-xs text-gray-500">{b.time}</Text>
          </View>
          {b.status !== "completed" && (
            <View className="flex-row items-center">
              <Feather name="navigation" size={12} color="#9CA3AF" />
              <Text className="ml-1.5 text-xs text-gray-500">
                {b.visitType}
              </Text>
            </View>
          )}
        </View>
      )}

      {b.status !== "accepted" && (
        <View className="mt-2 flex-row items-center justify-between">
          {b.status !== "completed" ? (
            <>
              <View className="flex-row items-center">
                <Feather name="map-pin" size={12} color="#9CA3AF" />
                <Text className="ml-1.5 text-xs text-gray-500">
                  {b.location}
                </Text>
              </View>
            </>
          ) : (
            <View className="flex-row items-center" style={{ gap: 4 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Feather key={i} name="star" size={12} color="#FBBF24" />
              ))}
              <Text className="ml-1 text-xs font-semibold text-gray-700">
                {b.review?.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      )}

      {b.status !== "completed" && (
        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-900">
            {b.status === "accepted" ? "" : `$${b.amount}`}
          </Text>
          {b.status !== "accepted" && (
            <Text className="text-xs text-gray-400">Total booking value</Text>
          )}
        </View>
      )}

      {b.status === "completed" && b.review && (
        <View className="mt-3 rounded-2xl bg-gray-50 p-3">
          <Text className="text-[10px] font-semibold text-gray-400">
            Client Review
          </Text>
          <Text className="mt-1 text-[13px] italic text-gray-600">
            {b.review.comment}
          </Text>
        </View>
      )}

      {/* Action buttons */}
      <View className="mt-3 flex-row" style={{ gap: 10 }}>
        {b.status === "new" && (
          <>
            <TouchableOpacity className="flex-1 items-center rounded-full border border-gray-200 py-2.5">
              <Text className="text-xs font-semibold text-gray-600">
                View Details
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity className="flex-1 items-center rounded-full bg-rose-400 py-2.5">
              <Text className="text-xs font-semibold text-white">Accept</Text>
            </TouchableOpacity> */}
            <PrimaryButton
              title="Accept"
              onPress={() => console.log("accepted")}
            />
            <TouchableOpacity className="flex-1 items-center rounded-full border border-rose-200 py-2.5">
              <Text className="text-xs font-semibold text-rose-400">
                Decline
              </Text>
            </TouchableOpacity>
          </>
        )}
        {b.status === "accepted" && (
          <>
            {/* <TouchableOpacity className="flex-1 items-center rounded-full bg-rose-400 py-2.5">
              <Text className="text-xs font-semibold text-white">
                View Details
              </Text>
            </TouchableOpacity> */}
            <PrimaryButton
              title="View Details"
              onPress={() => console.log("View Details")}
            />
            <TouchableOpacity className="flex-1 items-center rounded-full border border-gray-200 py-2.5">
              <Text className="text-xs font-semibold text-gray-600">
                Message
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 items-center rounded-full border border-rose-200 py-2.5">
              <Text className="text-xs font-semibold text-rose-300">
                Cancel
              </Text>
            </TouchableOpacity>
          </>
        )}
        {b.status === "pending" && (
          <>
            <TouchableOpacity className="flex-1 items-center rounded-full border border-gray-200 py-2.5">
              <Text className="text-xs font-semibold text-gray-600">
                View Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 items-center rounded-full border border-rose-200 py-2.5">
              <Text className="text-xs font-semibold text-rose-400">
                Decline
              </Text>
            </TouchableOpacity>
          </>
        )}
        {b.status === "completed" && (
          <>
            <TouchableOpacity className="flex-1 items-center rounded-full border border-gray-200 py-2.5">
              <Text className="text-xs font-semibold text-gray-600">
                View Receipt
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 items-center rounded-full border border-gray-200 py-2.5">
              <Text className="text-xs font-semibold text-gray-600">
                View Review
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity className="flex-1 items-center rounded-full bg-rose-400 py-2.5">
              <Text className="text-xs font-semibold text-white">
                Book Again
              </Text>
            </TouchableOpacity> */}
            <PrimaryButton
              title="Book Again"
              onPress={() => console.log("Book Again")}
            />
          </>
        )}
      </View>
    </View>
  );
}

function Metric({
  label,
  value,
  valueColor = "text-gray-900",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View>
      <Text className={`text-sm font-bold ${valueColor}`}>{value}</Text>
      <Text className="text-[11px] text-gray-400">{label}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<
    BookingStatus,
    { label: string; bg: string; text: string }
  > = {
    new: { label: "New", bg: "bg-orange-50", text: "text-orange-400" },
    pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-500" },
    accepted: {
      label: "Accepted",
      bg: "bg-emerald-50",
      text: "text-emerald-500",
    },
    completed: { label: "", bg: "", text: "" },
    declined: { label: "Declined", bg: "bg-gray-100", text: "text-gray-400" },
  };
  if (status === "completed") return null;
  const s = map[status];
  return (
    <View className={`rounded-full px-2.5 py-1 ${s.bg}`}>
      <Text className={`text-[11px] font-semibold ${s.text}`}>{s.label}</Text>
    </View>
  );
}

function DeclineModal({
  booking,
  onClose,
}: {
  booking: Booking | null;
  onClose: () => void;
}) {
  if (!booking) return null;

  const message =
    booking.status === "new"
      ? "Are you sure you want to decline this booking request? The client will be notified."
      : booking.status === "pending"
        ? "This booking is currently pending. Declining will remove it from your active requests."
        : "Are you sure you want to cancel this booking? This action cannot be undone.";

  return (
    <Modal transparent visible={!!booking} animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/40 px-5">
        <View className="w-full rounded-3xl bg-white p-5">
          <Text className="text-lg font-bold text-gray-900">
            Decline Booking
          </Text>

          <Text className="mt-3 text-sm text-gray-500">{message}</Text>

          <View className="mt-5 flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 rounded-full border border-gray-200 py-3"
            >
              <Text className="text-center text-sm font-semibold text-gray-600">
                Keep Booking
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // API call here
                onClose();
              }}
              className="flex-1 rounded-full bg-rose-400 py-3"
            >
              <Text className="text-center text-sm font-semibold text-white">
                Decline
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
