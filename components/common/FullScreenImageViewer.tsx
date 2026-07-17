import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Modal,
    Image as RNImage,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
    ScrollView as GHScrollView,
} from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// ---------------------------------------------
// Single zoomable page (pinch + double-tap + pan)
// ---------------------------------------------
function ZoomableImage({ source }: { source: any }) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const resetZoom = () => {
    "worklet";
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedScale.value = 1;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(1, Math.min(savedScale.value * e.scale, 5));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value < 1.05) {
        resetZoom();
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (savedScale.value <= 1) return;
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (savedScale.value > 1) {
        resetZoom();
      } else {
        scale.value = withTiming(2.5);
        savedScale.value = 2.5;
      }
    });

  const composedGesture = Gesture.Race(
    doubleTap,
    Gesture.Simultaneous(pinchGesture, panGesture),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          {
            width: SCREEN_W,
            height: SCREEN_H,
            alignItems: "center",
            justifyContent: "center",
          },
          animatedStyle,
        ]}
      >
        <RNImage
          source={source}
          style={{ width: SCREEN_W, height: SCREEN_H }}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}

// ---------------------------------------------
// Public modal — pass a single image or an array
// ---------------------------------------------
interface FullScreenImageViewerProps {
  visible: boolean;
  images: any[]; // require(...) sources or { uri } objects
  initialIndex?: number;
  onClose: () => void;
}

export default function FullScreenImageViewer({
  visible,
  images,
  initialIndex = 0,
  onClose,
}: FullScreenImageViewerProps) {
  const [index, setIndex] = useState(initialIndex);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    setIndex(initialIndex);

    setTimeout(() => {
      scrollRef.current?.scrollTo({
        x: initialIndex * SCREEN_W,
        animated: false,
      });
    }, 50);
  }, [visible, initialIndex]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar hidden />

      <GestureHandlerRootView style={styles.container}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={onClose}
          hitSlop={12}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <GHScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: initialIndex * SCREEN_W, y: 0 }}
        >
          {images.map((img, i) => (
            <ZoomableImage key={i} source={img} />
          ))}
        </GHScrollView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    position: "absolute",
    top: 58,
    alignSelf: "center",
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  counterText: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
