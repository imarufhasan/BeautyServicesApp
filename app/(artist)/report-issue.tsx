import AppHeader from "@/components/common/AppHeader";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IssueCategory = "booking" | "payment" | "artist" | "technical" | "other";

const CATEGORIES: {
  id: IssueCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "booking", label: "Booking Issue", icon: "calendar-outline" },
  { id: "payment", label: "Payment Problem", icon: "card-outline" },
  { id: "artist", label: "Artist Issue", icon: "person-outline" },
  { id: "technical", label: "Technical Bug", icon: "alert-circle-outline" },
  { id: "other", label: "Other", icon: "help-circle-outline" },
];

const CategoryCard = ({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    className="flex-row items-center rounded-2xl px-3 py-3.5 mb-3"
    style={{
      width: "48%",
      backgroundColor: selected ? "#FDEDF1" : "#fff",
      borderColor: selected ? "#FC6C8C" : "#EFEAF3",
      borderWidth: selected ? 1.5 : 1,
    }}
  >
    <View
      className="items-center justify-center rounded-full mr-2"
      style={{ width: 30, height: 30, backgroundColor: "#FDEDF1" }}
    >
      <Ionicons name={icon} size={14} color="#FC6C8C" />
    </View>
    <Text className="text-xs font-bold text-[#161119] flex-1" numberOfLines={2}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function ReportIssueScreen({
  onSubmit,
}: {
  onSubmit?: (payload: {
    category: IssueCategory | null;
    description: string;
    screenshotUri: string | null;
  }) => Promise<void> | void;
}) {
  const [category, setCategory] = useState<IssueCategory | null>(null);
  const [description, setDescription] = useState("");
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleUploadScreenshot = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setScreenshotUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!category) {
      Alert.alert(
        "Select a category",
        "Please choose what kind of issue you're reporting.",
      );
      return;
    }
    if (!description.trim()) {
      Alert.alert(
        "Add a description",
        "Please describe the issue before submitting.",
      );
      return;
    }

    setSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit({
          category,
          description: description.trim(),
          screenshotUri,
        });
      } else {
        // TODO API: await submitIssueReportMutation({ category, description, screenshotUri })
        console.log("Report submitted:", {
          category,
          description,
          screenshotUri,
        });
      }
      router.back();
    } catch (err) {
      console.warn("Failed to submit report:", err);
      Alert.alert("Something went wrong", "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <AppHeader title="Report an Issue" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 30,
        }}
      >
        <Text className="text-[11px] font-bold text-[#9A94A0] tracking-wide mb-3 uppercase">
          Issue Category
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {CATEGORIES.map((c) => (
            <CategoryCard
              key={c.id}
              label={c.label}
              icon={c.icon}
              selected={category === c.id}
              onPress={() => setCategory(c.id)}
            />
          ))}
        </View>

        <View
          className="bg-white rounded-[20px] p-4 mt-2"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <Text className="text-[11px] font-bold text-[#9A94A0] tracking-wide mb-2 uppercase">
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Please describe the issue in as much detail as possible..."
            placeholderTextColor="#D9AAB8"
            multiline
            className="rounded-2xl px-4 py-3.5 text-sm text-[#161119]"
            style={{
              backgroundColor: "#FDEDF1",
              minHeight: 100,
              textAlignVertical: "top",
            }}
          />

          <Text className="text-[11px] font-bold text-[#9A94A0] tracking-wide mt-5 mb-2 uppercase">
            Upload Screenshot (Optional)
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleUploadScreenshot}
            className="items-center justify-center rounded-2xl py-6"
            style={{
              borderWidth: 1.5,
              borderStyle: "dashed",
              borderColor: "#F6C9D6",
              backgroundColor: "#FFFBFC",
              overflow: "hidden",
            }}
          >
            {screenshotUri ? (
              <Image
                source={{ uri: screenshotUri }}
                style={{ width: "100%", height: 140, borderRadius: 12 }}
                resizeMode="cover"
              />
            ) : (
              <>
                <Ionicons name="image-outline" size={22} color="#FC6C8C" />
                <Text
                  className="text-sm font-bold mt-2"
                  style={{ color: "#FC6C8C" }}
                >
                  Tap to upload screenshot
                </Text>
                <Text className="text-[11px] text-[#B0AAB6] mt-1">
                  PNG, JPG up to 10 MB
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="px-5 pb-5 pt-2">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={submitting}
          className="rounded-full overflow-hidden"
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center rounded-full"
            style={{ opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-extrabold">
                Submit Report
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
