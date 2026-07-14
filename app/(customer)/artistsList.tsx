import ArtistCard, { Artist } from "@/components/common/ArtistCard";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------- Local assets (swap for your real portfolio/hero photos) ----------
const HERO_1 = require("../../assets/images/home/pic1.png");
const HERO_2 = require("../../assets/images/home/pic2.png");
const HERO_3 = require("../../assets/images/home/pic3.png");
const HERO_4 = require("../../assets/images/home/pic4.png");
const THUMB_1 = require("../../assets/images/home/pic1.png");
const THUMB_2 = require("../../assets/images/home/pic2.png");
const THUMB_3 = require("../../assets/images/home/pic3.png");

// ---------- Mock data (replace with your API results) ----------
const MOCK_ARTISTS: Artist[] = [
  {
    id: "1",
    name: "Sofia Marchetti",
    specialty: "Makeup Artist",
    category: "Bridal & Editorial",
    yearsExperience: 8,
    radiusKm: 15,
    rating: 4.9,
    reviewCount: 847,
    priceFrom: 120,
    heroImage: HERO_1,
    portfolioImages: [THUMB_1, THUMB_2, THUMB_3],
    extraPortfolioCount: 12,
    verified: true,
    availableToday: true,
    topRated: true,
  },
  {
    id: "2",
    name: "Amara Osei",
    specialty: "Hair Stylist",
    category: "Natural & Textured Hair",
    yearsExperience: 6,
    radiusKm: 10,
    rating: 4.8,
    reviewCount: 610,
    priceFrom: 95,
    heroImage: HERO_2,
    portfolioImages: [THUMB_1, THUMB_2, THUMB_3],
    verified: true,
    topRated: true,
  },
  {
    id: "3",
    name: "Leila Farouk",
    specialty: "Hair Stylist",
    category: "Cut & Colour",
    yearsExperience: 6,
    radiusKm: 12,
    rating: 4.9,
    reviewCount: 524,
    priceFrom: 85,
    heroImage: HERO_3,
    portfolioImages: [THUMB_1, THUMB_2, THUMB_3],
    verified: true,
    availableToday: true,
  },
  {
    id: "4",
    name: "Isabelle Renaud",
    specialty: "Formal Expert",
    category: "Skincare & Glow Treatments",
    yearsExperience: 10,
    radiusKm: 20,
    rating: 4.7,
    reviewCount: 381,
    priceFrom: 150,
    heroImage: HERO_4,
    portfolioImages: [THUMB_1, THUMB_2, THUMB_3],
    verified: true,
    availableToday: true,
    topRated: true,
  },
];

export default function ArtistListScreen() {
  // Pulls whatever filters were passed from the Home screen search card

  const params = useLocalSearchParams<{
    location?: string;
    date?: string;
    time?: string;
    service?: string;
    people?: string;
  }>();

  const screenTitle = params.service || "Find My Artist";

  // 🔧 New: artists now live in state, not a static const
  const [artistsData, setArtistsData] = useState<Artist[]>(MOCK_ARTISTS);

  const artists = useMemo(() => {
    const serviceQuery = params.service?.toLowerCase().trim();
    const locationQuery = params.location?.toLowerCase().trim();

    return artistsData.filter((artist) => {
      const matchesService = serviceQuery
        ? artist.specialty.toLowerCase().includes(serviceQuery) ||
          artist.category.toLowerCase().includes(serviceQuery)
        : true;
      const matchesLocation = locationQuery ? true : true;
      return matchesService && matchesLocation;
    });
  }, [
    artistsData,
    params.service,
    params.location,
    params.date,
    params.people,
  ]);

  // 🔧 New: proper immutable toggle
  const handleToggleFavorite = (artist: Artist) => {
    setArtistsData((prev) =>
      prev.map((a) =>
        a.id === artist.id ? { ...a, isFavorite: !a.isFavorite } : a,
      ),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-2xl bg-white items-center justify-center"
          style={{
            shadowColor: COLORS.baseColor,
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 1,
          }}
        >
          <Ionicons name="chevron-back" size={18} color="#161119" />
        </TouchableOpacity>

        <Text className="text-base font-extrabold text-[#161119]">
          {screenTitle}
        </Text>

        <View className="w-9 h-9" />
      </View>

      <FlatList
        data={artists}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View
            className="flex-row items-start bg-[#FBF6E9] border rounded-[16px] px-3 py-4 mb-4 mt-1"
            style={{ borderColor: "green" }}
          >
            <Ionicons
              name="warning-outline"
              size={18}
              color="#C9A227"
              style={{ marginRight: 8, marginTop: 1 }}
            />
            <Text className="flex-1 text-xs text-[#8A7A3D] leading-4">
              High-demand beauty experts book out quickly, so early scheduling
              is highly recommended.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ArtistCard
            artist={item}
            onQuickBook={(artist) =>
              //   router.push({
              //     pathname: "/booking/quick-book",
              //     params: { artistId: artist.id },
              //   })
              {}
            }
            onViewProfile={(artist) =>
              router.push({
                pathname: "/artist-details",
                params: { id: artist.id },
              })
            }
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <Text className="text-sm text-[#8A8590]">
              No artists found for these filters yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
