import ArtistCard, { Artist } from "@/components/common/ArtistCard";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HERO_1 = require("../../assets/images/home/pic1.png");
const HERO_2 = require("../../assets/images/home/pic2.png");
const HERO_3 = require("../../assets/images/home/pic3.png");
const HERO_4 = require("../../assets/images/home/pic4.png");
const THUMB_1 = require("../../assets/images/home/pic1.png");
const THUMB_2 = require("../../assets/images/home/pic2.png");
const THUMB_3 = require("../../assets/images/home/pic3.png");

type ArtistWithFilters = Artist & {
  services: string[];
  location: string;
  availableToday?: boolean;
  rating: number;
  priceFrom: number;
};

const MOCK_ARTISTS: ArtistWithFilters[] = [
  {
    id: "1",
    name: "Sofia Marchetti",
    specialty: "Makeup Artist",
    category: "Bridal & Editorial",
    services: ["Bridal Makeup", "Editorial Makeup", "Party Makeup"],
    location: "Sydney, NSW",
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
    services: ["Hair Styling", "Natural Hair", "Braiding"],
    location: "Melbourne, VIC",
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
    services: ["Hair Styling", "Hair Colour", "Party Makeup"],
    location: "Brisbane, QLD",
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
    services: ["Skincare", "Formal Makeup", "Bridal Makeup"],
    location: "Sydney, NSW",
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
  {
    id: "5",
    name: "Priya Nair",
    specialty: "Makeup Artist",
    category: "Festival & Party",
    services: ["Party Makeup", "Festival Look", "Hair Styling"],
    location: "Perth, WA",
    yearsExperience: 5,
    radiusKm: 18,
    rating: 4.6,
    reviewCount: 298,
    priceFrom: 75,
    heroImage: HERO_1,
    portfolioImages: [THUMB_1, THUMB_2, THUMB_3],
    verified: true,
    availableToday: false,
  },
];

export default function ArtistListScreen() {
  const params = useLocalSearchParams<{
    location?: string;
    date?: string;
    time?: string;
    service?: string;
    people?: string;
  }>();

  const screenTitle = params.service || "Find My Artist";
  const [searchText, setSearchText] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortType, setSortType] = useState<"rating" | "price">("rating");

  const [artistsData, setArtistsData] =
    useState<ArtistWithFilters[]>(MOCK_ARTISTS);

  const artists = useMemo(() => {
    const selectedServices = params.service
      ? params.service
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      : [];

    const locationQuery = params.location?.toLowerCase().trim();

    return artistsData
      .filter((artist) => {
        // Service filter
        const matchesService =
          selectedServices.length === 0 ||
          artist.services.some((service) =>
            selectedServices.includes(service.toLowerCase()),
          );

        // Location filter
        const matchesLocation =
          !locationQuery ||
          artist.location.toLowerCase().includes(locationQuery);

        // Search filter
        const matchesSearch =
          !searchText ||
          artist.name.toLowerCase().includes(searchText.toLowerCase()) ||
          artist.specialty.toLowerCase().includes(searchText.toLowerCase());

        // Availability filter
        const matchesAvailability = !onlyAvailable || artist.availableToday;

        return (
          matchesService &&
          matchesLocation &&
          matchesSearch &&
          matchesAvailability
        );
      })
      .sort((a, b) => {
        if (sortType === "rating") {
          return b.rating - a.rating;
        }

        return a.priceFrom - b.priceFrom;
      });
  }, [
    artistsData,
    params.service,
    params.location,
    searchText,
    onlyAvailable,
    sortType,
  ]);

  const handleToggleFavorite = (artist: Artist) => {
    setArtistsData((prev) =>
      prev.map((a) =>
        a.id === artist.id ? { ...a, isFavorite: !a.isFavorite } : a,
      ),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]" edges={["top"]}>
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

        <Text className="text-base mx-2 font-extrabold text-[#161119]">
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
            onQuickBook={() => {}}
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
