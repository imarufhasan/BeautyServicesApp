import { DonutChart } from "@/components/(artist)/DonutChart";
import { Toggle } from "@/components/(artist)/Toggle";
import Stars from "@/components/common/Stars";
import { getAnalyticsOverview, RevenuePeriod } from "@/constants/analytics";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  DollarSign,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const PERIODS: RevenuePeriod[] = ["Day", "Week", "Month", "Year"];
const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = Math.min(SCREEN_WIDTH, 420) - 40 - 36; // card padding

export default function AnalyticsScreen() {
  // In production: const overview = await fetch("/api/mobile/analytics")
  const overview = useMemo(() => getAnalyticsOverview(), []);

  const [period, setPeriod] = useState<RevenuePeriod>("Day");
  const [settings, setSettings] = useState(overview.notificationSettings);

  const chartData = overview.revenueSeries[period];
  const maxBookings = Math.max(
    ...overview.popularServices.map((s) => s.bookings),
  );

  function toggleSetting(id: string) {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  }

  return (
    <LinearGradient
      colors={["#fff1f2", "#ffffff", "#ecfdf5"]}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Analytics</Text>
          <View style={styles.datePill}>
            <Calendar size={14} color="#334155" />
            <Text style={styles.datePillText}>{overview.month}</Text>
          </View>
        </View>

        {/* Monthly revenue */}
        <View style={[styles.card, styles.rowBetween]}>
          <View>
            <Text style={styles.muted}>Monthly Revenue</Text>
            <Text style={styles.bigValue}>
              ${overview.monthlyRevenue.amount.toLocaleString()}
            </Text>
            <View style={styles.trendRow}>
              <ArrowUpRight size={13} color="#10b981" />
              <Text style={styles.trendText}>
                {overview.monthlyRevenue.trend}
              </Text>
            </View>
          </View>
          <View style={styles.revenueIconWrap}>
            <DollarSign size={20} color="#f43f5e" />
          </View>
        </View>

        {/* Metric grid */}
        <View style={styles.grid}>
          <MetricCard
            label="Total Bookings"
            value={String(overview.metrics.totalBookings.value)}
            sublabel={overview.metrics.totalBookings.sublabel}
            color="#f43f5e"
          />
          <MetricCard
            label="Completed Jobs"
            value={String(overview.metrics.completedJobs.value)}
            sublabel={overview.metrics.completedJobs.sublabel}
            color="#10b981"
          />
          <MetricCard
            label="Pending Jobs"
            value={String(overview.metrics.pendingJobs.value)}
            sublabel={overview.metrics.pendingJobs.sublabel}
            color="#f59e0b"
          />
          <MetricCard
            label="Customer Retention"
            value={`${overview.metrics.customerRetention.value}%`}
            sublabel={overview.metrics.customerRetention.sublabel}
            color="#8b5cf6"
          />
          <MetricCard
            label="Repeat Clients"
            value={String(overview.metrics.repeatClients.value)}
            sublabel={overview.metrics.repeatClients.sublabel}
            color="#10b981"
          />
          <View style={styles.metricCard}>
            <Text style={styles.muted}>Average Rating</Text>
            <View style={styles.ratingRow}>
              <Text style={[styles.metricValue, { color: "#f59e0b" }]}>
                {overview.metrics.averageRating.value}
              </Text>
              <View style={styles.starsRow}>
                <Stars rating={4.5} />
              </View>
            </View>
          </View>
        </View>

        {/* Revenue Analytics */}
        <View style={styles.card}>
          <View style={[styles.rowBetween, { marginBottom: 12 }]}>
            <Text style={styles.cardHeading}>Revenue Analytics</Text>
            <View style={styles.segmentedWrap}>
              {PERIODS.map((p) => {
                const active = period === p;
                return active ? (
                  <LinearGradient
                    key={p}
                    colors={["#fb7185", "#fdba74"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.segmentPill}
                  >
                    <Pressable onPress={() => setPeriod(p)}>
                      <Text style={styles.segmentTextActive}>
                        {p.slice(0, 3)}
                      </Text>
                    </Pressable>
                  </LinearGradient>
                ) : (
                  <Pressable
                    key={p}
                    onPress={() => setPeriod(p)}
                    style={styles.segmentPillInactive}
                  >
                    <Text style={styles.segmentText}>{p.slice(0, 3)}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <LineChart
            data={{
              labels: chartData.map((d) => d.label),
              datasets: [{ data: chartData.map((d) => d.value) }],
            }}
            width={CHART_WIDTH}
            height={176}
            withInnerLines={false}
            withOuterLines={false}
            withShadow={false}
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: () => "#fb7185",
              labelColor: () => "#9aa0a6",
              propsForDots: { r: "3", fill: "#fb7185" },
            }}
            bezier
            style={{ borderRadius: 16, marginLeft: -16 }}
          />
        </View>

        {/* Booking Statistics */}
        <View style={styles.card}>
          <Text style={[styles.cardHeading, { marginBottom: 16 }]}>
            Booking Statistics
          </Text>
          <View style={styles.donutRow}>
            <DonutChart
              data={overview.bookingStatus}
              size={128}
              strokeWidth={16}
            />
            <View style={styles.legendWrap}>
              {overview.bookingStatus.map((slice) => (
                <View key={slice.label} style={styles.legendRow}>
                  <View style={styles.legendLabelRow}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: slice.color },
                      ]}
                    />
                    <Text style={styles.legendLabel}>{slice.label}</Text>
                  </View>
                  <Text style={styles.legendValue}>{slice.percent}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Popular Services */}
        <View style={styles.card}>
          <Text style={[styles.cardHeading, { marginBottom: 16 }]}>
            Popular Services
          </Text>
          {overview.popularServices.map((s) => (
            <View key={s.rank} style={{ marginBottom: 16 }}>
              <View style={[styles.rowBetween, { marginBottom: 6 }]}>
                <View style={styles.serviceLeft}>
                  <Text style={styles.serviceRank}>#{s.rank}</Text>
                  <Text style={styles.serviceName}>{s.name}</Text>
                  <View style={styles.trendRow}>
                    {s.trend.direction === "up" ? (
                      <ArrowUpRight size={12} color="#10b981" />
                    ) : (
                      <ArrowDownRight size={12} color="#f43f5e" />
                    )}
                    <Text
                      style={[
                        styles.serviceTrend,
                        {
                          color:
                            s.trend.direction === "up" ? "#10b981" : "#f43f5e",
                        },
                      ]}
                    >
                      {s.trend.value}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.serviceBookings}>{s.bookings} bk</Text>
                  <Text style={styles.serviceRevenue}>
                    ${s.revenue.toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={["#fb7185", "#fdba74"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressFill,
                    { width: `${(s.bookings / maxBookings) * 100}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Customer Retention */}
        <View style={styles.card}>
          <Text style={[styles.cardHeading, { marginBottom: 16 }]}>
            Customer Retention
          </Text>
          <View style={styles.retentionRow}>
            <RetentionCard
              label="Repeat %"
              value={`${overview.retentionCards.repeatPct}%`}
              bg="#ecfdf5"
              color="#10b981"
            />
            <RetentionCard
              label="Returning"
              value={overview.retentionCards.returningPct}
              bg="#fff1f2"
              color="#f43f5e"
            />
            <RetentionCard
              label="Lifetime Val"
              value={`$${overview.retentionCards.lifetimeValue}`}
              bg="#fffbeb"
              color="#f59e0b"
            />
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.card}>
          <Text style={[styles.cardHeading, { marginBottom: 6 }]}>
            Notification Settings
          </Text>
          {settings.map((s, i) => (
            <View
              key={s.id}
              style={[
                styles.settingRow,
                i < settings.length - 1 && styles.settingRowBorder,
              ]}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.settingLabel}>{s.label}</Text>
                <Text style={styles.settingDescription}>{s.description}</Text>
              </View>
              <Toggle
                value={s.enabled}
                onValueChange={() => toggleSetting(s.id)}
                accessibilityLabel={`Toggle ${s.label}`}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function MetricCard({
  label,
  value,
  sublabel,
  color,
}: {
  label: string;
  value: string;
  sublabel?: string;
  color: string;
}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      {sublabel && <Text style={styles.metricSublabel}>{sublabel}</Text>}
    </View>
  );
}

function RetentionCard({
  label,
  value,
  bg,
  color,
}: {
  label: string;
  value: string;
  bg: string;
  color: string;
}) {
  return (
    <View style={[styles.retentionCard, { backgroundColor: bg }]}>
      <Text style={styles.retentionLabel}>{label}</Text>
      <Text style={[styles.retentionValue, { color }]}>{value}</Text>
    </View>
  );
}

const CARD_SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 48 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: "800", color: "#0f172a" },
  datePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  datePillText: { fontSize: 13, fontWeight: "600", color: "#334155" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    ...CARD_SHADOW,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  muted: { fontSize: 13, color: "#94a3b8" },
  bigValue: { fontSize: 28, fontWeight: "800", color: "#0f172a", marginTop: 4 },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  trendText: { fontSize: 12, fontWeight: "600", color: "#10b981" },
  revenueIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#ffe4e6",
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metricCard: {
    width: "48.5%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    ...CARD_SHADOW,
  },
  metricValue: { fontSize: 22, fontWeight: "800", marginTop: 4 },
  metricSublabel: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  starsRow: { flexDirection: "row", gap: 2 },
  cardHeading: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  segmentedWrap: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 999,
    padding: 3,
  },
  segmentPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  segmentPillInactive: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  segmentText: { fontSize: 11, fontWeight: "700", color: "#64748b" },
  segmentTextActive: { fontSize: 11, fontWeight: "700", color: "#fff" },
  donutRow: { flexDirection: "row", alignItems: "center", gap: 24 },
  legendWrap: { flex: 1, gap: 10 },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  legendLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: 13, color: "#475569" },
  legendValue: { fontSize: 13, fontWeight: "700", color: "#0f172a" },
  serviceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  serviceRank: { fontSize: 12, fontWeight: "700", color: "#94a3b8", width: 20 },
  serviceName: { fontSize: 14, fontWeight: "700", color: "#0f172a" },
  serviceTrend: { fontSize: 12, fontWeight: "700" },
  serviceBookings: { fontSize: 14, fontWeight: "700", color: "#0f172a" },
  serviceRevenue: { fontSize: 12, color: "#94a3b8" },
  progressTrack: {
    height: 6,
    width: "100%",
    backgroundColor: "#f1f5f9",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 999 },
  retentionRow: { flexDirection: "row", gap: 10 },
  retentionCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  retentionLabel: { fontSize: 11, color: "#64748b" },
  retentionValue: { fontSize: 17, fontWeight: "800", marginTop: 4 },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  settingLabel: { fontSize: 14, fontWeight: "700", color: "#0f172a" },
  settingDescription: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
});
