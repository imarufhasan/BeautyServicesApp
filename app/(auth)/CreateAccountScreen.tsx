import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthBrandHeader from "./AuthBrandHeader";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CreateAccountScreen() {
  const { role } = useLocalSearchParams();
  console.log("role 4: ", role);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(
    () =>
      fullName.trim().length >= 2 &&
      EMAIL_REGEX.test(email.trim()) &&
      password.length >= 8 &&
      password === confirmPassword &&
      acceptedTerms,
    [fullName, email, password, confirmPassword, acceptedTerms],
  );

  const handleCreateAccount = async () => {
    //if (!isValid || loading) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push({
        pathname: "/OtpVerificationScreen",
        params: {
          role: role,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8F9]" edges={["top"]}>
      <KeyboardAvoidingView contentContainerStyle={{ paddingBottom: 80 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
        >
          <View className="pt-4">
            <AuthBrandHeader />
          </View>

          <Text className="text-3xl font-extrabold text-[#161119] mt-6">
            Create Account
          </Text>
          <Text className="text-sm text-[#8A8590] mt-1">
            Join thousands of beauty lovers
          </Text>

          <View
            className="bg-white rounded-[22px] p-4 mt-6"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 },
              elevation: 2,
            }}
          >
            <Text className="text-sm font-bold text-[#161119] mb-2">
              Full Name
            </Text>
            <View
              className="flex-row items-center bg-[#F5F2F7] rounded-[14px] px-4"
              style={{ height: 50 }}
            >
              <Ionicons name="person-outline" size={16} color="#B0AAB6" />
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Sophie Anderson"
                placeholderTextColor="#B0AAB6"
                className="flex-1 text-base text-[#161119] ml-2"
              />
            </View>

            <Text className="text-sm font-bold text-[#161119] mb-2 mt-4">
              Email Address
            </Text>
            <View
              className="flex-row items-center bg-[#F5F2F7] rounded-[14px] px-4"
              style={{ height: 50 }}
            >
              <Ionicons name="mail-outline" size={16} color="#B0AAB6" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="sophie@example.com"
                placeholderTextColor="#B0AAB6"
                autoCapitalize="none"
                keyboardType="email-address"
                className="flex-1 text-base text-[#161119] ml-2"
              />
            </View>

            <Text className="text-sm font-bold text-[#161119] mb-2 mt-4">
              Password
            </Text>
            <View
              className="flex-row items-center bg-[#F5F2F7] rounded-[14px] px-4"
              style={{ height: 50 }}
            >
              <Ionicons name="lock-closed-outline" size={16} color="#B0AAB6" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a strong password"
                placeholderTextColor="#B0AAB6"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 text-base text-[#161119] ml-2"
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={17}
                  color="#B0AAB6"
                />
              </TouchableOpacity>
            </View>

            <Text className="text-sm font-bold text-[#161119] mb-2 mt-4">
              Confirm Password
            </Text>
            <View
              className="flex-row items-center bg-[#F5F2F7] rounded-[14px] px-4"
              style={{
                height: 50,
                borderWidth:
                  confirmPassword.length > 0 && password !== confirmPassword
                    ? 1
                    : 0,
                borderColor: "#E0405B",
              }}
            >
              <Ionicons name="lock-closed-outline" size={16} color="#B0AAB6" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#B0AAB6"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                className="flex-1 text-base text-[#161119] ml-2"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((v) => !v)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={17}
                  color="#B0AAB6"
                />
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <Text className="text-xs mt-1.5" style={{ color: "#E0405B" }}>
                Passwords do not match
              </Text>
            )}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setAcceptedTerms((v) => !v)}
              className="flex-row items-center justify-center mt-4"
            >
              <View
                className="items-center  justify-center rounded-full mr-2 mt-0.5"
                style={{
                  width: 18,
                  height: 18,
                  borderWidth: 1.5,
                  borderColor: acceptedTerms ? COLORS.baseColor : "#D9D3E0",
                  backgroundColor: acceptedTerms
                    ? COLORS.baseColor
                    : "transparent",
                }}
              >
                {acceptedTerms && (
                  <Ionicons name="checkmark" size={11} color="#fff" />
                )}
              </View>
              <Text className="flex-1 text-sm text-[#6E6875] leading-5">
                I accept the{" "}
                <Text
                  className="font-bold"
                  style={{ color: COLORS.baseColor }}
                  //onPress={() => router.push("/legal/terms")}
                >
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                  className="font-bold"
                  style={{ color: COLORS.baseColor }}
                  //onPress={() => router.push("/legal/privacy")}
                >
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            //disabled={!isValid || loading}
            onPress={handleCreateAccount}
            className="rounded-2xl overflow-hidden mt-6"
            //style={{ opacity: isValid ? 1 : 0.5 }}
          >
            <LinearGradient
              colors={[COLORS.baseColor1, COLORS.baseColor2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 items-center rounded-full"
            >
              <View className="flex-row items-center">
                {loading && (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text className="text-white text-lg font-extrabold">
                  {loading ? "Creating Account..." : "Create Account"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View className="flex-row items-center my-5">
            <View className="flex-1 h-[1px] bg-[#F0EEF2]" />
            <Text className="text-base text-[#B0AAB6] mx-3">or</Text>
            <View className="flex-1 h-[1px] bg-[#F0EEF2]" />
          </View>

          <View className="flex-row items-center justify-center">
            <Text className="text-sm text-[#6E6875]">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/LoginScreen")}
            >
              <Text
                className="text-sm font-extrabold"
                style={{ color: COLORS.baseColor }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
