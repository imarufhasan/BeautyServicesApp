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
    artistId: string;
    artistName: string;
    serviceId?: string;
    serviceName?: string;
    servicePrice?: string;
    dateLabel: string;
    timeLabel: string;
  }>();

  const services: BookingService[] = serviceId
    ? [
        {
          id: serviceId,
          name: serviceName ?? "Service",
          price: Number(servicePrice) || 0,
        },
      ]
    : [];

  return (
    <BookingSetupScreen
      params={{
        artistId,
        artistName,
        services,
        dateLabel,
        timeLabel,
      }}
    />
  );
}
