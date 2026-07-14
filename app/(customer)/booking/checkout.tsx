import { useLocalSearchParams } from "expo-router";
import CheckoutScreen from "./CheckoutScreen";

const AVATAR = require("../../../assets/images/home/pic1.png"); // swap for real artist avatar

export default function CheckoutRoute() {
  const p = useLocalSearchParams<{
    artistId: string;
    artistName: string;
    serviceTags: string;
    visitType: string;
    dateLabel: string;
    timeLabel: string;
    durationLabel: string;
    subtotal: string;
    travelFee: string;
  }>();

  return (
    <CheckoutScreen
      params={{
        artistId: p.artistId,
        artistName: p.artistName,
        artistAvatar: AVATAR,
        artistSpecialty: "Bridal & Beauty Artist",
        rating: 4.9,
        reviewCount: 284,
        serviceTags: JSON.parse(p.serviceTags || "[]"),
        visitType: p.visitType,
        dateLabel: p.dateLabel,
        timeLabel: p.timeLabel,
        durationLabel: p.durationLabel,
        subtotal: Number(p.subtotal),
        travelFee: Number(p.travelFee),
      }}
    />
  );
}
