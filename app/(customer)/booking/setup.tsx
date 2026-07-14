import { useLocalSearchParams } from "expo-router";
import BookingSetupScreen from "./BookingSetupScreen";

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
    serviceId: string;
    serviceName: string;
    servicePrice: string;
    dateLabel: string;
    timeLabel: string;
  }>();

  return (
    <BookingSetupScreen
      params={{
        artistId,
        artistName,
        services: [
          { id: serviceId, name: serviceName, price: Number(servicePrice) },
        ],
        dateLabel,
        timeLabel,
      }}
    />
  );
}
