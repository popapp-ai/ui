import { resolveAssetPath } from "../utils/resolve-asset-path";

export function PhoneFrame({
  src,
  alt = "App screen",
}: {
  src: string;
  alt?: string;
}) {
  return (
    <div className="custom_Preview" style={{ backgroundColor: "var(--vocs-color_codeTitleBackground)" }}>
      <div style={{ position: "relative", width: "100%", maxWidth: 300, aspectRatio: "0.4932" }}>
        <div
          style={{
            position: "absolute",
            inset: "1.92% 5.03%",
            borderRadius: "8%",
            overflow: "hidden",
            background: "white",
          }}
        >
          <img
            src={resolveAssetPath(src)}
            alt={alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <img
          src={resolveAssetPath("/assets/iphone-frame.png")}
          alt="iPhone frame"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            position: "relative",
            zIndex: 30,
            pointerEvents: "none",
            userSelect: "none",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
