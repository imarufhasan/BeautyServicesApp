import AppHeader from "@/components/common/AppHeader";
import FullScreenImageViewer from "@/components/common/FullScreenImageViewer";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------- Local assets ----------
const INSPO_WEDDING = require("../../assets/images/home/home_pic4.png");
const INSPO_FORMAL = require("../../assets/images/home/home_pic1.png");
const INSPO_NATURAL = require("../../assets/images/home/home_pic2.png");
const INSPO_PARTY = require("../../assets/images/home/home_pic3.png");
const INSPO_BRIDAL = require("../../assets/images/home/home_pic4.png");
const INSPO_LUXURY = require("../../assets/images/home/home_pic1.png");
const INSPO_FESTIVAL = require("../../assets/images/home/home_pic2.png");
const INSPO_EXTRA = require("../../assets/images/home/home_pic3.png");

// ---------------------------------------------------------------------------
// Types + data — replace with a real inspiration/gallery API
// ---------------------------------------------------------------------------
type InspirationCategory =
  | "All"
  | "Wedding"
  | "Bridal"
  | "Formal"
  | "Natural"
  | "Party"
  | "Luxury Glam"
  | "Festival"
  | "Editorial";

type InspirationItem = {
  id: string;
  image: any;
  label: InspirationCategory;
  height: number; // varies per item on purpose for the masonry look
  artistName: string;
};

const INSPIRATION: InspirationItem[] = [
  {
    id: "i1",
    image: INSPO_WEDDING,
    label: "Wedding",
    height: 220,
    artistName: "Emma Richards",
  },
  {
    id: "i2",
    image: INSPO_FORMAL,
    label: "Formal",
    height: 160,
    artistName: "Aria Zhang",
  },
  {
    id: "i3",
    image: INSPO_NATURAL,
    label: "Natural",
    height: 150,
    artistName: "Maya Patel",
  },
  {
    id: "i4",
    image: INSPO_PARTY,
    label: "Party",
    height: 210,
    artistName: "Chloe Martin",
  },
  {
    id: "i5",
    image: INSPO_BRIDAL,
    label: "Bridal",
    height: 140,
    artistName: "Sophie Anderson",
  },
  {
    id: "i6",
    image: INSPO_LUXURY,
    label: "Luxury Glam",
    height: 175,
    artistName: "Isabella Moore",
  },
  {
    id: "i7",
    image: INSPO_FESTIVAL,
    label: "Festival",
    height: 200,
    artistName: "Zara Williams",
  },
  {
    id: "i8",
    image: INSPO_EXTRA,
    label: "Editorial",
    height: 120,
    artistName: "Olivia Bennett",
  },
  {
    id: "i9",
    image: INSPO_WEDDING,
    label: "Bridal",
    height: 190,
    artistName: "Ava Thompson",
  },
  {
    id: "i10",
    image: INSPO_NATURAL,
    label: "Natural",
    height: 165,
    artistName: "Emma Richards",
  },
  {
    id: "i11",
    image: INSPO_PARTY,
    label: "Festival",
    height: 145,
    artistName: "Aria Zhang",
  },
  {
    id: "i12",
    image: INSPO_LUXURY,
    label: "Luxury Glam",
    height: 215,
    artistName: "Sophie Anderson",
  },
  {
    id: "i13",
    image: INSPO_FORMAL,
    label: "Editorial",
    height: 155,
    artistName: "Isabella Moore",
  },
  {
    id: "i14",
    image: INSPO_BRIDAL,
    label: "Wedding",
    height: 200,
    artistName: "Maya Patel",
  },
  {
    id: "i15",
    image: INSPO_FESTIVAL,
    label: "Party",
    height: 170,
    artistName: "Chloe Martin",
  },
  {
    id: "i16",
    image: INSPO_EXTRA,
    label: "Formal",
    height: 130,
    artistName: "Zara Williams",
  },
];

const CATEGORIES: InspirationCategory[] = [
  "All",
  "Wedding",
  "Bridal",
  "Formal",
  "Natural",
  "Party",
  "Luxury Glam",
  "Festival",
  "Editorial",
];

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function BeautyInspirationScreen() {
  const [activeCategory, setActiveCategory] =
    useState<InspirationCategory>("All");

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? INSPIRATION
        : INSPIRATION.filter((item) => item.label === activeCategory),
    [activeCategory],
  );

  const viewerImages = useMemo(
    () => filtered.map((item) => item.image),
    [filtered],
  );

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  const leftColumn = filtered.filter((_, i) => i % 2 === 0);
  const rightColumn = filtered.filter((_, i) => i % 2 !== 0);

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]" edges={["top"]}>
      <AppHeader title="Inspiration" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* <View className="px-5 pt-1">
          <Text className="text-sm text-[#8A8590]">
            Browse looks from our artists and tap a photo to see it up close.
          </Text>
        </View> */}

        {/* Category filter chips */}
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
        >
          {CATEGORIES.map((category, idx) => {
            const isSelected = category === activeCategory;
            return (
              <TouchableOpacity
                key={category}
                activeOpacity={0.85}
                onPress={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 ${
                  idx === CATEGORIES.length - 1 ? "" : "mr-2.5"
                }`}
                style={{
                  backgroundColor: isSelected ? undefined : "#fff",
                  borderWidth: isSelected ? 0 : 1,
                  borderColor: "#EFEAF3",
                  overflow: "hidden",
                }}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={[COLORS.baseColor1, COLORS.baseColor2]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 999,
                    }}
                  />
                ) : null}
                <Text
                  className="text-xs font-bold"
                  style={{ color: isSelected ? "#fff" : "#8A8590" }}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView> */}

        {/* Masonry grid */}
        <View className="flex-row px-5" style={{ gap: 14 }}>
          <View style={{ flex: 1 }}>
            {leftColumn.map((item) => {
              const originalIndex = filtered.indexOf(item);
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  className="rounded-[15px] overflow-hidden mb-3.5"
                  style={{ height: item.height }}
                  onPress={() => openViewer(originalIndex)}
                >
                  <Image
                    source={item.image}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.5)"]}
                    className="absolute bottom-0 left-0 right-0 h-16 justify-end px-3 pb-2.5"
                  >
                    <Text className="text-white text-sm font-bold">
                      {item.label}
                    </Text>
                    {/* <Text className="text-white/80 text-[10px] mt-0.5">
                      {item.artistName}
                    </Text> */}
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ flex: 1 }}>
            {rightColumn.map((item) => {
              const originalIndex = filtered.indexOf(item);
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  className="rounded-[15px] overflow-hidden mb-3.5"
                  style={{ height: item.height }}
                  onPress={() => openViewer(originalIndex)}
                >
                  <Image
                    source={item.image}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.55)"]}
                    className="absolute bottom-0 left-0 right-0 h-16 justify-end px-3 pb-2.5"
                  >
                    <Text className="text-white text-sm font-bold">
                      {item.label}
                    </Text>
                    {/* <Text className="text-white/80 text-[10px] mt-0.5">
                      {item.artistName}
                    </Text> */}
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {filtered.length === 0 && (
          <View className="items-center justify-center mt-16 px-10">
            <Ionicons name="images-outline" size={36} color="#C9C4CF" />
            <Text className="text-sm text-[#8A8590] mt-3 text-center">
              No looks in this category yet.
            </Text>
          </View>
        )}
      </ScrollView>

      <FullScreenImageViewer
        visible={viewerVisible}
        images={viewerImages}
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
      />
    </SafeAreaView>
  );
}
