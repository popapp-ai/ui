import { resolveAssetPath } from "../utils/resolve-asset-path";

type VideoSource = { src: string; type: string };

export function PhoneFrame({
  src,
  alt = "App screen",
  video,
}: {
  src?: string;
  alt?: string;
  video?: VideoSource[];
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
          {video ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            >
              {video.map((s) => (
                <source key={s.src} src={resolveAssetPath(s.src)} type={s.type} />
              ))}
            </video>
          ) : (
            <img
              src={resolveAssetPath(src!)}
              alt={alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          )}
        </div>
        <img
          src={resolveAssetPath("/assets/iphone-frame.png")}
          alt="iPhone frame"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            position: "relative",
            zIndex: 10,
            pointerEvents: "none",
            userSelect: "none",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
