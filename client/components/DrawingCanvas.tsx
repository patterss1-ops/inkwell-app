import React, { useRef, useCallback } from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import Svg, { Path, G } from "react-native-svg";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

import { Stroke, Point } from "@/types/note";
import { DottedBackground } from "@/components/DottedBackground";
import { useTheme } from "@/hooks/useTheme";

interface DrawingCanvasProps {
  strokes: Stroke[];
  currentStroke: Point[];
  penColor: string;
  penSize: number;
  onStrokeStart: () => void;
  onStrokeUpdate: (point: Point) => void;
  onStrokeEnd: () => void;
  canvasHeight: number;
}

function pointsToPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0];
    return `M ${p.x} ${p.y} L ${p.x} ${p.y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    path += ` L ${p.x} ${p.y}`;
  }

  return path;
}

export function DrawingCanvas({
  strokes,
  currentStroke,
  penColor,
  penSize,
  onStrokeStart,
  onStrokeUpdate,
  onStrokeEnd,
  canvasHeight,
}: DrawingCanvasProps) {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get("window").width;

  const handleStart = useCallback(() => {
    onStrokeStart();
  }, [onStrokeStart]);

  const handleUpdate = useCallback(
    (x: number, y: number) => {
      onStrokeUpdate({ x, y });
    },
    [onStrokeUpdate]
  );

  const handleEnd = useCallback(() => {
    onStrokeEnd();
  }, [onStrokeEnd]);

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onStart((event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      runOnJS(handleStart)();
      runOnJS(handleUpdate)(event.x, event.y);
    })
    .onUpdate((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      runOnJS(handleUpdate)(event.x, event.y);
    })
    .onEnd(() => {
      runOnJS(handleEnd)();
    })
    .onFinalize(() => {
      runOnJS(handleEnd)();
    });

  return (
    <View
      style={[
        styles.container,
        {
          height: canvasHeight,
          backgroundColor: theme.backgroundRoot,
        },
      ]}
    >
      <DottedBackground width={screenWidth} height={canvasHeight} />

      <GestureDetector gesture={panGesture}>
        <View style={styles.touchArea}>
          <Svg
            width={screenWidth}
            height={canvasHeight}
            style={styles.svg}
          >
            <G>
              {strokes.map((stroke, index) => (
                <Path
                  key={index}
                  d={pointsToPath(stroke.points)}
                  stroke={stroke.color}
                  strokeWidth={stroke.size}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
              {currentStroke.length > 0 && (
                <Path
                  d={pointsToPath(currentStroke)}
                  stroke={penColor}
                  strokeWidth={penSize}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
            </G>
          </Svg>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  touchArea: {
    flex: 1,
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
