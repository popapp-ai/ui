import { useTheme } from "@popapp/theme/use-theme";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

type TickerProps = {
  value: number | string;
  decimals?: number;
  fontSize?: number;
  locale?: string;
  currency?: string;
  unit?: string;
  color?: string;
  animationDisabled?: boolean;
  layoutDisabled?: boolean;
};

type TickerListProps = {
  digit: number;
  index: number;
  fontSize: number;
  color?: string;
  animationDisabled?: boolean;
  layoutDisabled?: boolean;
};

type TickProps = {
  children: string;
  fontSize: number;
  style?: any;
  color?: string;
};

const STAGGER = 50;
const HEIGHT_MULTIPLIER = 1.5;

const Tick: React.FC<TickProps> = ({ children, fontSize, style, color }) => {
  return (
    <Text
      style={[
        styles.tickText,
        {
          fontSize,
          height: fontSize * HEIGHT_MULTIPLIER,
          lineHeight: fontSize * HEIGHT_MULTIPLIER,
          color,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const TickerList: React.FC<TickerListProps> = ({
  digit,
  index,
  fontSize,
  color,
  animationDisabled,
  layoutDisabled,
}) => {
  const numbers = Array.from({ length: 10 }, (_, i) => i);

  return (
    <MotiView
      entering={animationDisabled ? undefined : FadeIn}
      exiting={animationDisabled ? undefined : FadeOut}
      layout={layoutDisabled || animationDisabled ? undefined : LinearTransition.springify().mass(1).damping(18).stiffness(150)}
    >
      <MaskedView
        maskElement={
          <LinearGradient
            style={StyleSheet.absoluteFillObject}
            colors={["transparent", "black", "black", "transparent"]}
            locations={[0, 0.25, 0.75, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        }
        style={[styles.cellContainer, { height: fontSize * HEIGHT_MULTIPLIER }]}
      >
        <MotiView
          animate={{
            translateY: -fontSize * HEIGHT_MULTIPLIER * digit,
          }}
          transition={
            animationDisabled
              ? { type: "timing", duration: 0 }
              : {
                  type: "spring",
                  damping: 18,
                  stiffness: 150,
                  mass: 1,
                  delay: index * STAGGER,
                }
          }
        >
          {numbers.map((n) => (
            <Tick key={n} fontSize={fontSize} color={color}>
              {n.toString()}
            </Tick>
          ))}
        </MotiView>
      </MaskedView>
    </MotiView>
  );
};

export const Ticker: React.FC<TickerProps> = ({
  value,
  decimals = 0,
  unit,
  fontSize = 50,
  locale = "en-US",
  currency,
  color,
  animationDisabled,
  layoutDisabled,
}) => {
  const { colors } = useTheme();
  const tickColor = color || colors.foreground;
  const formatter = new Intl.NumberFormat(locale, {
    ...(currency
      ? { style: "currency" as const, currency }
      : { style: "decimal" as const }),
    maximumFractionDigits: 2,
    minimumFractionDigits: decimals,
  });

  const formatted = typeof value === "number" ? formatter.format(value) : value;
  const chars = formatted.split("");

  return (
    <View style={styles.row}>
      {chars.map((char, index, array) => {
        const indexFromEnd = array.length - index - 1;
        const digit = parseInt(char, 10);

        if (Number.isNaN(digit)) {
          const { group } = getNumberSeparators(locale);
          const isGroupSeparator = char === group;
          const isDecimalSeparator = char === "." || char === ",";
          const isMinus = char === "-";
          const isFadedSymbol = isGroupSeparator || isDecimalSeparator || isMinus;
          return (
            <Tick
              key={`${index}-${char}`}
              fontSize={fontSize}
              color={tickColor}
              style={[
                isFadedSymbol && styles.nonNumber,
                isGroupSeparator && { marginHorizontal: -fontSize / 16 },
              ]}
            >
              {char}
            </Tick>
          );
        }

        return (
          <TickerList
            key={indexFromEnd}
            digit={digit}
            index={index}
            fontSize={fontSize}
            color={tickColor}
            animationDisabled={animationDisabled}
            layoutDisabled={layoutDisabled}
          />
        );
      })}
      {unit ? (
        <MotiView
          entering={animationDisabled ? undefined : FadeIn}
          exiting={animationDisabled ? undefined : FadeOut}
          layout={layoutDisabled || animationDisabled ? undefined : LinearTransition.springify().mass(1).damping(18).stiffness(150)}
        >
          <Tick fontSize={fontSize} color={tickColor} style={[styles.nonNumber, { marginLeft: fontSize / 5 }]}>{unit}</Tick>
        </MotiView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  cellContainer: {
    overflow: "hidden",
  },
  tickText: {
    fontVariant: ["tabular-nums"],
    fontWeight: "700",
  },
  nonNumber: {
    opacity: 0.4,
  },
});

function getNumberSeparators(locale: string) {
  const number = 12345.6;
  const formatted = new Intl.NumberFormat(locale).format(number);

  const group = formatted.match(/12(.?)345/)?.[1];
  const decimal = formatted.match(/345(.?)6/)?.[1];

  return { group, decimal };
}
