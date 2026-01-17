import React from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  WithSpringConfig,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { DottedBackground } from "@/components/DottedBackground";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows, Fonts } from "@/constants/theme";
import { Note, Point } from "@/types/note";

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - Spacing.lg * 3) / 2;
  const thumbnailHeight = cardWidth * 1.2;

  const scaleRatio = cardWidth / screenWidth;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, springConfig);
    opacity.value = withSpring(0.9, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
    opacity.value = withSpring(1, springConfig);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={`card-note-${note.id}`}
      style={[
        styles.container,
        {
          width: cardWidth,
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.border,
        },
        Shadows.card,
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.thumbnail,
          {
            height: thumbnailHeight,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <DottedBackground width={cardWidth} height={thumbnailHeight} />
        <Svg
          width={cardWidth}
          height={thumbnailHeight}
          style={styles.thumbnailSvg}
        >
          {note.strokes.map((stroke, index) => (
            <Path
              key={index}
              d={pointsToPath(
                stroke.points.map((p) => ({
                  x: p.x * scaleRatio,
                  y: p.y * scaleRatio,
                }))
              )}
              stroke={stroke.color}
              strokeWidth={stroke.size * scaleRatio}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
        </Svg>
      </View>

      <View style={styles.info}>
        <ThemedText
          style={[styles.title, { fontFamily: Fonts?.serifSemiBold }]}
          numberOfLines={1}
        >
          {note.title}
        </ThemedText>
        <ThemedText
          style={[styles.date, { color: theme.textSecondary }]}
          type="caption"
        >
          {formatDate(note.updatedAt)}
        </ThemedText>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  thumbnail: {
    overflow: "hidden",
  },
  thumbnailSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  info: {
    padding: Spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: 13,
  },
});
