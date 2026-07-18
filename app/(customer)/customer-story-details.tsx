import Stars from "@/components/common/Stars";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STORY_DETAILS = {
  id: "story_001",

  customer: {
    name: "Priya Patel",
    location: "Sydney, Australia",
    service: "Bridal Makeup",
    date: "March 15, 2025",
    avatar: require("../../assets/images/home/pic1.png"),
  },

  artist: {
    name: "Emma Richards",
    verified: true,
  },

  coverImage: require("../../assets/images/home/pic4.png"),

  rating: 5,

  review:
    "I was nervous about finding the right artist for my wedding day. A friend recommended memillennial and it completely changed my experience. Priya arrived exactly on time with a full professional kit.\n\nShe carefully listened to my vision, showed me references, and executed the look flawlessly. The bridal makeup lasted beautifully through 8 hours of celebrations. I felt like a queen all day long.\n\nI highly recommend memillennial to every bride-to-be. The quality, punctuality, and genuine care they bring make it worth every single request.",

  beforeAfter: {
    before: require("../../assets/images/home/pic2.png"),
    after: require("../../assets/images/home/pic3.png"),
  },

  gallery: [
    require("../../assets/images/home/pic1.png"),
    require("../../assets/images/home/pic2.png"),
    require("../../assets/images/home/pic3.png"),
    require("../../assets/images/home/pic4.png"),
  ],

  relatedStories: [
    {
      id: "rs1",
      name: "Ananya R.",
      service: "Bridal Makeup",
      rating: 5,
      image: require("../../assets/images/home/pic2.png"),
    },
    {
      id: "rs2",
      name: "Shreya M.",
      service: "Hair Color",
      rating: 4.8,
      image: require("../../assets/images/home/pic3.png"),
    },
    {
      id: "rs3",
      name: "Mia Johnson",
      service: "Party Makeup",
      rating: 4.9,
      image: require("../../assets/images/home/pic1.png"),
    },
    {
      id: "rs4",
      name: "Emily Davis",
      service: "Wedding Makeup",
      rating: 5,
      image: require("../../assets/images/home/pic4.png"),
    },
    {
      id: "rs5",
      name: "Sophia Wilson",
      service: "Luxury Glam",
      rating: 4.7,
      image: require("../../assets/images/home/pic2.png"),
    },
    {
      id: "rs6",
      name: "Ava Thompson",
      service: "Hair Styling",
      rating: 4.9,
      image: require("../../assets/images/home/pic3.png"),
    },
  ],
};

// ---------------------------------------------
// Drag-to-compare Before/After slider
// ---------------------------------------------
function BeforeAfterCompare({
  before,
  after,
  height = 210,
}: {
  before: any;
  after: any;
  height?: number;
}) {
  const [width, setWidth] = useState(0);
  const [ratio, setRatio] = useState(0.5);
  const widthRef = useRef(0);

  const onLayout = (e: LayoutChangeEvent) => {
    widthRef.current = e.nativeEvent.layout.width;
    setWidth(e.nativeEvent.layout.width);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (!widthRef.current) return;
        const x = Math.min(Math.max(gesture.moveX, 0), widthRef.current);
        setRatio(x / widthRef.current);
      },
    }),
  ).current;

  const handleX = width * ratio;

  return (
    <View>
      <View
        onLayout={onLayout}
        className="rounded-[14px] overflow-hidden"
        style={{ height }}
        {...panResponder.panHandlers}
      >
        <Image
          source={after}
          style={{ width: "100%", height: "100%", position: "absolute" }}
          resizeMode="cover"
        />

        {/* Before (clipped by handle position) */}
        <View
          style={{
            position: "absolute",
            width: handleX,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Image
            source={before}
            style={{ width: width || "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>

        {/* BEFORE badge */}
        <View className="absolute top-3 left-3 bg-black/70 rounded-full px-2.5 py-1">
          <Text className="text-white text-[10px] font-bold">BEFORE</Text>
        </View>

        {/* Divider */}
        {width > 0 && (
          <View
            style={{
              position: "absolute",
              left: handleX - 1,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: "#FFFFFF",
            }}
          />
        )}

        {/* Drag handle */}
        {width > 0 && (
          <View
            style={{
              position: "absolute",
              left: handleX - 16,
              top: height / 2 - 16,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 4,
            }}
          >
            <View
              style={{
                width: 3,
                height: 14,
                borderRadius: 2,
                backgroundColor: "#D9D3DC",
              }}
            />
          </View>
        )}
      </View>

      <Text className="text-center text-[10px] text-gray-400 mt-2">
        Drag slider to compare
      </Text>
    </View>
  );
}

export default function CustomerStoryDetails() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        {/* <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color="#161119" />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 1,
          }}
        >
          <Ionicons name="chevron-back" size={18} color="#161119" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-[#161119]">Customer Story</Text>

        <TouchableOpacity hitSlop={10}>
          <Ionicons name="share-outline" size={20} color="#161119" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero — rounded card with side margin, badge+name+rating stacked in one bottom overlay */}
        <View className="mx-5 mt-3 rounded-[22px] overflow-hidden">
          <Image
            source={STORY_DETAILS.coverImage}
            style={{ width: "100%", height: 230 }}
            resizeMode="cover"
          />

          <View
            className="absolute bottom-0 left-0 right-0 px-4 pt-10 pb-4"
            style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          >
            <View className="bg-[#E85D8A] self-start px-2.5 py-1 rounded-full flex-row items-center mb-2">
              <Ionicons name="checkmark-circle" size={11} color="#FFFFFF" />
              <Text className="text-white text-[10px] font-bold ml-1">
                Verified Booking
              </Text>
            </View>

            <Text className="text-white text-xl font-extrabold">
              {STORY_DETAILS.customer.name}
            </Text>

            <View className="flex-row items-center mt-1">
              {/* <Text style={{ color: COLORS.baseColor }} className="text-xs">
                {"★".repeat(Math.round(STORY_DETAILS.rating))}
              </Text> */}
              <Stars rating={STORY_DETAILS.rating} size={10} />
              <Text className="text-white text-xs ml-2">
                {STORY_DETAILS.customer.service} · {STORY_DETAILS.customer.date}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-5">
          {/* Quote */}
          <Text
            style={{ color: COLORS.baseColor }}
            className="text-3xl font-extrabold mt-5 leading-[22px]"
          >
            ❝
          </Text>

          <Text className="text-sm text-[#52505A] leading-6 mt-1">
            {STORY_DETAILS.review}
          </Text>

          {/* Before & After */}
          <Text className="text-lg font-extrabold text-[#161119] mt-7 mb-3">
            Before &amp; After
          </Text>

          <BeforeAfterCompare
            before={STORY_DETAILS.beforeAfter.before}
            after={STORY_DETAILS.beforeAfter.after}
          />

          {/* Photo Gallery — 2 columns to match the design */}
          <Text className="text-lg font-extrabold text-[#161119] mt-7 mb-3">
            Photo Gallery
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {STORY_DETAILS.gallery.map((img, index) => (
              <Image
                key={index}
                source={img}
                style={{
                  width: "48%",
                  height: 130,
                  borderRadius: 14,
                  marginBottom: 12,
                }}
                resizeMode="cover"
              />
            ))}
          </View>

          {/* Related Stories */}
          <Text className="text-lg font-extrabold text-[#161119] mt-3 mb-3">
            Related Stories
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20, paddingBottom: 10 }}
          >
            {STORY_DETAILS.relatedStories.map((item, index) => (
              <View
                key={index}
                className="bg-white rounded-[14px] overflow-hidden mr-3"
                style={{
                  width: 140,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 3 },
                  elevation: 2,
                }}
              >
                <Image
                  source={item.image}
                  style={{ height: 100, width: "100%" }}
                  resizeMode="cover"
                />

                <View className="p-2.5">
                  <Text className="text-xs font-bold text-[#161119]">
                    {item.name}
                  </Text>

                  <Text className="text-[11px] text-[#8A8590] mt-0.5">
                    {item.service}
                  </Text>

                  {/* <Text
                    style={{ color: COLORS.baseColor }}
                    className="text-[11px] mt-1"
                  >
                    ★★★★★
                  </Text> */}
                  <Stars rating={item.rating} size={9} />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
