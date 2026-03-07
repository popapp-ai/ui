const lightColors = {
  primary: "#000000",
  primaryForeground: "#ffffff",
  accent: "#007AFF",
  accentForeground: "#ffffff",
  background: "#ffffff",
  backgroundSecondary: "#f5f5f5",
  backgroundTertiary: "#EBEBEC",
  card: "#ffffff",
  cardForeground: "#11181C",
  cardSecondary: "#f0f0f0",
  foreground: "#11181C",
  foregroundSecondary: "#687076",
  muted: "#c0c0c0",
  mutedForeground: "#687076",
  border: "#e0e0e0",
  icon: "#687076",
  destructive: "#e53935",
  destructiveForeground: "#ffffff",
  success: "#34C759",
  successForeground: "#ffffff",
  warning: "#FF9500",
  warningForeground: "#ffffff",
  info: "#007AFF",
  infoForeground: "#ffffff",
};

const darkColors = {
  primary: "#ffffff",
  primaryForeground: "#000000",
  accent: "#0A84FF",
  accentForeground: "#ffffff",
  background: "#000000",
  backgroundSecondary: "#111111",
  backgroundTertiary: "#2a2a2a",
  card: "#1a1a1a",
  cardForeground: "#ECEDEE",
  cardSecondary: "#222222",
  foreground: "#ECEDEE",
  foregroundSecondary: "#9BA1A6",
  muted: "#555555",
  mutedForeground: "#9BA1A6",
  border: "#2a2a2a",
  icon: "#9BA1A6",
  destructive: "#ef5350",
  destructiveForeground: "#ffffff",
  success: "#30D158",
  successForeground: "#ffffff",
  warning: "#FFB74D",
  warningForeground: "#000000",
  info: "#64D2FF",
  infoForeground: "#000000",
};

const groups: { label: string; tokens: string[] }[] = [
  {
    label: "Brand",
    tokens: ["primary", "primaryForeground", "accent", "accentForeground"],
  },
  {
    label: "Surfaces",
    tokens: [
      "background",
      "backgroundSecondary",
      "backgroundTertiary",
      "card",
      "cardForeground",
      "cardSecondary",
    ],
  },
  {
    label: "Text",
    tokens: ["foreground", "foregroundSecondary", "muted", "mutedForeground"],
  },
  { label: "UI", tokens: ["border", "icon"] },
  {
    label: "Semantic",
    tokens: [
      "destructive",
      "destructiveForeground",
      "success",
      "successForeground",
      "warning",
      "warningForeground",
      "info",
      "infoForeground",
    ],
  },
];

function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

function Swatch({ name, color }: { name: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 0",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: color,
          border: "1px solid rgba(128,128,128,0.2)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{name}</span>
        <span
          style={{ fontSize: 12, opacity: 0.5, fontFamily: "monospace" }}
        >
          {color}
        </span>
      </div>
    </div>
  );
}

function PaletteColumn({
  title,
  colors,
}: {
  title: string;
  colors: Record<string, string>;
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 260,
        borderRadius: 12,
        border: "1px solid var(--vocs-color_border)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 16px",
          fontWeight: 600,
          fontSize: 14,
          borderBottom: "1px solid var(--vocs-color_border)",
        }}
      >
        {title}
      </div>
      {groups.map((group) => (
        <div key={group.label}>
          <div
            style={{
              padding: "8px 16px 2px",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              opacity: 0.5,
            }}
          >
            {group.label}
          </div>
          <div style={{ padding: "0 16px 8px" }}>
            {group.tokens.map((token) => (
              <Swatch
                key={token}
                name={token}
                color={colors[token as keyof typeof colors]}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ColorPalette() {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <PaletteColumn title="Light" colors={lightColors} />
      <PaletteColumn title="Dark" colors={darkColors} />
    </div>
  );
}
