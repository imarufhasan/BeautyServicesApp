import AddServiceSheet, {
  NewServiceInput,
} from "@/components/(artist)/AddServiceSheet";
import GradientButton from "@/components/common/GradientButton";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_PHOTOS = 20;

type ServiceCategory =
  "Bridal" | "Lashes" | "Hair" | "Nails" | "Facial" | "Massage";

interface ServiceItem {
  id: string;
  category: ServiceCategory;
  active: boolean;
  title: string;
  description: string;
  durationHours: number;
  price: number;
}

interface PortfolioImage {
  id: string;
  uri: string;
  label?: "Before" | "After";
}

// Dummy starting data — shaped so it drops straight into a future
// useGetServicesQuery() / useGetPortfolioQuery() response.
const initialServices: ServiceItem[] = [
  {
    id: "svc_1",
    category: "Bridal",
    active: true,
    title: "Bridal Makeup — Full Glam",
    description:
      "Full glamour bridal makeup including a trial session and on-the-day application with",
    durationHours: 3,
    price: 350,
  },
  {
    id: "svc_2",
    category: "Lashes",
    active: true,
    title: "Lash Extensions — Classic Set",
    description:
      "Individual silk lashes applied for a natural, fluttery look. Aftercare kit included.",
    durationHours: 1.5,
    price: 180,
  },
];

const initialPortfolio: PortfolioImage[] = [
  {
    id: "pf_1",
    uri: "https://picsum.photos/seed/beauty1/300/300",
    label: "Before",
  },
  {
    id: "pf_2",
    uri: "https://picsum.photos/seed/beauty2/300/300",
    label: "After",
  },
  { id: "pf_3", uri: "https://picsum.photos/seed/beauty3/300/300" },
  { id: "pf_4", uri: "https://picsum.photos/seed/beauty4/300/300" },
  { id: "pf_5", uri: "https://picsum.photos/seed/beauty5/300/300" },
  { id: "pf_6", uri: "https://picsum.photos/seed/beauty6/300/300" },
  { id: "pf_7", uri: "https://picsum.photos/seed/beauty7/300/300" },
  { id: "pf_8", uri: "https://picsum.photos/seed/beauty8/300/300" },
];

export default function ServicesPortfolioScreen() {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [portfolio, setPortfolio] =
    useState<PortfolioImage[]>(initialPortfolio);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleAddService = (input: NewServiceInput) => {
    setServices((prev) => [
      ...prev,
      {
        id: `svc_${prev.length + 1}`,
        category: (input.category as ServiceCategory) || "Bridal",
        active: true,
        title: input.description.slice(0, 40) || "New Service",
        description: input.description,
        durationHours: parseFloat(input.duration) || 1,
        price: parseFloat(input.price) || 0,
      },
    ]);
    setSheetOpen(false);
  };

  const removeService = (id: string) =>
    setServices((prev) => prev.filter((s) => s.id !== id));
  const toggleService = (id: string) =>
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
    );

  const pickImages = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - portfolio.length,
    });
    if (!res.canceled) {
      const newItems: PortfolioImage[] = res.assets.map((a, i) => ({
        id: `pf_new_${Date.now()}_${i}`,
        uri: a.uri,
      }));
      setPortfolio((prev) => [...prev, ...newItems].slice(0, MAX_PHOTOS));
    }
  };

  return (
    <LinearGradient
      colors={["#FDEFF4", "#FFFFFF", "#EAF6F5"]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center mt-6 mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: 1,
              }}
            >
              <Ionicons name="arrow-back" size={18} color="#161119" />
            </TouchableOpacity>
            <Text className="text-[19px] font-extrabold text-[#161119]">
              Services & Portfolio
            </Text>
          </View>

          {/* Services */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[16px] font-extrabold text-[#161119]">
              Services
            </Text>
            <Text className="text-xs text-[#8A8590]">
              {services.length} services
            </Text>
          </View>

          {services.map((s) => (
            <View
              key={s.id}
              className="bg-white rounded-[20px] p-5 mb-4"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
              }}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-row" style={{ gap: 8 }}>
                  <View className="rounded-full bg-[#FDEAF0] px-3 py-1">
                    <Text className="text-[11px] font-bold text-[#FB7185]">
                      {s.category}
                    </Text>
                  </View>
                  <View className="rounded-full bg-[#E4F8EE] px-3 py-1">
                    <Text className="text-[11px] font-bold text-[#34D399]">
                      {s.active ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={s.active}
                  onValueChange={() => toggleService(s.id)}
                  trackColor={{ true: "#FB7185", false: "#E5E7EB" }}
                  thumbColor="#fff"
                />
              </View>

              <Text className="mt-3 text-[16px] font-extrabold text-[#161119]">
                {s.title}
              </Text>
              <Text className="mt-1 text-[13px] leading-5 text-[#8A8590]">
                {s.description}
              </Text>

              <View className="mt-3 flex-row items-center">
                <Ionicons name="time-outline" size={14} color="#8A8590" />
                <Text className="ml-1.5 mr-3 text-[13px] text-[#8A8590]">
                  {s.durationHours} hrs
                </Text>
                <Text className="text-[16px] font-extrabold text-[#FB7185]">
                  ${s.price}
                </Text>
              </View>

              <View className="mt-4 flex-row" style={{ gap: 10 }}>
                <TouchableOpacity className="flex-1 flex-row items-center justify-center rounded-full border border-[#FBC6D0] py-2.5">
                  <Ionicons name="pencil-outline" size={13} color="#FB7185" />
                  <Text className="ml-1.5 text-[13px] font-bold text-[#FB7185]">
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeService(s.id)}
                  className="flex-1 flex-row items-center justify-center rounded-full border border-[#ECECEC] py-2.5"
                >
                  <Ionicons name="trash-outline" size={13} color="#8A8590" />
                  <Text className="ml-1.5 text-[13px] font-bold text-[#8A8590]">
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            onPress={() => setSheetOpen(true)}
            className="flex-row items-center justify-center rounded-full border border-dashed border-[#FBC6D0] py-4 mb-6"
          >
            <Ionicons name="add" size={16} color="#FB7185" />
            <Text className="ml-1.5 text-[14px] font-bold text-[#FB7185]">
              Add Service
            </Text>
          </TouchableOpacity>

          {/* Portfolio */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[16px] font-extrabold text-[#161119]">
              Portfolio
            </Text>
            <Text className="text-xs text-[#8A8590]">
              {portfolio.length}/{MAX_PHOTOS} photos
            </Text>
          </View>

          <TouchableOpacity
            onPress={pickImages}
            className="items-center justify-center rounded-[18px] border border-dashed border-[#FBC6D0] bg-white py-8 mb-4"
          >
            <View className="w-11 h-11 rounded-full bg-[#FDEAF0] items-center justify-center mb-3">
              <Ionicons name="cloud-upload-outline" size={20} color="#FB7185" />
            </View>
            <Text className="text-[14px] font-bold text-[#161119]">
              Drop images here or <Text className="text-[#FB923C]">browse</Text>
            </Text>
            <Text className="mt-1 text-xs text-[#B7B2BC]">
              PNG, JPG up to 10MB each
            </Text>
          </TouchableOpacity>

          {portfolio.length > 0 && (
            <View className="flex-row flex-wrap mb-6" style={{ gap: 10 }}>
              {portfolio.map((img) => (
                <View
                  key={img.id}
                  style={{ width: "31%" }}
                  className="aspect-square rounded-[14px] overflow-hidden relative"
                >
                  <Image
                    source={{ uri: img.uri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  {img.label && (
                    <View className="absolute top-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5">
                      <Text className="text-[10px] font-semibold text-white">
                        {img.label}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          <Text className="text-[16px] font-extrabold text-[#161119] mb-3">
            Portfolio Preview
          </Text>
          {portfolio.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-6"
            >
              <View className="flex-row" style={{ gap: 10 }}>
                {portfolio.slice(0, 6).map((img) => (
                  <View
                    key={`preview_${img.id}`}
                    className="w-28 h-40 rounded-[16px] overflow-hidden relative"
                  >
                    <Image
                      source={{ uri: img.uri }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/50 items-center justify-center">
                      <Ionicons name="eye-outline" size={13} color="#fff" />
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View className="mb-6" />
          )}

          <View className="rounded-[16px] border border-[#F3E8C9] bg-[#FBF6E4] px-4 py-4 mb-6">
            <Text className="text-[12px] leading-5 text-[#8A7A3D]">
              • I confirm that all portfolio images provided are true
              representations of my own work{"\n"}• Every image has been
              captured with client consent
            </Text>
          </View>

          <GradientButton
            label="Save Changes"
            onPress={() => {
              router.push("/registration/AvailabilitySetupScreen");
            }}
          />
        </ScrollView>
      </SafeAreaView>

      <AddServiceSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleAddService}
      />
    </LinearGradient>
  );
}
