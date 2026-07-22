import { LinearGradient } from "expo-linear-gradient";
import {
    ChevronLeft,
    Flag,
    Image as ImageIcon,
    Search,
    Star,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Review {
  id: number;
  initials: string;
  bg: string;
  fg: string;
  name: string;
  status: string;
  service: string;
  date: string;
  rating: number;
  text: string;
  photos: number;
  response: string | null;
  reported: boolean;
}

const initialReviews: Review[] = [
  {
    id: 1,
    initials: "SW",
    bg: "#fbcfe8",
    fg: "#be185d",
    name: "Sophia Williams",
    status: "Approved",
    service: "Bridal Makeup",
    date: "Jun 28, 2025",
    rating: 5,
    text: "Absolutely stunning work! The artist understood exactly what I wanted for my wedding day. The makeup lasted all day and I received so many compliments. Highly recommend!",
    photos: 3,
    response:
      "Thank you so much, Sophia! It was an honor to be part of your special day. Wishing you a lifetime of happiness!",
    reported: false,
  },
  {
    id: 2,
    initials: "EJ",
    bg: "#a7f3d0",
    fg: "#047857",
    name: "Emma Johnson",
    status: "Approved",
    service: "Facial Treatment",
    date: "Jun 25, 2025",
    rating: 4,
    text: "Really lovely experience. My skin felt amazing afterwards. The artist was very professional and knowledgeable about skincare. Would definitely book again.",
    photos: 1,
    response: null,
    reported: false,
  },
  {
    id: 3,
    initials: "AM",
    bg: "#fde68a",
    fg: "#b45309",
    name: "Ava Martinez",
    status: "Approved",
    service: "Full Makeover",
    date: "Jun 18, 2025",
    rating: 5,
    text: "Mind-blowing transformation! I felt like a completely new person. The attention to detail and quality of products used is top-notch. 10/10 experience.",
    photos: 5,
    response: null,
    reported: false,
  },
  {
    id: 4,
    initials: "MT",
    bg: "#ddd6fe",
    fg: "#6d28d9",
    name: "Mia Thompson",
    status: "Approved",
    service: "Hair Styling",
    date: "Jun 12, 2025",
    rating: 3,
    text: "Decent service but took longer than expected. The result was okay but not exactly what I asked for.",
    photos: 0,
    response: null,
    reported: true,
  },
];

const filters = ["All", "5 Star", "4 Star", "3 Star", "Reported"];

function Stars({ rating }: { rating: number }) {
  return (
    <View className="flex-row gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          color={i <= rating ? "#fbbf24" : "#e5e7eb"}
          fill={i <= rating ? "#fbbf24" : "none"}
        />
      ))}
    </View>
  );
}

export default function ReviewsScreen() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const avgRating = useMemo(() => {
    const sum = reviews.reduce((a, r) => a + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const pendingApproval = 1;
  const reportedCount = reviews.filter((r) => r.reported).length;

  const filtered = reviews.filter((r) => {
    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Reported"
          ? r.reported
          : r.rating === Number(filter[0]);
    const matchesQuery =
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.service.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const toggleReport = (id: number) =>
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reported: !r.reported } : r)),
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pb-3 pt-4">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
            <ChevronLeft size={18} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">Reviews</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowSearch((s) => !s)}
          className="h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Search size={16} color="#374151" />
        </TouchableOpacity>
      </View>

      {showSearch && (
        <View className="px-4 pb-2">
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search by client or service..."
            placeholderTextColor="#d1d5db"
            className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm"
          />
        </View>
      )}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="gap-4 px-4">
          {/* Stats */}
          <View className="flex-row flex-wrap justify-between gap-y-3">
            <View className="w-[47%] rounded-2xl bg-white p-4 shadow-sm">
              <Text className="text-xs text-gray-400">Average Rating</Text>
              <View className="mt-1 flex-row items-center gap-1">
                <Text className="text-2xl font-bold text-gray-900">
                  {avgRating}
                </Text>
                <Stars rating={Math.round(Number(avgRating))} />
              </View>
              <Text className="mt-0.5 text-[11px] text-gray-400">
                {reviews.length} reviews
              </Text>
            </View>
            <View className="w-[47%] rounded-2xl bg-white p-4 shadow-sm">
              <Text className="text-xs text-gray-400">Total Reviews</Text>
              <Text className="mt-1 text-2xl font-bold text-rose-500">
                {reviews.length}
              </Text>
            </View>
            <View className="w-[47%] rounded-2xl bg-white p-4 shadow-sm">
              <Text className="text-xs text-gray-400">Pending Approval</Text>
              <Text className="mt-1 text-2xl font-bold text-amber-500">
                {pendingApproval}
              </Text>
            </View>
            <View className="w-[47%] rounded-2xl bg-white p-4 shadow-sm">
              <Text className="text-xs text-gray-400">Reported</Text>
              <Text className="mt-1 text-2xl font-bold text-violet-500">
                {reportedCount}
              </Text>
            </View>
          </View>

          {/* Filter chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 pb-1">
              {filters.map((f) => (
                <TouchableOpacity key={f} onPress={() => setFilter(f)}>
                  {filter === f ? (
                    <LinearGradient
                      colors={["#ec4899", "#fb923c"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="rounded-full px-4 py-2"
                    >
                      <Text className="text-xs font-medium text-white">
                        {f}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View className="rounded-full bg-white px-4 py-2 shadow-sm">
                      <Text className="text-xs font-medium text-gray-500">
                        {f}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Review cards */}
          {filtered.length === 0 && (
            <Text className="py-10 text-center text-sm text-gray-400">
              No reviews match this filter.
            </Text>
          )}
          {filtered.map((r) => (
            <View key={r.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <View className="flex-row items-start gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: r.bg }}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: r.fg }}
                  >
                    {r.initials}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-gray-900">
                    {r.name}
                  </Text>
                  <View className="mt-1 flex-row flex-wrap items-center gap-1.5">
                    <View className="rounded-full bg-emerald-100 px-2 py-0.5">
                      <Text className="text-[10px] font-semibold text-emerald-600">
                        {r.status}
                      </Text>
                    </View>
                    {r.reported && (
                      <View className="rounded-full bg-amber-100 px-2 py-0.5">
                        <Text className="text-[10px] font-semibold text-amber-600">
                          Reported
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="mt-1 text-xs text-gray-400">
                    {r.service} • {r.date}
                  </Text>
                  <View className="mt-1">
                    <Stars rating={r.rating} />
                  </View>
                </View>
              </View>

              <Text className="mt-3 text-sm leading-relaxed text-gray-600">
                {r.text}
              </Text>

              {r.photos > 0 && (
                <View className="mt-3 flex-row gap-2">
                  {Array.from({ length: Math.min(r.photos, 3) }).map((_, i) => (
                    <View
                      key={i}
                      className="h-14 w-14 items-center justify-center rounded-xl bg-pink-50"
                    >
                      <ImageIcon size={18} color="#f9a8d4" />
                    </View>
                  ))}
                  {r.photos > 3 && (
                    <View className="h-14 w-14 items-center justify-center rounded-xl bg-gray-100">
                      <Text className="text-xs font-semibold text-gray-500">
                        +{r.photos - 3}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {r.response && (
                <View className="mt-3 rounded-xl bg-emerald-50 p-3">
                  <Text className="text-xs font-semibold text-emerald-600">
                    Your Response
                  </Text>
                  <Text className="mt-0.5 text-xs leading-relaxed text-emerald-700">
                    {r.response}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={() => toggleReport(r.id)}
                className={`mt-3 flex-row items-center justify-center gap-1.5 rounded-full border py-2 ${
                  r.reported ? "border-rose-300 bg-rose-50" : "border-rose-200"
                }`}
              >
                <Flag size={12} color="#fb7185" />
                <Text className="text-xs font-medium text-rose-500">
                  {r.reported ? "Reported" : "Report"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
