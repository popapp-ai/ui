/**
 * SVG Icon Registry
 *
 * Register your custom SVG icons here. Each icon must accept IconProps
 * and use the BaseIcon wrapper for consistent sizing.
 *
 * Example:
 * ```tsx
 * // 1. Create your icon in svg-icons/my-icon.tsx
 * import { Path } from "react-native-svg";
 * import { BaseIcon, IconProps } from "./base-icon";
 *
 * export function MyIcon({ size, color, style }: IconProps) {
 *   return (
 *     <BaseIcon size={size} style={style}>
 *       <Path fill={color ?? "currentColor"} d="M12 2L..." />
 *     </BaseIcon>
 *   );
 * }
 *
 * // 2. Register it below
 * import { MyIcon } from "./my-icon";
 * export const ICON_COMPONENTS = { myIcon: MyIcon } as const;
 *
 * // 3. Use it: <IconSymbol name="svg-myIcon" />
 * ```
 */

// Add your SVG icon imports here:
// import { MyIcon } from "./my-icon";

export const ICON_COMPONENTS = {
  // myIcon: MyIcon,
} as const;

export type SVGIconName = keyof typeof ICON_COMPONENTS;

export { BaseIcon, type IconProps } from "./base-icon";
