import Stars from "@/components/common/Stars";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
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
type Service = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  popular?: boolean;
};

type Review = {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
  rating: number;
  timeAgo: string;
  text: string;
};

type AvailabilityDay = {
  id: string;
  dayLabel: string; // "Mon"
  dateLabel: string; // "7"
  fullDate: string; // "July 7" — used in "Available Times — {fullDate}"
  available: boolean;
  times: string[];
};

type ArtistProfile = {
  id: string;
  name: string;
  specialty: string;
  heroImage: ImageSourcePropType;
  avatar: ImageSourcePropType;
  rating: number;
  reviewCount: number;
  location: string;
  verified: boolean;
  availableToday: boolean;
  photos: ImageSourcePropType[];
  services: Service[];
  yearsExperience: number;
  experienceTitle: string;
  experienceDescription: string;
  experienceTags: string[];
  certifications: string[];
  reviews: Review[];
  availability: AvailabilityDay[];
  travelRadiusKm: number;
  travelDescription: string;
  freeTravel: boolean;
};

// ---------------------------------------------------------------------------
// Mock data — replace image requires + fields with real API data
// ---------------------------------------------------------------------------
const HERO = require("../../assets/images/home/pic1.png");
const AVATAR = require("../../assets/images/home/pic1.png");
const PHOTO_1 = require("../../assets/images/home/pic2.png");
const PHOTO_2 = require("../../assets/images/home/pic3.png");
const PHOTO_3 = require("../../assets/images/home/pic4.png");
const REVIEWER_1 = require("../../assets/images/home/pic2.png");
const REVIEWER_2 = require("../../assets/images/home/pic3.png");
const REVIEWER_3 = require("../../assets/images/home/pic4.png");

// ---------------------------------------------------------------------------
// Dynamically generates availability rows for the CURRENT MONTH only —
// starts at today's date and stops at the last day of this month (never
// spills into next month). Replace the `available` / `times` logic below
// with real API data per artist when wiring this up for real.
// ---------------------------------------------------------------------------
function generateMonthAvailability(): AvailabilityDay[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString("en-US", { month: "long" });
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  const days: AvailabilityDay[] = [];

  for (let date = today.getDate(); date <= lastDayOfMonth; date++) {
    const current = new Date(year, month, date);
    const dayOfWeek = current.getDay(); // 0 = Sun, 6 = Sat
    const dayLabel = current.toLocaleString("en-US", { weekday: "short" });

    // Mock pattern: Sundays are off, everything else has slots.
    const available = dayOfWeek !== 0;

    const times = available
      ? dayOfWeek === 6
        ? ["9:00 AM", "11:00 AM", "2:00 PM"] // shorter Saturday hours
        : ["9:00 AM", "10:30 AM", "12:00 PM", "2:00 PM", "3:30 PM", "5:00 PM"]
      : [];

    days.push({
      id: `d${date}`,
      dayLabel,
      dateLabel: String(date),
      fullDate: `${monthName} ${date}`,
      available,
      times,
    });
  }

  return days;
}

const MOCK_PROFILE: ArtistProfile = {
  id: "1",
  name: "Sophia Laurent",
  specialty: "Bridal & Editorial Makeup",
  heroImage: HERO,
  avatar: AVATAR,
  rating: 5.0,
  reviewCount: 312,
  location: "Brisbane, Queensland",
  verified: true,
  availableToday: true,
  photos: [PHOTO_1, PHOTO_2, PHOTO_3],
  services: [
    {
      id: "s1",
      name: "Bridal Makeup",
      description: "",
      duration: "3 hrs",
      price: 380,
      popular: true,
    },
    {
      id: "s2",
      name: "Event Makeup",
      description: "Polished look for any occasion",
      duration: "1.5 hrs",
      price: 180,
    },
    {
      id: "s3",
      name: "Hair Styling",
      description: "Elegant updos & blowouts",
      duration: "1 hr",
      price: 120,
    },
    {
      id: "s4",
      name: "Makeup Prep",
      description: "Base & skin treatment",
      duration: "45 min",
      price: 95,
    },
    {
      id: "s5",
      name: "Brows",
      description: "Shaping, tinting & lamination",
      duration: "30 min",
      price: 65,
    },
    {
      id: "s6",
      name: "Touch Up",
      description: "Quick refresh & retouch",
      duration: "30 min",
      price: 55,
    },
  ],
  yearsExperience: 8,
  experienceTitle: "Professional Beauty Artist",
  experienceDescription:
    "Sophia specializes in luxury bridal and editorial makeup. Known for her flawless skin preparation and long-lasting artistry, she has served A-list clientele across New York and Paris.",
  experienceTags: ["Bridal", "Editorial", "Runway", "Film & TV"],
  certifications: [
    "MAC Pro Certified",
    "CIDESCO Diploma",
    "Bridal Specialist",
    "Airbrush Certified",
    "Color Theory",
    "Skincare Pro",
  ],
  reviews: [
    {
      id: "r1",
      name: "Isabella M.",
      avatar: REVIEWER_1,
      rating: 5,
      timeAgo: "2 days ago",
      text: "Sophia made me feel like a queen on my wedding day. Absolute perfection.",
    },
    {
      id: "r2",
      name: "Priya S.",
      avatar: REVIEWER_2,
      rating: 5,
      timeAgo: "1 week ago",
      text: "The most professional and talented artist I've worked with. Highly recommend.",
    },
    {
      id: "r3",
      name: "Chloé R.",
      avatar: REVIEWER_3,
      rating: 5,
      timeAgo: "2 weeks ago",
      text: "My makeup stayed flawless for 12 hours straight. Incredible artistry.",
    },
  ],
  // 🔧 Dynamically generated — always stays within the current month
  availability: generateMonthAvailability(),
  travelRadiusKm: 35,
  travelDescription: "Covers Manhattan, Brooklyn, Queens & surrounding areas",
  freeTravel: true,
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-base font-extrabold text-[#161119] mb-3">
    {children}
  </Text>
);

const Tag = ({ label }: { label: string }) => (
  <View className="bg-[#BAF1E4] rounded-full px-3 py-1.5 mr-2 mb-2">
    <Text className="text-xs font-bold text-[#48B9A8]">{label}</Text>
  </View>
);

const CertPill = ({ label }: { label: string }) => (
  <View
    className="flex-row items-center rounded-full px-3 py-2 mr-2 mb-2 border"
    style={{ borderColor: "#BAF1E4" }}
  >
    <Ionicons
      name="shield-checkmark-outline"
      size={13}
      color="#48B9A8"
      style={{ marginRight: 5 }}
    />
    <Text className="text-xs font-bold text-[#161119]">{label}</Text>
  </View>
);

export default function ArtistProfileScreen({
  profile = MOCK_PROFILE,
}: {
  profile?: ArtistProfile;
}) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    profile.services[0]?.id,
  );

  // 🔧 Availability state — default to first available day
  const defaultDayId =
    profile.availability.find((d) => d.available)?.id ??
    profile.availability[0]?.id;
  const [selectedDayId, setSelectedDayId] = useState<string>(defaultDayId);

  const selectedDay = useMemo(
    () => profile.availability.find((d) => d.id === selectedDayId),
    [profile.availability, selectedDayId],
  );

  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    selectedDay?.times[0],
  );

  const handleSelectDay = (day: AvailabilityDay) => {
    if (!day.available) return;
    setSelectedDayId(day.id);
    setSelectedTime(day.times[0]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC] mb-10" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Header actions */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-2xl p-2 bg-white items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 1,
            }}
          >
            <Ionicons name="chevron-back" size={18} color="#161119" />
          </TouchableOpacity>

          <View className="flex-row" style={{ gap: 10 }}>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white items-center justify-center"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 1,
              }}
            >
              <Ionicons name="heart-outline" size={18} color="#B57EDC" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white items-center justify-center"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 1,
              }}
            >
              <Ionicons name="share-social-outline" size={17} color="#161119" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero + profile summary card */}
        <View className="mx-5 rounded-[24px] overflow-hidden bg-white">
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ height: 110 }}
          />

          <View className="px-4 pb-4" style={{ marginTop: -36 }}>
            <View className="flex-row items-end">
              <View>
                <Image
                  source={profile.avatar}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 18,
                    borderWidth: 3,
                    borderColor: "#fff",
                  }}
                  resizeMode="cover"
                />
                {profile.verified && (
                  <LinearGradient
                    colors={[COLORS.baseColor1, COLORS.baseColor2]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 999,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="checkmark" size={13} color="#fff" />
                  </LinearGradient>
                )}
              </View>
            </View>

            <View className="flex-row items-start justify-between mt-3">
              <View className="flex-1 pr-2">
                <Text className="text-[18px] font-extrabold text-[#161119]">
                  {profile.name}
                </Text>
                <Text className="text-xs text-[#8A8590] mt-0.5">
                  {profile.specialty}
                </Text>
              </View>

              <View className="items-end">
                <View className="flex-row items-center">
                  <Stars rating={profile.rating} size={11} />
                  <Text className="font-extrabold text-[#161119]">
                    {" "}
                    {profile.rating.toFixed(1)}
                  </Text>
                </View>
                <Text className="text-xs text-[#8A8590] mt-1">
                  {profile.reviewCount} reviews
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mt-3">
              <Ionicons name="location-outline" size={13} color="green" />
              <Text className="text-xs text-[#8A8590] ml-1 mr-3">
                {profile.location}
              </Text>
              {profile.verified && (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={13}
                    color="green"
                  />
                  <Text className="text-xs text-green-600 font-bold ml-1">
                    Verified Artist
                  </Text>
                </>
              )}
            </View>

            {profile.availableToday && (
              <View className="flex-row mt-3">
                <View
                  className="flex-row items-center rounded-full px-3 py-1.5"
                  style={{
                    backgroundColor: "#FFA23026",
                    borderColor: "#FFA230",
                    borderWidth: 1,
                  }}
                >
                  <Ionicons
                    name="ellipse"
                    size={8}
                    color="#FFA230"
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    className="text-xs font-bold"
                    style={{ color: "#FFA230" }}
                  >
                    Available Today
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Photos */}
        <View className="mt-6 px-5">
          <SectionTitle>Photos</SectionTitle>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {profile.photos.map((photo, idx) => (
            <Image
              key={idx}
              source={photo}
              style={{
                width: 140,
                height: 170,
                borderRadius: 16,
                marginRight: 10,
              }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Services Offered */}
        <View className="mt-6 px-5">
          <SectionTitle>Services Offered</SectionTitle>

          {profile.services.map((service) => {
            const isSelected = service.id === selectedServiceId;
            return (
              <TouchableOpacity
                key={service.id}
                activeOpacity={0.85}
                onPress={() => setSelectedServiceId(service.id)}
                className="flex-row items-center justify-between rounded-[16px] px-4 py-3.5 mb-3 bg-white border"
                style={{
                  borderColor: isSelected ? COLORS.baseColor : "#EFEAF3",
                  borderWidth: isSelected ? 1.5 : 1,
                  backgroundColor: isSelected ? COLORS.backGradient1 : "white",
                }}
              >
                <View className="flex-1 pr-3">
                  <View className="flex-row items-center flex-wrap">
                    <Text className="text-sm font-extrabold text-[#161119]">
                      {service.name}
                    </Text>
                    {service.popular && (
                      <LinearGradient
                        colors={[COLORS.baseColor1, COLORS.baseColor2]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          borderRadius: 999,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          marginLeft: 8,
                        }}
                      >
                        <Text className="text-[9px] font-bold text-white">
                          Popular
                        </Text>
                      </LinearGradient>
                    )}
                  </View>
                  {!!service.description && (
                    <Text className="text-xs text-[#8A8590] mt-0.5">
                      {service.description}
                    </Text>
                  )}
                  <View className="flex-row items-center mt-1.5">
                    <Ionicons name="time-outline" size={12} color="#8A8590" />
                    <Text className="text-[11px] text-[#8A8590] ml-1">
                      {service.duration}
                    </Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-sm font-extrabold text-[#161119] mb-2">
                    ${service.price}
                  </Text>
                  {isSelected ? (
                    <LinearGradient
                      colors={[COLORS.baseColor1, COLORS.baseColor2]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    </LinearGradient>
                  ) : (
                    <View
                      className="w-5 h-5 rounded-full border-2"
                      style={{ borderColor: "#D9D3E0" }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Experience */}
        <View className="mt-3 px-5">
          <SectionTitle>Experience</SectionTitle>
          <View
            className="bg-white rounded-[20px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <View className="flex-row items-center">
              <View
                className="items-center justify-center rounded-2xl mr-3"
                style={{ width: 52, height: 52, backgroundColor: "#F4E4FF" }}
              >
                <Text
                  className="text-2xl font-extrabold"
                  style={{ color: "#B57EDC" }}
                >
                  {profile.yearsExperience}
                </Text>
                <Text
                  className="text-[9px] font-bold -mt-0.5"
                  style={{ color: "#B57EDC" }}
                >
                  YRS
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-[#9A94A0] font-semibold">
                  Years of Experience
                </Text>
                <Text className="text-sm font-extrabold text-[#161119] mt-0.5">
                  {profile.experienceTitle}
                </Text>
              </View>
            </View>

            <Text className="text-xs text-[#6E6875] leading-5 mt-3">
              {profile.experienceDescription}
            </Text>

            <View className="flex-row flex-wrap mt-3">
              {profile.experienceTags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </View>
          </View>
        </View>

        {/* Certifications */}
        <View className="mt-3 px-5">
          <SectionTitle>Certifications</SectionTitle>
          <View className="flex-row flex-wrap">
            {profile.certifications.map((cert) => (
              <CertPill key={cert} label={cert} />
            ))}
          </View>
        </View>

        {/* Reviews */}
        <View className="mt-3 px-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-extrabold text-[#161119]">
              Reviews
            </Text>
            <View className="flex-row items-center">
              <Stars rating={profile.rating} size={12} />
              <Text className="text-sm font-extrabold text-[#161119] ml-1.5">
                {profile.rating.toFixed(1)}
              </Text>
            </View>
          </View>

          {profile.reviews.map((review) => (
            <View
              key={review.id}
              className="flex-row bg-white rounded-[18px] p-3.5 mb-3"
              style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
            >
              <Image
                source={review.avatar}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  marginRight: 10,
                }}
                resizeMode="cover"
              />
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-extrabold text-[#161119]">
                    {review.name}
                  </Text>
                  <Text className="text-[10px] text-[#B0AAB6]">
                    {review.timeAgo}
                  </Text>
                </View>
                <Stars rating={review.rating} size={11} />
                <Text className="text-xs text-[#6E6875] leading-5 mt-1.5">
                  {review.text}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Availability */}
        <View className="mt-3 px-5">
          <SectionTitle>Availability</SectionTitle>

          <View
            className="bg-white rounded-[20px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            {/* Day picker */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 4 }}
            >
              {profile.availability.map((day) => {
                const isSelected = day.id === selectedDayId;

                const DayInner = (
                  <>
                    <Text
                      className="text-[11px] font-bold"
                      style={{
                        color: !day.available
                          ? "#C7C1CD"
                          : isSelected
                            ? "#fff"
                            : "#8A8590",
                      }}
                    >
                      {day.dayLabel}
                    </Text>
                    <Text
                      className="text-base font-extrabold mt-0.5"
                      style={{
                        color: !day.available
                          ? "#C7C1CD"
                          : isSelected
                            ? "#fff"
                            : "#161119",
                      }}
                    >
                      {day.dateLabel}
                    </Text>
                    {day.available && (
                      <View
                        className="w-1.5 h-1.5 rounded-full mt-1"
                        style={{
                          backgroundColor: isSelected ? "#fff" : "#FFA230",
                        }}
                      />
                    )}
                  </>
                );

                return (
                  <TouchableOpacity
                    key={day.id}
                    activeOpacity={day.available ? 0.85 : 1}
                    onPress={() => handleSelectDay(day)}
                    disabled={!day.available}
                    style={{ marginRight: 10, alignItems: "center" }}
                  >
                    {isSelected ? (
                      <LinearGradient
                        colors={[COLORS.baseColor1, COLORS.baseColor2]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          width: 52,
                          height: 68,
                          borderRadius: 16,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {DayInner}
                      </LinearGradient>
                    ) : (
                      <View
                        className="items-center justify-center rounded-2xl"
                        style={{
                          width: 52,
                          height: 68,
                          backgroundColor: "#F5F2F7",
                        }}
                      >
                        {DayInner}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Available times */}
            <Text className="text-[11px] font-bold text-[#9A94A0] mt-4 mb-2 tracking-wide">
              AVAILABLE TIMES — {selectedDay?.fullDate?.toUpperCase() ?? "—"}
            </Text>

            {selectedDay && selectedDay.times.length > 0 ? (
              <View className="flex-row flex-wrap" style={{ gap: 10 }}>
                {selectedDay.times.map((time) => {
                  const isTimeSelected = time === selectedTime;
                  return (
                    <TouchableOpacity
                      key={time}
                      activeOpacity={0.85}
                      onPress={() => setSelectedTime(time)}
                    >
                      {isTimeSelected ? (
                        <LinearGradient
                          colors={[COLORS.baseColor1, COLORS.baseColor2]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            borderRadius: 999,
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                          }}
                        >
                          <Text className="text-xs font-bold text-white">
                            {time}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View
                          className="rounded-full px-4 py-2.5"
                          style={{ backgroundColor: "#F5F2F7" }}
                        >
                          <Text className="text-xs font-bold text-[#161119]">
                            {time}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <Text className="text-xs text-[#8A8590]">
                No slots available on this day.
              </Text>
            )}
          </View>
        </View>

        {/* Travel Radius */}
        <View className="mt-3 px-5">
          <SectionTitle>Travel Radius</SectionTitle>
          <View
            className="flex-row items-center bg-white rounded-[18px] p-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <View
              className="items-center justify-center rounded-2xl mr-3"
              style={{ width: 52, height: 52, backgroundColor: "#EAF7F3" }}
            >
              <Ionicons name="navigate" size={16} color="#1A5A52" />
              <Text
                className="text-[10px] font-extrabold mt-0.5"
                style={{ color: "#1A5A52" }}
              >
                {profile.travelRadiusKm} km
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-[#161119]">
                Travels up to {profile.travelRadiusKm} km
              </Text>
              <Text className="text-xs text-[#8A8590] mt-0.5">
                {profile.travelDescription}
              </Text>
              {profile.freeTravel && (
                <View className="self-start bg-[#F4E9FC] rounded-full px-2.5 py-1 mt-2">
                  <Text
                    className="text-[10px] font-bold"
                    style={{ color: COLORS.baseColor }}
                  >
                    Free travel included
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row items-center bg-gray-100 px-5 pt-3"
        style={{ gap: 10, paddingBottom: 22 }}
      >
        <TouchableOpacity
          className="w-14 h-14 rounded-2xl items-center justify-center bg-[#F4E4FF]"
          onPress={() => {
            router.push("/ChatScreen");
          }}
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
            borderColor: "#F4E4FF",
            borderWidth: 2,
          }}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#B57EDC" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          className="flex-1 rounded-2xl overflow-hidden"
          onPress={() => {
            const selectedService = profile.services.find(
              (s) => s.id === selectedServiceId,
            );
            if (!selectedService || !selectedDay || !selectedTime) return;

            router.push({
              pathname: "/booking/setup",
              params: {
                artistId: profile.id,
                artistName: profile.name,
                serviceId: selectedService.id,
                serviceName: selectedService.name,
                servicePrice: String(selectedService.price),
                dateLabel: selectedDay.fullDate,
                timeLabel: selectedTime,
              },
            });
          }}
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center rounded-full"
          >
            <Text className="text-white text-lg font-extrabold">Book Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
