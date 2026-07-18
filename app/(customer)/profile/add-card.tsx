import AppHeader from "@/components/common/AppHeader";
import Toggle from "@/components/common/Toggle";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type CardForm = {
  number: string;
  holderName: string;
  expiry: string;
  cvv: string;
  billingCountry: string;
  saveCard: boolean;
  setAsDefault: boolean;
};

const EMPTY_CARD: CardForm = {
  number: "",
  holderName: "",
  expiry: "",
  cvv: "",
  billingCountry: "",
  saveCard: true,
  setAsDefault: false,
};

const formatCardNumber = (raw: string) =>
  raw
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const CardPreview = ({
  card,
  flipped,
  onFlip,
}: {
  card: CardForm;
  flipped: boolean;
  onFlip: () => void;
}) => {
  const rotate = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(rotate, {
      toValue: flipped ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [flipped]);

  const frontRotate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const backRotate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onFlip}>
      <View style={{ height: 190 }}>
        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: [{ rotateY: frontRotate }],
          }}
        >
          <LinearGradient
            colors={["#2A2438", "#161119"]}
            style={{
              flex: 1,
              borderRadius: 20,
              padding: 20,
              justifyContent: "space-between",
            }}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-sm font-extrabold">
                memillennial
              </Text>
              <Ionicons name="card" size={20} color="#fff" />
            </View>
            <Text className="text-white text-lg tracking-widest">
              {card.number || "•••• •••• •••• ••••"}
            </Text>
            <View className="flex-row items-end justify-between">
              <View>
                <Text className="text-[9px] text-[#B0AAB6] tracking-wide">
                  YOUR NAME
                </Text>
                <Text className="text-white text-xs font-bold mt-1">
                  {card.holderName || "YOUR NAME"}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-[9px] text-[#B0AAB6] tracking-wide">
                  EXPIRES
                </Text>
                <Text className="text-white text-xs font-bold mt-1">
                  {card.expiry || "MM/YY"}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: [{ rotateY: backRotate }],
          }}
        >
          <LinearGradient
            colors={["#2A2438", "#161119"]}
            style={{ flex: 1, borderRadius: 20, paddingTop: 20 }}
          >
            <View
              style={{
                height: 36,
                backgroundColor: "#0A0810",
                marginBottom: 20,
              }}
            />
            <View className="px-5">
              <View className="flex-row items-center justify-end bg-white/90 rounded px-3 py-2">
                <Text className="text-[#161119] text-xs font-bold tracking-widest">
                  {card.cvv ? "•".repeat(card.cvv.length) : "•••"}
                </Text>
              </View>
              <Text className="text-[9px] text-[#B0AAB6] mt-2 text-right">
                CVV
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secure,
  maxLength,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
  secure?: boolean;
  maxLength?: number;
}) => (
  <View className="mb-4">
    <Text className="text-[10px] font-bold text-[#8A8590] tracking-wide mb-1.5 uppercase">
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#C4BFC9"
      keyboardType={keyboardType}
      secureTextEntry={secure}
      maxLength={maxLength}
      className="rounded-2xl px-4 py-3.5 text-sm text-[#161119]"
      style={{
        borderColor: "#EFEAF3",
        borderWidth: 1,
        backgroundColor: "#fff",
      }}
    />
  </View>
);

export default function AddCardScreen({
  onSave,
}: {
  onSave?: (card: CardForm) => Promise<void> | void;
}) {
  const [card, setCard] = useState<CardForm>(EMPTY_CARD);
  const [flipped, setFlipped] = useState(false);
  const [saving, setSaving] = useState(false);

  const patch = (fields: Partial<CardForm>) =>
    setCard((prev) => ({ ...prev, ...fields }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (onSave) {
        await onSave(card);
      } else {
        // TODO API:
        // await addPaymentMethodMutation(card)  // tokenize server-side, never send raw PAN/CVV to your own DB
        console.log("Add card:", {
          ...card,
          number: "***masked***",
          cvv: "***",
        });
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <AppHeader title="Add Debit / Credit Card" />
      <ScrollView>
        <View className="px-5 pt-2 flex-1" style={{ overflow: "hidden" }}>
          <CardPreview
            card={card}
            flipped={flipped}
            onFlip={() => setFlipped((f) => !f)}
          />
          <Text className="text-center text-[11px] text-[#B0AAB6] mt-2 mb-5">
            Tap card to flip
          </Text>

          <Field
            label="Card Number"
            value={card.number}
            onChangeText={(v) => patch({ number: formatCardNumber(v) })}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
          />
          <Field
            label="Card Holder Name"
            value={card.holderName}
            onChangeText={(v) => patch({ holderName: v.toUpperCase() })}
            placeholder="As printed on card"
          />
          <View className="flex-row" style={{ gap: 12 }}>
            <View className="flex-1">
              <Field
                label="Expiry Date"
                value={card.expiry}
                onChangeText={(v) => patch({ expiry: formatExpiry(v) })}
                placeholder="MM/YY"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View className="flex-1">
              <Field
                label="CVV"
                value={card.cvv}
                onChangeText={(v) =>
                  patch({ cvv: v.replace(/\D/g, "").slice(0, 4) })
                }
                placeholder="•••"
                keyboardType="numeric"
                secure
                maxLength={4}
              />
            </View>
          </View>
          <Field
            label="Billing Country"
            value={card.billingCountry}
            onChangeText={(v) => patch({ billingCountry: v })}
            placeholder="Australia"
          />

          <View
            className="bg-white rounded-2xl px-4 py-1 mb-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <View className="flex-row items-center justify-between py-3">
              <Text className="text-sm text-[#161119]">Save Card</Text>
              <Toggle
                value={card.saveCard}
                onChange={(v) => patch({ saveCard: v })}
              />
            </View>
            <View className="h-[1px] bg-[#F0EEF2]" />
            <View className="flex-row items-center justify-between py-3">
              <Text className="text-sm text-[#161119]">
                Set as Default Payment Method
              </Text>
              <Toggle
                value={card.setAsDefault}
                onChange={(v) => patch({ setAsDefault: v })}
              />
            </View>
          </View>

          <View
            className="flex-row items-center rounded-2xl px-4 py-3 mb-2"
            style={{ backgroundColor: "#EAF7F3" }}
          >
            <Ionicons
              name="lock-closed"
              size={13}
              color="#1A8073"
              style={{ marginRight: 8 }}
            />
            <Text className="text-xs flex-1" style={{ color: "#1A8073" }}>
              Your payment information is securely encrypted.
            </Text>
          </View>
        </View>
      </ScrollView>
      <View className="px-5 pb-5 pt-2">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSave}
          disabled={saving}
          className="rounded-full overflow-hidden"
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center rounded-full"
            style={{ opacity: saving ? 0.7 : 1 }}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-extrabold">
                Add Card
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
