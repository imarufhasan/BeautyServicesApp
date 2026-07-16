import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
      name: "Ananya R.",
      service: "Bridal Makeup",
      image: require("../../assets/images/home/pic2.png"),
    },
    {
      name: "Shreya M.",
      service: "Hair Styling",
      image: require("../../assets/images/home/pic3.png"),
    },
  ],
};

export default function CustomerStoryDetails() {
  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFA]" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        {/* Header */}
        <View className="px-5 pt-3 flex-row justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 rounded-full bg-white items-center justify-center"
          >
            <Ionicons name="chevron-back" size={20} />
          </TouchableOpacity>

          <TouchableOpacity className="w-9 h-9 rounded-full bg-white items-center justify-center">
            <Ionicons name="share-social-outline" size={18} />
          </TouchableOpacity>
        </View>

        {/* Hero */}

        <View className="mx-5 mt-3 rounded-[22px] overflow-hidden">
          <Image
            source={STORY_DETAILS.coverImage}
            style={{
              height: 220,
              width: "100%",
            }}
            resizeMode="cover"
          />

          <View className="absolute bottom-0 left-0 right-0 p-4">
            <View className="bg-[#FF6B8A] self-start px-2 py-1 rounded-full">
              <Text className="text-white text-[10px] font-bold">
                ✓ Verified Booking
              </Text>
            </View>

            <Text className="text-white text-lg font-extrabold mt-2">
              {STORY_DETAILS.customer.name}
            </Text>

            <Text className="text-white text-xs">
              ★★★★★ Bridal Makeup · {STORY_DETAILS.customer.date}
            </Text>
          </View>
        </View>

        {/* Review */}

        <View className="px-5 mt-5">
          <Text className="text-base font-bold text-[#161119]">❝</Text>

          <Text className="text-sm text-[#52505A] leading-6">
            {STORY_DETAILS.review}
          </Text>
        </View>

        {/* Before After */}

        <View className="px-5 mt-5">
          <Text className="font-extrabold text-[#161119]">Before & After</Text>

          <View className="mt-3 rounded-[14px] overflow-hidden">
            <Image
              source={STORY_DETAILS.beforeAfter.after}
              style={{
                height: 150,
                width: "100%",
              }}
              resizeMode="cover"
            />

            <View className="absolute left-1/2 top-1/2">
              <View className="w-8 h-8 bg-white rounded-full items-center justify-center">
                <Ionicons name="swap-horizontal" size={16} />
              </View>
            </View>
          </View>

          <Text className="text-center text-[10px] text-gray-400 mt-2">
            Drag slider to compare
          </Text>
        </View>

        {/* Photo Gallery */}

        <View className="px-5 mt-5">
          <Text className="font-extrabold text-[#161119]">Photo Gallery</Text>

          <View className="flex-row flex-wrap justify-between mt-3">
            {STORY_DETAILS.gallery.map((img, index) => (
              <Image
                key={index}
                source={img}
                style={{
                  width: "31%",
                  height: 90,
                  borderRadius: 12,
                  marginBottom: 10,
                }}
                resizeMode="cover"
              />
            ))}
          </View>
        </View>

        {/* Related Stories */}

        <View className="px-5 mt-5">
          <Text className="font-extrabold text-[#161119]">Related Stories</Text>

          <View className="flex-row mt-3">
            {STORY_DETAILS.relatedStories.map((item, index) => (
              <View
                key={index}
                className="bg-white rounded-[12px] overflow-hidden mr-3"
                style={{
                  width: 160,
                }}
              >
                <Image
                  source={item.image}
                  style={{
                    height: 100,
                    width: "100%",
                  }}
                  resizeMode="cover"
                />

                <View className="p-2">
                  <Text className="text-sm font-bold">{item.name}</Text>

                  <Text className="text-[11px] text-gray-400">
                    {item.service}
                  </Text>

                  <Text
                    style={{
                      color: COLORS.baseColor,
                    }}
                  >
                    ★★★★★
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
