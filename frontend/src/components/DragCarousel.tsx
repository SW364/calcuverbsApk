import React, { useCallback, useState } from "react";
import { StyleSheet, View, LayoutChangeEvent, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from "react-native-reanimated";

import { colors, radius } from "@/src/theme";

const GAP = 12;
const SPRING = { damping: 18, stiffness: 140, mass: 0.5 } as const;

type Props<T> = {
  data: T[];
  index: number;
  onChange: (i: number) => void;
  itemWidth: number;
  itemHeight: number;
  accent: string;
  renderItem: (item: T, isActive: boolean) => React.ReactNode;
  testID?: string;
};

function Item({
  translateX,
  stride,
  position,
  width,
  height,
  children,
}: {
  translateX: Animated.SharedValue<number>;
  stride: number;
  position: number;
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  const style = useAnimatedStyle(() => {
    const center = -translateX.value / stride;
    const d = Math.abs(center - position);
    return {
      transform: [
        {
          scale: interpolate(d, [0, 1, 2], [1, 0.84, 0.78], Extrapolation.CLAMP),
        },
      ],
      opacity: interpolate(d, [0, 1, 2], [1, 0.55, 0.32], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View style={[{ width, height, marginRight: GAP }, style]}>
      {children}
    </Animated.View>
  );
}

export default function DragCarousel<T>({
  data,
  index,
  onChange,
  itemWidth,
  itemHeight,
  accent,
  renderItem,
  testID,
}: Props<T>) {
  const stride = itemWidth + GAP;
  const [width, setWidth] = useState(Dimensions.get("window").width - 32);
  const translateX = useSharedValue(-index * stride);
  const startX = useSharedValue(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  }, []);

  const commit = useCallback(
    (i: number) => {
      if (i !== index) onChange(i);
    },
    [index, onChange],
  );

  const pan = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
    })
    .onEnd((e) => {
      const projected = translateX.value + e.velocityX * 0.08;
      let i = Math.round(-projected / stride);
      if (i < 0) i = 0;
      if (i > data.length - 1) i = data.length - 1;
      translateX.value = withSpring(-i * stride, SPRING);
      runOnJS(commit)(i);
    });

  const sidePad = Math.max((width - itemWidth) / 2, 0);

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.container, { height: itemHeight + 16 }]} onLayout={onLayout}>
      {/* Center selection frame */}
      <View
        pointerEvents="none"
        style={[
          styles.frame,
          {
            left: sidePad,
            width: itemWidth,
            height: itemHeight,
            top: 8,
            borderColor: accent,
          },
        ]}
      />
      <GestureDetector gesture={pan}>
        <Animated.View
          testID={testID}
          style={[styles.row, { paddingLeft: sidePad, paddingTop: 8 }, rowStyle]}
        >
          {data.map((item, i) => (
            <Item
              key={i}
              translateX={translateX}
              stride={stride}
              position={i}
              width={itemWidth}
              height={itemHeight}
            >
              {renderItem(item, i === index)}
            </Item>
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  frame: {
    position: "absolute",
    borderWidth: 2.5,
    borderRadius: radius.md,
    backgroundColor: "rgba(74,125,240,0.04)",
  },
});
