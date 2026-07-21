import { Field, SectionCard } from "@/components/(artist)/FormField";
import GradientButton from "@/components/common/GradientButton";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfessionalRegistrationScreen() {
  const [businessName, setBusinessName] = useState("");
  const [abn, setAbn] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [experience, setExperience] = useState("");
  const [accepted, setAccepted] = useState(false);

  const canContinue = accepted;

  const handleContinue = () => {
    //if (!canContinue) return;
    router.push({
      pathname: "/registration/IdentityVerificationScreen",
      params: { businessName, abn, businessAddress, experience },
    });
  };

  return (
    <LinearGradient
      colors={["#FDEFF4", "#FFFFFF", "#EAF6F5"]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            className="flex-1 px-5"
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <View className="flex-row items-center mt-6 mb-6">
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  transform: [{ rotate: "45deg" }],
                  marginRight: 10,
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={["#FF5FA2", "#FFA35C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1 }}
                />
              </View>
              <Text
                style={{ color: COLORS.baseColor }}
                className="text-lg font-bold"
              >
                memillennial
              </Text>
            </View>

            {/* Heading */}
            <Text className="text-[28px] font-extrabold text-[#161119]">
              Professional Registration
            </Text>
            <Text className="mt-2 text-[15px] text-[#8A8590]">
              Create your professional beauty profile.
            </Text>

            {/* Progress bar */}
            <View className="flex-row items-center mt-6 mb-7">
              <LinearGradient
                colors={["#FF5FA2", "#FFA35C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-1.5 flex-1 rounded-full mr-2"
              />
              <View className="h-1.5 flex-1 rounded-full bg-[#ECECEC] mr-2" />
              <View className="h-1.5 flex-1 rounded-full bg-[#ECECEC] mr-3" />
              <Text
                style={{ color: COLORS.baseColor }}
                className="text-xs font-bold"
              >
                Step 1 of 3
              </Text>
            </View>

            {/* Business Information */}
            <SectionCard title="BUSINESS INFORMATION">
              <Field
                label="Business Name"
                placeholder="Jane's Beauty Studio"
                value={businessName}
                onChangeText={setBusinessName}
              />
              <Field
                label="ABN (Australian Business Number)"
                placeholder="XX XXX XXX XXX"
                value={abn}
                onChangeText={setAbn}
                keyboardType="numeric"
              />
              <Field
                label="Business Address"
                placeholder="123 Beauty St, Melbourne VIC 3000"
                value={businessAddress}
                onChangeText={setBusinessAddress}
              />
              <View className="mb-0">
                <Field
                  label="Years of Experience"
                  placeholder="e.g. 5"
                  value={experience}
                  onChangeText={setExperience}
                  keyboardType="numeric"
                />
              </View>
            </SectionCard>

            {/* Terms */}
            <View
              className="bg-white rounded-[20px] p-5 mb-6 flex-row items-start"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
              }}
            >
              <TouchableOpacity
                onPress={() => setAccepted((a) => !a)}
                className={`w-6 h-6 rounded-[6px] border-2 items-center justify-center mr-3 mt-0.5 ${
                  accepted
                    ? "bg-[#B57EDC] border-[#B57EDC]"
                    : "border-[#D9D5DE] bg-white"
                }`}
              >
                {accepted && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
              <Text className="flex-1 text-sm leading-5 text-[#161119]">
                I accept the{" "}
                <Text className="text-[#B57EDC] font-semibold">
                  Terms & Conditions
                </Text>{" "}
                and{" "}
                <Text className="text-[#B57EDC] font-semibold">
                  Privacy Policy
                </Text>
                . I confirm all information provided is accurate and up to date.
              </Text>
            </View>

            <GradientButton
              label="Continue"
              onPress={handleContinue}
              // disabled={!canContinue}
              style={{ marginTop: 10 }}
            />

            {/* Login link */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/LoginScreen")}
              className="mt-4 items-center"
            >
              <Text className="text-sm text-[#8A8590]">
                Already have an account?{" "}
                <Text className="text-[#B57EDC] font-semibold">Login</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
