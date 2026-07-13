import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const CUSTOMER_IMAGE = require("../../assets/images/choose-role/choose_role_pic1.png");
const ARTIST_IMAGE = require("../../assets/images/choose-role/choose_role_pic2.png");

type RoleCardProps = {
  image: any;
  title: string;
  subtitle: string;
  variant: "customer" | "artist";
  selected: boolean;
  onPress: () => void;
  minHeight: number;
  onLayout: (event: any) => void;
};

const RoleCard = ({
  image,
  title,
  subtitle,
  variant,
  onPress,
  selected,
  minHeight,
  onLayout,
}: RoleCardProps) => {
  const isSelected = selected;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onLayout={onLayout}
      className={`flex-1 rounded-[12px] p-2.5
    ${isSelected ? "border-[#B57EDC] bg-[#F4E4FF]" : "border-[#ECECEC] bg-white"}
  `}
      style={[
        {
          borderWidth: 1,
          minHeight,
        },
        isSelected
          ? {
              shadowColor: "#F2447D",
              shadowOpacity: 0.25,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
            }
          : {
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 2,
            },
      ]}
    >
      <Image
        source={image}
        className="w-full h-48 rounded-[14px]"
        resizeMode="cover"
      />

      <View className="mt-3 px-2 pb-1.5 items-center">
        <Text className="text-2xl font-bold text-black text-center">
          {title}
        </Text>

        <Text
          className="mt-2 text-sm text-center leading-4 text-gray-500"
          style={{ minHeight: 36 }}
        >
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function ChooseRoleScreen({ navigation }: any) {
  const [selectedRole, setSelectedRole] = useState<"customer" | "artist">(
    "customer",
  );

  const [cardHeight, setCardHeight] = useState(0);

  const handleSelectCustomer = () => {
    setSelectedRole("customer");

    setTimeout(() => {
      router.push({
        pathname: "/(customer)/customerHomeScreen",
        params: {
          role: "customer",
        },
      });
    }, 300);
  };

  const handleSelectArtist = () => {
    setSelectedRole("artist");

    setTimeout(() => {
      router.push({
        pathname: "/(auth)/professional-registration",
        params: {
          role: "artist",
        },
      });
    }, 300);
  };

  return (
    <LinearGradient
      colors={[
        COLORS.backGradient1,
        COLORS.backGradient2,
        COLORS.backGradient3,
      ]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      className="flex-1"
    >
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        {/* Logo */}
        <View className="items-center mt-8">
          <View
            className="w-16 h-16 rounded-[18px] items-center justify-center"
            style={{
              backgroundColor: COLORS.baseColor,
              shadowColor: "#F2447D",
              shadowOpacity: 0.35,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 8 },
              elevation: 6,
            }}
          >
            <Ionicons name="location" size={30} color="#FFFFFF" />
            <View className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-white" />
          </View>
          <Text
            style={{
              color: COLORS.baseColor,
            }}
            className="mt-3 text-xs font-bold tracking-[4px]"
          >
            MEMILLENNIAL
          </Text>
        </View>

        {/* Heading */}
        <Text className="mt-7 text-center text-[34px] leading-10 font-extrabold text-[#161119]">
          Choose Your{"\n"}Journey
        </Text>

        {/* Subtitle */}
        <Text className="mt-3.5 text-center text-sm leading-5 text-[#8A8590] px-8">
          Select how you&lsquo;d like to continue with{"\n"}
          <Text
            style={{
              color: COLORS.baseColor,
            }}
            className="font-semibold"
          >
            memillennial.
          </Text>
        </Text>

        {/* Cards */}
        <View className="flex-1 flex-row mt-8 px-5 gap-3.5 items-start">
          <RoleCard
            image={CUSTOMER_IMAGE}
            title="Customer"
            subtitle="Book professional beauty services near you."
            variant="customer"
            selected={selectedRole === "customer"}
            minHeight={cardHeight}
            onLayout={(e) => {
              const height = e.nativeEvent.layout.height;
              if (height > cardHeight) {
                setCardHeight(height);
              }
            }}
            onPress={handleSelectCustomer}
          />
          <RoleCard
            image={ARTIST_IMAGE}
            title="Beauty Artist"
            subtitle="Grow your business and manage bookings easy"
            variant="artist"
            selected={selectedRole === "artist"}
            minHeight={cardHeight}
            onLayout={(e) => {
              const height = e.nativeEvent.layout.height;
              if (height > cardHeight) {
                setCardHeight(height);
              }
            }}
            onPress={handleSelectArtist}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
