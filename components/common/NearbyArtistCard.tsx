import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  artist: any;
  onPress: () => void;
  onFavorite: () => void;
};

export default function NearbyArtistCard({
  artist,
  onPress,
  onFavorite,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      //   className="bg-white rounded-[22px] overflow-hidden mb-5"
      className="bg-white rounded-[20px] mb-4 overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      {/* Image */}
      <View>
        <Image
          source={artist.heroImage}
          className="w-full h-[250px]"
          resizeMode="cover"
        />

        {/* badges */}
        <View className="absolute top-4 left-4 flex-row gap-2">
          {artist.verified && (
            <View className="bg-[#D8F5EC] px-3 py-1 rounded-full">
              <Text className="text-[11px] text-[#25896C] font-bold">
                ✓ Verified
              </Text>
            </View>
          )}

          {artist.availableToday && (
            <View className="bg-[#FFE9A8] px-3 py-1 rounded-full">
              <Text className="text-[11px] text-[#D48A00] font-bold">
                ● Available Today
              </Text>
            </View>
          )}

          {artist.topRated && (
            <View className="bg-white px-3 py-1 rounded-full">
              <Text className="text-[11px] text-[#E39B00] font-bold">
                ♙ Top Rated
              </Text>
            </View>
          )}
        </View>

        {/* Favorite */}

        <TouchableOpacity
          onPress={onFavorite}
          className="absolute right-4 top-4 bg-white w-11 h-11 rounded-full items-center justify-center"
        >
          <Ionicons
            name={artist.isFavorite ? "heart" : "heart-outline"}
            size={22}
            color={COLORS.baseColor}
          />
        </TouchableOpacity>

        {/* Price */}

        <View className="absolute right-4 bottom-4 bg-white rounded-full px-4 py-2">
          <Text className="text-xs text-[#888]">From</Text>

          <Text className="text-lg font-extrabold text-[#161119]">
            ${artist.priceFrom}
          </Text>
        </View>
      </View>

      {/* Details */}

      <View className="p-5">
        <View className="flex-row justify-between">
          <View>
            <Text className="text-xl font-extrabold text-[#161119]">
              {artist.name}
            </Text>

            <Text className="text-sm text-[#E57AA0] mt-1">
              {artist.specialty}
            </Text>

            <Text className="text-sm text-[#8A8590] mt-2">
              {artist.category}
            </Text>
          </View>

          <View className="bg-[#FFF5DA] rounded-full px-3 h-8 justify-center flex-row items-center">
            <Ionicons name="star" size={14} color="#FFB300" />

            <Text className="ml-1 font-bold">{artist.rating}</Text>

            <Text className="text-[#888] ml-1">({artist.reviewCount})</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
