import { LinearGradient } from "expo-linear-gradient";
import {
    Check,
    DollarSign,
    Pause,
    Pencil,
    Percent,
    Play,
    Send,
    Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Status = "Active" | "Scheduled" | "Expired";
interface Promotion {
  id: number;
  name: string;
  tag: string;
  status: Status;
  discount: string;
  code: string;
  bookings: number;
  ends: string;
}

const initialPromotions: Promotion[] = [
  {
    id: 1,
    name: "Summer Glow Package",
    tag: "Seasonal Offer",
    status: "Active",
    discount: "20%",
    code: "GLOW20",
    bookings: 12,
    ends: "Jul 31",
  },
  {
    id: 2,
    name: "Repeat Client Special",
    tag: "Repeat Client Discount",
    status: "Active",
    discount: "15%",
    code: "LOYAL15",
    bookings: 8,
    ends: "Aug 15",
  },
  {
    id: 3,
    name: "Group Bridal Offer",
    tag: "Large Group Booking",
    status: "Scheduled",
    discount: "$50 off",
    code: "BRIDE50",
    bookings: 0,
    ends: "Sep 30",
  },
  {
    id: 4,
    name: "Spring Referral",
    tag: "Referral Reward",
    status: "Expired",
    discount: "10%",
    code: "REFER10",
    bookings: 34,
    ends: "May 31",
  },
];

const statusStyles: Record<Status, { bg: string; text: string }> = {
  Active: { bg: "bg-emerald-100", text: "text-emerald-600" },
  Scheduled: { bg: "bg-amber-100", text: "text-amber-600" },
  Expired: { bg: "bg-gray-200", text: "text-gray-500" },
};

const promoTypes = [
  "Repeat Client Discount",
  "Large Group Booking",
  "Seasonal Offer",
  "Referral Reward",
];
const eligibilities = ["Repeat Clients Only", "Group Booking", "All Clients"];

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View className="flex-1 items-center rounded-2xl bg-white p-3 shadow-sm">
      <Text className="text-[11px] text-gray-400">{label}</Text>
      <Text className="mt-1 text-lg font-bold" style={{ color }}>
        {value}
      </Text>
    </View>
  );
}

function PillButton({
  label,
  Icon,
  onPress,
}: {
  label: string;
  Icon: any;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 flex-row items-center justify-center gap-1 rounded-full border border-purple-200 py-1.5"
    >
      <Icon size={12} color="#a855f7" />
      <Text className="text-xs font-medium text-purple-500">{label}</Text>
    </TouchableOpacity>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <Text className="mb-1.5 text-xs font-medium text-gray-500">{label}</Text>
      {children}
    </View>
  );
}

export default function PromotionsScreen() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [form, setForm] = useState({
    name: "",
    code: "",
    minValue: "",
    limit: "",
    type: "Repeat Client Discount",
    discountType: "Percentage" as "Percentage" | "Fixed",
    discountValue: "",
    start: "",
    end: "",
    eligibility: "Repeat Clients Only",
  });

  const counts = {
    Active: promotions.filter((p) => p.status === "Active").length,
    Scheduled: promotions.filter((p) => p.status === "Scheduled").length,
    Expired: promotions.filter((p) => p.status === "Expired").length,
  };

  const pausePromo = (id: number) =>
    setPromotions((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Active" ? "Scheduled" : "Active" }
          : p,
      ),
    );

  const deletePromo = (id: number) =>
    setPromotions((prev) => prev.filter((p) => p.id !== id));

  const setField = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handlePublish = () => {
    if (!form.name || !form.code) return;
    setPromotions((prev) => [
      {
        id: Date.now(),
        name: form.name,
        tag: form.type,
        status: "Scheduled",
        discount:
          form.discountType === "Percentage"
            ? `${form.discountValue || 0}%`
            : `$${form.discountValue || 0} off`,
        code: form.code.toUpperCase(),
        bookings: 0,
        ends: form.end || "TBD",
      },
      ...prev,
    ]);
    setForm({
      name: "",
      code: "",
      minValue: "",
      limit: "",
      type: "Repeat Client Discount",
      discountType: "Percentage",
      discountValue: "",
      start: "",
      end: "",
      eligibility: "Repeat Clients Only",
    });
  };

  const inputClass =
    "rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700";

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-5 pb-4 pt-4">
          <Text className="text-xl font-bold text-gray-900">Promotions</Text>
        </View>

        <View className="gap-4 px-4">
          {/* Status stats */}
          <View className="flex-row gap-3">
            <StatCard label="Active" value={counts.Active} color="#10b981" />
            <StatCard
              label="Scheduled"
              value={counts.Scheduled}
              color="#f59e0b"
            />
            <StatCard label="Expired" value={counts.Expired} color="#9ca3af" />
          </View>

          {/* Promotion cards */}
          {promotions.map((p) => (
            <View key={p.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-2">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <Text className="text-[15px] font-bold text-gray-900">
                      {p.name}
                    </Text>
                    <View
                      className={`rounded-full px-2 py-0.5 ${statusStyles[p.status].bg}`}
                    >
                      <Text
                        className={`text-[10px] font-semibold ${statusStyles[p.status].text}`}
                      >
                        {p.status}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-gray-400">{p.tag}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-lg font-bold text-purple-500">
                    {p.discount}
                  </Text>
                  <Text className="text-[10px] text-gray-400">discount</Text>
                </View>
              </View>

              <View className="mt-3 flex-row justify-between rounded-xl bg-gray-50 p-2">
                <View className="flex-1 items-center">
                  <Text className="text-[10px] text-gray-400">Code</Text>
                  <Text className="text-xs font-semibold text-gray-700">
                    {p.code}
                  </Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-[10px] text-gray-400">Bookings</Text>
                  <Text className="text-xs font-semibold text-gray-700">
                    {p.bookings}
                  </Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-[10px] text-gray-400">Ends</Text>
                  <Text className="text-xs font-semibold text-gray-700">
                    {p.ends}
                  </Text>
                </View>
              </View>

              <View className="mt-3 flex-row gap-2">
                <PillButton label="Edit" Icon={Pencil} />
                {p.status !== "Expired" && (
                  <PillButton
                    label={p.status === "Active" ? "Pause" : "Resume"}
                    Icon={p.status === "Active" ? Pause : Play}
                    onPress={() => pausePromo(p.id)}
                  />
                )}
                <PillButton
                  label="Delete"
                  Icon={Trash2}
                  onPress={() => deletePromo(p.id)}
                />
              </View>
            </View>
          ))}

          {/* Create promotion form */}
          <View className="rounded-2xl bg-white p-4 shadow-sm">
            <Text className="mb-3 text-base font-bold text-gray-900">
              Create Promotion
            </Text>
            <View className="gap-3">
              <Field label="Promotion Name">
                <TextInput
                  className={inputClass}
                  placeholder="e.g. Summer Glow Package"
                  placeholderTextColor="#d1d5db"
                  value={form.name}
                  onChangeText={setField("name")}
                />
              </Field>
              <Field label="Promo Code">
                <TextInput
                  className={inputClass}
                  placeholder="e.g. GLOW20"
                  placeholderTextColor="#d1d5db"
                  value={form.code}
                  onChangeText={setField("code")}
                />
              </Field>
              <Field label="Minimum Booking Value">
                <TextInput
                  className={inputClass}
                  placeholder="$100"
                  placeholderTextColor="#d1d5db"
                  keyboardType="numeric"
                  value={form.minValue}
                  onChangeText={setField("minValue")}
                />
              </Field>
              <Field label="Usage Limit">
                <TextInput
                  className={inputClass}
                  placeholder="100"
                  placeholderTextColor="#d1d5db"
                  keyboardType="numeric"
                  value={form.limit}
                  onChangeText={setField("limit")}
                />
              </Field>

              <Field label="Promotion Type">
                <View className="flex-row flex-wrap gap-2">
                  {promoTypes.map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setField("type")(t)}
                      className={`rounded-full border px-3 py-2 ${
                        form.type === t
                          ? "border-pink-300 bg-pink-50"
                          : "border-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          form.type === t ? "text-pink-500" : "text-gray-500"
                        }`}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Field>

              <Field label="Discount Type">
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => setField("discountType")("Percentage")}
                    className={`flex-1 flex-row items-center justify-center gap-1 rounded-full border px-3 py-2 ${
                      form.discountType === "Percentage"
                        ? "border-pink-300 bg-pink-50"
                        : "border-gray-200"
                    }`}
                  >
                    <Percent
                      size={12}
                      color={
                        form.discountType === "Percentage"
                          ? "#ec4899"
                          : "#6b7280"
                      }
                    />
                    <Text
                      className={`text-xs font-medium ${
                        form.discountType === "Percentage"
                          ? "text-pink-500"
                          : "text-gray-500"
                      }`}
                    >
                      Percentage
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setField("discountType")("Fixed")}
                    className={`flex-1 flex-row items-center justify-center gap-1 rounded-full border px-3 py-2 ${
                      form.discountType === "Fixed"
                        ? "border-pink-300 bg-pink-50"
                        : "border-gray-200"
                    }`}
                  >
                    <DollarSign
                      size={12}
                      color={
                        form.discountType === "Fixed" ? "#ec4899" : "#6b7280"
                      }
                    />
                    <Text
                      className={`text-xs font-medium ${
                        form.discountType === "Fixed"
                          ? "text-pink-500"
                          : "text-gray-500"
                      }`}
                    >
                      Fixed Amount
                    </Text>
                  </TouchableOpacity>
                </View>
              </Field>

              <Field
                label={`Discount Value ${form.discountType === "Percentage" ? "(%)" : "($)"}`}
              >
                <TextInput
                  className={inputClass}
                  placeholder="20"
                  placeholderTextColor="#d1d5db"
                  keyboardType="numeric"
                  value={form.discountValue}
                  onChangeText={setField("discountValue")}
                />
              </Field>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Field label="Start Date">
                    <TextInput
                      className={inputClass}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#d1d5db"
                      value={form.start}
                      onChangeText={setField("start")}
                    />
                  </Field>
                </View>
                <View className="flex-1">
                  <Field label="End Date">
                    <TextInput
                      className={inputClass}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#d1d5db"
                      value={form.end}
                      onChangeText={setField("end")}
                    />
                  </Field>
                </View>
              </View>

              <Field label="Eligibility">
                <View className="gap-2">
                  {eligibilities.map((e) => (
                    <TouchableOpacity
                      key={e}
                      onPress={() => setField("eligibility")(e)}
                      className={`flex-row items-center justify-between rounded-full border px-4 py-2.5 ${
                        form.eligibility === e
                          ? "border-pink-300 bg-pink-50"
                          : "border-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          form.eligibility === e
                            ? "text-pink-500"
                            : "text-gray-500"
                        }`}
                      >
                        {e}
                      </Text>
                      {form.eligibility === e && (
                        <Check size={14} color="#ec4899" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </Field>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.85} onPress={handlePublish}>
            <LinearGradient
              colors={["#ec4899", "#fb923c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="flex-row items-center justify-center gap-2 rounded-2xl py-4"
            >
              <Send size={16} color="white" />
              <Text className="text-[15px] font-semibold text-white">
                Publish Promotion
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
