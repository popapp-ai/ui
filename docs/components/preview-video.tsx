import { resolveAssetPath } from "../utils/resolve-asset-path";

type VideoSource = { src: string; type: string }

export function PreviewVideo({
  sources,
  src,
}: {
  sources?: VideoSource[]
  src?: string
}) {
  const resolvedSources = sources ?? (src ? [{ src, type: 'video/mp4' }] : [])

  return (
    <div className="custom_Preview">
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%',
          maxWidth: 360,
          borderRadius: 16,
          display: 'block',
        }}
      >
        {resolvedSources.map((s) => (
          <source key={s.src} src={resolveAssetPath(s.src)} type={s.type} />
        ))}
      </video>
    </div>
  )
}
