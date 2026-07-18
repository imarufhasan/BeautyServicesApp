import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const REQUIREMENTS: {
  id: string;
  label: string;
  test: (pw: string) => boolean;
}[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (pw) => pw.length >= 8,
  },
  {
    id: "upper",
    label: "One uppercase letter",
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    id: "lower",
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

const strengthMeta = (score: number) => {
  if (score <= 1) return { label: "Weak", color: "#E0405B" };
  if (score <= 2) return { label: "Fair", color: "#E17100" };
  if (score <= 3) return { label: "Good", color: "#E17100" };
  if (score <= 4) return { label: "Strong", color: "#48B9A8" };
  return { label: "Very Strong", color: "#1A8073" };
};

const PasswordField = ({
  label,
  value,
  onChangeText,
  visible,
  onToggleVisible,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
}) => (
  <View className="mb-4">
    <Text className="text-sm font-bold text-[#161119] mb-2">{label}</Text>
    <View
      className="flex-row items-center rounded-2xl px-4"
      style={{ backgroundColor: "#F5F2F7" }}
    >
      <Ionicons
        name="lock-closed-outline"
        size={16}
        color="#8A8590"
        style={{ marginRight: 8 }}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visible}
        placeholder="********"
        placeholderTextColor={"gray"}
        className="flex-1 py-4 text-sm text-[#161119]"
        autoCapitalize="none"
      />
      <TouchableOpacity
        onPress={onToggleVisible}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={visible ? "eye-off-outline" : "eye-outline"}
          size={16}
          color="#8A8590"
        />
      </TouchableOpacity>
    </View>
  </View>
);

export default function ChangePasswordScreen({
  onSubmit,
}: {
  onSubmit?: (newPassword: string) => Promise<void> | void;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const results = useMemo(
    () => REQUIREMENTS.map((r) => ({ ...r, met: r.test(newPassword) })),
    [newPassword],
  );
  const score = results.filter((r) => r.met).length;
  const meta = strengthMeta(score);
  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === newPassword;
  const canSubmit = score === REQUIREMENTS.length && passwordsMatch;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(newPassword);
      } else {
        // TODO API: await changePasswordMutation({ newPassword })
        console.log("Password changed");
      }
      router.push("/profile/password-updated");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <View className="px-5 pt-4">
        <Text className="text-2xl font-extrabold text-[#161119]">
          Change Password
        </Text>
        <Text className="text-sm text-[#8A8590] mt-1">
          Make it strong and memorable
        </Text>
      </View>

      <View className="px-5 mt-6">
        <View
          className="bg-white rounded-[20px] p-4"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <PasswordField
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            visible={showNew}
            onToggleVisible={() => setShowNew((v) => !v)}
          />

          {/* Strength meter */}
          <View className="flex-row mb-1.5" style={{ gap: 5 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: i < score ? meta.color : "#F0EEF2",
                }}
              />
            ))}
          </View>
          {newPassword.length > 0 && (
            <Text
              className="text-xs font-bold mb-4"
              style={{ color: meta.color }}
            >
              {meta.label}
            </Text>
          )}

          <View className="mb-5" style={{ gap: 8 }}>
            {results.map((r) => (
              <View key={r.id} className="flex-row items-center">
                <View
                  className="items-center justify-center rounded-full mr-2"
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: r.met ? "#E17100" : "#F0EEF2",
                  }}
                >
                  {r.met && (
                    <Ionicons name="checkmark" size={11} color="#fff" />
                  )}
                </View>
                <Text
                  className="text-xs"
                  style={{ color: r.met ? "#161119" : "#B0AAB6" }}
                >
                  {r.label}
                </Text>
              </View>
            ))}
          </View>

          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            visible={showConfirm}
            onToggleVisible={() => setShowConfirm((v) => !v)}
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <Text className="text-xs -mt-3 mb-1" style={{ color: "#E0405B" }}>
              Passwords do not match
            </Text>
          )}
        </View>
      </View>

      <View className="px-5 mt-5">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
          className="rounded-full overflow-hidden"
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center rounded-full"
            style={{ opacity: canSubmit ? 1 : 0.5 }}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-extrabold">
                Reset Password
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
