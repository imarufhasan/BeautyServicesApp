import { getNotifications, NotificationType } from "@/constants/notifications";
import { LinearGradient } from "expo-linear-gradient";
import {
  Award,
  Calendar,
  CheckCircle2,
  DollarSign,
  RefreshCw,
  Star,
  type LucideIcon,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const ICONS: Record<NotificationType, LucideIcon> = {
  booking: Calendar,
  payment: DollarSign,
  review: Star,
  reschedule: RefreshCw,
  promotion: Award,
  withdrawal: CheckCircle2,
};

const ICON_COLORS: Record<NotificationType, { bg: string; fg: string }> = {
  booking: { bg: "#d1fae5", fg: "#059669" },
  payment: { bg: "#d1fae5", fg: "#059669" },
  review: { bg: "#fef3c7", fg: "#d97706" },
  reschedule: { bg: "#ede9fe", fg: "#7c3aed" },
  promotion: { bg: "#ffe4e6", fg: "#e11d48" },
  withdrawal: { bg: "#d1fae5", fg: "#059669" },
};

export default function NotificationsScreen() {
  // In production: const notifications = await fetch("/api/mobile/notifications")
  const notifications = useMemo(() => getNotifications(), []);

  return (
    <LinearGradient
      colors={["#fff1f2", "#ffffff", "#ecfdf5"]}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Notifications</Text>

        {notifications.map((n) => {
          const Icon = ICONS[n.type];
          const colors = ICON_COLORS[n.type];
          return (
            <View key={n.id} style={styles.card}>
              <View style={[styles.iconWrap, { backgroundColor: colors.bg }]}>
                <Icon size={18} color={colors.fg} />
              </View>

              <View style={styles.textWrap}>
                <Text style={styles.cardTitle}>{n.title}</Text>
                <Text style={styles.cardMessage}>{n.message}</Text>
                <Text style={styles.cardTime}>{n.timeAgo}</Text>
              </View>

              {n.unread && <View style={styles.dot} />}
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 80 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  textWrap: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#0f172a" },
  cardMessage: { fontSize: 13, color: "#64748b", marginTop: 2, lineHeight: 18 },
  cardTime: { fontSize: 11, color: "#94a3b8", marginTop: 6 },
  dot: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f43f5e",
  },
});
