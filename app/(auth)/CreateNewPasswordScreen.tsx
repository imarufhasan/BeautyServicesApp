import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------------------------------------
// Password strength logic — fully dynamic, recomputed on every keystroke
// ---------------------------------------------------------------------------
type Requirement = {
  id: string;
  label: string;
  test: (pw: string) => boolean;
};

const REQUIREMENTS: Requirement[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (pw) => pw.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (pw) => /[a-z]/.test(pw),
  },
  { id: "number", label: "One number", test: (pw) => /[0-9]/.test(pw) },
  {
    id: "special",
    label: "One special character",
    test: (pw) => /[^A-Za-z0-9]/.test(pw),
  },
];

const STRENGTH_LABELS = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

function getStrength(password: string) {
  const metCount = REQUIREMENTS.filter((r) => r.test(password)).length;
  const level = password.length === 0 ? 0 : Math.max(metCount, 1);
  return {
    level, // 0..5
    label:
      password.length === 0
        ? ""
        : (STRENGTH_LABELS[metCount - 1] ?? STRENGTH_LABELS[0]),
  };
}

export default function CreateNewPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getStrength(password), [password]);
  const metRequirements = useMemo(
    () => REQUIREMENTS.map((r) => ({ ...r, met: r.test(password) })),
    [password],
  );

  const allRequirementsMet = metRequirements.every((r) => r.met);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const isValid = allRequirementsMet && passwordsMatch;

  const handleResetPassword = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    try {
      // TODO: call real reset-password mutation, passing { newPassword: password }
      //router.push("/(auth)/password-updated");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8F9]" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          <Text className="text-2xl font-extrabold text-[#161119] mt-4">
            Create New Password
          </Text>
          <Text className="text-xs text-[#8A8590] mt-1">
            Make it strong and memorable
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
            <Text className="text-xs font-bold text-[#161119] mb-2">
              New Password
            </Text>
            <View
              className="flex-row items-center bg-[#F5F2F7] rounded-[14px] px-4"
              style={{
                height: 50,
                borderWidth: password.length > 0 ? 1.5 : 0,
                borderColor:
                  strength.level >= 4
                    ? "#FFA230"
                    : strength.level >= 2
                      ? "#E17100"
                      : "#E0405B",
              }}
            >
              <Ionicons name="lock-closed-outline" size={16} color="#B0AAB6" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter new password"
                placeholderTextColor="#B0AAB6"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 text-sm text-[#161119] ml-2"
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={17}
                  color="#B0AAB6"
                />
              </TouchableOpacity>
            </View>

            {/* Strength meter */}
            {password.length > 0 && (
              <>
                <View className="flex-row mt-3" style={{ gap: 5 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <View
                      key={i}
                      className="flex-1 rounded-full"
                      style={{
                        height: 4,
                        backgroundColor:
                          i < strength.level ? "#FFA230" : "#F0EEF2",
                      }}
                    />
                  ))}
                </View>
                <Text
                  className="text-[11px] font-bold mt-1.5"
                  style={{ color: "#FFA230" }}
                >
                  {strength.label}
                </Text>
              </>
            )}

            {/* Requirement checklist */}
            <View className="mt-3">
              {metRequirements.map((req) => (
                <View key={req.id} className="flex-row items-center mb-1.5">
                  <View
                    className="items-center justify-center rounded-full mr-2"
                    style={{
                      width: 16,
                      height: 16,
                      backgroundColor: req.met ? "#FFA230" : "#F0EEF2",
                    }}
                  >
                    {req.met && (
                      <Ionicons name="checkmark" size={10} color="#fff" />
                    )}
                  </View>
                  <Text
                    className="text-xs"
                    style={{ color: req.met ? "#161119" : "#B0AAB6" }}
                  >
                    {req.label}
                  </Text>
                </View>
              ))}
            </View>

            <Text className="text-xs font-bold text-[#161119] mb-2 mt-4">
              Confirm Password
            </Text>
            <View
              className="flex-row items-center bg-[#F5F2F7] rounded-[14px] px-4"
              style={{
                height: 50,
                borderWidth: confirmPassword.length > 0 ? 1.5 : 0,
                borderColor: passwordsMatch ? "#FFA230" : "#E0405B",
              }}
            >
              <Ionicons name="lock-closed-outline" size={16} color="#B0AAB6" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#B0AAB6"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                className="flex-1 text-sm text-[#161119] ml-2"
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
            {confirmPassword.length > 0 && !passwordsMatch && (
              <Text className="text-[11px] mt-1.5" style={{ color: "#E0405B" }}>
                Passwords do not match
              </Text>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!isValid || loading}
            onPress={handleResetPassword}
            className="rounded-full overflow-hidden mt-6"
            style={{ opacity: isValid ? 1 : 0.5 }}
          >
            <LinearGradient
              colors={[COLORS.baseColor1, COLORS.baseColor2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 items-center rounded-full"
            >
              <Text className="text-white text-base font-extrabold">
                {loading ? "Updating..." : "Reset Password"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
