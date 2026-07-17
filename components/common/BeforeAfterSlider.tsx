import React, { useRef, useState } from "react";
import {
    Image,
    LayoutChangeEvent,
    PanResponder,
    Text,
    View,
} from "react-native";

interface BeforeAfterSliderProps {
  beforeImage: any;
  afterImage: any;
  height?: number;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  height = 220,
}: BeforeAfterSliderProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [sliderX, setSliderX] = useState(0.5); // 0 -> 1, fraction across the width

  const widthRef = useRef(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    widthRef.current = w;
    setContainerWidth(w);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (!widthRef.current) return;
        const x = Math.min(Math.max(gestureState.moveX, 0), widthRef.current);
        setSliderX(x / widthRef.current);
      },
    }),
  ).current;

  const handleLeft = containerWidth * sliderX;

  return (
    <View>
      <View
        onLayout={onLayout}
        className="rounded-[18px] overflow-hidden"
        style={{ height }}
        {...panResponder.panHandlers}
      >
        {/* After image (full, base layer) */}
        <Image
          source={afterImage}
          style={{ width: "100%", height: "100%", position: "absolute" }}
          resizeMode="cover"
        />

        {/* Before image (clipped to slider position) */}
        <View
          style={{
            position: "absolute",
            width: handleLeft,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Image
            source={beforeImage}
            style={{ width: containerWidth || "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>

        {/* BEFORE badge */}
        <View className="absolute top-3 left-3 bg-black/60 rounded-full px-3 py-1">
          <Text className="text-white text-[10px] font-semibold tracking-wide">
            BEFORE
          </Text>
        </View>

        {/* Divider line */}
        {containerWidth > 0 && (
          <View
            style={{
              position: "absolute",
              left: handleLeft - 1,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: "#FFFFFF",
            }}
          />
        )}

        {/* Drag handle */}
        {containerWidth > 0 && (
          <View
            style={{
              position: "absolute",
              left: handleLeft - 16,
              top: height / 2 - 16,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 4,
            }}
          >
            <View
              style={{
                width: 3,
                height: 14,
                borderRadius: 2,
                backgroundColor: "#D9D3DC",
              }}
            />
          </View>
        )}
      </View>

      <Text className="text-center text-[11px] text-[#B0AAB4] mt-2">
        Drag slider to compare
      </Text>
    </View>
  );
}
