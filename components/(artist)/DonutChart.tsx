import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

export interface DonutSlice {
  label: string;
  percent: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
  strokeWidth?: number;
}

/**
 * Simple ring/donut chart. Each slice is drawn as a Circle with a
 * strokeDasharray/strokeDashoffset trick, rotated so slices stack clockwise
 * starting from 12 o'clock.
 */
export function DonutChart({
  data,
  size = 128,
  strokeWidth = 16,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {data.map((slice) => {
          const dash = (slice.percent / 100) * circumference;
          const offset =
            circumference - (cumulativePercent / 100) * circumference;
          cumulativePercent += slice.percent;

          return (
            <Circle
              key={slice.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
              fill="none"
              // rotate -90deg around the center so the first slice starts at 12 o'clock
              originX={size / 2}
              originY={size / 2}
              rotation={-90}
            />
          );
        })}
      </Svg>
    </View>
  );
}
