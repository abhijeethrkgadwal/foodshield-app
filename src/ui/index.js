import React, { forwardRef } from "react";
import {
  View as RNView,
  Text as RNText,
  Image as RNImage,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  ActivityIndicator,
  StatusBar as RNStatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@app/theme/colors";

const FONT_MAP = {
  heading: {
    400: "Poppins-Regular",
    500: "Poppins-Medium",
    600: "Poppins-SemiBold",
    700: "Poppins-Bold",
  },
  body: {
    400: "Poppins-Regular",
    500: "Poppins-Medium",
    600: "Poppins-SemiBold",
    700: "Poppins-Bold",
  },
  mono: {
    400: "Poppins-Regular",
    500: "Poppins-Medium",
    600: "Poppins-SemiBold",
    700: "Poppins-Bold",
  },
};

const SPACE = 4;

const resolveSpace = (value) => {
  if (value == null || value === "") return undefined;
  if (typeof value === "number") return value * SPACE;
  if (value === "auto") return "auto";
  if (typeof value === "string") {
    if (value.endsWith("%")) return value;
    if (value.includes("/")) {
      const [a, b] = value.split("/").map(Number);
      if (a && b) return `${(a / b) * 100}%`;
    }
    const asNumber = Number(value);
    if (!Number.isNaN(asNumber)) return asNumber * SPACE;
  }
  return value;
};

const resolveSize = (value) => {
  if (value == null) return undefined;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    if (value === "full") return "100%";
    if (value.includes("/")) {
      const [a, b] = value.split("/").map(Number);
      if (a && b) return `${(a / b) * 100}%`;
    }
    const asNumber = Number(value);
    if (!Number.isNaN(asNumber)) return asNumber * SPACE;
  }
  return value;
};

const omitUndefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

const buildLayoutStyle = (props) =>
  omitUndefined({
    flex: props.flex,
    flexDirection: props.flexDirection,
    alignItems: props.alignItems,
    justifyContent: props.justifyContent,
    alignSelf: props.alignSelf,
    position: props.position,
    top: resolveSize(props.top),
    bottom: resolveSize(props.bottom),
    left: resolveSize(props.left),
    right: resolveSize(props.right),
    zIndex: props.zIndex,
    opacity: props.opacity,
    overflow: props.overflow,
    width: resolveSize(props.width ?? props.w),
    height: resolveSize(props.height ?? props.h),
    minWidth: resolveSize(props.minWidth),
    minHeight: resolveSize(props.minHeight),
    maxWidth: resolveSize(props.maxWidth),
    maxHeight: resolveSize(props.maxHeight),
    margin: resolveSpace(props.m ?? props.margin),
    marginTop: resolveSpace(props.mt ?? props.marginTop),
    marginBottom: resolveSpace(props.mb ?? props.marginBottom),
    marginLeft: resolveSpace(props.ml ?? props.marginLeft),
    marginRight: resolveSpace(props.mr ?? props.marginRight),
    marginHorizontal: resolveSpace(props.mx ?? props.marginX),
    marginVertical: resolveSpace(props.my ?? props.marginY),
    padding: resolveSpace(props.p ?? props.padding),
    paddingTop: resolveSpace(props.pt ?? props.paddingTop),
    paddingBottom: resolveSpace(props.pb ?? props.paddingBottom),
    paddingLeft: resolveSpace(props.pl ?? props.paddingLeft),
    paddingRight: resolveSpace(props.pr ?? props.paddingRight),
    paddingHorizontal: resolveSpace(props.px ?? props.paddingX),
    paddingVertical: resolveSpace(props.py ?? props.paddingY),
    backgroundColor: props.bgColor ?? props.bg ?? props.backgroundColor,
    borderRadius: props.borderRadius,
    borderWidth: props.borderWidth,
    borderColor: props.borderColor,
    gap: props.space != null ? resolveSpace(props.space) : undefined,
  });

const LAYOUT_PROP_KEYS = new Set([
  "flex",
  "flexDirection",
  "alignItems",
  "justifyContent",
  "alignSelf",
  "position",
  "top",
  "bottom",
  "left",
  "right",
  "zIndex",
  "opacity",
  "overflow",
  "width",
  "w",
  "height",
  "h",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "m",
  "margin",
  "mt",
  "marginTop",
  "mb",
  "marginBottom",
  "ml",
  "marginLeft",
  "mr",
  "marginRight",
  "mx",
  "marginX",
  "my",
  "marginY",
  "p",
  "padding",
  "pt",
  "paddingTop",
  "pb",
  "paddingBottom",
  "pl",
  "paddingLeft",
  "pr",
  "paddingRight",
  "px",
  "paddingX",
  "py",
  "paddingY",
  "bgColor",
  "bg",
  "backgroundColor",
  "borderRadius",
  "borderWidth",
  "borderColor",
  "space",
  "safeArea",
  "safeAreaBottom",
  "safeAreaTop",
  "style",
]);

const splitProps = (props) => {
  const layout = {};
  const rest = {};
  Object.entries(props).forEach(([key, value]) => {
    if (LAYOUT_PROP_KEYS.has(key)) layout[key] = value;
    else rest[key] = value;
  });
  return { layout, rest };
};

const withSafeArea = (Component) =>
  forwardRef(({ safeArea, safeAreaBottom, safeAreaTop, style, ...props }, ref) => {
    const { layout, rest } = splitProps(props);
    const layoutStyle = buildLayoutStyle(layout);
    const composedStyle = [layoutStyle, style];

    if (safeArea || safeAreaBottom || safeAreaTop) {
      const edges = safeArea
        ? ["top", "right", "bottom", "left"]
        : [
            ...(safeAreaTop ? ["top"] : []),
            ...(safeAreaBottom ? ["bottom"] : []),
          ];
      return (
        <SafeAreaView
          ref={ref}
          edges={edges}
          style={[{ flex: layout.flex === 0 ? undefined : 1 }, composedStyle]}
          {...rest}
        />
      );
    }

    return <Component ref={ref} style={composedStyle} {...rest} />;
  });

export const Box = withSafeArea(RNView);
export const View = Box;
export const Flex = withSafeArea(RNView);
export const VStack = forwardRef((props, ref) => (
  <Box ref={ref} flexDirection="column" {...props} />
));
export const HStack = forwardRef((props, ref) => (
  <Box ref={ref} flexDirection="row" {...props} />
));

export const Text = ({
  children,
  style,
  fontFamily = "mono",
  fontWeight = "400",
  fontSize,
  color,
  textAlign,
  textTransform,
  ...props
}) => {
  const { layout, rest } = splitProps(props);
  const weight = String(fontWeight);
  const mappedFont =
    FONT_MAP[fontFamily]?.[weight] ||
    FONT_MAP.mono[weight] ||
    "Poppins-Regular";

  return (
    <RNText
      style={[
        buildLayoutStyle(layout),
        {
          fontFamily: mappedFont,
          fontSize: typeof fontSize === "string" ? Number(fontSize) : fontSize,
          color,
          textAlign,
          textTransform,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export const Heading = (props) => <Text fontFamily="heading" {...props} />;

export const Image = ({ style, alt, ...props }) => {
  const { layout, rest } = splitProps(props);
  return (
    <RNImage
      accessibilityLabel={alt}
      style={[buildLayoutStyle(layout), style]}
      {...rest}
    />
  );
};

export const Pressable = ({ style, children, ...props }) => {
  const { layout, rest } = splitProps(props);
  return (
    <RNPressable style={[buildLayoutStyle(layout), style]} {...rest}>
      {children}
    </RNPressable>
  );
};

export const Button = ({
  children,
  style,
  onPress,
  leftIcon,
  bgColor,
  variant,
  size,
  disabled,
  ...props
}) => {
  const { layout, rest } = splitProps(props);
  const sizeStyles =
    size === "lg"
      ? { minHeight: 48, paddingHorizontal: 16 }
      : size === "xs"
        ? { minHeight: 28, paddingHorizontal: 8 }
        : { minHeight: 40, paddingHorizontal: 12 };

  const backgroundColor =
    bgColor ||
    (variant === "outline" ? "transparent" : colors.green);

  return (
    <RNPressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        sizeStyles,
        buildLayoutStyle(layout),
        {
          backgroundColor,
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor: colors.white,
          opacity: pressed || disabled ? 0.8 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {leftIcon}
      {typeof children === "string" ? (
        <Text color={colors.white} fontWeight="600">
          {children}
        </Text>
      ) : (
        children
      )}
    </RNPressable>
  );
};

export const Spinner = ({ color = colors.green, size = "small", style, ...props }) => {
  const { layout, rest } = splitProps(props);
  const indicatorSize = size === "xl" || size === "lg" || size === "md" ? "large" : "small";
  return (
    <ActivityIndicator
      color={color}
      size={indicatorSize}
      style={[buildLayoutStyle(layout), style]}
      {...rest}
    />
  );
};

export const Progress = ({
  value = 0,
  style,
  _filledTrack,
  bg = "transparent",
  ...props
}) => {
  const { layout } = splitProps(props);
  const fill = _filledTrack?.bg || colors.green;
  return (
    <RNView
      style={[
        styles.progressTrack,
        { backgroundColor: bg === "transparent" ? "#00000010" : bg },
        buildLayoutStyle(layout),
        style,
      ]}
    >
      <RNView
        style={[
          styles.progressFill,
          {
            width: `${Math.max(0, Math.min(100, Number(value) || 0))}%`,
            backgroundColor: fill,
          },
        ]}
      />
    </RNView>
  );
};

export const ScrollView = ({ style, children, ...props }) => {
  const { layout, rest } = splitProps(props);
  return (
    <RNScrollView
      style={[buildLayoutStyle(layout), style]}
      contentContainerStyle={layout.flex === 1 ? { flexGrow: 1 } : undefined}
      {...rest}
    >
      {children}
    </RNScrollView>
  );
};

export const StatusBar = RNStatusBar;

export const ThemeProvider = ({ children }) => children;

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
});
