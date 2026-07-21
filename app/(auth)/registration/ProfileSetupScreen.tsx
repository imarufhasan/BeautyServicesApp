import {
  DropdownField,
  PlainCard,
  ValidatedField,
} from "@/components/(artist)/FormField";
import {
  StepHeader,
  StepProgressBar,
} from "@/components/(artist)/StepProgress";
import GradientButton from "@/components/common/GradientButton";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BIO_MAX = 500;

export default function ProfileSetupScreen() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [bio, setBio] = useState(
    "Passionate hair & makeup artist with 8 years of experience specialising in bridal beauty.",
  );
  const [city, setCity] = useState("Melbourne");
  const [stateVal, setStateVal] = useState("VIC");
  const [postalCode, setPostalCode] = useState("3000");
  const [website, setWebsite] = useState("www.belleartistry.com.au");
  const [instagram, setInstagram] = useState("@belleartistry");
  const [facebook, setFacebook] = useState("facebook.com/belleartistry");
  const [languages, setLanguages] = useState("English");
  const [travelRadius, setTravelRadius] = useState("30 km");

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!res.canceled && res.assets?.[0]?.uri) setPhotoUri(res.assets[0].uri);
  };

  const handleContinue = () => {
    //if (!canContinue) return;
    router.push({
      pathname: "/registration/ServicesPortfolioScreen",
      params: { data: "data" },
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
            <StepHeader title="Profile Setup" step={3} />
            <StepProgressBar step={3} />

            <Text className="text-[15px] text-[#8A8590] mb-5">
              Complete your professional profile to start receiving bookings.
            </Text>

            {/* Profile Photo */}
            <PlainCard>
              <Text className="text-[15px] font-bold text-[#161119] mb-4">
                Profile Photo
              </Text>
              <View className="items-center">
                <TouchableOpacity onPress={pickPhoto} className="relative">
                  <View className="w-24 h-24 rounded-full overflow-hidden bg-[#F4F2F6]">
                    {photoUri ? (
                      <Image
                        source={{ uri: photoUri }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-full items-center justify-center">
                        <Ionicons name="person" size={40} color="#D9D5DE" />
                      </View>
                    )}
                  </View>
                  <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                    <LinearGradient
                      colors={["#FF5FA2", "#FFA35C"]}
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="camera" size={14} color="#fff" />
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
                <Text className="mt-3 text-xs text-[#8A8590] text-center">
                  A professional photo increases booking rates by 40%
                </Text>
              </View>
            </PlainCard>

            {/* Bio */}
            <PlainCard>
              <Text className="text-[15px] font-bold text-[#161119] mb-3">
                Professional Bio
              </Text>
              <TextInput
                value={bio}
                onChangeText={(v) => v.length <= BIO_MAX && setBio(v)}
                placeholder="Tell clients about yourself, your experience, specialties and professional background."
                placeholderTextColor="#B7B2BC"
                multiline
                textAlignVertical="top"
                className="rounded-[14px] border border-[#ECECEC] px-4 py-3.5 text-[14px] text-[#161119]"
                style={{ minHeight: 110 }}
              />
              <Text className="mt-1.5 text-right text-xs text-[#B7B2BC]">
                {bio.length}/{BIO_MAX}
              </Text>
            </PlainCard>

            {/* Information */}
            <PlainCard>
              <Text className="text-[15px] font-bold text-[#161119] mb-3">
                Information
              </Text>
              <View className="flex-row" style={{ gap: 12 }}>
                <ValidatedField
                  label="City"
                  placeholder="Melbourne"
                  value={city}
                  onChangeText={setCity}
                />
                <ValidatedField
                  label="State"
                  placeholder="VIC"
                  value={stateVal}
                  onChangeText={setStateVal}
                />
              </View>
              <ValidatedField
                label="Postal Code"
                placeholder="3000"
                value={postalCode}
                onChangeText={setPostalCode}
                keyboardType="numeric"
              />
              <ValidatedField
                label="Website"
                placeholder="www.yourbusiness.com.au"
                value={website}
                onChangeText={setWebsite}
                keyboardType="url"
                leftIcon="globe-outline"
              />
              <ValidatedField
                label="Instagram"
                placeholder="@yourbusiness"
                value={instagram}
                onChangeText={setInstagram}
              />
              <View className="mb-0">
                <ValidatedField
                  label="Facebook"
                  placeholder="facebook.com/yourbusiness"
                  value={facebook}
                  onChangeText={setFacebook}
                />
              </View>
            </PlainCard>

            {/* Additional Information */}
            <PlainCard>
              <Text className="text-[15px] font-bold text-[#161119] mb-3">
                Additional Information
              </Text>
              <DropdownField
                label="Languages Spoken"
                value={languages}
                onPress={() => {}}
              />
              <View className="mb-0">
                <DropdownField
                  label="Travel Radius"
                  value={travelRadius}
                  onPress={() => {}}
                />
              </View>
            </PlainCard>

            <GradientButton
              label="Save & Continue"
              onPress={handleContinue}
              style={{ marginTop: 4 }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
