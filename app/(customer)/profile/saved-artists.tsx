import Stars from "@/components/common/Stars";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
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
export type SavedArtist = {
  id: string;
  name: string;
  role: string;
  photo: ImageSourcePropType;
  verified: boolean;
  availability: string; // e.g. "Available Today" | "Next: Thu"
  availabilityTone: "available" | "upcoming";
  priceFrom: number;
  rating: number;
  reviewCount: number;
  distanceKm: number;
};

// ---------------------------------------------------------------------------
// Mock data — replace with real API data (saved-artists endpoint)
// ---------------------------------------------------------------------------
const MOCK_ARTISTS: SavedArtist[] = [
  {
    id: "sophie-laurent",
    name: "Sophie Laurent",
    role: "Hair Stylist",
    photo: {
      uri: "https://images.unsplash.com/photo-1541823709867-1b206113eafd?w=800&q=80",
    },
    verified: true,
    availability: "Available Today",
    availabilityTone: "available",
    priceFrom: 85,
    rating: 4.9,
    reviewCount: 218,
    distanceKm: 2.1,
  },
  {
    id: "mia-chen",
    name: "Mia Chen",
    role: "Makeup Artist",
    photo: {
      uri: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80",
    },
    verified: true,
    availability: "Next: Thu",
    availabilityTone: "upcoming",
    priceFrom: 120,
    rating: 4.8,
    reviewCount: 342,
    distanceKm: 3.4,
  },
  {
    id: "aria-patel",
    name: "Aria Patel",
    role: "Nail Technician",
    photo: {
      uri: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80",
    },
    verified: true,
    availability: "Available Today",
    availabilityTone: "available",
    priceFrom: 60,
    rating: 4.7,
    reviewCount: 156,
    distanceKm: 1.8,
  },
];

// ---------------------------------------------------------------------------
// Badge shown top-left of the photo ("Available Today" / "Next: Thu")
// ---------------------------------------------------------------------------
const AvailabilityBadge = ({
  label,
  tone,
}: {
  label: string;
  tone: "available" | "upcoming";
}) => (
  <View
    className="absolute top-3 left-3 rounded-full px-3 py-1"
    style={{
      backgroundColor: tone === "available" ? "#1A9C7E" : "#F0891C",
    }}
  >
    <Text className="text-[11px] font-bold text-white">{label}</Text>
  </View>
);

// ---------------------------------------------------------------------------
// Heart button top-right of the photo — filled because it's a saved artist
// ---------------------------------------------------------------------------
const SavedHeartButton = ({
  saved,
  onToggle,
}: {
  saved: boolean;
  onToggle: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onToggle}
    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white items-center justify-center"
    style={{
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    <Ionicons
      name={saved ? "heart" : "heart-outline"}
      size={15}
      color="#B57EDC"
    />
  </TouchableOpacity>
);

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
const ArtistCard = ({
  artist,
  onPress,
  onBookNow,
}: {
  artist: SavedArtist;
  onPress: (artist: SavedArtist) => void;
  onBookNow: (artist: SavedArtist) => void;
}) => {
  const [saved, setSaved] = useState(true);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(artist)}
      className="bg-white rounded-[20px] overflow-hidden mb-4"
      style={{
        borderColor: "#EFEAF3",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
      }}
    >
      {/* Photo */}
      <View style={{ height: 200 }}>
        <Image
          source={artist.photo}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />

        <AvailabilityBadge
          label={artist.availability}
          tone={artist.availabilityTone}
        />
        <SavedHeartButton saved={saved} onToggle={() => setSaved((s) => !s)} />

        {/* Bottom gradient scrim so name/price stay legible over the photo */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.75)"]}
          className="absolute bottom-0 left-0 right-0 px-4 pt-10 pb-3"
        >
          <View className="flex-row items-end justify-between">
            <View className="flex-1 pr-2">
              <View className="flex-row items-center">
                <Text
                  className="text-base font-extrabold text-white"
                  numberOfLines={1}
                >
                  {artist.name}
                </Text>
                {artist.verified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color="#fff"
                    style={{ marginLeft: 5 }}
                  />
                )}
              </View>
              <Text className="text-xs text-white/80 mt-0.5">
                {artist.role}
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-[10px] text-white/70">FROM</Text>
              <Text className="text-base font-extrabold text-white">
                ${artist.priceFrom}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Footer: rating, distance, book now */}
      <View className="flex-row items-center justify-between px-4 py-3.5">
        <View className="flex-row items-center">
          {/* <Ionicons name="star" size={13} color="#FC6C8C" /> */}
          <Stars rating={artist.rating} size={12} />
          {/* <Text className="text-xs font-extrabold text-[#161119] ml-1">
            {artist.rating.toFixed(1)}
          </Text> */}
          <Text className="text-xs text-[#9A94A0] ml-1">
            ({artist.reviewCount})
          </Text>

          <Ionicons
            name="location-outline"
            size={13}
            color="#9A94A0"
            style={{ marginLeft: 10 }}
          />
          <Text className="text-xs text-[#9A94A0] ml-1">
            {artist.distanceKm}km
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onBookNow(artist)}
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-full px-5 py-2"
            style={{ borderRadius: 999 }}
          >
            <Text className="text-xs font-bold text-white">Book Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function SavedArtistsScreen({
  artists = MOCK_ARTISTS,
}: {
  artists?: SavedArtist[];
}) {
  const handleCardPress = (artist: SavedArtist) => {
    router.push("/(customer)/artist-details");
  };

  const handleBookNow = (artist: SavedArtist) => {
    router.push("/(customer)/booking/setup");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <View className="flex-row items-center pt-3 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 rounded-full bg-white items-center justify-center mr-3"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 1,
            }}
          >
            <Ionicons name="chevron-back" size={18} color="#161119" />
          </TouchableOpacity>
          <Text className="text-2xl font-extrabold text-[#161119]">
            Saved Artists
          </Text>
        </View>

        {artists.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onPress={handleCardPress}
            onBookNow={handleBookNow}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
