import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Stars from "./Stars";

export type Artist = {
  id: string;
  name: string;
  specialty: string; // e.g. "Makeup Artist" / "Hair Stylist"
  category: string; // e.g. "Bridal & Editorial"
  yearsExperience: number;
  radiusKm: number;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  heroImage: ImageSourcePropType;
  portfolioImages: ImageSourcePropType[];
  extraPortfolioCount?: number; // shown as "+N" pill
  verified?: boolean;
  availableToday?: boolean;
  topRated?: boolean;
  isFavorite?: boolean;
};

const Badge = ({
  icon,
  label,
  bg,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  bg: string;
  color: string;
}) => (
  <View
    className="flex-row items-center rounded-full px-2 py-1 mr-1.5"
    style={{ backgroundColor: bg, borderColor: color, borderWidth: 1 }}
  >
    <Ionicons name={icon} size={11} color={color} style={{ marginRight: 3 }} />
    <Text style={{ color, fontSize: 10 }} className="font-bold">
      {label}
    </Text>
  </View>
);

export default function ArtistCard({
  artist,
  onQuickBook,
  onViewProfile,
  onToggleFavorite,
}: {
  artist: Artist;
  onQuickBook?: (artist: Artist) => void;
  onViewProfile?: (artist: Artist) => void;
  onToggleFavorite?: (artist: Artist) => void;
}) {
  const visiblePortfolio = artist.portfolioImages.slice(0, 3);

  return (
    <View
      className="bg-white rounded-[20px] mb-4 overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View>
        <Image
          source={artist.heroImage}
          style={{ width: "100%", height: 190 }}
          resizeMode="cover"
        />

        {/* Top row: status badges + favorite */}
        <View className="absolute top-3 left-3 right-3 flex-row items-center justify-between">
          <View className="flex-row flex-wrap flex-1 pr-2">
            {artist.verified && (
              <Badge
                icon="checkmark-circle-outline"
                label="Verified"
                bg="#BAF1E4"
                color="#1A5A52"
              />
            )}
            {/* {artist.availableToday && (
              <Badge
                icon="ellipse"
                label="Available Today"
                bg="#FFA23026"
                color="#FFA230"
              />
            )} */}
            {artist.availableToday && (
              <View className="bg-[#FFE9A8] px-3 py-1 rounded-full">
                <Text className="text-[11px] text-[#D48A00] font-bold">
                  ● Available Today
                </Text>
              </View>
            )}
            {artist.topRated && (
              <Badge
                icon="ribbon-outline"
                label="Top Rated"
                bg="#FFFBEB"
                color="#E17100"
              />
            )}
          </View>

          <TouchableOpacity
            onPress={() => onToggleFavorite?.(artist)}
            className="w-8 h-8 rounded-full bg-white/80 items-center justify-center"
          >
            <Ionicons
              name={artist.isFavorite ? "heart" : "heart-outline"}
              size={16}
              color={artist.isFavorite ? "#B57EDC" : "#B57EDC"}
            />
          </TouchableOpacity>
        </View>

        {/* Price badge */}
        <View
          className="absolute bottom-3 right-3 bg-white rounded-2xl items-center justify-center px-3 py-2"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <Text className="text-[10px] text-[#9A94A0] font-semibold">From</Text>
          <Text className="text-sm font-extrabold text-[#161119]">
            ${artist.priceFrom}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-2">
            <Text className="text-[16px] font-extrabold text-[#161119]">
              {artist.name}
            </Text>
            {/* <Text
              style={{ color: COLORS.baseColor1 }}
              className="text-xs font-bold mt-0.5"
            >
              {artist.specialty}
            </Text> */}
            <MaskedView
              maskElement={
                <Text className="text-xs font-bold mt-0.5">
                  {artist.specialty}
                </Text>
              }
            >
              <LinearGradient
                colors={[COLORS.baseColor1, COLORS.baseColor2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text
                  className="text-xs font-bold mt-0.5"
                  style={{ opacity: 0 }}
                >
                  {artist.specialty}
                </Text>
              </LinearGradient>
            </MaskedView>
            <Text className="text-xs text-[#8A8590] mt-0.5">
              {artist.category}
            </Text>
          </View>

          <View className="flex-row items-center bg-[#FBF2E4] rounded-full px-2 py-1">
            {/* <Fontisto name="star" size={12} color="#FC6C8C" />
            <Text className="text-xs font-extrabold text-[#161119] ml-1">
              {artist.rating.toFixed(1)}
            </Text> */}
            <Stars rating={artist.rating} size={11} />
            <Text className="text-[10px] text-[#9A94A0] ml-1">
              ({artist.reviewCount})
            </Text>
          </View>
        </View>

        {/* Meta row */}
        <View className="flex-row items-center mt-2.5">
          <Ionicons name="time-outline" size={13} color="#FC6C8C" />
          <Text className="text-xs text-[#8A8590] ml-1 mr-3">
            {artist.yearsExperience} yrs
          </Text>
          <Ionicons name="navigate-outline" size={13} color="#48B9A8" />
          <Text className="text-xs text-[#8A8590] ml-1">
            {artist.radiusKm} km radius
          </Text>
        </View>

        {/* Portfolio */}
        <Text className="text-[11px] font-bold text-[#9A94A0] mt-3 mb-1.5">
          Portfolio
        </Text>
        <View className="flex-row items-center">
          {visiblePortfolio.map((img, idx) => (
            <Image
              key={idx}
              source={img}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 8,
                borderWidth: 2,
                borderColor: "#fff",
              }}
              resizeMode="cover"
            />
          ))}
          {!!artist.extraPortfolioCount && (
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: "#F4E9FC" }}
            >
              <Text
                style={{ color: COLORS.baseColor }}
                className="text-xs font-extrabold"
              >
                +{artist.extraPortfolioCount}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View className="flex-row items-center mt-4" style={{ gap: 10 }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onQuickBook?.(artist)}
            className="flex-1 rounded-full overflow-hidden"
          >
            <LinearGradient
              colors={[COLORS.baseColor1, COLORS.baseColor2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-3 items-center rounded-full"
            >
              <Text className="text-white text-sm font-bold">Quick Book</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onViewProfile?.(artist)}
            className="flex-1 py-3 items-center rounded-full border"
            style={{ borderColor: COLORS.borderColor }}
          >
            <Text
              style={{ color: COLORS.baseColor }}
              className="text-sm font-bold"
            >
              View Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
