import AppHeader from "@/components/common/AppHeader";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { COLORS } from "@/constants/colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type BookingSummary = {
  bookingId: string;
  artistName: string;
  artistAvatar: any;
  specialty: string;
  rating: number;
  date: string;
  time: string;
};

export type ReviewPayload = {
  bookingId: string;
  overallRating: number;
  tags: string[];
  reviewText: string;
  photos: {
    before: string | null;
    after: string | null;
    others: string[];
  };
};

type PhotoSlotKey = "before" | "after" | "others";

interface ReviewScreenProps {
  // Pass this in directly when navigating with a component prop,
  // otherwise it's parsed from the "bookingData" route param.
  booking?: BookingSummary;
  // Configurable so the tag list can come from the API/config later
  // instead of being hardcoded.
  ratingTags?: string[];
  // Total photos allowed across before + after + others combined.
  maxPhotos?: number;
  maxReviewLength?: number;
  // Swap this out for the real API call — everything else stays the same.
  onSubmit?: (payload: ReviewPayload) => Promise<void> | void;
  onSkip?: () => void;
}

// ---------------------------------------------------------------------------
// Config defaults
// ---------------------------------------------------------------------------
const DEFAULT_TAGS = [
  "Friendly",
  "Professional",
  "Punctual",
  "Hygienic",
  "Great Comm.",
  "Skilled",
  "Attentive",
  "Good Vibes",
  "Well Equipped",
];

const TAG_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Friendly: "happy-outline",
  Professional: "briefcase-outline",
  Punctual: "time-outline",
  Hygienic: "sparkles-outline",
  "Great Comm.": "chatbubble-ellipses-outline",
  Skilled: "star-outline",
  Attentive: "eye-outline",
  "Good Vibes": "musical-notes-outline",
  "Well Equipped": "hammer-outline",
};

const MOCK_BOOKING: BookingSummary = {
  bookingId: "BKG-1029",
  artistName: "Mia Chen",
  artistAvatar: require("../../assets/images/home/pic1.png"),
  specialty: "Full Glam Makeup",
  rating: 4.8,
  date: "Mon, 12 Aug 2024",
  time: "10:30 AM",
};

const StarRating = ({
  value,
  onChange,
  size = 30,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) => (
  <View className="flex-row justify-center mt-3">
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity
        key={star}
        activeOpacity={0.7}
        onPress={() => onChange(star)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={{ marginHorizontal: 5 }}
      >
        <FontAwesome
          name={star <= value ? "star" : "star-o"}
          size={size}
          color={star <= value ? "#FC6C8C" : "#D9D3E0"}
        />
      </TouchableOpacity>
    ))}
  </View>
);

const TagChip = ({
  label,
  selected,
  altBg,
  onPress,
}: {
  label: string;
  selected: boolean;
  altBg: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="flex-row items-center rounded-lg px-3 py-2.5 mb-2.5"
      style={{
        backgroundColor: selected ? "#F4E4FF" : "#FCFAFD",
        borderWidth: selected ? 1.5 : 1,
        borderColor: selected ? "#B57EDC" : "#EFEAF3",
        width: "31.5%",
        justifyContent: "center",
      }}
    >
      <Ionicons
        name={TAG_ICONS[label] ?? "checkmark-circle-outline"}
        size={13}
        color={selected ? "#7A3FA8" : "#8A8590"}
        style={{ marginRight: 5 }}
      />
      <Text
        className="text-[11px] font-bold"
        numberOfLines={1}
        style={{ color: selected ? "#7A3FA8" : "#6E6875" }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const PhotoSlot = ({
  label,
  uri,
  onPress,
  onRemove,
}: {
  label: string;
  uri: string | null;
  onPress: () => void;
  onRemove: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={uri ? undefined : onPress}
    className="flex-1 items-center justify-center rounded-2xl"
    style={{
      height: 90,
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: "#F6C9D6",
      backgroundColor: "#FFFBFC",
      overflow: "hidden",
    }}
  >
    {uri ? (
      <View style={{ width: "100%", height: "100%" }}>
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={onRemove}
          className="absolute top-1 right-1 rounded-full bg-black/50 p-0.5"
        >
          <Ionicons name="close" size={12} color="#fff" />
        </TouchableOpacity>
      </View>
    ) : (
      <>
        <Ionicons name="add" size={18} color="#FC6C8C" />
        <Text
          className="text-[10px] font-bold mt-1"
          style={{ color: "#FC6C8C" }}
        >
          {label}
        </Text>
      </>
    )}
  </TouchableOpacity>
);

export default function ReviewScreen({
  booking,
  ratingTags = DEFAULT_TAGS,
  maxPhotos = 6,
  maxReviewLength = 500,
  onSubmit,
  onSkip,
}: ReviewScreenProps) {
  const params = useLocalSearchParams<{ bookingData?: string }>();

  const bookingSummary: BookingSummary = useMemo(() => {
    if (booking) return booking;
    if (params.bookingData) {
      try {
        return JSON.parse(params.bookingData) as BookingSummary;
      } catch (err) {
        console.warn("Failed to parse booking param for review screen:", err);
      }
    }
    return MOCK_BOOKING;
  }, [booking, params.bookingData]);

  const [overallRating, setOverallRating] = useState(3);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [reviewText, setReviewText] = useState("");

  const [photos, setPhotos] = useState<{
    before: string | null;
    after: string | null;
    others: string[];
  }>({ before: null, after: null, others: [] });
  const [submitting, setSubmitting] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);

  const totalPhotoCount =
    (photos.before ? 1 : 0) + (photos.after ? 1 : 0) + photos.others.length;

  const othersLimit = Math.max(0, maxPhotos - 2);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  const pickImage = async (slot: PhotoSlotKey) => {
    if (totalPhotoCount >= maxPhotos) {
      Alert.alert("Limit reached", `You can upload up to ${maxPhotos} photos.`);
      return;
    }
    if (slot !== "others" && totalPhotoCount >= maxPhotos) {
      Alert.alert("Limit reached", `You can upload up to ${maxPhotos} photos.`);
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo access to upload review photos.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;
    const uri = result.assets[0].uri;

    setPhotos((prev) => {
      if (slot === "others") {
        return { ...prev, others: [...prev.others, uri] };
      }
      // "before" / "after" are single-image slots — a new pick replaces
      // whatever was there.
      return { ...prev, [slot]: uri };
    });
  };

  const removePhoto = (slot: PhotoSlotKey, index?: number) => {
    setPhotos((prev) => {
      if (slot === "others" && typeof index === "number") {
        return { ...prev, others: prev.others.filter((_, i) => i !== index) };
      }
      return { ...prev, [slot]: null };
    });
  };

  const handleReportFakeReview = () => {
    // TODO API: open report-fake-review flow / modal for this booking
    console.log("Report fake review for booking:", bookingSummary.bookingId);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      router.back();
    }
  };

  // Tapping "Submit Review" just opens the confirmation modal.
  const handleSubmitPress = () => {
    if (overallRating === 0) {
      Alert.alert("Add a rating", "Please tap a star to rate your experience.");
      return;
    }
    setSubmitModalVisible(true);
  };

  // Confirming in the modal performs the actual submit.
  const confirmSubmit = async () => {
    const payload: ReviewPayload = {
      bookingId: bookingSummary.bookingId,
      overallRating,
      tags: Array.from(selectedTags),
      reviewText: reviewText.trim(),
      photos,
    };

    setSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        // TODO API:
        // await submitReviewMutation(payload)
        console.log("Submit review payload:", payload);
      }
      setSubmitModalVisible(false);
      router.push("/bookings");
    } catch (err) {
      console.warn("Failed to submit review:", err);
      setSubmitModalVisible(false);
      Alert.alert("Something went wrong", "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <AppHeader title="Reviews" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {/* Booking summary card */}
        <View
          className="flex-row items-center bg-white rounded-[20px] p-4 mt-1"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <Image
            source={bookingSummary.artistAvatar}
            style={{ width: 46, height: 46, borderRadius: 14 }}
            resizeMode="cover"
          />
          <View className="flex-1 ml-3">
            <Text className="text-sm font-extrabold text-[#161119]">
              {bookingSummary.artistName}
            </Text>
            <Text className="text-xs text-[#8A8590] mt-0.5">
              {bookingSummary.specialty}
            </Text>
            <View className="flex-row items-center mt-1.5" style={{ gap: 10 }}>
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={11} color="#8A8590" />
                <Text className="text-[11px] text-[#8A8590] ml-1">
                  {bookingSummary.date}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={11} color="#8A8590" />
                <Text className="text-[11px] text-[#8A8590] ml-1">
                  {bookingSummary.time}
                </Text>
              </View>
            </View>
          </View>
          {/* <View className="items-end">
            <Text className="text-[11px] text-[#8A8590]">Rating</Text>
            <View className="flex-row items-center mt-1">
              <Fontisto name="star" size={11} color="#FC6C8C" />
              <Text
                className="text-sm font-extrabold ml-1"
                style={{ color: "#FC6C8C" }}
              >
                {bookingSummary.rating?.toFixed(1)}
              </Text>
            </View>
          </View> */}
        </View>

        {/* Rate your experience */}
        <View
          className="bg-white rounded-[20px] p-4 mt-4 items-center justify-center"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <Text className="text-lg font-extrabold text-[#161119]">
            Rate your experience
          </Text>

          <View className="flex-row items-center mt-1">
            <Text className="text-sm text-gray-400">Your rating:</Text>

            <Text
              className="text-sm font-extrabold ml-1"
              style={{ color: "#FC6C8C" }}
            >
              {overallRating} / 5
            </Text>
          </View>

          <StarRating value={overallRating} onChange={setOverallRating} />
        </View>

        {/* Rate the artist */}
        <View
          className="bg-white rounded-[20px] p-4 mt-4"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <Text className="text-base font-extrabold text-[#161119]">
            Rate the artist
          </Text>
          <Text className="text-xs text-[#8A8590] mt-0.5 mb-3">
            Tap all that apply
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {ratingTags.map((tag, idx) => (
              <TagChip
                key={tag}
                label={tag}
                selected={selectedTags.has(tag)}
                altBg={idx % 2 === 1}
                onPress={() => toggleTag(tag)}
              />
            ))}
          </View>
        </View>

        {/* Written review */}
        <View
          className="bg-white rounded-[20px] p-4 mt-4"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <Text className="text-[11px] font-bold text-[#9A94A0] tracking-wide mb-2">
            WRITTEN REVIEW
          </Text>
          <TextInput
            value={reviewText}
            onChangeText={(text) =>
              setReviewText(text.slice(0, maxReviewLength))
            }
            placeholder="Share your experience..."
            placeholderTextColor="#B0AAB6"
            multiline
            maxLength={maxReviewLength}
            style={{
              minHeight: 90,
              textAlignVertical: "top",
              fontSize: 13,
              color: "#161119",
            }}
          />
          <Text className="text-[10px] text-[#B0AAB6] text-right mt-1">
            {reviewText.length}/{maxReviewLength}
          </Text>
        </View>

        {/* Upload photos */}
        <View
          className="bg-white rounded-[20px] p-4 mt-4"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[11px] font-bold text-[#9A94A0] tracking-wide">
              UPLOAD PHOTOS
            </Text>
            <Text className="text-[11px] font-bold text-[#8A8590]">
              {totalPhotoCount}/{maxPhotos}
            </Text>
          </View>
          <View className="flex-row" style={{ gap: 10 }}>
            <PhotoSlot
              label="ADD BEFORE"
              uri={photos.before}
              onPress={() => pickImage("before")}
              onRemove={() => removePhoto("before")}
            />
            <PhotoSlot
              label="ADD AFTER"
              uri={photos.after}
              onPress={() => pickImage("after")}
              onRemove={() => removePhoto("after")}
            />
            {/* <PhotoSlot
              label="ADD PHOTOS"
              uri={photos.others[0] ?? null}
              onPress={() => pickImage("others")}
              onRemove={() => removePhoto("others", 0)}
            /> */}
            <View className="flex-1">
              {photos.others.length === 0 ? (
                <PhotoSlot
                  label="ADD PHOTOS"
                  uri={null}
                  onPress={() => pickImage("others")}
                  onRemove={() => {}}
                />
              ) : (
                <View className="flex-row flex-wrap" style={{ gap: 6 }}>
                  {photos.others.map((uri, index) => (
                    <View
                      key={uri}
                      style={{
                        width: 40,
                        height: 40,
                      }}
                    >
                      <PhotoSlot
                        label=""
                        uri={uri}
                        onPress={() => {}}
                        onRemove={() => removePhoto("others", index)}
                      />
                    </View>
                  ))}

                  {photos.others.length < othersLimit && (
                    <TouchableOpacity
                      onPress={() => pickImage("others")}
                      className="items-center justify-center rounded-2xl"
                      style={{
                        width: 40,
                        height: 40,
                        borderWidth: 1.5,
                        borderStyle: "dashed",
                        borderColor: "#F6C9D6",
                        backgroundColor: "#FFFBFC",
                      }}
                    >
                      <Ionicons name="add" size={16} color="#FC6C8C" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
          {photos.others.length > 1 && (
            <View className="flex-row flex-wrap mt-2" style={{ gap: 8 }}>
              {photos.others.slice(1).map((uri, idx) => (
                <View key={uri} style={{ width: 60, height: 60 }}>
                  <PhotoSlot
                    label=""
                    uri={uri}
                    onPress={() => {}}
                    onRemove={() => removePhoto("others", idx + 1)}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Report fake review */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleReportFakeReview}
          className="flex-row items-center justify-center mt-4"
        >
          <Ionicons
            name="flag-outline"
            size={12}
            color="#B0AAB6"
            style={{ marginRight: 5 }}
          />
          <Text className="text-xs text-[#B0AAB6]">Report Fake Review</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmitPress}
          disabled={submitting}
          className="rounded-full overflow-hidden mt-4"
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center rounded-full"
            style={{ opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-extrabold">
                Submit Review
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Skip */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSkip}
          className="items-center mt-4"
        >
          <Text className="text-sm font-bold text-[#8A8590]">Skip</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmationModal
        visible={submitModalVisible}
        title="Submit Review?"
        message="Once submitted, your review and rating will be posted to the artist's profile and can't be edited. Do you want to continue?"
        confirmText={submitting ? "Submitting..." : "Yes, Submit"}
        cancelText="Cancel"
        onConfirm={confirmSubmit}
        onCancel={() => setSubmitModalVisible(false)}
      />
    </SafeAreaView>
  );
}
