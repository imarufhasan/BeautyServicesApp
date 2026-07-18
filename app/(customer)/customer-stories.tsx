import AppHeader from "@/components/common/AppHeader";
import Stars from "@/components/common/Stars";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STORY_IMAGES = [
  require("../../assets/images/home/pic2.png"),
  require("../../assets/images/home/pic3.png"),
  require("../../assets/images/home/pic4.png"),
  require("../../assets/images/home/pic1.png"),
];

const STORIES = [
  {
    id: "story_001",
    image: STORY_IMAGES[0],
    rating: 5,
    quote:
      "Emma transformed me for my wedding day — I felt like absolute royalty. Every single guest was asking about my makeup. Cannot recommend this platform enough.",
    name: "Olivia Bennett",
    location: "Sydney, NSW · Bridal Makeup",
  },
  {
    id: "story_002",
    image: STORY_IMAGES[1],
    rating: 5,
    quote:
      "Booked Aria for my formal and she was beyond professional. My hair lasted through hours of dancing. Already re-booked her for my birthday party.",
    name: "Priya Sharma",
    location: "Melbourne, VIC · Hair Styling",
  },
  {
    id: "story_003",
    image: STORY_IMAGES[2],
    rating: 5,
    quote:
      "The artist was incredible and made me feel confident throughout the entire experience.",
    name: "Sophia Williams",
    location: "Brisbane, QLD · Makeup",
  },
  {
    id: "story_004",
    image: STORY_IMAGES[3],
    rating: 4.8,
    quote:
      "Amazing service from start to finish. The booking process was simple and the result was beautiful.",
    name: "Amelia Brown",
    location: "Perth, WA · Beauty Styling",
  },
];

export default function CustomerStoriesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      {/* <View className="flex-row items-center px-5 py-4 border-b border-[#F1EFF3]">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={22} color="#161119" />
        </TouchableOpacity>

        <Text className="text-xl font-extrabold text-[#161119] ml-3">
          Customer Stories
        </Text>
      </View> */}
      <AppHeader title="Customer Stories" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
      >
        {STORIES.map((story, index) => (
          <View
            key={index}
            className="bg-white rounded-[22px] overflow-hidden mb-5"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 12,
              shadowOffset: {
                width: 0,
                height: 5,
              },
              elevation: 3,
            }}
          >
            {/* Image */}
            <Image
              source={story.image}
              style={{
                width: "100%",
                height: 172,
              }}
              resizeMode="cover"
            />

            <View className="p-4">
              <Stars rating={story.rating} />

              <Text className="text-sm text-[#161119] mt-3 leading-5">
                “{story.quote}”
              </Text>

              <View className="flex-row items-center justify-between mt-4">
                <View>
                  <Text className="text-sm font-extrabold text-[#161119]">
                    {story.name}
                  </Text>

                  <Text className="text-xs text-[#8A8590] mt-1">
                    {story.location}
                  </Text>
                </View>

                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() =>
                    router.push({
                      pathname: "/(customer)/customer-story-details",
                      params: {
                        id: story.id,
                      },
                    })
                  }
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color: COLORS.baseColor,
                    }}
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
    </SafeAreaView>
  );
}
