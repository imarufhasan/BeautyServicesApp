import { COLORS } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Award, Check, Plus, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const MAX_TAGS = 20;

// In production, initial values come from `GET /api/mobile/profile/certifications`.
const INITIAL_CERTIFICATIONS = [
  "Bridal Specialist",
  "Airbrush Certified",
  "srfgt",
];
const INITIAL_PRODUCTS = ["Bridal Specialist", "Airbrush Certified", "srfgt"];

export default function CertificationsScreen() {
  const [certifications, setCertifications] = useState<string[]>(
    INITIAL_CERTIFICATIONS,
  );
  const [certInput, setCertInput] = useState("");

  const [products, setProducts] = useState<string[]>(INITIAL_PRODUCTS);
  const [productInput, setProductInput] = useState("");

  function addTag(
    value: string,
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    clearInput: () => void,
  ) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setList((prev) =>
      prev.length >= MAX_TAGS || prev.includes(trimmed)
        ? prev
        : [...prev, trimmed],
    );
    clearInput();
  }

  function removeTag(
    value: string,
    setList: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    setList((prev) => prev.filter((t) => t !== value));
  }

  return (
    <LinearGradient
      colors={["#fff1f2", "#ffffff", "#ecfdf5"]}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.badgeRow}>
          <View style={styles.badgeIcon}>
            <Award size={12} color="#e11d48" />
          </View>
          <Text style={styles.badgeText}>PROFILE SETUP</Text>
        </View>

        <Text style={styles.title}>Certifications</Text>
        <Text style={styles.subtitle}>
          Show your professional qualifications to build trust with clients.
        </Text>

        {/* Certifications */}
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>CERTIFICATION NAME</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={certInput}
              onChangeText={setCertInput}
              onSubmitEditing={() =>
                addTag(certInput, setCertifications, () => setCertInput(""))
              }
              placeholder="e.g. MAC Pro Certified"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              returnKeyType="done"
            />
            <Pressable
              onPress={() =>
                addTag(certInput, setCertifications, () => setCertInput(""))
              }
              style={styles.inlineAddButton}
              accessibilityLabel="Add certification tag"
            >
              <Plus size={16} color="#fff" />
            </Pressable>
          </View>

          <Pressable
            onPress={() =>
              addTag(certInput, setCertifications, () => setCertInput(""))
            }
          >
            <LinearGradient
              colors={[COLORS.baseColor1, COLORS.baseColor2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addButton}
            >
              <Plus size={16} color="#fff" />
              <Text style={styles.addButtonText}>Add Certification</Text>
            </LinearGradient>
          </Pressable>

          <Text style={styles.counter}>
            {certifications.length}/{MAX_TAGS} certifications
          </Text>
        </View>

        {/* Products */}
        <View style={[styles.card, { marginTop: 20 }]}>
          <Text style={styles.fieldLabel}>PRODUCT NAME</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={productInput}
              onChangeText={setProductInput}
              onSubmitEditing={() =>
                addTag(productInput, setProducts, () => setProductInput(""))
              }
              placeholder="e.g. Product"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              returnKeyType="done"
            />
            <Pressable
              onPress={() =>
                addTag(productInput, setProducts, () => setProductInput(""))
              }
              style={styles.inlineAddButton}
              accessibilityLabel="Add product tag"
            >
              <Plus size={16} color="#fff" />
            </Pressable>
          </View>

          <Pressable
            onPress={() =>
              addTag(productInput, setProducts, () => setProductInput(""))
            }
          >
            <LinearGradient
              colors={[COLORS.baseColor1, COLORS.baseColor2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addButton}
            >
              <Plus size={16} color="#fff" />
              <Text style={styles.addButtonText}>Add Product</Text>
            </LinearGradient>
          </Pressable>

          <Text style={styles.counter}>
            {products.length}/{MAX_TAGS} certifications
          </Text>
        </View>

        <TagRow items={products} onRemove={(t) => removeTag(t, setProducts)} />
      </ScrollView>
    </LinearGradient>
  );
}

function TagRow({
  items,
  onRemove,
}: {
  items: string[];
  onRemove: (value: string) => void;
}) {
  if (items.length === 0) {
    return (
      <Text style={styles.emptyText}>
        Nothing added yet — it&apos;ll show up here.
      </Text>
    );
  }

  return (
    <View style={styles.tagRow}>
      {items.map((tag) => (
        <View key={tag} style={styles.tag}>
          <Check size={13} color="#059669" />
          <Text style={styles.tagText}>{tag}</Text>
          <Pressable
            onPress={() => onRemove(tag)}
            accessibilityLabel={`Remove ${tag}`}
          >
            <X size={13} color="#059669" />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 80 },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  badgeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ffe4e6",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#e11d48",
    letterSpacing: 0.5,
  },
  title: { fontSize: 30, fontWeight: "800", color: "#0f172a" },
  subtitle: { fontSize: 14, color: "#64748b", marginTop: 8, lineHeight: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginTop: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0f172a",
  },
  inlineAddButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f43f5e",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 999,
    paddingVertical: 14,
    marginTop: 16,
  },
  addButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  counter: {
    textAlign: "right",
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 10,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#a7f3d0",
    backgroundColor: "#ecfdf5",
    borderRadius: 999,
    paddingLeft: 12,
    paddingRight: 10,
    paddingVertical: 7,
  },
  tagText: { fontSize: 13, fontWeight: "600", color: "#059669" },
  emptyText: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 12,
    paddingHorizontal: 4,
  },
});
