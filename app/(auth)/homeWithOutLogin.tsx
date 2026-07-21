import DateModal from "@/components/common/DateModal";
import FullScreenImageViewer from "@/components/common/FullScreenImageViewer";
import GradientButton from "@/components/common/GradientButton";
import {
  LocationOption,
  ServiceOption,
  TimeSlot,
} from "@/components/common/homeSearchApi";
import LocationModal from "@/components/common/LocationModal";
import PeopleModal from "@/components/common/PeopleModal";
import ServiceModal from "@/components/common/ServiceModal";
import TimeModal from "@/components/common/TimeModal";

import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------- Local assets ----------
const HERO_IMAGE = require("@/assets/images/home/pic5.png");
const STORY_1_IMAGE = require("@/assets/images/home/pic2.png");
const STORY_2_IMAGE = require("@/assets/images/home/pic3.png");
const INSPO_WEDDING = require("@/assets/images/home/pic4.png");
const INSPO_FORMAL = require("@/assets/images/home/pic1.png");
const INSPO_NATURAL = require("@/assets/images/home/pic2.png");
const INSPO_PARTY = require("@/assets/images/home/pic4.png");
//INSPO_BRIDAL
const INSPO_BRIDAL = require("@/assets/images/home/pic4.png");

const INSPO_LUXURY = require("@/assets/images/home/pic1.png");
const INSPO_FESTIVAL = require("@/assets/images/home/pic2.png");
const INSPO_EXTRA = require("@/assets/images/home/pic3.png");
const USER_AVATAR = require("@/assets/images/home/pic1.png");
const ARTIST_1 = require("@/assets/images/home/pic1.png");
const ARTIST_2 = require("@/assets/images/home/pic2.png");
const ARTIST_3 = require("@/assets/images/home/pic3.png");
const ARTIST_4 = require("@/assets/images/home/pic4.png");

// ---------- Header mock data — replace with real auth/user + notifications API ----------
const CURRENT_USER = { name: "Naz", avatar: USER_AVATAR };
const UNREAD_NOTIFICATIONS_COUNT = 1;

// ---------- Artist preview types + mock data — replace with real API ----------
type ArtistPreview = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  distanceKm: number;
  priceFrom: number;
  image: any;
  verified: boolean;
  isFavorite?: boolean;
};

const FEATURED_ARTISTS: ArtistPreview[] = [
  {
    id: "f1",
    name: "Emma Richards",
    specialty: "Bridal & Editorial",
    rating: 4.9,
    reviewCount: 312,
    yearsExperience: 8,
    distanceKm: 2.3,
    priceFrom: 180,
    image: ARTIST_1,
    verified: true,
  },
  {
    id: "f2",
    name: "Aria Zhang",
    specialty: "Hair & Color Specialist",
    rating: 4.8,
    reviewCount: 248,
    yearsExperience: 6,
    distanceKm: 3.1,
    priceFrom: 150,
    image: ARTIST_2,
    verified: true,
  },
  {
    id: "f3",
    name: "Sophie Anderson",
    specialty: "Luxury Makeup Artist",
    rating: 5.0,
    reviewCount: 421,
    yearsExperience: 10,
    distanceKm: 4.5,
    priceFrom: 220,
    image: ARTIST_3,
    verified: true,
  },
  {
    id: "f4",
    name: "Isabella Moore",
    specialty: "Celebrity Makeup & Styling",
    rating: 4.9,
    reviewCount: 356,
    yearsExperience: 9,
    distanceKm: 5.2,
    priceFrom: 250,
    image: ARTIST_4,
    verified: true,
  },
];

const NEARBY_ARTISTS: ArtistPreview[] = [
  {
    id: "n1",
    name: "Maya Patel",
    specialty: "Natural & Organic Makeup",
    rating: 4.9,
    reviewCount: 201,
    yearsExperience: 7,
    distanceKm: 0.8,
    priceFrom: 145,
    image: ARTIST_3,
    verified: true,
  },
  {
    id: "n2",
    name: "Zara Williams",
    specialty: "Hair Styling & Updos",
    rating: 4.8,
    reviewCount: 178,
    yearsExperience: 5,
    distanceKm: 1.2,
    priceFrom: 135,
    image: ARTIST_4,
    verified: true,
  },
  {
    id: "n3",
    name: "Olivia Bennett",
    specialty: "Bridal Hair Specialist",
    rating: 4.7,
    reviewCount: 145,
    yearsExperience: 6,
    distanceKm: 1.5,
    priceFrom: 120,
    image: ARTIST_1,
    verified: true,
  },
  {
    id: "n4",
    name: "Chloe Martin",
    specialty: "Party Makeup & Glam",
    rating: 4.8,
    reviewCount: 189,
    yearsExperience: 4,
    distanceKm: 2.1,
    priceFrom: 110,
    image: ARTIST_2,
    verified: false,
  },
  {
    id: "n5",
    name: "Ava Thompson",
    specialty: "Hair Coloring Expert",
    rating: 4.9,
    reviewCount: 267,
    yearsExperience: 8,
    distanceKm: 2.8,
    priceFrom: 160,
    image: ARTIST_3,
    verified: true,
  },
];

// ---------- Types ----------
type FilterKey = "location" | "date" | "time" | "service" | "people";

// ---------- Data ----------
const FIND_ROWS: {
  key: FilterKey;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "location",
    icon: "location-outline",
    label: "LOCATION",
    placeholder: "Where are you?",
  },
  {
    key: "date",
    icon: "calendar-outline",
    label: "DATE",
    placeholder: "When?",
  },
  {
    key: "time",
    icon: "time-outline",
    label: "TIME",
    placeholder: "What time?",
  },
  {
    key: "service",
    icon: "cut-outline",
    label: "SERVICE",
    placeholder: "What service?",
  },
  {
    key: "people",
    icon: "people-outline",
    label: "PEOPLE",
    placeholder: "1 guest",
  },
];

const WHY_CARDS = [
  {
    icon: "shield-checkmark-outline" as const,
    iconBg: "#DDF3E7",
    iconColor: "#2FA773",
    title: "Verified & Insured Artists",
    desc: "Every artist undergoes ID verification, qualification checks and holds active public liability insurance.",
  },
  {
    icon: "card-outline" as const,
    iconBg: "#E1EAFB",
    iconColor: "#3E6FE0",
    title: "Secure Payments",
    desc: "Secure checkout encrypted by Stripe. We accept Visa, PayPal, Apple Pay, and Google Pay.",
  },
];

const STORIES = [
  {
    id: "s1",
    image: STORY_1_IMAGE,
    rating: 5,
    quote:
      "Emma transformed me for my wedding day — I felt like absolute royalty. Every single guest was asking about my makeup.",
    name: "Olivia Bennett",
    location: "Sydney, NSW · Bridal Makeup",
  },
  {
    id: "s2",
    image: STORY_2_IMAGE,
    rating: 4.5,
    quote:
      "The whole experience was incredible. My makeup lasted all day and looked even better than I imagined.",
    name: "Priya Sharma",
    location: "Melbourne, VIC · Event Makeup",
  },
  {
    id: "s3",
    image: STORY_1_IMAGE,
    rating: 5,
    quote:
      "I booked a makeup artist for my engagement party and the results were absolutely stunning. Highly recommended!",
    name: "Charlotte Wilson",
    location: "Brisbane, QLD · Party Glam",
  },
  {
    id: "s4",
    image: STORY_2_IMAGE,
    rating: 4.8,
    quote:
      "Professional, friendly, and extremely talented. She understood exactly the look I wanted for my special day.",
    name: "Amelia Thompson",
    location: "Perth, WA · Wedding Makeup",
  },
  {
    id: "s5",
    image: STORY_1_IMAGE,
    rating: 5,
    quote:
      "My bridal look was flawless from start to finish. The artist was amazing and made me feel so confident.",
    name: "Sophie Mitchell",
    location: "Adelaide, SA · Bridal Makeup",
  },
  {
    id: "s6",
    image: STORY_2_IMAGE,
    rating: 4.7,
    quote:
      "Amazing service and beautiful results. I received so many compliments throughout the evening.",
    name: "Isabella Brown",
    location: "Canberra, ACT · Formal Makeup",
  },
];

const INSPIRATION = [
  { image: INSPO_WEDDING, label: "Wedding", height: 220 },
  { image: INSPO_FORMAL, label: "Formal", height: 160 },
  { image: INSPO_NATURAL, label: "Natural", height: 150 },
  { image: INSPO_PARTY, label: "Party", height: 210 },
  { image: INSPO_BRIDAL, label: "Bridal", height: 140 },
  { image: INSPO_LUXURY, label: "Luxury Glam", height: 175 },
  { image: INSPO_FESTIVAL, label: "Festival", height: 200 },
  { image: INSPO_EXTRA, label: "Editorial", height: 120 },
];

const StarRow = ({ rating }: { rating: number }) => (
  <View className="flex-row items-center">
    {[1, 2, 3, 4, 5].map((i) => (
      <Ionicons
        key={i}
        name={
          rating >= i
            ? "star"
            : rating >= i - 0.5
              ? "star-half"
              : "star-outline"
        }
        size={13}
        color={COLORS.baseColor}
        style={{ marginRight: 2 }}
      />
    ))}
    <Text className="ml-1 text-xs font-semibold text-[#161119]">
      {rating.toFixed(1)}
    </Text>
  </View>
);

const FindRow = ({
  icon,
  label,
  value,
  placeholder,
  isLast,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | null;
  placeholder: string;
  isLast?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className={`flex-row items-center py-3.5 ${
      isLast ? "" : "border-b border-[#F1EFF3]"
    }`}
  >
    <View className="w-10 h-10 rounded-full bg-[#F4E9FC] items-center justify-center mr-3">
      <Ionicons name={icon} size={18} color="#B57EDC" />
    </View>
    <View className="flex-1">
      <Text className="text-[11px] font-bold tracking-[1px] text-[#9A94A0]">
        {label}
      </Text>
      <Text
        className="text-[15px] mt-0.5"
        style={{ color: value ? "#161119" : "#B7B2BC" }}
      >
        {value ?? placeholder}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#C9C4CF" />
  </TouchableOpacity>
);

const ArtistPreviewCard = ({ artist }: { artist: ArtistPreview }) => {
  const [isFavorite, setIsFavorite] = useState(!!artist.isFavorite);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/artist-details",
          params: { id: artist.id },
        })
      }
      className="bg-white rounded-[15px] overflow-hidden mr-3.5"
      style={{
        width: 168,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View>
        <Image
          source={artist.image}
          style={{ width: "100%", height: 150 }}
          resizeMode="cover"
        />

        {artist.verified && (
          <View className="absolute top-2.5 left-2.5 flex-row items-center bg-[#DDF3E7] rounded-full px-2 py-1">
            <Ionicons name="checkmark-circle" size={11} color="#2FA773" />
            <Text
              className="text-[10px] font-bold ml-1"
              style={{ color: "#2FA773" }}
            >
              Verified
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => setIsFavorite((v) => !v)}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 items-center justify-center"
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={14}
            color="#B57EDC"
          />
        </TouchableOpacity>

        <View className="absolute bottom-2.5 right-2.5 flex-row items-center bg-black/50 rounded-full px-2 py-1">
          <Ionicons name="location-outline" size={10} color="#fff" />
          <Text className="text-[10px] text-white font-semibold ml-1">
            {artist.distanceKm} km
          </Text>
        </View>
      </View>

      <View className="p-3">
        <Text
          className="text-sm font-extrabold text-[#161119]"
          numberOfLines={1}
        >
          {artist.name}
        </Text>
        <Text className="text-xs text-[#8A8590] mt-0.5" numberOfLines={1}>
          {artist.specialty}
        </Text>

        <View className="flex-row items-center mt-1.5">
          <Ionicons name="star" size={12} color={COLORS.baseColor} />
          <Text className="text-xs font-bold text-[#161119] ml-1">
            {artist.rating.toFixed(1)}
          </Text>
          <Text className="text-[11px] text-[#8A8590] ml-1">
            ({artist.reviewCount})
          </Text>
          <Text className="text-[11px] text-[#8A8590] ml-2">
            · {artist.yearsExperience} yrs
          </Text>
        </View>

        <View className="flex-row items-center justify-between mt-2.5">
          <View>
            <Text className="text-[10px] text-[#9A94A0]">From</Text>
            <Text className="text-sm font-extrabold text-[#161119]">
              ${artist.priceFrom}
            </Text>
          </View>

          <TouchableOpacity activeOpacity={0.85}>
            <LinearGradient
              colors={[COLORS.baseColor1, COLORS.baseColor2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 7,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/artist-details",
                    params: { id: artist.id },
                  })
                }
              >
                <Text className="text-[11px] font-bold text-white">
                  Book Now
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function CustomerHomeScreen() {
  const { role } = useLocalSearchParams();
  console.log("user local 2: ", role);

  const userName = CURRENT_USER.name;
  const userAvatar = CURRENT_USER.avatar;
  const unreadNotifications = UNREAD_NOTIFICATIONS_COUNT;

  const [activeModal, setActiveModal] = useState<FilterKey | null>(null);
  const [serviceValues, setServiceValues] = useState<ServiceOption[]>([]);
  const [locationValue, setLocationValue] = useState<LocationOption | null>(
    null,
  );

  // ---------- Fullscreen image viewer state ----------
  // Generic: holds whichever image array was tapped (Stories, Inspiration, etc.)
  // plus the tapped index, so one viewer + one modal instance serves every grid.
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerImages, setViewerImages] = useState<any[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = (images: any[], index: number) => {
    setViewerImages(images);
    setViewerIndex(index);
    setViewerVisible(true);
  };

  const [dateISO, setDateISO] = useState<string | null>(null);
  const [dateLabel, setDateLabel] = useState<string | null>(null);
  const [timeValue, setTimeValue] = useState<TimeSlot | null>(null);
  //const [serviceValue, setServiceValue] = useState<ServiceOption | null>(null);
  const [peopleCount, setPeopleCount] = useState<number | null>(null);

  const resetFilters = () => {
    setLocationValue(null);
    setDateISO(null);
    setDateLabel(null);
    setTimeValue(null);
    setServiceValues([]);
    setPeopleCount(null);
    setActiveModal(null);
  };

  const displayValues: Record<FilterKey, string | null> = {
    location: locationValue
      ? `${locationValue.name}, ${locationValue.region}`
      : null,
    date: dateLabel,
    time: timeValue ? timeValue.label : null,
    service: serviceValues.length
      ? serviceValues.map((s) => s.name).join(", ")
      : null,
    people: peopleCount
      ? `${peopleCount} ${peopleCount === 1 ? "guest" : "guests"}`
      : null,
  };

  const closeModal = () => setActiveModal(null);

  useFocusEffect(
    useCallback(() => {
      resetFilters();
    }, []),
  );

  return (
    <LinearGradient
      colors={[
        COLORS.backGradient1,
        COLORS.backGradient2,
        COLORS.backGradient3,
      ]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mt-3 flex-row items-center justify-between">
            <View className="flex-1 pr-2">
              <Text className="text-lg font-semibold text-black">
                Me
                <Text style={{ color: COLORS.baseColor }}>millennial</Text>
              </Text>
              <Text className="text-3xl font-extrabold text-[#161119] mt-1">
                Hi, Beautiful!
              </Text>
              <Text className="text-sm text-[#8A8590] mt-1">
                Let&apos;s find your perfect beauty artist.
              </Text>
            </View>
          </View>

          {/* Hero banner */}
          <LinearGradient
            colors={[COLORS.baseColor11, COLORS.baseColor22]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="mt-5 rounded-[15px] p-5 overflow-hidden flex-row"
          >
            <View className="flex-1 pr-2">
              <Text
                style={{ color: "#FC6C8C" }}
                className="text-sm font-bold tracking-[1.9px] opacity-90"
              >
                PREMIUM BEAUTY
              </Text>
              <Text className="text-black text-2xl font-extrabold mt-2 leading-8">
                Beauty services, delivered wherever you are.
              </Text>
              <Text className="text-gray-700 text-xs mt-3 opacity-90 leading-4">
                Book verified makeup artists and hairstylists across Australia.
              </Text>
            </View>
            <Image
              source={HERO_IMAGE}
              className="w-28 h-full rounded-[15px]"
              resizeMode="cover"
            />
          </LinearGradient>

          <View
            className="bg-white rounded-[15px] p-5 mt-5"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            }}
          >
            <Text className="text-xs font-bold tracking-[1.5px] text-[#9A94A0] mb-1">
              FIND MY ARTIST
            </Text>
            {FIND_ROWS.map((row, idx) => (
              <FindRow
                key={row.key}
                icon={row.icon}
                label={row.label}
                placeholder={row.placeholder}
                value={displayValues[row.key]}
                isLast={idx === FIND_ROWS.length - 1}
                onPress={() => {
                  setActiveModal(row.key);
                }}
              />
            ))}

            <GradientButton
              label="Find My Artist"
              onPress={() => {
                const params: Record<string, string> = {};

                if (locationValue) {
                  params.location = `${locationValue.name}, ${locationValue.region}`;
                }
                if (dateLabel) {
                  params.date = dateLabel;
                }
                if (timeValue?.label) {
                  params.time = timeValue.label;
                }
                if (serviceValues.length) {
                  params.service = serviceValues.map((s) => s.name).join(", ");
                }
                if (peopleCount) {
                  params.people = String(peopleCount);
                }

                router.push({
                  pathname: "/LoginScreen",
                  params: {
                    ...params,
                    role: String(role),
                  },
                });
              }}
              search={true}
              style={{ marginTop: 40 }}
            />
          </View>

          {/* Why memillennial */}
          <Text className="text-xl font-extrabold text-[#161119] mt-7 mb-3">
            Why memillennial?
          </Text>
          <View className="flex-row gap-3">
            {WHY_CARDS.map((card) => (
              <View
                key={card.title}
                className="flex-1 bg-white rounded-[15px] p-4"
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 3 },
                  elevation: 1,
                }}
              >
                <View
                  className="w-10 h-10 rounded-[15px] items-center justify-center mb-3"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <Ionicons name={card.icon} size={18} color={card.iconColor} />
                </View>
                <Text className="text-[15px] font-bold text-[#161119] leading-5">
                  {card.title}
                </Text>
                <Text className="text-xs text-[#8A8590] mt-1.5 leading-4">
                  {card.desc}
                </Text>
              </View>
            ))}
          </View>

          {/* Customer Stories */}
          <View className="flex-row items-center justify-between mt-7 mb-3">
            <Text className="text-xl font-extrabold text-[#161119]">
              Customer Stories
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(customer)/customer-stories")}
              className="flex-row items-center"
            >
              <Text
                style={{ color: COLORS.baseColor }}
                className="text-sm font-semibold mr-0.5"
              >
                See All
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={COLORS.baseColor}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20, paddingBottom: 10 }}
          >
            {STORIES.map((story, storyIndex) => (
              <View
                key={story.id}
                className="bg-white rounded-[15px] mr-3.5 overflow-hidden"
                style={{
                  width: 260,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 2,
                }}
              >
                {/* Tap the photo to open it fullscreen with pinch-zoom */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    openViewer(
                      STORIES.map((s) => s.image),
                      storyIndex,
                    )
                  }
                >
                  <Image
                    source={story.image}
                    style={{ width: "100%", height: 160 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <View className="p-3.5">
                  <StarRow rating={story.rating} />
                  <Text
                    numberOfLines={2}
                    className="text-sm text-[#161119] mt-2 leading-5"
                  >
                    &ldquo;{story.quote}&rdquo;
                  </Text>
                  <View className="flex-row items-center justify-between mt-3">
                    <View>
                      <Text className="text-sm font-bold text-[#161119]">
                        {story.name}
                      </Text>
                      <Text className="text-xs text-[#8A8590] mt-0.5">
                        {story.location}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => router.push("/customer-story-details")}
                      className="flex-row items-center"
                    >
                      <Text
                        style={{ color: COLORS.baseColor }}
                        className="text-xs font-semibold mr-0.5"
                      >
                        Read Story
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={12}
                        color={COLORS.baseColor}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Beauty Inspiration */}
          <View className="flex-row items-center justify-between mt-7 mb-3">
            <Text className="text-xl font-extrabold text-[#161119]">
              Beauty Inspiration
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text
                style={{ color: COLORS.baseColor }}
                className="text-sm font-semibold mr-0.5"
              >
                See All
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={COLORS.baseColor}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row mb-20" style={{ gap: 14 }}>
            {/* Left column: even-indexed items */}
            <View style={{ flex: 1 }}>
              {INSPIRATION.filter((_, i) => i % 2 === 0).map((item) => {
                const originalIndex = INSPIRATION.indexOf(item);
                return (
                  <TouchableOpacity
                    key={item.label}
                    activeOpacity={0.9}
                    className="rounded-[15px] overflow-hidden mb-3.5"
                    style={{ height: item.height }}
                    onPress={() =>
                      openViewer(
                        INSPIRATION.map((i) => i.image),
                        originalIndex,
                      )
                    }
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
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Right column: odd-indexed items */}
            <View style={{ flex: 1 }}>
              {INSPIRATION.filter((_, i) => i % 2 !== 0).map((item) => {
                const originalIndex = INSPIRATION.indexOf(item);
                return (
                  <TouchableOpacity
                    key={item.label}
                    activeOpacity={0.9}
                    className="rounded-[15px] overflow-hidden mb-3.5"
                    style={{ height: item.height }}
                    onPress={() =>
                      openViewer(
                        INSPIRATION.map((i) => i.image),
                        originalIndex,
                      )
                    }
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
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* ---------- Filter modals ---------- */}
      <LocationModal
        visible={activeModal === "location"}
        onClose={closeModal}
        onSelect={setLocationValue}
      />

      <DateModal
        visible={activeModal === "date"}
        onClose={closeModal}
        initialDateISO={dateISO}
        onSelect={(iso: any, label: any) => {
          setDateISO(iso);
          setDateLabel(label);
        }}
      />

      <FullScreenImageViewer
        visible={viewerVisible}
        images={viewerImages}
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
      />

      <TimeModal
        visible={activeModal === "time"}
        onClose={closeModal}
        dateISO={dateISO}
        onSelect={setTimeValue}
      />

      <ServiceModal
        visible={activeModal === "service"}
        onClose={closeModal}
        onSelect={setServiceValues}
        initialSelected={serviceValues}
      />

      <PeopleModal
        visible={activeModal === "people"}
        onClose={closeModal}
        initialCount={peopleCount}
        onSelect={setPeopleCount}
      />
    </LinearGradient>
  );
}
