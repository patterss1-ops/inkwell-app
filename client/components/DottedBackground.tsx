import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

interface DottedBackgroundProps {
  width?: number;
  height?: number;
}

export function DottedBackground({ width, height }: DottedBackgroundProps) {
  const { theme } = useTheme();
  const screenDimensions = Dimensions.get("window");

  const w = width || screenDimensions.width;
  const h = height || screenDimensions.height;

  const dots = useMemo(() => {
    const dotSpacing = Spacing.dotSpacing;
    const dotRadius = Spacing.dotSize / 2;
    const result: { x: number; y: number }[] = [];

    const cols = Math.ceil(w / dotSpacing) + 1;
    const rows = Math.ceil(h / dotSpacing) + 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        result.push({
          x: col * dotSpacing,
          y: row * dotSpacing,
        });
      }
    }

    return { dots: result, dotRadius };
  }, [w, h]);

  return (
    <View style={[styles.container, { width: w, height: h }]} pointerEvents="none">
      <Svg width={w} height={h}>
        {dots.dots.map((dot, index) => (
          <Circle
            key={index}
            cx={dot.x}
            cy={dot.y}
            r={dots.dotRadius}
            fill={theme.dotGrid}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
