import AppHeader from "@/components/common/AppHeader";
import ArtistCard, { Artist } from "@/components/common/ArtistCard";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  featured?: boolean;
  distanceKm?: number;
};

const MOCK_ARTISTS: ArtistWithFilters[] = [
  {
    id: "art_001",
    name: "Sofia Marchetti",
    specialty: "Makeup Artist",
    category: "Bridal & Editorial",
    services: ["Bridal Makeup", "Editorial Makeup", "Party Makeup"],
    location: "Sydney, NSW",
    yearsExperience: 8,
    radiusKm: 15,
    distanceKm: 1.8,
    rating: 4.1,
    reviewCount: 847,
    priceFrom: 120,
    heroImage: HERO_1,
    portfolioImages: [THUMB_1, THUMB_2, THUMB_3],
    extraPortfolioCount: 12,
    verified: true,
    availableToday: true,
    topRated: true,
    featured: true,
  },

  {
    id: "art_002",
    name: "Amara Osei",
    specialty: "Hair Stylist",
    category: "Natural & Textured Hair",
    services: ["Hair Styling", "Natural Hair", "Braiding"],
    location: "Melbourne, VIC",
    yearsExperience: 6,
    radiusKm: 10,
    distanceKm: 2.6,
    rating: 4.2,
    reviewCount: 610,
    priceFrom: 95,
    heroImage: HERO_2,
    portfolioImages: [THUMB_1, THUMB_2, THUMB_3],
    verified: true,
    availableToday: true,
    topRated: true,
    featured: true,
  },

  {
    id: "art_003",
    name: "Leila Farouk",
    specialty: "Hair Stylist",
    category: "Cut & Colour",
    services: ["Hair Styling", "Hair Colour", "Party Makeup"],
    location: "Brisbane, QLD",
    yearsExperience: 6,
    radiusKm: 12,
    distanceKm: 4.2,
    rating: 4.3,
    reviewCount: 524,
    priceFrom: 85,
    heroImage: HERO_3,
    portfolioImages: [THUMB_1, THUMB_2, THUMB_3],
    verified: true,
    availableToday: true,
    featured: true,
  },

  {
    id: "art_004",
    name: "Isabelle Renaud",
    specialty: "Formal Makeup Expert",
    category: "Skincare & Glow Treatments",
    services: ["Skincare", "Formal Makeup", "Bridal Makeup"],
    location: "Sydney, NSW",
    yearsExperience: 10,
    radiusKm: 20,
    distanceKm: 1.2,
    rating: 4.4,
    reviewCount: 381,
    priceFrom: 150,
    heroImage: HERO_4,
    portfolioImages: [THUMB_1, THUMB_2, THUMB_3],
    verified: true,
    availableToday: true,
    topRated: true,
    featured: false,
  },

  {
    id: "art_005",
    name: "Priya Nair",
    specialty: "Makeup Artist",
    category: "Festival & Party",
    services: ["Party Makeup", "Festival Look", "Hair Styling"],
    location: "Perth, WA",
    yearsExperience: 5,
    radiusKm: 18,
    distanceKm: 2.1,
    rating: 4.5,
    reviewCount: 298,
    priceFrom: 75,
    heroImage: HERO_1,
    portfolioImages: [THUMB_1, THUMB_2, THUMB_3],
    verified: true,
    availableToday: false,
    featured: false,
  },
];

// ---------------------------------------------
// Sort option definitions for each header variant
// ---------------------------------------------
type FeaturedSort = "popular" | "rating" | "nearest" | "price";
type NearbySort = "nearest" | "rating" | "available" | "price";

const FEATURED_SORT_OPTIONS: { key: FeaturedSort; label: string }[] = [
  { key: "popular", label: "Most Popular" },
  { key: "rating", label: "Highest Rated" },
  { key: "nearest", label: "Nearest" },
  { key: "price", label: "Low to High" },
];

const NEARBY_SORT_OPTIONS: { key: NearbySort; label: string }[] = [
  { key: "nearest", label: "Nearest" },
  { key: "rating", label: "Highest Rated" },
  { key: "available", label: "Available Today" },
  { key: "price", label: "Lowest Price" },
];

const RADIUS_OPTIONS = [5, 10, 20, 50];

// Mock current-location data — replace with real geolocation/reverse-geocode API
const MOCK_LOCATION = {
  label: "Marylebone, London",
  detail: "W1U 4PH · Accurate to 50m",
};

// ---------------------------------------------
// Small reusable pill used across the Featured / Nearby headers
// ---------------------------------------------
const FilterPill = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => {
  if (active) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <LinearGradient
          colors={[COLORS.baseColor1, COLORS.baseColor2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 999,
            paddingHorizontal: 14,
            paddingVertical: 8,
          }}
        >
          <Text className="text-xs font-bold text-white">{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="rounded-full px-3.5 py-2 bg-white border border-[#EDE9F0]"
    >
      <Text className="text-xs font-semibold text-[#8A8590]">{label}</Text>
    </TouchableOpacity>
  );
};

export default function ArtistListScreen() {
  const params = useLocalSearchParams<{
    location?: string;
    date?: string;
    time?: string;
    service?: string;
    people?: string;
    type?: string;
  }>();

  const artistType = Array.isArray(params.type) ? params.type[0] : params.type;
  const isFeatured = artistType === "featured";
  const isNearby = artistType === "nearby";

  const screenTitle = isFeatured
    ? "Featured Artists"
    : isNearby
      ? "Nearby Artists"
      : params.service || "Find My Artist";

  const [searchText, setSearchText] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortType, setSortType] = useState<"rating" | "price">("rating");

  // Featured Artists header state
  const [featuredSort, setFeaturedSort] = useState<FeaturedSort>("popular");

  // Nearby Artists header state
  const [radiusKm, setRadiusKm] = useState(10);
  const [nearbySort, setNearbySort] = useState<NearbySort>("nearest");

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
        const matchesNearby =
          !isNearby || (artist.distanceKm ?? 999) <= radiusKm;

        const matchesFeatured = !isFeatured || artist.featured === true;

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
          matchesNearby &&
          matchesFeatured &&
          matchesService &&
          matchesLocation &&
          matchesSearch &&
          matchesAvailability
        );
      })
      .sort((a, b) => {
        if (isFeatured) {
          switch (featuredSort) {
            case "popular":
              return b.reviewCount - a.reviewCount;
            case "rating":
              return b.rating - a.rating;
            case "nearest":
              return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
            case "price":
              return a.priceFrom - b.priceFrom;
          }
        }

        if (isNearby) {
          switch (nearbySort) {
            case "nearest":
              return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
            case "rating":
              return b.rating - a.rating;
            case "available":
              return Number(!!b.availableToday) - Number(!!a.availableToday);
            case "price":
              return a.priceFrom - b.priceFrom;
          }
        }

        if (sortType === "rating") {
          return b.rating - a.rating;
        }

        return a.priceFrom - b.priceFrom;
      });
  }, [
    artistsData,
    params.service,
    params.location,
    isFeatured,
    isNearby,
    featuredSort,
    radiusKm,
    nearbySort,
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

  // ---------------------------------------------
  // Header content — three variants depending on how this screen was reached
  // ---------------------------------------------
  const renderListHeader = () => {
    if (isFeatured) {
      return (
        <View className="mb-4 mt-1">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingRight: 20 }}
          >
            {FEATURED_SORT_OPTIONS.map((opt) => (
              <FilterPill
                key={opt.key}
                label={opt.label}
                active={featuredSort === opt.key}
                onPress={() => setFeaturedSort(opt.key)}
              />
            ))}
          </ScrollView>
        </View>
      );
    }

    if (isNearby) {
      return (
        <View className="mb-4 mt-1">
          {/* Current location card */}
          <View
            className="flex-row items-center justify-between bg-white rounded-[16px] px-4 py-3 mb-3.5"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 1,
            }}
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-9 h-9 rounded-full bg-[#F4E9FC] items-center justify-center mr-3">
                <Ionicons name="location" size={16} color="#B57EDC" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] text-[#9A94A0]">
                  Current Location
                </Text>
                <Text
                  className="text-sm font-bold text-[#161119]"
                  numberOfLines={1}
                >
                  {MOCK_LOCATION.label}
                </Text>
                <Text className="text-[11px] text-[#8A8590] mt-0.5">
                  {MOCK_LOCATION.detail}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="rounded-full px-3.5 py-1.5 border"
              style={{ borderColor: COLORS.baseColor }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: COLORS.baseColor }}
              >
                Change
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search radius */}
          <Text className="text-[11px] font-bold tracking-[1px] text-[#9A94A0] mb-2">
            SEARCH RADIUS
          </Text>
          <View className="flex-row mb-3.5" style={{ gap: 8 }}>
            {RADIUS_OPTIONS.map((r) => (
              <FilterPill
                key={r}
                label={`${r} KM`}
                active={radiusKm === r}
                onPress={() => setRadiusKm(r)}
              />
            ))}
          </View>

          {/* Sort options */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingRight: 20 }}
          >
            {NEARBY_SORT_OPTIONS.map((opt) => (
              <FilterPill
                key={opt.key}
                label={opt.label}
                active={nearbySort === opt.key}
                onPress={() => setNearbySort(opt.key)}
              />
            ))}
          </ScrollView>
        </View>
      );
    }

    // Default: service search / "Find My Artist" flow — keep the original warning banner
    return (
      <View
        className="flex-row items-start bg-[#FBF6E9] border rounded-[16px] px-3 py-4 mb-4 mt-1"
        style={{ borderColor: "#F0E0A0" }}
      >
        <Ionicons
          name="warning-outline"
          size={18}
          color="#C9A227"
          style={{ marginRight: 8, marginTop: 1 }}
        />
        <Text className="flex-1 text-xs text-[#8A7A3D] leading-4">
          High-demand beauty experts book out quickly, so early scheduling is
          highly recommended.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]" edges={["top"]}>
      <AppHeader title="Find Artist" />

      <FlatList
        data={artists}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderListHeader}
        renderItem={({ item }) => (
          <ArtistCard
            artist={item}
            onQuickBook={() => {
              router.push({
                pathname: "/booking/setup",
                params: {
                  artistId: item.id,
                  artistName: item.name,
                  serviceId: "service_001",
                  serviceName: item.services[0] ?? "Beauty Service",
                  servicePrice: String(item.priceFrom),
                  dateLabel: "Today",
                  timeLabel: "10:00 AM",
                },
              });
            }}
            onViewProfile={(artist) =>
              router.push({
                pathname: "/artist-details",
                params: {
                  id: artist.id,
                },
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
