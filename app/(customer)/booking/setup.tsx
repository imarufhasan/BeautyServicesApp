import { useLocalSearchParams } from "expo-router";
import BookingSetupScreen, { BookingService } from "./BookingSetupScreen";

export default function BookingSetupRoute() {
  const {
    artistId,
    artistName,
    serviceId,
    serviceName,
    servicePrice,
    dateLabel,
    timeLabel,
  } = useLocalSearchParams<{
    artistId?: string;
    artistName?: string;
    serviceId?: string;
    serviceName?: string;
    servicePrice?: string;
    dateLabel?: string;
    timeLabel?: string;
  }>();

  const services: BookingService[] = serviceId
    ? [
        {
          id: serviceId,
          name: serviceName ?? "Service",
          price: Number(servicePrice) || 0,
        },
      ]
    : [
        // Dummy service data
        {
          id: "service-001",
          name: "Bridal Makeup & Hair Styling",
          price: 250,
        },
        {
          id: "service-002",
          name: "Party Makeup",
          price: 120,
        },
      ];

  return (
    <BookingSetupScreen
      params={{
        artistId: artistId ?? "artist-001",
        artistName: artistName ?? "Sofia Laurent",
        services,
        dateLabel: dateLabel ?? "Saturday, July 12, 2025",
        timeLabel: timeLabel ?? "10:00 AM",
      }}
    />
  );
}
