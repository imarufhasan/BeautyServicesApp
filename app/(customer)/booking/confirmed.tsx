import { useLocalSearchParams } from "expo-router";
import BookingConfirmedScreen from "./BookingConfirmedScreen";

const AVATAR = require("../../../assets/images/home/pic1.png"); // swap for real artist avatar

export default function BookingConfirmedRoute() {
  const p = useLocalSearchParams<{
    bookingId: string;
    artistId: string;
    artistName: string;
    serviceSummary: string;
    dateLabel: string;
    timeLabel: string;
    visitType: string;
    location: string;
    paymentMethodLabel: string;
    amountPaid: string;
  }>();

  return (
    <BookingConfirmedScreen
      params={{
        bookingId: p.bookingId,
        artistName: p.artistName,
        artistAvatar: AVATAR, // TODO: fetch real avatar by artistId
        serviceSummary: p.serviceSummary,
        dateLabel: p.dateLabel,
        timeLabel: p.timeLabel,
        visitType: p.visitType,
        location: p.location,
        paymentMethodLabel: p.paymentMethodLabel,
        amountPaid: Number(p.amountPaid),
      }}
    />
  );
}
