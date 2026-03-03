import type { SVGIconName } from "@popapp/components/svg-icons";

export type SVGPrefixedIconName = `svg-${SVGIconName}`;

/**
 * Icon name — can be an SF Symbol name (string) or a prefixed SVG icon (`svg-myIcon`).
 *
 * On iOS, SF Symbol names are rendered natively via `expo-symbols`.
 * On Android/Web, they're mapped to Material Icons via MAPPING.
 * SVG icons (prefixed with `svg-`) always render the custom SVG component.
 *
 * To add custom SVG icons, add them to the svg-icons directory
 * and register them in the ICON_COMPONENTS map.
 */
export type IconSymbolName = string | SVGPrefixedIconName;
